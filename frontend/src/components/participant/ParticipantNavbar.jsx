import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Wallet, LogOut, ChevronDown, RefreshCw } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useWeb3 from '../../hooks/useWeb3';

const ParticipantNavbar = () => {
  const { user, logout } = useAuth();
  const { connectWallet, disconnectWallet, switchWallet, connectionStatus } = useWeb3();
  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);
  const wallet = (user?.wallet_address && user?.wallet_verified) ? user.wallet_address : null;

  return (
    <nav className="sticky top-0 z-50 w-full h-[72px] bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/8">
      <div className="max-w-[1280px] mx-auto px-6 h-full relative flex items-center justify-between">
        {/* Logo */}
        <Link to="/participant/home" className="flex items-center gap-2 z-10">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-black text-lg">T</span>
          </div>
          <span className="text-xl font-bold text-white">Tickify</span>
        </Link>

        {/* Desktop Navigation - Centered Absolutely */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link to="/participant/home" className="text-[#A0A0A0] hover:text-white transition-colors duration-200 text-sm font-medium">
            Home
          </Link>
          <Link to="/participant/tickets" className="text-[#A0A0A0] hover:text-white transition-colors duration-200 text-sm font-medium">
            My Tickets
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 z-10">
          {/* Web3 Wallet Section */}
          {wallet ? (
            <div className="relative">
              <button
                onClick={() => setIsWalletDropdownOpen(!isWalletDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-white/5 border border-white/12 rounded-xl hover:border-white/25 hover:bg-white/10 transition-all duration-200"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-xs">{`${wallet.slice(0, 6)}...${wallet.slice(-4)}`}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isWalletDropdownOpen ? 'rotate-180' : ''}`} strokeWidth={1.5} />
              </button>

              {isWalletDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsWalletDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-[#0D0D0D] border border-white/10 rounded-xl p-1.5 shadow-2xl z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                    <button
                      onClick={async () => {
                        setIsWalletDropdownOpen(false);
                        await switchWallet();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-[#A0A0A0] hover:text-white hover:bg-white/5 rounded-lg text-left transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" strokeWidth={1.5} />
                      Switch Wallet
                    </button>
                    <button
                      onClick={() => {
                        setIsWalletDropdownOpen(false);
                        disconnectWallet();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg text-left transition-colors border-t border-white/5 mt-1 pt-2"
                    >
                      <LogOut className="w-4 h-4" strokeWidth={1.5} />
                      Disconnect
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={connectionStatus === 'connecting'}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-transparent border border-white/12 rounded-xl hover:border-white/25 hover:bg-white/5 transition-all duration-200 disabled:opacity-50"
            >
              <Wallet className="w-4 h-4" strokeWidth={1.5} />
              <span>{connectionStatus === 'connecting' ? 'Connecting...' : 'Connect Wallet'}</span>
            </button>
          )}

          <button
            onClick={logout}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-transparent border border-white/12 rounded-xl hover:border-white/25 hover:bg-white/5 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default ParticipantNavbar;
