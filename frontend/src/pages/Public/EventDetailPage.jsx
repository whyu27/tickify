import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/landing/Navbar';
import Footer from '../../components/landing/Footer';
import { Calendar, MapPin, Ticket, Users, AlertCircle, ArrowLeft } from 'lucide-react';
import { getImageUrl } from '../../utils/imageHelper';

const EventDetailPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchEventDetail = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await api.get(`/events/${id}`);
      if (response.data && response.data.success) {
        setEvent(response.data.data);
      } else {
        setErrorMsg(response.data?.message || 'Event not found.');
      }
    } catch (error) {
      console.error('Fetch event detail error:', error);
      const msg = error.response?.data?.message || 'An error occurred on the server while fetching event details.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetail();
  }, [id]);

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-[1280px] w-full mx-auto px-6 py-10 flex flex-col gap-8 animate-fade-in">
        {/* Back Link */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#A0A0A0] hover:text-white transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" strokeWidth={2} />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="min-h-[400px] flex items-center justify-center flex-grow">
            <div className="text-center space-y-4">
              <div className="inline-block w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              <p className="text-sm font-semibold text-[#A0A0A0]">Loading event details...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && errorMsg && (
          <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] p-8 rounded-2xl flex flex-col items-center justify-center gap-4 text-center max-w-lg mx-auto w-full my-12">
            <AlertCircle className="w-12 h-12 stroke-[1.5]" />
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Error Loading Event</h3>
              <p className="text-sm text-[#A0A0A0]">{errorMsg}</p>
            </div>
            <button
              onClick={fetchEventDetail}
              className="mt-2 px-6 py-2.5 bg-white text-black font-semibold text-sm rounded-xl hover:bg-[#EAEAEA] transition-all duration-200 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Not Found State */}
        {!isLoading && !errorMsg && !event && (
          <div className="min-h-[400px] flex flex-col items-center justify-center text-center py-12">
            <div className="w-16 h-16 bg-white/5 border border-white/8 text-[#A0A0A0] rounded-2xl flex items-center justify-center mb-6">
              <Calendar className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h3 className="text-xl font-bold text-white">Event Not Found</h3>
            <p className="mt-2 text-sm text-[#A0A0A0] max-w-sm">
              The event you are looking for does not exist or may have been deleted.
            </p>
          </div>
        )}

        {/* Event Content */}
        {!isLoading && !errorMsg && event && (
          <div className="space-y-8">
            {/* Large Responsive Banner */}
            <div className="relative rounded-2xl overflow-hidden border border-white/8 bg-[#161616] group h-[280px] sm:h-[350px] md:h-[450px]">
              {event.banner_url && (
                <div
                  className="absolute inset-0 bg-cover bg-center blur-2xl opacity-25 scale-105 pointer-events-none"
                  style={{ backgroundImage: `url(${getImageUrl(event.banner_url)})` }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              {event.banner_url ? (
                <img
                  src={getImageUrl(event.banner_url)}
                  alt={event.title}
                  className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-[1.01]"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#777777] gap-3">
                  <Calendar className="w-16 h-16 text-[#555555] stroke-[1.5]" />
                  <span className="font-semibold text-lg">No Banner Available</span>
                </div>
              )}

              {/* Status Badge overlay */}
              <div className="absolute top-6 right-6 z-20">
                <span className={`px-4 py-1.5 text-xs font-bold rounded-full uppercase tracking-wider ${
                  event.status === 'published'
                    ? 'bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E]'
                    : event.status === 'closed'
                    ? 'bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444]'
                    : 'bg-[#FACC15]/10 border border-[#FACC15]/30 text-[#FACC15]'
                }`}>
                  {event.status === 'published' ? 'Live' : event.status}
                </span>
              </div>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Main Content Column */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#161616] border border-white/8 rounded-2xl p-6 md:p-8 space-y-6">
                  {/* Title & Organizer */}
                  <div className="space-y-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                      {event.title}
                    </h1>

                    {event.organizer_name && (
                      <div className="flex items-center gap-3 pt-2">
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/8 text-white flex items-center justify-center font-bold">
                          {event.organizer_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs text-[#777777] font-semibold uppercase tracking-wider">Organized by</p>
                          <p className="text-sm font-semibold text-white">{event.organizer_name}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <hr className="border-white/6" />

                  {/* Core Details (Date/Time & Location) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-white/5 border border-white/8 rounded-xl text-white">
                        <Calendar className="w-5 h-5 stroke-[1.5]" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-[#777777] font-semibold uppercase tracking-wider">Date & Time</p>
                        <p className="text-sm font-medium text-white">{formatDate(event.event_date)}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-white/5 border border-white/8 rounded-xl text-white">
                        <MapPin className="w-5 h-5 stroke-[1.5]" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-[#777777] font-semibold uppercase tracking-wider">Location</p>
                        <p className="text-sm font-medium text-white">{event.location}</p>
                      </div>
                    </div>
                  </div>

                  <hr className="border-white/6" />

                  {/* Description */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">Description</h3>
                    <p className="text-[#A0A0A0] text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                      {event.description || 'No description available for this event.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sidebar Column */}
              <div className="space-y-6">
                <div className="bg-[#161616] border border-white/8 rounded-2xl p-6 space-y-6 lg:sticky lg:top-24 shadow-sm hover:border-white/12 transition-all duration-300">
                  <h3 className="text-lg font-bold text-white">Ticket Details</h3>

                  {/* Ticket pricing & availability metadata */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/2 border border-white/8 rounded-xl">
                      <div className="flex items-center gap-2 text-[#A0A0A0]">
                        <Ticket className="w-5 h-5 stroke-[1.5]" />
                        <span className="text-sm font-medium">Ticket Price</span>
                      </div>
                      <span className="text-lg font-bold text-white">
                        {event.price_eth} ETH
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/2 border border-white/8 rounded-xl">
                      <div className="flex items-center gap-2 text-[#A0A0A0]">
                        <Users className="w-5 h-5 stroke-[1.5]" />
                        <span className="text-sm font-medium">Remaining</span>
                      </div>
                      <span className="text-base font-bold text-white">
                        {event.quota - (event.tickets_sold || 0)} / {event.quota}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/2 border border-white/8 rounded-xl">
                      <div className="flex items-center gap-2 text-[#A0A0A0]">
                        <AlertCircle className="w-5 h-5 stroke-[1.5]" />
                        <span className="text-sm font-medium">Status</span>
                      </div>
                      <span className={`text-sm font-bold capitalize ${
                        event.status === 'published' ? 'text-[#22C55E]' : 'text-[#EF4444]'
                      }`}>
                        {event.status === 'published' ? 'Live' : event.status}
                      </span>
                    </div>
                  </div>

                  {/* Purchase CTA */}
                  <Link
                    to="/login"
                    className="w-full text-center block py-3.5 px-6 bg-white hover:bg-[#EAEAEA] text-black font-semibold rounded-xl transition-all duration-200 shadow-md hover:scale-[1.01]"
                  >
                    Login to Purchase
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default EventDetailPage;
