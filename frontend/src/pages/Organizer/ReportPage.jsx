import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Ticket, TrendingUp } from 'lucide-react';
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
  const ticketPrice = Number(event.price_eth) || 0;
  const totalRevenue = (ticketsSold * ticketPrice).toFixed(3);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-between">
      <OrganizerNavbar />

      <main className="flex-grow flex items-center justify-center py-6 md:py-12">
        <div className="max-w-[1280px] w-full mx-auto px-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Event Performance Report
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-xs font-bold rounded-full">
              CLOSED
            </span>
          </div>

          {/* Desktop Grid Layout (1 Screen Focus) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Left: Event Information Card */}
            <div className="bg-[#161616] border border-white/8 rounded-2xl p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Banner */}
                <div className="relative h-44 md:h-52 rounded-xl overflow-hidden border border-white/8 bg-[#0D0D0D]">
                  {event.banner_url ? (
                    <img
                      src={getImageUrl(event.banner_url)}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#777777] font-semibold text-sm">
                      No Banner Image
                    </div>
                  )}
                </div>

                {/* Category & Status Badges */}
                <div className="flex items-center gap-2">
                  {event.category_name && (
                    <span className="px-2.5 py-1 text-xs font-semibold bg-white/5 border border-white/8 text-[#A0A0A0] rounded-full">
                      {event.category_name}
                    </span>
                  )}
                  <span className="px-2.5 py-1 text-xs font-semibold bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] rounded-full">
                    Sales Closed
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl md:text-2xl font-extrabold text-white leading-tight">
                  {event.title}
                </h2>

                {/* Date & Location */}
                <div className="space-y-2 pt-1 text-sm text-[#A0A0A0]">
                  <div className="flex items-start gap-2.5">
                    <Calendar className="w-4 h-4 text-[#777777] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <span>{formatDate(event.event_date)}</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#777777] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>

              {/* Organizer Meta */}
              <div className="pt-4 border-t border-white/6 flex items-center justify-between text-xs text-[#777777]">
                <span>ORGANIZER</span>
                <span className="font-semibold text-white">{event.organizer_name || 'Tickify Organizer'}</span>
              </div>
            </div>

            {/* Right: Summary Cards & Actions */}
            <div className="flex flex-col justify-between gap-6">
              {/* Summary Cards Column */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 flex-grow">
                {/* Tickets Sold Card */}
                <div className="bg-[#161616] border border-white/8 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-center min-h-[120px] hover:border-white/15 transition-all duration-200">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#22C55E]"></div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#777777] uppercase tracking-wider">Tickets Sold</span>
                    <Ticket className="w-5 h-5 text-[#22C55E]" strokeWidth={1.5} />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">{ticketsSold}</span>
                    <span className="text-sm text-[#777777]">/ {totalTickets} sold</span>
                  </div>
                </div>

                {/* Revenue Card */}
                <div className="bg-[#161616] border border-white/8 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-center min-h-[120px] hover:border-white/15 transition-all duration-200">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#FACC15]"></div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#777777] uppercase tracking-wider">Revenue</span>
                    <TrendingUp className="w-5 h-5 text-[#FACC15]" strokeWidth={1.5} />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">{totalRevenue} ETH</span>
                    <span className="text-xs text-[#777777]">at {ticketPrice} ETH each</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Link
                  to="/dashboard/organizer/home"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-black bg-white rounded-xl hover:bg-[#EAEAEA] transition-all duration-200 hover:scale-[1.01]"
                >
                  <ArrowLeft className="w-5 h-5" strokeWidth={2} />
                  Back to My Events
                </Link>
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
