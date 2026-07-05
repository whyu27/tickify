const Footer = () => {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/8 py-12">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Bottom Text */}
        <div className="text-center space-y-3">
          <p className="text-sm text-[#A0A0A0]">
            <b>Powered by Ethereum Smart Contracts</b>
          </p>
          <p className="text-sm text-[#777777]">
            © 2026 Tickify. Blockchain Ticketing SaaS.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
