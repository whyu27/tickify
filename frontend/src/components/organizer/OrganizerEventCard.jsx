import { Calendar, MapPin, Ticket, Edit, Trash2, Eye, CheckCircle, XCircle, Copy, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageHelper';
import { useState } from 'react';

const OrganizerEventCard = ({ event, onDelete, onStatusChange }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handlePublish = async () => {
    if (window.confirm(`Publish "${event.title}"? It will be visible to all users.`)) {
      setIsProcessing(true);
      await onStatusChange(event.id, 'published');
      setIsProcessing(false);
    }
  };

  const handleCloseSales = async () => {
    if (window.confirm(`Close sales for "${event.title}"? Users will no longer be able to purchase tickets.`)) {
      setIsProcessing(true);
      await onStatusChange(event.id, 'closed');
      setIsProcessing(false);
    }
  };

  const handleView = () => {
    navigate(`/events/${event.id}`);
  };

  const handleViewReport = () => {
    navigate(`/dashboard/organizer/reports/${event.id}`);
  };

  const handleDuplicate = () => {
    // Navigate to create page with event data
    navigate('/dashboard/organizer/events/create', { 
      state: { 
        duplicateData: {
          title: `${event.title} (Copy)`,
          description: event.description,
          location: event.location,
          priceEth: event.price_eth,
          quota: event.quota,
          categoryId: event.category_id || event.category?.id,
        }
      }
    });
  };

  const renderActionButtons = () => {
    const status = event.status || 'draft';

    if (status === 'draft') {
      return (
        <>
          <button 
            onClick={handleEdit}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-transparent border border-white/12 rounded-xl hover:border-white/25 hover:bg-white/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Edit className="w-4 h-4" strokeWidth={1.5} />
            Edit
          </button>
          <button 
            onClick={handlePublish}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-black bg-[#22C55E] rounded-xl hover:bg-[#22C55E]/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
            Publish
          </button>
          <button 
            onClick={handleDelete}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-[#EF4444] bg-transparent border border-[#EF4444]/20 rounded-xl hover:border-[#EF4444]/40 hover:bg-[#EF4444]/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" strokeWidth={1.5} />
            Delete
          </button>
        </>
      );
    }

    if (status === 'published') {
      return (
        <>
          <button 
            onClick={handleEdit}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-transparent border border-white/12 rounded-xl hover:border-white/25 hover:bg-white/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Edit className="w-4 h-4" strokeWidth={1.5} />
            Edit
          </button>
          <button 
            onClick={handleCloseSales}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-[#EF4444] bg-transparent border border-[#EF4444]/20 rounded-xl hover:border-[#EF4444]/40 hover:bg-[#EF4444]/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <XCircle className="w-4 h-4" strokeWidth={1.5} />
            Close Sales
          </button>
        </>
      );
    }

    if (status === 'closed') {
      return (
        <button 
          onClick={handleViewReport}
          disabled={isProcessing}
          className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-transparent border border-white/12 rounded-xl hover:border-white/25 hover:bg-white/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-center"
        >
          <BarChart2 className="w-4 h-4" strokeWidth={1.5} />
          View Report
        </button>
      );
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
          <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
            event.status === 'published' 
              ? 'bg-[#22C55E] text-black' 
              : event.status === 'closed'
              ? 'bg-[#EF4444] text-white'
              : 'bg-[#FACC15] text-black'
          }`}>
            {event.status ? event.status.charAt(0).toUpperCase() + event.status.slice(1) : 'Draft'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Category Badge */}
        {event.category_name && (
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold bg-white/5 border border-white/8 text-[#A0A0A0] rounded-full">
            {event.category_name}
          </span>
        )}

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
        <div className={`grid gap-3 pt-2 ${
          event.status === 'draft' ? 'grid-cols-3' : 
          event.status === 'closed' ? 'grid-cols-1' : 'grid-cols-2'
        }`}>
          {renderActionButtons()}
        </div>
      </div>
    </div>
  );
};

export default OrganizerEventCard;
