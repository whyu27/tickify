import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';
import { Plus, Calendar, Users, Ticket, Crown, Zap, Sparkles, AlertCircle, Check, Loader } from 'lucide-react';

const DashboardOrganizer = () => {
  const { user } = useAuth();
  
  // Dashboard state
  const [subscription, setSubscription] = useState(null);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Upgrade state
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeError, setUpgradeError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const [subRes, eventsRes] = await Promise.all([
        api.get('/subscription'),
        api.get('/events/organizer')
      ]);

      if (subRes.data && subRes.data.success) {
        setSubscription(subRes.data.data);
      }
      
      if (eventsRes.data && eventsRes.data.success) {
        setEvents(eventsRes.data.data || []);
      }
    } catch (error) {
      console.error('Fetch dashboard data error:', error);
      setErrorMsg(error.response?.data?.message || 'Gagal memuat data dashboard.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    setUpgradeError('');
    try {
      const response = await api.put('/subscription/upgrade');
      if (response.data && response.data.success) {
        setSubscription(response.data.data);
        setShowSuccess(true);
        // Refresh event details too
        fetchDashboardData();
      } else {
        setUpgradeError(response.data?.message || 'Gagal melakukan upgrade.');
      }
    } catch (error) {
      console.error('Upgrade subscription error:', error);
      setUpgradeError(error.response?.data?.message || 'Terjadi kesalahan pada server saat upgrade.');
    } finally {
      setIsUpgrading(false);
    }
  };

  // Dynamic statistics calculations
  const totalEvents = events.length;
  const totalTicketsSold = events.reduce((sum, e) => sum + (Number(e.tickets_sold) || 0), 0);
  const totalParticipants = totalTicketsSold; // Dynamic proxy for participants count

  const stats = [
    { 
      name: 'Total Events', 
      value: String(totalEvents), 
      icon: Calendar, 
      color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' 
    },
    { 
      name: 'Total Participants', 
      value: String(totalParticipants), 
      icon: Users, 
      color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
    },
    { 
      name: 'Total Tickets Sold', 
      value: String(totalTicketsSold), 
      icon: Ticket, 
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' 
    },
  ];

  // Active events for Free plan check (status draft or published)
  const activeEventsCount = events.filter(e => ['draft', 'published'].includes(e.status)).length;
  const isFreePlan = subscription?.subscription_plan !== 'pro';

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-650 mx-auto"></div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 font-sans">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

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

      {errorMsg && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-650 dark:text-red-400 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-semibold">{errorMsg}</span>
        </div>
      )}

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Stats and Info Box */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              {totalEvents === 0 ? (
                <>
                  You haven't created any events yet. Click the <strong>Create Event</strong> button to launch your first Web3-powered ticketing experience.
                </>
              ) : (
                <>
                  You have successfully created <strong>{totalEvents}</strong> events. Go to the <strong>My Events</strong> page to view their detailed status and ticket pricing.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Right Side: Subscription Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-zinc-800 rounded-3xl border border-gray-200 dark:border-zinc-700 shadow-sm overflow-hidden flex flex-col justify-between h-full">
            {/* Card Header with beautiful premium gradient */}
            <div className="p-6 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-6 -mt-6 transform rotate-45 pointer-events-none"></div>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-purple-200">
                    Organizer Plan
                  </span>
                  <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                    {!isFreePlan ? (
                      <>
                        <Crown className="w-6 h-6 text-amber-300 animate-pulse fill-amber-300" />
                        <span>Pro Plan</span>
                      </>
                    ) : (
                      <span>Free Plan</span>
                    )}
                  </h2>
                </div>
                <div>
                  {!isFreePlan ? (
                    <span className="inline-flex items-center gap-1 bg-amber-400 text-purple-950 font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                      PRO ACTIVE
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-white/20 text-white font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full">
                      FREE TIER
                    </span>
                  )}
                </div>
              </div>

              {!isFreePlan && subscription?.subscription_end_date && (
                <div className="mt-4 text-xs text-purple-200 font-medium">
                  Active until {new Date(subscription.subscription_end_date).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              )}
            </div>

            {/* Card Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
              {/* Plan Status */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase font-bold text-gray-400 tracking-wider">Plan Status</h3>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      subscription?.subscription_status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${
                      subscription?.subscription_status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}></span>
                  </span>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300 capitalize">
                    {subscription?.subscription_status || 'Active'}
                  </span>
                </div>
              </div>

              {/* Event Usage Progress Bar */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-400 uppercase tracking-wider">Event Usage</span>
                  <span className="font-extrabold text-gray-900 dark:text-white">
                    {!isFreePlan ? (
                      `${activeEventsCount} / ∞`
                    ) : (
                      `${activeEventsCount} / 2`
                    )}
                  </span>
                </div>
                
                {!isFreePlan ? (
                  <div className="h-2 w-full bg-gray-150 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 w-full"></div>
                  </div>
                ) : (
                  <div className="h-2 w-full bg-gray-150 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        activeEventsCount >= 2 
                          ? 'bg-gradient-to-r from-red-500 to-amber-500' 
                          : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                      }`}
                      style={{ width: `${Math.min((activeEventsCount / 2) * 100, 100)}%` }}
                    ></div>
                  </div>
                )}
                
                {isFreePlan && activeEventsCount >= 2 && (
                  <p className="text-[10px] text-red-500 font-bold leading-tight flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>Free plan limit reached. Upgrade to Pro.</span>
                  </p>
                )}
              </div>

              {/* Upgrade Button */}
              {isFreePlan ? (
                <button
                  onClick={() => {
                    setIsUpgradeModalOpen(true);
                    setUpgradeError('');
                    setShowSuccess(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-650 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Upgrade to Pro</span>
                </button>
              ) : (
                <div className="w-full flex items-center justify-center gap-2 px-5 py-3 border border-amber-250 dark:border-amber-800/50 bg-amber-50/20 dark:bg-amber-950/10 text-amber-600 dark:text-amber-400 font-bold text-xs rounded-2xl">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Pro Features Unlocked</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all">
          <div className="bg-white dark:bg-zinc-800 rounded-3xl max-w-md w-full border border-gray-250 dark:border-zinc-700 p-6 shadow-2xl relative overflow-hidden space-y-6">
            
            {!showSuccess ? (
              <>
                {/* Modal Header */}
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-yellow-500/20 animate-bounce">
                    <Crown className="w-8 h-8 text-white fill-white" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">Upgrade to Pro</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 px-4">
                    Unlock unlimited power and scale your Tickify Web3-based events.
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-3 pt-2">
                  {[
                    { title: 'Unlimited Events', desc: 'Create as many draft or published events as you want (Free: 2 limit).' },
                    { title: 'Priority verification', desc: 'Instant check-in scanning and secure blockchain transactions.' },
                    { title: 'Advanced Dashboard Metrics', desc: 'Unlock detailed graphs, participants analytics & sales history.' },
                  ].map((feat, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="p-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg flex-shrink-0 h-7 w-7 flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-gray-800 dark:text-zinc-200">{feat.title}</h4>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing / Trial Info */}
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/30 p-4 rounded-2xl text-center space-y-1">
                  <p className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 tracking-wider">Pricing</p>
                  <p className="text-lg font-black text-purple-950 dark:text-purple-300">
                    Free / 30 Days Trial
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    No credit card required. Upgrade instantly.
                  </p>
                </div>

                {/* Error Banner */}
                {upgradeError && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-650 dark:text-red-400 p-3 rounded-xl text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{upgradeError}</span>
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="flex items-center gap-3 justify-end pt-2">
                  <button
                    type="button"
                    disabled={isUpgrading}
                    onClick={() => setIsUpgradeModalOpen(false)}
                    className="px-5 py-2.5 border border-gray-250 dark:border-zinc-650 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-350 hover:bg-gray-50 dark:hover:bg-zinc-700/50 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isUpgrading}
                    onClick={handleUpgrade}
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-650 to-indigo-650 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/10 hover:shadow-purple-600/20 disabled:opacity-50 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    {isUpgrading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        <span>Upgrading...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-white" />
                        <span>Upgrade Now</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              /* Success Screen */
              <div className="text-center py-6 space-y-6">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-md animate-pulse">
                  <Check className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">Upgrade Successful!</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 px-6 leading-relaxed">
                    Welcome to <strong>Tickify Pro</strong>! Your account has been upgraded, unlocking unlimited events and premium features.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => setIsUpgradeModalOpen(false)}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardOrganizer;

