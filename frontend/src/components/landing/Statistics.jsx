import { useState, useEffect } from 'react';
import { Calendar, Ticket, ShieldCheck } from 'lucide-react';
import api from '../../api/axios';

const iconMap = {
  calendar: Calendar,
  ticket: Ticket,
  'shield-check': ShieldCheck
};

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/statistics');

        if (response.data.success) {
          setStats(response.data.data);
        } else {
          setError('Failed to load statistics');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statItems = stats
    ? [
        {
          id: 1,
          label: 'Active Events',
          value: stats.activeEvents,
          description: 'Live events on platform',
          icon: 'calendar'
        },
        {
          id: 2,
          label: 'Tickets Available',
          value: `${stats.ticketsAvailable}+`,
          description: 'Ready for purchase',
          icon: 'ticket'
        },
        {
          id: 3,
          label: 'Platform Status',
          value: stats.platformStatus,
          description: 'Running on Sepolia',
          icon: 'shield-check'
        },
        {
          id: 4,
          label: 'NFT Tickets Minted',
          value: '100%',
          description: 'Secured on Ethereum',
          icon: 'shield-check'
        }
      ]
    : [];

  return (
    <section className="py-20 bg-[#0D0D0D]">
      <div className="max-w-[1280px] mx-auto px-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <p className="text-[#A0A0A0] text-sm mt-4">Loading statistics...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statItems.map((stat) => {
              const Icon = iconMap[stat.icon];
              return (
                <div
                  key={stat.id}
                  className="bg-[#161616] border border-white/8 rounded-2xl p-6 hover:border-white/15 transition-all duration-300 h-full flex flex-col justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/5 rounded-xl flex-shrink-0">
                      {Icon && <Icon className="w-6 h-6 text-white" strokeWidth={1.5} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-3xl font-bold text-white mb-1 truncate">{stat.value}</h3>
                      <p className="text-base font-semibold text-white mb-1 truncate">{stat.label}</p>
                      <p className="text-sm text-[#777777] break-words">{stat.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Statistics;
