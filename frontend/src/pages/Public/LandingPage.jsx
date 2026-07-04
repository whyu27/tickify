import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import { Calendar, MapPin, Ticket, AlertCircle } from 'lucide-react';

const LandingPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchEvents = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await api.get('/events');
      if (response.data && response.data.success) {
        setEvents(response.data.data || []);
      } else {
        setErrorMsg(response.data?.message || 'Gagal memuat event.');
      }
    } catch (error) {
      console.error('Fetch events error:', error);
      const msg = error.response?.data?.message || 'Terjadi kesalahan pada server saat mengambil data event';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-800 via-indigo-900 to-zinc-950 text-white py-16 px-8 sm:px-12 text-center shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.15),transparent_50%)]"></div>
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
            Web3-Powered Ticketing
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Discover and Attend Premium Blockchain Events
          </h1>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Tickify is the premier decentralized ticketing platform. Buy, verify, and own your tickets securely on the blockchain.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-6 py-3 bg-white text-purple-900 font-semibold rounded-xl hover:bg-purple-50 transition-all duration-200 hover:-translate-y-0.5"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 hover:-translate-y-0.5 border border-purple-500/30"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Upcoming Events
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Explore and book your spot at top-tier events.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="min-h-[300px] flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading events...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && errorMsg && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-650 dark:text-red-400 p-6 rounded-2xl flex items-start gap-4">
            <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-bold">Error Memuat Event</h3>
              <p className="text-sm">{errorMsg}</p>
              <button
                onClick={fetchEvents}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !errorMsg && events.length === 0 && (
          <div className="min-h-[300px] flex flex-col items-center justify-center bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 p-8 rounded-2xl shadow-sm text-center">
            <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">No Events Found</h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
              Currently there are no events scheduled. Please check back later!
            </p>
          </div>
        )}

        {/* Events Grid */}
        {!isLoading && !errorMsg && events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event.id}
                onClick={() => navigate(`/events/${event.id}`)}
                className="group cursor-pointer bg-white dark:bg-zinc-800 rounded-2xl border border-gray-200 dark:border-zinc-700 shadow-sm flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Banner */}
                <div className="relative overflow-hidden">
                  {event.banner_url ? (
                    <img
                      src={event.banner_url}
                      alt={event.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
                      No Banner Available
                    </div>
                  )}
                  {/* Quota Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/95 dark:bg-zinc-900/95 shadow-sm text-purple-600 dark:text-purple-400">
                      {event.quota} Slots
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-lg text-gray-900 dark:text-white line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {event.title}
                    </h3>

                    {/* Date & Location */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                        <span>{formatDate(event.event_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="pt-4 border-t border-gray-100 dark:border-zinc-700 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Price</span>
                    <span className="text-base font-black text-purple-600 dark:text-purple-400 flex items-center gap-1">
                      <Ticket className="w-4 h-4" />
                      {event.price_eth} ETH
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
