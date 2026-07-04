import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { Plus, Calendar, Users, Ticket } from 'lucide-react';

const DashboardOrganizer = () => {
  const { user } = useAuth();

  // Placeholder stats
  const stats = [
    { name: 'Total Events', value: '0', icon: Calendar, color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' },
    { name: 'Total Participants', value: '0', icon: Users, color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' },
    { name: 'Total Tickets Sold', value: '0', icon: Ticket, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome & Create Event CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Welcome, {user?.name || 'Organizer'}!
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Manage your events, view ticket metrics, and verify check-ins in one central place.
          </p>
        </div>
        
        <div>
          <Link
            to="/dashboard/organizer/events/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-purple-600/10 hover:shadow-purple-600/20 transition-all duration-200 hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            <span>Create Event</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white dark:bg-zinc-800 p-6 rounded-2xl border border-gray-200 dark:border-zinc-700 shadow-sm flex items-center justify-between transition-all hover:shadow-md"
            >
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`p-4 rounded-xl ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Info Box */}
      <div className="bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-purple-900 dark:text-purple-300">
          Get Started with Tickify
        </h3>
        <p className="mt-2 text-sm text-purple-700 dark:text-purple-400">
          You haven't created any events yet. Click the <strong>Create Event</strong> button to launch your first Web3-powered ticketing experience.
        </p>
      </div>
    </div>
  );
};

export default DashboardOrganizer;
