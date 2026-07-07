import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full h-[72px] bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/8">
      <div className="max-w-[1280px] mx-auto px-6 h-full relative flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 z-10" onClick={() => setIsOpen(false)}>
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-black text-lg">T</span>
          </div>
          <span className="text-xl font-bold text-white">Tickify</span>
        </Link>

        {/* Desktop Navigation - Centered Absolutely */}
        <div className="hidden md:flex items-center gap-4 lg:gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <HashLink smooth to="/#home" className="text-[#A0A0A0] hover:text-white transition-colors duration-200 text-sm font-medium">
            Home
          </HashLink>
          <HashLink smooth to="/#events" className="text-[#A0A0A0] hover:text-white transition-colors duration-200 text-sm font-medium">
            Events
          </HashLink>
          <HashLink smooth to="/#faq" className="text-[#A0A0A0] hover:text-white transition-colors duration-200 text-sm font-medium">
            FAQ
          </HashLink>
          <HashLink smooth to="/#pricing" className="text-[#A0A0A0] hover:text-white transition-colors duration-200 text-sm font-medium">
            Pricing
          </HashLink>
        </div>

        {/* Auth Buttons - Hidden on Mobile */}
        <div className="hidden md:flex items-center gap-4 z-10">
          <Link
            to="/login"
            className="px-5 py-2.5 text-sm font-semibold text-white bg-transparent border border-white/12 rounded-xl hover:border-white/25 transition-all duration-200"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 text-sm font-semibold text-black bg-white rounded-xl hover:bg-[#EAEAEA] transition-all duration-200"
          >
            Register
          </Link>
        </div>

        {/* Hamburger Toggle Button - Mobile Only */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-[#A0A0A0] hover:text-white transition-colors duration-200 z-50 focus:outline-none"
          aria-label="Toggle Navigation Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer - Slide Down Overlay */}
      <div
        className={`fixed inset-x-0 top-[72px] bg-[#0A0A0A]/95 border-b border-white/8 backdrop-blur-lg md:hidden transition-all duration-300 ease-in-out z-40 overflow-hidden ${
          isOpen ? 'max-h-[calc(100vh-72px)] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-6 p-6">
          <HashLink
            smooth
            to="/#home"
            onClick={() => setIsOpen(false)}
            className="text-[#A0A0A0] hover:text-white transition-colors duration-200 text-base font-semibold"
          >
            Home
          </HashLink>
          <HashLink
            smooth
            to="/#events"
            onClick={() => setIsOpen(false)}
            className="text-[#A0A0A0] hover:text-white transition-colors duration-200 text-base font-semibold"
          >
            Events
          </HashLink>
          <HashLink
            smooth
            to="/#faq"
            onClick={() => setIsOpen(false)}
            className="text-[#A0A0A0] hover:text-white transition-colors duration-200 text-base font-semibold"
          >
            FAQ
          </HashLink>
          <HashLink
            smooth
            to="/#pricing"
            onClick={() => setIsOpen(false)}
            className="text-[#A0A0A0] hover:text-white transition-colors duration-200 text-base font-semibold"
          >
            Pricing
          </HashLink>

          <div className="h-px bg-white/8 my-1"></div>

          <div className="flex flex-col gap-3">
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="w-full text-center px-5 py-3 text-sm font-semibold text-white bg-transparent border border-white/12 rounded-xl hover:border-white/25 transition-all duration-200"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="w-full text-center px-5 py-3 text-sm font-semibold text-black bg-white rounded-xl hover:bg-[#EAEAEA] transition-all duration-200"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
