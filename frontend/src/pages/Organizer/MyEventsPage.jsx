import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Plus, Calendar, MapPin, Ticket, AlertCircle } from 'lucide-react';
import { getImageUrl } from '../../utils/imageHelper';

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [notification, setNotification] = useState('');

  const fetchEvents = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await api.get('/events/organizer');
      if (response.data && response.data.success) {
        setEvents(response.data.data || []);
      } else {
        setErrorMsg(response.data?.message || 'Gagal memuat event.');
      }
    } catch (error) {
      console.error('Fetch organizer events error:', error);
      const msg = error.response?.data?.message || 'Terjadi kesalahan pada server';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;
    setIsDeleting(true);
    setDeleteError('');
    try {
      const response = await api.delete(`/events/${eventToDelete.id}`);
      if (response.data && response.data.success) {
        setNotification('Event berhasil dihapus.');
        setEventToDelete(null);
        fetchEvents();
        setTimeout(() => {
          setNotification('');
        }, 3000);
      } else {
        setDeleteError(response.data?.message || 'Gagal menghapus event.');
      }
    } catch (error) {
      console.error('Delete event error:', error);
      const msg = error.response?.data?.message || 'Terjadi kesalahan pada server saat menghapus event';
      setDeleteError(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            My Events
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            List of all events you have hosted on Tickify.
          </p>
        </div>

        {events.length > 0 && (
          <Link
            to="/dashboard/organizer/events/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </Link>
        )}
      </div>

      {/* Success Notification */}
      {notification && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-850 dark:text-emerald-400 p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
            <span className="text-sm font-semibold">{notification}</span>
          </div>
          <button
            onClick={() => setNotification('')}
            className="text-emerald-650 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-350 text-xs font-bold"
          >
            Close
          </button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {!isLoading && errorMsg && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-6 rounded-2xl flex items-start gap-4">
          <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="font-bold">Error Memuat Event</h3>
            <p className="text-sm">{errorMsg}</p>
            <button
              onClick={fetchEvents}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !errorMsg && events.length === 0 && (
        <div className="min-h-[400px] flex flex-col items-center justify-center bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 p-8 rounded-2xl shadow-sm text-center">
          <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">No Events Found</h3>
          <p className="mt-2 text-sm text-gray-550 dark:text-gray-400 max-w-sm mb-6">
            You haven't created any events yet.
          </p>
          <div>
            <Link
              to="/dashboard/organizer/events/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </Link>
          </div>
        </div>
      )}

      {/* Events Grid */}
      {!isLoading && !errorMsg && events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-200 dark:border-zinc-700 shadow-sm flex flex-col justify-between overflow-hidden transition-shadow hover:shadow-md"
            >
              {/* Event Image Banner */}
              <div className="relative">
                {event.banner_url ? (
                  <img
                    src={getImageUrl(event.banner_url)}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-purple-50 dark:bg-purple-900/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
                    No Banner Available
                  </div>
                )}
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${event.status === 'published'
                        ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-400'
                        : 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-400'
                      }`}
                  >
                    {event.status || 'draft'}
                  </span>
                </div>
              </div>

              {/* Event Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-extrabold text-lg text-gray-900 dark:text-white line-clamp-1">
                    {event.title}
                  </h3>

                  {/* Location & Date */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                      <span>{formatDate(event.event_date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>
                </div>

                {/* Metrics: Ticket Price & Quota */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-zinc-700 text-center">
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Price</p>
                    <p className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center justify-center gap-0.5">
                      <Ticket className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span>{event.price_eth} ETH</span>
                    </p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Quota</p>
                    <p className="text-sm font-extrabold text-gray-900 dark:text-white">
                      {event.quota}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <Link
                    to={`/dashboard/organizer/events/${event.id}/edit`}
                    className="flex-1 px-4 py-2 border border-purple-200 dark:border-purple-800/50 text-xs font-semibold rounded-xl text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/10 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-colors text-center"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      setEventToDelete(event);
                      setDeleteError('');
                    }}
                    className="flex-1 px-4 py-2 border border-red-200 dark:border-red-800/50 text-xs font-semibold rounded-xl text-red-650 dark:text-red-400 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors text-center"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {eventToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl max-w-md w-full border border-gray-200 dark:border-zinc-700 p-6 shadow-xl space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-650 dark:text-red-400" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Event</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete <strong className="text-gray-900 dark:text-white">"{eventToDelete.title}"</strong>? This action cannot be undone.
                </p>
              </div>
            </div>

            {deleteError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-xl text-xs">
                {deleteError}
              </div>
            )}

            <div className="flex items-center gap-3 justify-end">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  setEventToDelete(null);
                  setDeleteError('');
                }}
                className="px-4 py-2 border border-gray-300 dark:border-zinc-650 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-350 hover:bg-gray-50 dark:hover:bg-zinc-700/50 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold shadow-md disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEventsPage;
