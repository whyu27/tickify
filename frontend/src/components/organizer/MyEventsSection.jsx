import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OrganizerEventCard from './OrganizerEventCard';

const MyEventsSection = ({ events, onDeleteEvent, onStatusChange, loading, error }) => {
  const navigate = useNavigate();

  const handleCreateEvent = () => {
    navigate('/dashboard/organizer/events/create');
  };

  return (
    <section id="my-events" className="py-20 bg-[#0D0D0D]">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              My Events
            </h2>
            <p className="text-lg text-[#A0A0A0] max-w-2xl">
              Manage and track all your blockchain-powered events.
            </p>
          </div>
          
          <button
            onClick={handleCreateEvent}
            className="flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold text-black bg-white rounded-xl hover:bg-[#EAEAEA] transition-all duration-200 hover:scale-105"
          >
            <Plus className="w-5 h-5" strokeWidth={2} />
            Create Event
          </button>
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
        {!loading && !error && events.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#777777] text-lg mb-6">
              You haven't created any events yet.
            </p>
            <button
              onClick={handleCreateEvent}
              className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-black bg-white rounded-xl hover:bg-[#EAEAEA] transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-5 h-5" strokeWidth={2} />
              Create Your First Event
            </button>
          </div>
        )}

        {/* Events Grid */}
        {!loading && !error && events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <OrganizerEventCard 
                key={event.id} 
                event={event} 
                onDelete={onDeleteEvent}
                onStatusChange={onStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyEventsSection;
