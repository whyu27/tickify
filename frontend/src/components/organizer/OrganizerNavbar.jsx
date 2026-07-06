import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Wallet, LogOut, ChevronDown, RefreshCw } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useWeb3 from '../../hooks/useWeb3';

const OrganizerNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const { connectWallet, disconnectWallet, switchWallet, connectionStatus } = useWeb3();
  const wallet = user?.wallet_address;
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/dashboard/organizer/home' },
    { name: 'Create Event', path: '/dashboard/organizer/events/create' },
    { name: 'Validator', path: '/dashboard/organizer/validator' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/8">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link to="/dashboard/organizer/home" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-black text-lg">T</span>
            </div>
            <span className="text-xl font-bold text-white">Tickify</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'text-white'
                    : 'text-[#A0A0A0] hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4 z-10">
            {/* Connect Wallet Button */}
            {wallet ? (
              <div className="relative">
                <button
                  onClick={() => setIsWalletDropdownOpen(!isWalletDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-white/5 border border-white/12 rounded-xl hover:border-white/25 hover:bg-white/10 transition-all duration-200"
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
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-transparent border border-white/12 rounded-xl hover:border-white/25 hover:bg-white/5 transition-all duration-200 disabled:opacity-50"
              >
                <Wallet className="w-4 h-4" strokeWidth={1.5} />
                <span>{connectionStatus === 'connecting' ? 'Connecting...' : 'Connect Wallet'}</span>
              </button>
            )}

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-transparent border border-white/12 rounded-xl hover:border-white/25 hover:bg-white/5 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/5 rounded-lg transition-colors duration-200"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" strokeWidth={1.5} />
            ) : (
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/8 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'text-white bg-white/5'
                    : 'text-[#A0A0A0] hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="pt-4 border-t border-white/8 space-y-3">
              {wallet ? (
                <div className="space-y-2 px-4">
                  <div className="flex items-center gap-2 px-3 py-2 text-sm text-white bg-white/5 border border-white/12 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-xs truncate flex-1">{wallet}</span>
                  </div>
                  <button
                    onClick={async () => {
                      setIsMobileMenuOpen(false);
                      await switchWallet();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-[#A0A0A0] bg-transparent border border-white/12 rounded-xl hover:text-white hover:border-white/25 transition-all"
                  >
                    <RefreshCw className="w-4 h-4 animate-spin-hover" strokeWidth={1.5} />
                    <span>Switch Wallet</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      disconnectWallet();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-red-400 bg-transparent border border-red-500/20 rounded-xl hover:text-red-300 hover:border-red-500/40 transition-all"
                  >
                    <LogOut className="w-4 h-4" strokeWidth={1.5} />
                    <span>Disconnect Wallet</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    connectWallet();
                  }}
                  disabled={connectionStatus === 'connecting'}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-transparent border border-white/12 rounded-xl hover:border-white/25 hover:bg-white/5 transition-all duration-200 disabled:opacity-50"
                >
                  <Wallet className="w-4 h-4" strokeWidth={1.5} />
                  <span>{connectionStatus === 'connecting' ? 'Connecting...' : 'Connect Wallet'}</span>
                </button>
              )}
              
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-transparent border border-white/12 rounded-xl hover:border-white/25 hover:bg-white/5 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" strokeWidth={1.5} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default OrganizerNavbar;
