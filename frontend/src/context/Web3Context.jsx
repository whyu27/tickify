import { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Wallet, X } from 'lucide-react';

const Web3Context = createContext(null);

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [showInstallModal, setShowInstallModal] = useState(false);

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setShowInstallModal(true);
      return;
    }

    try {
      setConnectionStatus('connecting');

      // Request permissions to force MetaMask to always show the account selector popup
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      });

      // Request accounts
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts && accounts.length > 0) {
        const tempProvider = new ethers.BrowserProvider(window.ethereum);
        const tempSigner = await tempProvider.getSigner();
        const address = await tempSigner.getAddress();
        const network = await tempProvider.getNetwork();

        setProvider(tempProvider);
        setSigner(tempSigner);
        setWallet(address);
        setChainId(Number(network.chainId));
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      // Reset connection status if not previously connected
      if (!wallet) {
        setConnectionStatus('disconnected');
      } else {
        setConnectionStatus('connected');
      }
    }
  };

  const switchWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setShowInstallModal(true);
      return;
    }

    try {
      setConnectionStatus('connecting');

      // Request permissions again to force MetaMask to show account list
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      });

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts && accounts.length > 0) {
        const tempProvider = new ethers.BrowserProvider(window.ethereum);
        const tempSigner = await tempProvider.getSigner();
        const address = await tempSigner.getAddress();
        const network = await tempProvider.getNetwork();

        setProvider(tempProvider);
        setSigner(tempSigner);
        setWallet(address);
        setChainId(Number(network.chainId));
        setConnectionStatus('connected');
      }
    } catch (error) {
      console.error('Error switching wallet:', error);
      // Keep existing connection if it exists
      if (wallet) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
      }
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setWallet(null);
    setChainId(null);
    setConnectionStatus('disconnected');
  };

  // Event Listeners for MetaMask Changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = async (accounts) => {
        if (accounts.length === 0) {
          // If no accounts, clear connection state
          disconnectWallet();
        } else {
          try {
            // Update provider, signer, and wallet address directly
            const tempProvider = new ethers.BrowserProvider(window.ethereum);
            const tempSigner = await tempProvider.getSigner();
            const address = await tempSigner.getAddress();
            
            setProvider(tempProvider);
            setSigner(tempSigner);
            setWallet(address);
            setConnectionStatus('connected');
          } catch (error) {
            console.error('Error handling accountsChanged:', error);
            disconnectWallet();
          }
        }
      };

      const handleChainChanged = (chainIdHex) => {
        const parsedChainId = parseInt(chainIdHex, 16);
        setChainId(parsedChainId);
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        wallet,
        chainId,
        connectionStatus,
        connectWallet,
        disconnectWallet,
        switchWallet,
      }}
    >
      {children}

      {/* Modern Glassmorphic Install MetaMask Modal */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(255,255,255,0.05)] overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            
            <button
              onClick={() => setShowInstallModal(false)}
              className="absolute top-4 right-4 text-[#A0A0A0] hover:text-white transition-colors duration-200 bg-white/5 hover:bg-white/10 p-1.5 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <Wallet className="w-8 h-8 text-white" strokeWidth={1.5} />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">MetaMask Required</h3>
              <p className="text-sm text-[#A0A0A0] mb-8 leading-relaxed max-w-xs">
                To connect your Web3 wallet and manage tickets, please install the MetaMask extension for your browser.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex justify-center items-center px-5 py-3 text-sm font-semibold text-black bg-white rounded-xl hover:bg-[#EAEAEA] active:scale-[0.98] transition-all duration-200"
                >
                  Install MetaMask
                </a>
                <button
                  onClick={() => setShowInstallModal(false)}
                  className="flex-1 px-5 py-3 text-sm font-semibold text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 active:scale-[0.98] transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Web3Context.Provider>
  );
};

export default Web3Context;
