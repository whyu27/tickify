import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full h-[72px] bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/8">
      <div className="max-w-[1280px] mx-auto px-6 h-full relative flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white tracking-tight z-10">
          Tickify
        </Link>

        {/* Desktop Navigation - Centered Absolutely */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <a href="#home" className="text-[#A0A0A0] hover:text-white transition-colors duration-200 text-sm font-medium">
            Home
          </a>
          <a href="#events" className="text-[#A0A0A0] hover:text-white transition-colors duration-200 text-sm font-medium">
            Events
          </a>
          <a href="#faq" className="text-[#A0A0A0] hover:text-white transition-colors duration-200 text-sm font-medium">
            FAQ
          </a>
          <a href="#pricing" className="text-[#A0A0A0] hover:text-white transition-colors duration-200 text-sm font-medium">
            Pricing
          </a>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4 z-10">
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
      </div>
    </nav>
  );
};

export default Navbar;
