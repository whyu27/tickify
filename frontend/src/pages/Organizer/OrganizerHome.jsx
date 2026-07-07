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
  const [toast, setToast] = useState({ message: '', type: 'success', show: false });

  useEffect(() => {
    fetchOrganizerData();
  }, []);

  useEffect(() => {
    document.title = 'My Events — Tickify';
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
        showToast('Event deleted successfully', 'success');
        return { success: true };
      } else {
        const errMsg = response.data.message || 'Failed to delete event.';
        showToast(errMsg, 'error');
        return { success: false, message: errMsg };
      }
    } catch (err) {
      console.error('Delete event error:', err);
      const errMsg = err.response?.data?.message || 'Failed to delete event.';
      showToast(errMsg, 'error');
      return { success: false, message: errMsg };
    }
  };

  const handleStatusChange = async (eventId, newStatus) => {
    try {
      const response = await api.patch(`/events/${eventId}/status`, { status: newStatus });
      
      if (response.data.success) {
        // Update the event in the list
        setEvents(events.map(event => 
          event.id === eventId 
            ? { ...event, status: newStatus }
            : event
        ));
        
        const statusMessages = {
          published: 'Event published successfully',
          closed: 'Event sales closed successfully',
          draft: 'Event moved to draft'
        };
        
        showToast(statusMessages[newStatus] || 'Event status updated', 'success');
        return { success: true };
      } else {
        const errMsg = response.data.message || 'Failed to update event status.';
        showToast(errMsg, 'error');
        return { success: false, message: errMsg };
      }
    } catch (err) {
      console.error('Update status error:', err);
      const errMsg = err.response?.data?.message || 'Failed to update event status.';
      showToast(errMsg, 'error');
      return { success: false, message: errMsg };
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type, show: true });
    setTimeout(() => {
      setToast({ message: '', type: 'success', show: false });
    }, 3000);
  };

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      const response = await api.put('/subscription/upgrade');
      
      if (response.data && response.data.success) {
        setSubscription(response.data.data);
        showToast('Organizer Pro activated successfully.', 'success');
        fetchOrganizerData();
        return true;
      } else {
        showToast(response.data?.message || 'Failed to upgrade subscription.', 'error');
        return false;
      }
    } catch (err) {
      console.error('Upgrade subscription error:', err);
      showToast(err.response?.data?.message || 'Failed to upgrade subscription.', 'error');
      return false;
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
        onStatusChange={handleStatusChange}
        loading={loading}
        error={error}
      />

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-8 right-8 z-50 animate-fade-in">
          <div className={`px-6 py-4 rounded-xl shadow-lg border ${
            toast.type === 'success' 
              ? 'bg-[#22C55E]/10 border-[#22C55E]/20 text-[#22C55E]'
              : 'bg-[#EF4444]/10 border-[#EF4444]/20 text-[#EF4444]'
          }`}>
            <p className="text-sm font-semibold">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Subscription Section */}
      <OrganizerSubscriptionSection 
        subscription={subscription}
        currentPlan={subscriptionPlan}
        onUpgrade={handleUpgrade}
        events={events}
      />

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default OrganizerHome;
