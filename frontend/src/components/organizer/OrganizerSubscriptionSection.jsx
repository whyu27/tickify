import { useState } from 'react';
import { Check, Info, Calendar, Shield, CreditCard, Sparkles, Award, Loader } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const OrganizerSubscriptionSection = ({ subscription, currentPlan, onUpgrade, events = [] }) => {
  const [showModal, setShowModal] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const { user } = useAuth();

  const activeEventsCount = events.filter(e => e.status === 'draft' || e.status === 'published').length;
  const remainingQuota = Math.max(0, 2 - activeEventsCount);
  const isPro = currentPlan === 'pro' || currentPlan === 'organizer_pro';

  const formattedEndDate = subscription?.subscription_end_date 
    ? new Date(subscription.subscription_end_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '30 Days from activation';

  const displayWallet = user?.wallet_address 
    ? `${user.wallet_address.slice(0, 6)}...${user.wallet_address.slice(-4)}`
    : '0xAcademicDemoAddress...3f8a';

  const handleUpgradeClick = async () => {
    setIsUpgrading(true);
    const success = await onUpgrade();
    setIsUpgrading(false);
    if (success) {
      setShowModal(false);
    }
  };

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
                  Active
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

                {/* Web3 Info */}
                <div className="p-5 bg-white/5 border border-white/5 rounded-xl space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-[#777777] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <div>
                      <p className="text-xs text-[#777777] uppercase tracking-wider">Expiry Date</p>
                      <p className="text-sm font-semibold text-[#A0A0A0]">{formattedEndDate}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pt-3 border-t border-white/6">
                    <CreditCard className="w-5 h-5 text-[#777777] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <div>
                      <p className="text-xs text-[#777777] uppercase tracking-wider">Linked Wallet</p>
                      <p className="text-sm font-semibold text-[#A0A0A0]">{displayWallet}</p>
                    </div>
                  </div>
                </div>

                {/* Current Plan Badge */}
                <div className="pt-4">
                  <div className="w-full flex items-center justify-center gap-2 px-6 py-4 text-base font-bold text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-xl">
                    <Check className="w-5 h-5 text-[#22C55E]" />
                    <span>Current Plan</span>
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

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#161616] border border-white/8 rounded-2xl p-8 max-w-md w-full relative shadow-2xl animate-scale-in flex flex-col space-y-6">
            
            {/* Header */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Upgrade to Organizer Pro</h3>
              <p className="text-sm text-[#A0A0A0] leading-relaxed">
                Unlock all premium organizer features.
              </p>
            </div>

            {/* Features list */}
            <div className="space-y-3 py-2 border-t border-b border-white/6">
              {[
                'Unlimited Event Creation',
                'NFT Ticket Minting',
                'Advanced Event Reports',
                'Ticket Validator',
                'QR Code Verification'
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-sm text-[#A0A0A0]">
                  <Check className="w-4 h-4 text-[#22C55E] flex-shrink-0" strokeWidth={2.5} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Info Box */}
            <div className="p-4 bg-purple-600/10 border border-purple-500/25 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <Info className="w-4.5 h-4.5 flex-shrink-0 text-purple-400" />
                <span>Academic Version</span>
              </div>
              <p className="text-xs text-[#A0A0A0] leading-relaxed">
                Organizer Pro will be activated instantly for demonstration purposes.
              </p>
              <p className="text-xs font-semibold text-purple-300">
                No payment is required.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isUpgrading}
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 border border-white/10 rounded-xl text-xs font-bold text-[#A0A0A0] hover:text-white hover:bg-white/5 disabled:opacity-50 transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isUpgrading}
                onClick={handleUpgradeClick}
                className="px-5 py-2.5 bg-white hover:bg-[#EAEAEA] disabled:bg-white/50 text-black rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer min-w-[120px]"
              >
                {isUpgrading ? (
                  <>
                    <Loader className="w-3.5 h-3.5 animate-spin" />
                    <span>Upgrading...</span>
                  </>
                ) : (
                  <span>Upgrade to Pro</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default OrganizerSubscriptionSection;
