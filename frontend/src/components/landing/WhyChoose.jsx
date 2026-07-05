import { Shield, BadgeCheck, QrCode } from 'lucide-react';
import { features } from '../../data/features';

const iconMap = {
  shield: Shield,
  'badge-check': BadgeCheck,
  'qr-code': QrCode
};

const WhyChoose = () => {
  return (
    <section className="py-20 bg-[#0A0A0A]">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why Choose Tickify
          </h2>
          <p className="text-lg text-[#A0A0A0] max-w-2xl mx-auto">
            Secure, transparent and decentralized ticketing.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = iconMap[feature.icon];
            return (
              <div
                key={feature.id}
                className="bg-[#161616] border border-white/8 rounded-2xl p-8 hover:border-white/15 transition-all duration-300 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 rounded-2xl mb-6">
                  {Icon && <Icon className="w-8 h-8 text-white" strokeWidth={1.5} />}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-base text-[#A0A0A0] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
