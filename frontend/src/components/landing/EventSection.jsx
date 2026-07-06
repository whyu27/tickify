import { useState, useEffect } from 'react';
import EventCard from './EventCard';
import api from '../../api/axios';

const EventSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [eventsRes, catsRes] = await Promise.all([
          api.get('/events'),
          api.get('/categories')
        ]);
        
        if (eventsRes.data.success) {
          setEvents(eventsRes.data.data || []);
        } else {
          setError('Failed to load events');
        }

        if (catsRes.data && catsRes.data.success) {
          setCategories(catsRes.data.data || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredEvents = selectedCategory === 'all'
    ? events
    : events.filter(event => (event.category_slug || event.category?.slug || '').toLowerCase() === selectedCategory);

  const allCategories = [
    { id: 'all', name: 'All', slug: 'all' },
    ...categories
  ];

  return (
    <section id="events" className="py-20 bg-[#0A0A0A]">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Upcoming Events
          </h2>
          <p className="text-lg text-[#A0A0A0] max-w-2xl">
            Discover upcoming blockchain-powered events.
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {allCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.slug)}
              disabled={loading}
              className={`px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 ${
                selectedCategory === category.slug
                  ? 'bg-white text-black'
                  : 'bg-transparent text-[#A0A0A0] border border-white/12 hover:border-white/25 hover:text-white'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <p className="text-[#A0A0A0] text-lg mt-4">Loading events...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2.5 text-sm font-semibold bg-white text-black rounded-full hover:bg-[#EAEAEA] transition-all duration-200"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#777777] text-lg">
              {selectedCategory === 'all' 
                ? 'No events available at the moment.' 
                : 'No events found in this category.'}
            </p>
          </div>
        )}

        {/* Events Grid */}
        {!loading && !error && filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default EventSection;
