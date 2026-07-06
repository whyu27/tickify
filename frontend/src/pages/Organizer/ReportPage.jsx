import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Ticket, Shield, TrendingUp, Users, CheckCircle, BarChart3, Database } from 'lucide-react';
import OrganizerNavbar from '../../components/organizer/OrganizerNavbar';
import Footer from '../../components/landing/Footer';
import api from '../../api/axios';
import { getImageUrl } from '../../utils/imageHelper';

const ReportPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventReport = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/events/${eventId}`);
        if (response.data && response.data.success) {
          setEvent(response.data.data);
        } else {
          setError(response.data?.message || 'Failed to load report data.');
        }
      } catch (err) {
        console.error('Fetch event report error:', err);
        setError(err.response?.data?.message || 'Failed to load report data.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventReport();
  }, [eventId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
        <OrganizerNavbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-20">
          <div className="inline-block w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          <p className="text-[#A0A0A0] text-lg font-medium">Loading performance report...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
        <OrganizerNavbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-6 py-20 max-w-md mx-auto px-6 text-center">
          <p className="text-[#EF4444] text-lg font-semibold">{error || 'Event report not found.'}</p>
          <button
            onClick={() => navigate('/dashboard/organizer/home')}
            className="flex items-center gap-2 px-6 py-3 text-base font-semibold text-black bg-white rounded-xl hover:bg-[#EAEAEA] transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate Metrics
  const totalTickets = Number(event.quota) || 0;
  const ticketsSold = Number(event.tickets_sold) || 0;
  const remainingTickets = Math.max(0, totalTickets - ticketsSold);
  const ticketPrice = Number(event.price_eth) || 0;
  const totalRevenue = (ticketsSold * ticketPrice).toFixed(3);

  const checkedInTickets = Number(event.checked_in_tickets) || 0;
  const pendingTickets = Number(event.pending_tickets) || 0;
  const attendanceRate = ticketsSold > 0 
    ? ((checkedInTickets / ticketsSold) * 100).toFixed(1) 
    : '0.0';

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      <OrganizerNavbar />

      <main className="flex-grow py-12">
        <div className="max-w-[1280px] mx-auto px-6 space-y-10">
          
          {/* Top Navigation */}
          <div className="flex items-center justify-between">
            <Link
              to="/dashboard/organizer/home"
              className="inline-flex items-center gap-2.5 text-sm font-semibold text-[#A0A0A0] hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </Link>
            
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-xs font-bold rounded-full">
              CLOSED EVENT REPORT
            </span>
          </div>

          {/* Event Banner & Basic Title */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Banner Column */}
            <div className="lg:col-span-2 relative h-64 md:h-80 rounded-2xl overflow-hidden border border-white/8 bg-[#161616]">
              {event.banner_url ? (
                <img
                  src={getImageUrl(event.banner_url)}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#777777] font-semibold">
                  No Banner Image
                </div>
              )}
              {/* Overlay shadow */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>

            {/* Event Meta Column */}
            <div className="bg-[#161616] border border-white/8 rounded-2xl p-6 md:p-8 space-y-6 h-full flex flex-col justify-between">
              <div className="space-y-4">
                {event.category_name && (
                  <span className="inline-block px-2.5 py-1 text-xs font-semibold bg-white/5 border border-white/8 text-[#A0A0A0] rounded-full">
                    {event.category_name}
                  </span>
                )}
                <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                  {event.title}
                </h1>
                
                <div className="space-y-3 pt-2 text-sm text-[#A0A0A0]">
                  <div className="flex items-start gap-2.5">
                    <Calendar className="w-5 h-5 text-[#777777] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <span>{formatDate(event.event_date)}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-5 h-5 text-[#777777] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/6 flex items-center justify-between text-xs text-[#777777]">
                <span>ORGANIZER</span>
                <span className="font-semibold text-white">{event.organizer_name || 'Tickify Organizer'}</span>
              </div>
            </div>
          </div>

          {/* Metrics Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tickets Sold Card */}
            <div className="bg-[#161616] border border-white/8 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#22C55E]"></div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#777777] uppercase tracking-wider">Tickets Sold</span>
                <Ticket className="w-5 h-5 text-[#22C55E]" />
              </div>
              <p className="text-3xl font-extrabold text-white mb-1">
                {ticketsSold}
              </p>
              <p className="text-xs text-[#777777]">
                out of {totalTickets} total quota
              </p>
            </div>

            {/* Total Revenue Card */}
            <div className="bg-[#161616] border border-white/8 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#FACC15]"></div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#777777] uppercase tracking-wider">Total Revenue</span>
                <TrendingUp className="w-5 h-5 text-[#FACC15]" />
              </div>
              <p className="text-3xl font-extrabold text-white mb-1">
                {totalRevenue} ETH
              </p>
              <p className="text-xs text-[#777777]">
                at {ticketPrice} ETH / ticket
              </p>
            </div>

            {/* Attendance Checked In Card */}
            <div className="bg-[#161616] border border-white/8 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#777777] uppercase tracking-wider">Checked In</span>
                <CheckCircle className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-extrabold text-white mb-1">
                {checkedInTickets}
              </p>
              <p className="text-xs text-[#777777]">
                with {pendingTickets} pending tickets
              </p>
            </div>

            {/* Attendance Rate Card */}
            <div className="bg-[#161616] border border-white/8 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500"></div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-[#777777] uppercase tracking-wider">Attendance Rate</span>
                <Users className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-3xl font-extrabold text-white mb-1">
                {attendanceRate}%
              </p>
              <p className="text-xs text-[#777777]">
                checked-in relative to sold
              </p>
            </div>
          </div>

          {/* Charts & Blockchain Performance Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Blockchain Details (Placeholders) */}
            <div className="bg-[#161616] border border-white/8 rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
                    <Database className="w-5 h-5 text-[#A0A0A0]" strokeWidth={1.5} />
                    On-chain Performance
                  </h3>
                  <span className="px-3 py-1 bg-white/5 border border-white/8 text-[#777777] text-[10px] font-bold rounded-full tracking-wider uppercase">
                    Coming Soon
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm py-2 border-b border-white/5">
                    <span className="text-[#A0A0A0]">Smart Contract Status</span>
                    <span className="text-[#777777] italic font-medium">Pending Release</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-2 border-b border-white/5">
                    <span className="text-[#A0A0A0]">NFTs Minted</span>
                    <span className="text-[#777777] italic font-medium">0 / {ticketsSold}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm py-2 border-b border-white/5">
                    <span className="text-[#A0A0A0]">Total On-chain Transactions</span>
                    <span className="text-[#777777] italic font-medium">0</span>
                  </div>
                  <div className="flex justify-between items-start text-sm py-2 border-b border-white/5">
                    <span className="text-[#A0A0A0] flex-shrink-0">Contract Address</span>
                    <span className="text-[#777777] italic truncate max-w-[200px] md:max-w-xs font-mono">Not Deployed</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/5 flex flex-col justify-center items-center text-center space-y-2">
                <p className="text-xs text-[#A0A0A0] font-semibold">Web3 Transaction History</p>
                <p className="text-[11px] text-[#777777] leading-relaxed">
                  Decentralized sync details and event contracts logs will load dynamically after Smart Contract integration.
                </p>
              </div>
            </div>

            {/* Visual Analytics Charts Placeholder */}
            <div className="bg-[#161616] border border-white/8 rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between min-h-[350px]">
              {/* Blur screen for Analytics Placeholder */}
              <div className="absolute inset-0 bg-[#161616]/40 backdrop-blur-[1px] flex flex-col items-center justify-center p-6 text-center z-10">
                <div className="w-12 h-12 bg-white/5 border border-white/8 rounded-2xl flex items-center justify-center mb-4 text-[#A0A0A0]">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Advanced Analytics</h4>
                <p className="text-xs text-[#777777] max-w-xs leading-relaxed mb-6">
                  Interactive sales velocity, ticket tier breakdowns, and hourly check-in rates are coming soon.
                </p>
                <span className="px-3 py-1 bg-white/5 border border-white/8 text-[#A0A0A0] text-xs font-bold rounded-full">
                  COMING SOON
                </span>
              </div>

              {/* Fake Chart Graphics in background */}
              <div className="opacity-10 pointer-events-none select-none flex flex-col justify-between h-full w-full">
                <div className="flex justify-between items-center mb-6">
                  <div className="h-4 bg-white/20 rounded w-24"></div>
                  <div className="h-4 bg-white/20 rounded w-16"></div>
                </div>

                <div className="flex items-end justify-between h-40 pt-4">
                  <div className="h-10 bg-white/20 rounded w-8"></div>
                  <div className="h-24 bg-white/20 rounded w-8"></div>
                  <div className="h-16 bg-white/20 rounded w-8"></div>
                  <div className="h-32 bg-white/20 rounded w-8"></div>
                  <div className="h-28 bg-white/20 rounded w-8"></div>
                  <div className="h-36 bg-white/20 rounded w-8"></div>
                  <div className="h-40 bg-white/20 rounded w-8"></div>
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
                  <div className="h-3 bg-white/20 rounded w-12"></div>
                  <div className="h-3 bg-white/20 rounded w-12"></div>
                  <div className="h-3 bg-white/20 rounded w-12"></div>
                  <div className="h-3 bg-white/20 rounded w-12"></div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReportPage;
