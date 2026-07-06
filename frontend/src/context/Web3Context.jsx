import { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Wallet, X } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import api from '../api/axios';

const Web3Context = createContext(null);

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [showInstallModal, setShowInstallModal] = useState(false);
  const { user, setUser } = useAuth();

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setShowInstallModal(true);
      return;
    }

    try {
      setConnectionStatus('connecting');

      // Step 1: Request nonce from backend
      const nonceResponse = await api.get('/users/wallet/nonce');
      if (!nonceResponse.data || !nonceResponse.data.nonce) {
        throw new Error('Failed to get verification nonce');
      }
      const nonce = nonceResponse.data.nonce;

      // Step 2: Request accounts with permissions to force MetaMask accounts pop-up
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      });

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts && accounts.length > 0) {
        const address = accounts[0];

        // Step 3: BrowserProvider & Signer
        const tempProvider = new ethers.BrowserProvider(window.ethereum);
        const tempSigner = await tempProvider.getSigner();

        // Step 4: Construct verification message
        const message = `Tickify Wallet Verification\n\nNonce:\n${nonce}`;

        // Step 5: Sign the message
        const signature = await tempSigner.signMessage(message);

        // Step 6: Send verification to backend
        const response = await api.post('/users/connect-wallet', {
          walletAddress: address,
          signature,
          nonce
        });

        if (response.data && response.data.success) {
          // Update the user profile in AuthContext
          setUser(response.data.data);

          const network = await tempProvider.getNetwork();

          setProvider(tempProvider);
          setSigner(tempSigner);
          setWallet(address);
          setChainId(Number(network.chainId));
          setConnectionStatus('connected');
        } else {
          setConnectionStatus('disconnected');
        }
      } else {
        setConnectionStatus('disconnected');
      }
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      const errMsg = error.response?.data?.message || error.message || 'Error connecting to wallet';
      alert(errMsg);
      
      if (!user?.wallet_address || !user?.wallet_verified) {
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

      // Step 1: Disconnect current wallet on backend first
      const disconnectResponse = await api.post('/users/disconnect-wallet');
      if (!disconnectResponse.data || !disconnectResponse.data.success) {
        throw new Error('Failed to disconnect current wallet');
      }

      // Reset local states first
      setProvider(null);
      setSigner(null);
      setWallet(null);
      setChainId(null);
      setUser(disconnectResponse.data.data);

      // Step 2: Request new nonce
      const nonceResponse = await api.get('/users/wallet/nonce');
      if (!nonceResponse.data || !nonceResponse.data.nonce) {
        throw new Error('Failed to get verification nonce');
      }
      const nonce = nonceResponse.data.nonce;

      // Step 3: Request permissions to let user choose/switch accounts in MetaMask
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      });

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts && accounts.length > 0) {
        const address = accounts[0];

        // Step 4: BrowserProvider & Signer
        const tempProvider = new ethers.BrowserProvider(window.ethereum);
        const tempSigner = await tempProvider.getSigner();

        // Step 5: Construct verification message
        const message = `Tickify Wallet Verification\n\nNonce:\n${nonce}`;

        // Step 6: Sign the message
        const signature = await tempSigner.signMessage(message);

        // Step 7: Send verification to backend
        const response = await api.post('/users/connect-wallet', {
          walletAddress: address,
          signature,
          nonce
        });

        if (response.data && response.data.success) {
          setUser(response.data.data);
          const network = await tempProvider.getNetwork();

          setProvider(tempProvider);
          setSigner(tempSigner);
          setWallet(address);
          setChainId(Number(network.chainId));
          setConnectionStatus('connected');
        } else {
          setConnectionStatus('disconnected');
        }
      } else {
        setConnectionStatus('disconnected');
      }
    } catch (error) {
      console.error('Error switching wallet:', error);
      const errMsg = error.response?.data?.message || error.message || 'Error switching wallet';
      alert(errMsg);
      
      if (!user?.wallet_address || !user?.wallet_verified) {
        setConnectionStatus('disconnected');
      } else {
        setConnectionStatus('connected');
      }
    }
  };

  const disconnectWallet = async () => {
    try {
      const response = await api.post('/users/disconnect-wallet');
      if (response.data && response.data.success) {
        setUser(response.data.data);

        setProvider(null);
        setSigner(null);
        setWallet(null);
        setChainId(null);
        setConnectionStatus('disconnected');
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      const errMsg = error.response?.data?.message || 'Error disconnecting wallet';
      alert(errMsg);
    }
  };

  // Silent Initialization on Mount or User Change
  useEffect(() => {
    const initProvider = async () => {
      if (typeof window !== 'undefined' && window.ethereum && user?.wallet_address && user?.wallet_verified) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0 && accounts[0].toLowerCase() === user.wallet_address.toLowerCase()) {
            const tempProvider = new ethers.BrowserProvider(window.ethereum);
            const tempSigner = await tempProvider.getSigner();
            const network = await tempProvider.getNetwork();

            setProvider(tempProvider);
            setSigner(tempSigner);
            setWallet(accounts[0]);
            setChainId(Number(network.chainId));
            setConnectionStatus('connected');
          } else {
            setConnectionStatus('disconnected');
          }
        } catch (err) {
          console.error('Silent initialization failed:', err);
          setConnectionStatus('disconnected');
        }
      } else {
        setConnectionStatus('disconnected');
      }
    };

    initProvider();
  }, [user]);

  // Event Listeners for MetaMask Changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = async (accounts) => {
        if (accounts.length === 0 || !user?.wallet_address || !user?.wallet_verified) {
          setProvider(null);
          setSigner(null);
          setWallet(null);
          setChainId(null);
          setConnectionStatus('disconnected');
        } else {
          const newAddress = accounts[0];
          if (newAddress.toLowerCase() === user.wallet_address.toLowerCase()) {
            try {
              const tempProvider = new ethers.BrowserProvider(window.ethereum);
              const tempSigner = await tempProvider.getSigner();
              const network = await tempProvider.getNetwork();

              setProvider(tempProvider);
              setSigner(tempSigner);
              setWallet(newAddress);
              setChainId(Number(network.chainId));
              setConnectionStatus('connected');
            } catch (error) {
              console.error('Error handling accountsChanged:', error);
            }
          } else {
            // Mismatch: clear provider/signer to prevent wrong transaction signing
            setProvider(null);
            setSigner(null);
            setWallet(null);
            setConnectionStatus('disconnected');
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
  }, [user]);

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
