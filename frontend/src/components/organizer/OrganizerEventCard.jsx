import { Calendar, MapPin, Ticket, Edit, Trash2, Eye, CheckCircle, XCircle, Copy, BarChart2, AlertTriangle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageHelper';
import { useState } from 'react';

const OrganizerEventCard = ({ event, onDelete, onStatusChange }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Custom Modals State
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState('');

  const [isCloseSalesModalOpen, setIsCloseSalesModalOpen] = useState(false);
  const [isClosingSales, setIsClosingSales] = useState(false);
  const [closeSalesError, setCloseSalesError] = useState('');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

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
    setDeleteError('');
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    setIsProcessing(true);
    setDeleteError('');
    const result = await onDelete(event.id);
    setIsDeleting(false);
    setIsProcessing(false);
    if (result && result.success) {
      setIsDeleteModalOpen(false);
    } else {
      setDeleteError(result?.message || 'Failed to delete event.');
    }
  };

  const handlePublish = () => {
    setPublishError('');
    setIsPublishModalOpen(true);
  };

  const handlePublishConfirm = async () => {
    setIsPublishing(true);
    setIsProcessing(true);
    setPublishError('');
    const result = await onStatusChange(event.id, 'published');
    setIsPublishing(false);
    setIsProcessing(false);
    if (result && result.success) {
      setIsPublishModalOpen(false);
    } else {
      setPublishError(result?.message || 'Failed to publish event.');
    }
  };

  const handleCloseSales = () => {
    setCloseSalesError('');
    setIsCloseSalesModalOpen(true);
  };

  const handleCloseSalesConfirm = async () => {
    setIsClosingSales(true);
    setIsProcessing(true);
    setCloseSalesError('');
    const result = await onStatusChange(event.id, 'closed');
    setIsClosingSales(false);
    setIsProcessing(false);
    if (result && result.success) {
      setIsCloseSalesModalOpen(false);
    } else {
      setCloseSalesError(result?.message || 'Failed to close sales.');
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

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in pointer-events-auto">
          <div className="w-full max-w-md bg-[#161616]/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 animate-scale-in text-left">
            <h3 className="text-xl font-bold text-white mb-2">Delete Event</h3>
            <p className="text-sm text-[#A0A0A0] mb-4 leading-relaxed">
              Are you sure you want to delete <span className="text-white font-semibold">"{event.title}"</span>?
            </p>

            {/* Warning Box */}
            <div className="bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-xl p-4 mb-6 flex gap-3">
              <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" strokeWidth={1.5} />
              <div className="text-xs text-[#A0A0A0] leading-relaxed">
                <p className="font-semibold text-[#EF4444] mb-1">Warning</p>
                <p>This action cannot be undone. This will permanently delete the event and all associated draft data.</p>
              </div>
            </div>

            {/* Error Message */}
            {deleteError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-medium">
                {deleteError}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2.5 text-sm font-semibold text-white bg-transparent border border-white/12 rounded-xl hover:bg-white/5 hover:border-white/20 transition-all duration-200 disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#EF4444] rounded-xl hover:bg-[#EF4444]/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete Event'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close Sales Confirmation Modal */}
      {isCloseSalesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in pointer-events-auto">
          <div className="w-full max-w-md bg-[#161616]/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 animate-scale-in text-left">
            <h3 className="text-xl font-bold text-white mb-2">Close Sales</h3>
            <p className="text-sm text-[#A0A0A0] mb-4 leading-relaxed">
              Are you sure you want to close ticket sales for <span className="text-white font-semibold">"{event.title}"</span>?
            </p>

            {/* Warning Box */}
            <div className="bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-xl p-4 mb-6 flex gap-3">
              <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0 mt-0.5" strokeWidth={1.5} />
              <div className="text-xs text-[#A0A0A0] leading-relaxed">
                <p className="font-semibold text-[#EF4444] mb-1">Warning</p>
                <p>After closing sales, users will no longer be able to purchase tickets for this event. This status cannot be reversed.</p>
              </div>
            </div>

            {/* Error Message */}
            {closeSalesError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-medium">
                {closeSalesError}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsCloseSalesModalOpen(false)}
                disabled={isClosingSales}
                className="px-4 py-2.5 text-sm font-semibold text-white bg-transparent border border-white/12 rounded-xl hover:bg-white/5 hover:border-white/20 transition-all duration-200 disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCloseSalesConfirm}
                disabled={isClosingSales}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#EF4444] rounded-xl hover:bg-[#EF4444]/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isClosingSales ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Closing...
                  </>
                ) : (
                  'Close Sales'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Publish Event Confirmation Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in pointer-events-auto">
          <div className="w-full max-w-lg bg-[#161616]/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 animate-scale-in text-left">
            <h3 className="text-xl font-bold text-white mb-2">Publish Event</h3>
            <p className="text-sm text-[#A0A0A0] mb-4 leading-relaxed">
              You are about to publish this event.<br />
              Once published, participants will be able to discover and purchase tickets for this event.
            </p>

            {/* Event Info Table */}
            <div className="bg-white/5 border border-white/8 rounded-xl p-4 mb-4 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-[#777777]">Event Name</span>
                <span className="font-semibold text-white max-w-[240px] truncate">{event.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777777]">Category</span>
                <span className="font-semibold text-white">{event.category_name || event.category?.name || 'Uncategorized'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777777]">Event Date</span>
                <span className="font-semibold text-white">{formatDate(event.event_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777777]">Location</span>
                <span className="font-semibold text-white max-w-[240px] truncate">{event.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777777]">Current Status</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FACC15]/10 text-[#FACC15] capitalize border border-[#FACC15]/20">
                  {event.status || 'Draft'}
                </span>
              </div>
            </div>

            {/* Warning Box */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" strokeWidth={1.5} />
              <div className="text-xs text-[#A0A0A0] leading-relaxed">
                <p className="font-semibold text-amber-500 mb-1">After publishing:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>The event becomes visible to participants.</li>
                  <li>Participants can purchase NFT tickets.</li>
                  <li>You can no longer edit critical event information.</li>
                </ul>
              </div>
            </div>

            {/* Error Message */}
            {publishError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-medium">
                {publishError}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsPublishModalOpen(false)}
                disabled={isPublishing}
                className="px-4 py-2.5 text-sm font-semibold text-white bg-transparent border border-white/12 rounded-xl hover:bg-white/5 hover:border-white/20 transition-all duration-200 disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePublishConfirm}
                disabled={isPublishing}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-black bg-[#22C55E] rounded-xl hover:bg-[#22C55E]/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isPublishing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                    Publishing...
                  </>
                ) : (
                  'Publish Event'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerEventCard;
