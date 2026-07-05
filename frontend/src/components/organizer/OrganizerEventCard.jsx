import { Calendar, MapPin, Ticket, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageHelper';

const OrganizerEventCard = ({ event, onDelete }) => {
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEdit = () => {
    navigate(`/dashboard/organizer/events/edit/${event.id}`);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      onDelete(event.id);
    }
  };

  return (
    <div className="bg-[#161616] border border-white/8 rounded-2xl overflow-hidden hover:border-white/15 hover:shadow-lg transition-all duration-300 group">
      {/* Banner */}
      <div className="relative h-48 overflow-hidden bg-[#0D0D0D]">
        {event.banner_url ? (
          <img
            src={getImageUrl(event.banner_url)}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#777777] text-sm font-semibold">
            No Banner
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
            event.status === 'published' 
              ? 'bg-[#22C55E] text-black' 
              : event.status === 'draft'
              ? 'bg-[#FACC15] text-black'
              : 'bg-[#777777] text-white'
          }`}>
            {event.status ? event.status.charAt(0).toUpperCase() + event.status.slice(1) : 'Draft'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Event Name */}
        <h3 className="text-xl font-bold text-white line-clamp-1 group-hover:text-[#A0A0A0] transition-colors duration-200">
          {event.title}
        </h3>

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
            <p className="text-xs text-[#777777] uppercase tracking-wider mb-1">Sold</p>
            <span className="text-lg font-bold text-white">{event.tickets_sold || 0}/{event.quota}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button 
            onClick={handleEdit}
            className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-transparent border border-white/12 rounded-xl hover:border-white/25 hover:bg-white/5 transition-all duration-200"
          >
            <Edit className="w-4 h-4" strokeWidth={1.5} />
            Edit
          </button>
          <button 
            onClick={handleDelete}
            className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-[#EF4444] bg-transparent border border-[#EF4444]/20 rounded-xl hover:border-[#EF4444]/40 hover:bg-[#EF4444]/5 transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" strokeWidth={1.5} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrganizerEventCard;
