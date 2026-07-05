import { Calendar, MapPin, Ticket } from 'lucide-react';

const ParticipantEventCard = ({ event }) => {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleBuyTicket = () => {
    // UI only - no blockchain logic yet
    console.log('Buy ticket for event:', event.id);
  };

  return (
    <div className="bg-[#161616] border border-white/8 rounded-2xl overflow-hidden hover:border-white/15 hover:shadow-lg transition-all duration-300 group">
      {/* Banner */}
      <div className="relative h-48 overflow-hidden bg-[#0D0D0D]">
        {event.banner_url ? (
          <img
            src={event.banner_url}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#777777] text-sm font-semibold">
            No Banner
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Event Name */}
        <h3 className="text-xl font-bold text-white line-clamp-1 group-hover:text-[#A0A0A0] transition-colors duration-200">
          {event.title}
        </h3>

        {/* Organizer */}
        {event.organizer_name && (
          <p className="text-sm text-[#777777]">by {event.organizer_name}</p>
        )}

        {/* Location & Date */}
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#A0A0A0] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
            <span className="text-sm text-[#A0A0A0] line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#A0A0A0] flex-shrink-0" strokeWidth={1.5} />
            <span className="text-sm text-[#A0A0A0]">{formatDate(event.event_date)}</span>
          </div>
        </div>

        {/* Ticket Info */}
        <div className="pt-4 border-t border-white/6 flex items-center justify-between">
          <div>
            <p className="text-xs text-[#777777] uppercase tracking-wider mb-1">Price</p>
            <div className="flex items-center gap-1.5">
              <Ticket className="w-4 h-4 text-white" strokeWidth={1.5} />
              <span className="text-lg font-bold text-white">{event.price_eth} ETH</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#777777] uppercase tracking-wider mb-1">Available</p>
            <span className="text-lg font-bold text-white">{event.quota - (event.tickets_sold || 0)}</span>
          </div>
        </div>

        {/* CTA */}
        <button 
          onClick={handleBuyTicket}
          className="w-full px-6 py-3 text-sm font-semibold text-black bg-white rounded-xl hover:bg-[#EAEAEA] transition-all duration-200"
        >
          Buy Ticket
        </button>
      </div>
    </div>
  );
};

export default ParticipantEventCard;
