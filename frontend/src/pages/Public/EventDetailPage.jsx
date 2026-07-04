import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../../api/axios';
import useAuth from '../../hooks/useAuth';
import { Calendar, MapPin, Ticket, Users, AlertCircle, ArrowLeft, Info } from 'lucide-react';

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [purchaseAlert, setPurchaseAlert] = useState('');

  const fetchEventDetail = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await api.get(`/events/${id}`);
      if (response.data && response.data.success) {
        setEvent(response.data.data);
      } else {
        setErrorMsg(response.data?.message || 'Event tidak ditemukan.');
      }
    } catch (error) {
      console.error('Fetch event detail error:', error);
      const msg = error.response?.data?.message || 'Terjadi kesalahan pada server saat memuat detail event.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetail();
  }, [id]);

  const handleBuyTicket = () => {
    if (!isAuthenticated) {
      // Redirect to login page and preserve history
      navigate('/login', { state: { from: location } });
    } else {
      // If logged in, display a placeholder alert/notification (as actual blockchain buy is not requested/implemented yet)
      setPurchaseAlert('Fitur pembelian tiket via Blockchain/MetaMask belum diimplementasikan.');
      setTimeout(() => {
        setPurchaseAlert('');
      }, 5000);
    }
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back Button */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-purple-650 dark:hover:text-purple-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading detail event...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {!isLoading && errorMsg && (
        <div className="bg-red-55 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-6 rounded-2xl flex items-start gap-4">
          <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="font-bold">Error Memuat Event</h3>
            <p className="text-sm">{errorMsg}</p>
            <button
              onClick={fetchEventDetail}
              className="px-4 py-2 bg-red-605 hover:bg-red-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !errorMsg && !event && (
        <div className="min-h-[400px] flex flex-col items-center justify-center bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 p-8 rounded-2xl shadow-sm text-center">
          <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Event Tidak Ditemukan</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
            Event yang Anda cari mungkin telah dihapus atau tidak tersedia.
          </p>
        </div>
      )}

      {/* Main Details layout */}
      {!isLoading && !errorMsg && event && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Details column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Banner image */}
            <div className="relative rounded-3xl overflow-hidden shadow-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-850">
              {event.banner_url ? (
                <img
                  src={event.banner_url}
                  alt={event.title}
                  className="w-full max-h-[400px] object-cover"
                />
              ) : (
                <div className="w-full h-[300px] bg-gradient-to-br from-purple-500/10 to-indigo-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-lg">
                  No Banner Available
                </div>
              )}
            </div>

            {/* Event Info Card */}
            <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="space-y-4">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
                  {event.title}
                </h1>

                {/* Date & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 text-purple-650 dark:text-purple-400 rounded-xl">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Waktu & Tanggal</p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-zinc-200">{formatDate(event.event_date)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Lokasi</p>
                      <p className="text-sm font-semibold text-gray-850 dark:text-zinc-200">{event.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-gray-100 dark:border-zinc-700" />

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Deskripsi Event</h3>
                <div className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                  {event.description || 'Tidak ada deskripsi yang tersedia untuk event ini.'}
                </div>
              </div>

              {/* Organizer Info (Display if available from API) */}
              {event.organizer_name && (
                <>
                  <hr className="border-gray-100 dark:border-zinc-700" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                      {event.organizer_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">Diselenggarakan oleh</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{event.organizer_name}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Ticket Purchasing column */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-3xl p-6 shadow-sm space-y-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Detail Tiket</h3>

              {/* Price & Quota details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100/55 dark:border-purple-900/20 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Harga Tiket</span>
                  </div>
                  <span className="text-xl font-black text-purple-650 dark:text-purple-400">
                    {event.price_eth} ETH
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-550 dark:text-gray-400" />
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Sisa Kuota</span>
                  </div>
                  <span className="text-base font-bold text-gray-900 dark:text-white">
                    {event.quota} Slot
                  </span>
                </div>
              </div>

              {/* Buy Ticket button */}
              <div className="space-y-3">
                <button
                  onClick={handleBuyTicket}
                  className="w-full py-3 px-6 bg-purple-605 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-md transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Ticket className="w-5 h-5" />
                  <span>Buy Ticket</span>
                </button>

                {/* Purchase Alert (Blockchain integration placeholder) */}
                {purchaseAlert && (
                  <div className="p-3.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-400 rounded-2xl text-xs flex gap-2 items-start animate-fade-in">
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                    <span>{purchaseAlert}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailPage;
