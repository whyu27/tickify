const Hero = () => {
  return (
    <section id="home" className="relative min-h-[85vh] flex items-center justify-center bg-[#0A0A0A] overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/3 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/5 border border-white/8 rounded-full">
          <span className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse"></span>
          <span className="text-sm font-medium text-[#A0A0A0]">Live on Sepolia Testnet</span>
        </div>

        {/* Heading */}
        <h1 className="text-6xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
          Events Tiketing Platform<br />
          <span className="text-[#A0A0A0] text-5xl">Powered by Blockchain</span>
        </h1>

        {/* Sub Heading */}
        <p className="text-lg md:text-xl text-[#A0A0A0] max-w-3xl mx-auto mb-10 leading-relaxed">
          Buy, manage, and verify event tickets securely using blockchain technology.
          <br />
          Designed for organizers and participants in one platform.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-3">
          <a
            href="#events"
            className="px-4 py-3 text-base font-semibold text-black bg-white rounded-xl hover:bg-[#EAEAEA] transition-all duration-200 hover:scale-105"
          >
            Explore Events
          </a>
          <a
            href="#faq"
            className="px-4 py-3 text-base font-semibold text-white bg-transparent border border-white/12 rounded-xl hover:border-white/25 hover:bg-white/5 transition-all duration-200"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
