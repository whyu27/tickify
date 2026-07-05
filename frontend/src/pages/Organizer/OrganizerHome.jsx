import { useState, useEffect } from 'react';
import OrganizerNavbar from '../../components/organizer/OrganizerNavbar';
import OrganizerHero from '../../components/organizer/OrganizerHero';
import OrganizerStatistics from '../../components/organizer/OrganizerStatistics';
import MyEventsSection from '../../components/organizer/MyEventsSection';
import FAQSection from '../../components/landing/FAQSection';
import OrganizerSubscriptionSection from '../../components/organizer/OrganizerSubscriptionSection';
import Footer from '../../components/landing/Footer';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';

const OrganizerHome = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    fetchOrganizerData();
  }, []);

  const fetchOrganizerData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [eventsRes, subRes] = await Promise.all([
        api.get('/events/organizer'),
        api.get('/subscription')
      ]);

      if (eventsRes.data.success) {
        setEvents(eventsRes.data.data || []);
      }

      if (subRes.data && subRes.data.success) {
        setSubscription(subRes.data.data);
      }
    } catch (err) {
      console.error('Fetch organizer data error:', err);
      setError(err.response?.data?.message || 'Failed to load organizer data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await api.delete(`/events/${eventId}`);
      
      if (response.data.success) {
        setEvents(events.filter(event => event.id !== eventId));
      } else {
        alert(response.data.message || 'Failed to delete event.');
      }
    } catch (err) {
      console.error('Delete event error:', err);
      alert(err.response?.data?.message || 'Failed to delete event.');
    }
  };

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      const response = await api.put('/subscription/upgrade');
      
      if (response.data && response.data.success) {
        setSubscription(response.data.data);
        alert('Successfully upgraded to Pro Plan!');
        fetchOrganizerData();
      } else {
        alert(response.data?.message || 'Failed to upgrade subscription.');
      }
    } catch (err) {
      console.error('Upgrade subscription error:', err);
      alert(err.response?.data?.message || 'Failed to upgrade subscription.');
    } finally {
      setIsUpgrading(false);
    }
  };

  // Calculate statistics
  const totalEvents = events.length;
  const totalTicketsSold = events.reduce((sum, event) => sum + (Number(event.tickets_sold) || 0), 0);
  const subscriptionPlan = subscription?.subscription_plan || 'free';

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Navbar */}
      <OrganizerNavbar />

      {/* Hero Section */}
      <OrganizerHero />

      {/* Statistics Section */}
      <OrganizerStatistics 
        totalEvents={totalEvents}
        totalTicketsSold={totalTicketsSold}
        subscriptionPlan={subscriptionPlan}
      />

      {/* My Events Section */}
      <MyEventsSection 
        events={events}
        onDeleteEvent={handleDeleteEvent}
        loading={loading}
        error={error}
      />

      {/* FAQ Section */}
      <FAQSection />

      {/* Subscription Section */}
      <OrganizerSubscriptionSection 
        currentPlan={subscriptionPlan}
        onUpgrade={handleUpgrade}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default OrganizerHome;
