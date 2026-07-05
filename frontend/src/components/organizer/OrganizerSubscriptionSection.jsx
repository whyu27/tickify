import { Check, X } from 'lucide-react';

const OrganizerSubscriptionSection = ({ currentPlan, onUpgrade }) => {
  const subscriptionPlans = [
    {
      id: 'free',
      name: 'Free',
      price: 'Free',
      priceDetail: 'Forever',
      description: 'Perfect for trying out the platform',
      features: [
        { text: 'Max 2 Events', included: true },
        { text: 'Basic Dashboard', included: true },
        { text: 'Community Support', included: true },
        { text: 'Advanced Analytics', included: false },
        { text: 'Priority Support', included: false }
      ],
      cta: 'Current Plan',
      highlighted: false
    },
    {
      id: 'pro',
      name: 'Organizer Pro',
      price: '0.1 ETH',
      priceDetail: 'per month',
      description: 'For serious event organizers',
      features: [
        { text: 'Unlimited Events', included: true },
        { text: 'Advanced Analytics', included: true },
        { text: 'Priority Support', included: true },
        { text: 'Unlimited Ticket Verification', included: true },
        { text: 'Custom Branding', included: true }
      ],
      cta: 'Upgrade Now',
      highlighted: true
    }
  ];

  const handlePlanAction = (planId) => {
    if (planId === 'pro' && currentPlan !== 'pro') {
      onUpgrade();
    }
  };

  return (
    <section id="subscription" className="py-20 bg-[#0A0A0A]">
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
          {subscriptionPlans.map((plan) => {
            const isCurrentPlan = currentPlan === plan.id;
            const shouldHighlight = plan.highlighted || isCurrentPlan;

            return (
              <div
                key={plan.id}
                className={`bg-[#161616] rounded-2xl p-8 relative ${
                  shouldHighlight
                    ? 'border-2 border-white/25 shadow-xl'
                    : 'border border-white/8'
                } hover:border-white/15 transition-all duration-300`}
              >
                {/* Current Plan Badge */}
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-4 py-1 bg-[#22C55E] text-black text-xs font-bold rounded-full">
                      ACTIVE
                    </span>
                  </div>
                )}

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
                <button
                  onClick={() => handlePlanAction(plan.id)}
                  disabled={isCurrentPlan}
                  className={`w-full px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-200 ${
                    isCurrentPlan
                      ? 'bg-[#777777] text-white cursor-not-allowed opacity-60'
                      : plan.highlighted
                      ? 'bg-white text-black hover:bg-[#EAEAEA]'
                      : 'bg-transparent text-white border border-white/12 hover:border-white/25'
                  }`}
                >
                  {isCurrentPlan ? 'Current Plan' : plan.cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OrganizerSubscriptionSection;
