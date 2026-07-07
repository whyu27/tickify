import { HashLink } from 'react-router-hash-link';

const Footer = () => {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/8 py-16">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Footer Content Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <HashLink smooth to="/#home" className="flex items-center gap-2 z-10 inline-flex">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-black text-lg">T</span>
              </div>
              <span className="text-xl font-bold text-white">Tickify</span>
            </HashLink>
            <p className="text-sm text-[#A0A0A0] leading-relaxed max-w-xs">
              Blockchain-powered ticketing SaaS for secure, transparent, and decentralized event management.
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Product</h4>
            <ul className="space-y-2">
              <li>
                <HashLink smooth to="/#features" className="text-sm text-[#777777] hover:text-white transition-colors duration-200 block">
                  Features
                </HashLink>
              </li>
              <li>
                <HashLink smooth to="/#events" className="text-sm text-[#777777] hover:text-white transition-colors duration-200 block">
                  Explore Events
                </HashLink>
              </li>
              <li>
                <HashLink smooth to="/#pricing" className="text-sm text-[#777777] hover:text-white transition-colors duration-200 block">
                  Pricing Plans
                </HashLink>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2">
              <li>
                <HashLink smooth to="/#faq" className="text-sm text-[#777777] hover:text-white transition-colors duration-200 block">
                  FAQs
                </HashLink>
              </li>
              <li>
                <span className="text-sm text-[#777777] block">
                  Sepolia Testnet
                </span>
              </li>
              <li>
                <span className="text-sm text-[#777777] block">
                  Smart Contracts
                </span>
              </li>
            </ul>
          </div>

          {/* Platform Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Platform</h4>
            <p className="text-sm text-[#777777] leading-relaxed">
              Powered by Ethereum Smart Contracts. Secure, transparent, and verifiable ticket NFT ownership.
            </p>
          </div>
        </div>

        {/* Divider and Copyright */}
        <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-sm text-[#777777]">
            © 2026 Tickify. Blockchain Ticketing SaaS.
          </p>
          <div className="flex items-center gap-4 text-sm text-[#777777]">
            <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
