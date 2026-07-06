import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import Navbar from '../../components/landing/Navbar';
import Footer from '../../components/landing/Footer';
import { ArrowLeft } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

// Shared Components
import EventBanner from '../../components/event/EventBanner';
import EventInfo from '../../components/event/EventInfo';
import EventSidebar from '../../components/event/EventSidebar';
import { EventLoading, EventError, EventNotFound } from '../../components/event/EventStates';

const PublicEventDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
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
        {isLoading && <EventLoading />}

        {/* Error State */}
        {!isLoading && errorMsg && (
          <EventError errorMsg={errorMsg} onRetry={fetchEventDetail} />
        )}

        {/* Not Found State */}
        {!isLoading && !errorMsg && !event && <EventNotFound />}

        {/* Event Content */}
        {!isLoading && !errorMsg && event && (
          <div className="space-y-8">
            <EventBanner event={event} />

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Main Content Column */}
              <div className="lg:col-span-2 space-y-6">
                <EventInfo event={event} />
              </div>

              {/* Sidebar Column */}
              <div className="space-y-6">
                <EventSidebar event={event}>
                  {/* Purchase CTA */}
                  {!user ? (
                    <Link
                      to="/login"
                      className="w-full text-center block py-3.5 px-6 bg-white hover:bg-[#EAEAEA] text-black font-semibold rounded-xl transition-all duration-200 shadow-md hover:scale-[1.01]"
                    >
                      Login to Purchase
                    </Link>
                  ) : user.role === 'organizer' ? (
                    <div className="w-full text-center py-3.5 px-6 bg-white/5 border border-white/8 text-[#777777] font-semibold rounded-xl text-sm">
                      Organizers cannot purchase tickets
                    </div>
                  ) : (
                    <Link
                      to={`/participant/events/${event.id}`}
                      className="w-full text-center block py-3.5 px-6 bg-white hover:bg-[#EAEAEA] text-black font-semibold rounded-xl transition-all duration-200 shadow-md hover:scale-[1.01]"
                    >
                      Go to Participant Dashboard
                    </Link>
                  )}
                </EventSidebar>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default PublicEventDetailPage;
