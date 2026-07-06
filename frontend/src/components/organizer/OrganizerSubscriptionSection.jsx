import { useState } from 'react';
import { Check, Info, Calendar, Shield, CreditCard, Sparkles, Award } from 'lucide-react';

const OrganizerSubscriptionSection = ({ currentPlan, onUpgrade, events = [] }) => {
  const [showModal, setShowModal] = useState(false);

  const activeEventsCount = events.filter(e => e.status === 'draft' || e.status === 'published').length;
  const remainingQuota = Math.max(0, 2 - activeEventsCount);
  const isPro = currentPlan === 'pro' || currentPlan === 'organizer_pro';

  const freeFeatures = [
    'Max 2 Active Events',
    'Basic Dashboard',
    'Community Support'
  ];

  const proFeatures = [
    'Unlimited Events',
    'Advanced Analytics',
    'Priority Support',
    'Unlimited Ticket Verification',
    'Custom Branding'
  ];

  return (
    <section id="subscription" className="py-24 bg-[#0D0D0D] border-t border-white/5">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            My Subscription
          </h2>
          <p className="text-lg text-[#A0A0A0] max-w-2xl mx-auto">
            Manage your plan details, view quotas, and upgrade your organizer capabilities.
          </p>
        </div>

        {/* Personalized Card Container */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#161616] border border-white/8 rounded-2xl p-8 md:p-10 relative overflow-hidden group hover:border-white/12 transition-all duration-300 shadow-2xl">
            {/* Top gradient blur for premium look */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

            {/* Card Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-white/6">
              <div>
                <p className="text-xs text-[#777777] uppercase tracking-wider mb-1">Current Status</p>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  {isPro ? (
                    <>
                      Organizer Pro <Sparkles className="w-5 h-5 text-[#FACC15] animate-pulse" />
                    </>
                  ) : (
                    <>
                      Free Plan <Award className="w-5 h-5 text-[#777777]" />
                    </>
                  )}
                </h3>
              </div>
              <div>
                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold ${
                  isPro 
                    ? 'bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E]' 
                    : 'bg-white/5 border border-white/8 text-[#A0A0A0]'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isPro ? 'bg-[#22C55E] animate-pulse' : 'bg-[#A0A0A0]'}`}></span>
                  ACTIVE
                </span>
              </div>
            </div>

            {/* Plan Specific Body */}
            {!isPro ? (
              // Free Plan Body
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-3">Included Features</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {freeFeatures.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-sm text-[#A0A0A0]">
                        <Check className="w-4.5 h-4.5 text-[#22C55E] flex-shrink-0" strokeWidth={2} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quota Section */}
                <div className="p-5 bg-white/5 border border-white/5 rounded-xl">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className="text-sm font-semibold text-white flex items-center gap-2">
                      <Info className="w-4 h-4 text-[#A0A0A0]" />
                      Active Events Quota
                    </span>
                    <span className="text-sm font-bold text-white">
                      {activeEventsCount} / 2 Used
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-3">
                    <div 
                      className="h-full bg-white transition-all duration-500 rounded-full"
                      style={{ width: `${Math.min(100, (activeEventsCount / 2) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-[#777777]">
                    You have <strong className="text-[#A0A0A0]">{remainingQuota}</strong> remaining active event slot{remainingQuota !== 1 && 's'}. Drafts and published events count towards this limit.
                  </p>
                </div>

                {/* Upgrade Button */}
                <div className="pt-4">
                  <button
                    onClick={() => setShowModal(true)}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 text-base font-bold text-black bg-white rounded-xl hover:bg-[#EAEAEA] transition-all duration-200 hover:scale-[1.01]"
                  >
                    Upgrade to Organizer Pro
                  </button>
                </div>
              </div>
            ) : (
              // Pro Plan Body
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-3">Your Premium Features</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {proFeatures.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-sm text-[#A0A0A0]">
                        <Check className="w-4.5 h-4.5 text-[#22C55E] flex-shrink-0" strokeWidth={2} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Web3 Placeholders */}
                <div className="p-5 bg-white/5 border border-white/5 rounded-xl space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-[#777777] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <div>
                      <p className="text-xs text-[#777777] uppercase tracking-wider">Expiry Date</p>
                      <p className="text-sm font-semibold text-[#A0A0A0]">Coming Soon (Sepolia Sync)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pt-3 border-t border-white/6">
                    <CreditCard className="w-5 h-5 text-[#777777] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <div>
                      <p className="text-xs text-[#777777] uppercase tracking-wider">Linked Wallet</p>
                      <p className="text-sm font-semibold text-[#A0A0A0]">Coming Soon (Web3 Sync)</p>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <p className="text-sm text-[#22C55E] font-medium">
                    You have unlocked all Organizer capabilities. Thank you for choosing Tickify Pro!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Coming Soon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#161616] border border-white/8 rounded-2xl p-8 max-w-md w-full text-center relative shadow-2xl animate-scale-in">
            <div className="w-16 h-16 bg-white/5 border border-white/8 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white">
              <Shield className="w-8 h-8" strokeWidth={1.5} />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-3">Upgrade Coming Soon</h3>
            <p className="text-sm text-[#A0A0A0] leading-relaxed mb-8">
              Organizer Pro subscription contracts are coming soon to Sepolia Testnet! Soon you will be able to lock premium credentials and subscribe directly using MetaMask payments.
            </p>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3.5 px-6 text-sm font-semibold text-white bg-transparent border border-white/12 rounded-xl hover:border-white/25 hover:bg-white/5 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default OrganizerSubscriptionSection;
