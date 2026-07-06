import { Link } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { subscriptionPlans } from '../../data/subscriptions';

const SubscriptionSection = () => {
  return (
    <section id="pricing" className="py-20 bg-[#0D0D0D]">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Subscription
          </h2>
          <p className="text-lg text-[#A0A0A0] max-w-2xl mx-auto">
            Choose the best plan for your organization.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-[#161616] rounded-2xl p-8 ${
                plan.highlighted
                  ? 'border-2 border-white/25 shadow-xl'
                  : 'border border-white/8'
              } hover:border-white/15 transition-all duration-300`}
            >
              {/* Plan Name */}
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              
              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.priceDetail && (
                    <span className="text-[#777777] text-sm">{plan.priceDetail}</span>
                  )}
                </div>
                <p className="text-sm text-[#A0A0A0] mt-2">{plan.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-[#22C55E] flex-shrink-0 mt-0.5" strokeWidth={2} />
                    ) : (
                      <X className="w-5 h-5 text-[#777777] flex-shrink-0 mt-0.5" strokeWidth={2} />
                    )}
                    <span className={`text-sm ${feature.included ? 'text-white' : 'text-[#777777]'}`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                to="/register?role=organizer"
                className={`w-full text-center block px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  plan.highlighted
                    ? 'bg-white text-black hover:bg-[#EAEAEA]'
                    : 'bg-transparent text-white border border-white/12 hover:border-white/25'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubscriptionSection;
