import { Calendar, Ticket, Crown } from 'lucide-react';

const OrganizerStatistics = ({ totalEvents, totalTicketsSold, subscriptionPlan }) => {
  const stats = [
    {
      id: 'events',
      icon: Calendar,
      value: totalEvents,
      label: 'My Events'
    },
    {
      id: 'tickets',
      icon: Ticket,
      value: totalTicketsSold,
      label: 'Tickets Sold'
    },
    {
      id: 'subscription',
      icon: Crown,
      value: subscriptionPlan === 'pro' ? 'Pro' : 'Free',
      label: 'Subscription Plan'
    }
  ];

  return (
    <section className="py-20 bg-[#0A0A0A]">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Your Statistics
          </h2>
          <p className="text-lg text-[#A0A0A0] max-w-2xl mx-auto">
            Track your event performance and subscription status.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="bg-[#161616] border border-white/8 rounded-2xl p-8 hover:border-white/15 transition-all duration-300 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 rounded-2xl mb-6">
                  <Icon className="w-8 h-8 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-4xl font-bold text-white mb-3">
                  {stat.value}
                </h3>
                <p className="text-base text-[#A0A0A0]">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OrganizerStatistics;
