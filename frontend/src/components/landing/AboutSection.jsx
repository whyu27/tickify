const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-[#0A0A0A]">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text Content */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              About Tickify
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">What is Tickify?</h3>
                <p className="text-base text-[#A0A0A0] leading-relaxed">
                  Tickify is a blockchain-based ticketing SaaS platform that revolutionizes how events are managed. 
                  We provide secure, transparent, and decentralized ticketing solutions for organizers and participants.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">Why Blockchain?</h3>
                <p className="text-base text-[#A0A0A0] leading-relaxed">
                  Blockchain technology ensures ticket authenticity, prevents fraud, and provides transparent ownership. 
                  Every ticket is immutable and verifiable on the blockchain, eliminating counterfeit tickets.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">NFT Ticket Benefits</h3>
                <p className="text-base text-[#A0A0A0] leading-relaxed">
                  Each ticket is minted as an NFT, giving you true ownership. You can transfer, collect, or even trade 
                  your tickets securely. NFT tickets also serve as digital memorabilia from your favorite events.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">Who is it for?</h3>
                <p className="text-base text-[#A0A0A0] leading-relaxed">
                  Tickify is designed for event organizers who want secure ticket management and participants who value 
                  authenticity and ownership. From concerts to conferences, we serve all types of events.
                </p>
              </div>
            </div>
          </div>

          {/* Right - Illustration */}
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/8 flex items-center justify-center p-12">
              <div className="text-center space-y-6">
                <div className="w-32 h-32 mx-auto bg-white/10 rounded-2xl flex items-center justify-center">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-white mb-2">Blockchain Powered</h4>
                  <p className="text-[#A0A0A0] text-sm">Secure, Transparent, Decentralized</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
