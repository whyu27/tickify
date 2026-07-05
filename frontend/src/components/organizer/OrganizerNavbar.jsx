import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Wallet } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const OrganizerNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
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
          <div className="hidden md:flex items-center gap-8">
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
          <div className="hidden md:flex items-center gap-4">
            {/* Connect Wallet Button */}
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-transparent border border-white/12 rounded-xl hover:border-white/25 hover:bg-white/5 transition-all duration-200">
              <Wallet className="w-4 h-4" strokeWidth={1.5} />
              <span>Connect Wallet</span>
            </button>

            {/* Profile Link */}
            <Link
              to="/dashboard/organizer/profile"
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-white rounded-xl hover:bg-[#EAEAEA] transition-all duration-200"
            >
              Profile
            </Link>
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
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-transparent border border-white/12 rounded-xl hover:border-white/25 hover:bg-white/5 transition-all duration-200">
                <Wallet className="w-4 h-4" strokeWidth={1.5} />
                <span>Connect Wallet</span>
              </button>
              
              <Link
                to="/dashboard/organizer/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2 text-sm font-semibold text-black bg-white rounded-xl hover:bg-[#EAEAEA] transition-all duration-200"
              >
                Profile
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default OrganizerNavbar;
