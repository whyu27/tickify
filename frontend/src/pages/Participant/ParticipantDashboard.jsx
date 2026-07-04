import useAuth from '../../hooks/useAuth';
import { Calendar, Wallet, Ticket, ArrowRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const ParticipantDashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-650 mx-auto"></div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const cards = [
    {
      name: 'Wallet Status',
      value: 'Not Connected',
      icon: Wallet,
      desc: 'Connect MetaMask wallet to buy tickets.',
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30',
    },
    {
      name: 'Total Tickets',
      value: '0',
      icon: Ticket,
      desc: 'Total tickets owned by your wallet on-chain.',
      color: 'text-purple-650 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-900/30',
    },
    {
      name: 'Upcoming Events',
      value: '0',
      icon: Calendar,
      desc: 'Active events you are scheduled to attend.',
      color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Welcome back, {user?.name || 'Participant'}!
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Browse upcoming events, view your ticket history, and manage your blockchain tickets.
          </p>
        </div>

        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5"
          >
            <span>Browse Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.name}
              className={`bg-white dark:bg-zinc-800 p-6 rounded-3xl border border-gray-250 dark:border-zinc-700 shadow-sm flex flex-col justify-between space-y-4 transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  {card.name}
                </span>
                <div className={`p-3 rounded-xl ${card.color.split(' ').slice(0,3).join(' ')}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">
                  {card.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-normal">
                  {card.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action / Information Section */}
      <div className="bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 p-6 rounded-3xl space-y-4">
        <h3 className="text-lg font-bold text-purple-900 dark:text-purple-300">
          Get Started with Decentralized Ticketing
        </h3>
        <p className="text-sm text-purple-750 dark:text-purple-400 leading-relaxed max-w-3xl">
          To buy tickets, make sure you have installed the MetaMask wallet extension on your browser and linked it to your account. Your ticket ownership is securely registered on the Sepolia/Amoy testnet.
        </p>
        <div className="pt-2">
          <button
            disabled
            className="px-4 py-2 border border-purple-200 dark:border-purple-800/40 text-xs font-semibold rounded-xl text-purple-400 dark:text-purple-550 bg-purple-50/50 dark:bg-purple-950/10 cursor-not-allowed"
          >
            Connect MetaMask (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParticipantDashboard;
