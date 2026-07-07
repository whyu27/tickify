import { useState, useEffect } from 'react';
import ParticipantNavbar from '../../components/participant/ParticipantNavbar';
import Footer from '../../components/landing/Footer';
import { Ticket, Calendar, MapPin, QrCode, Eye, Wallet, X, AlertCircle } from 'lucide-react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { getImageUrl } from '../../utils/imageHelper';
import TicketQRModal from '../../components/participant/TicketQRModal';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Modal State
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/tickets/my-tickets');
      if (response.data && response.data.success) {
        setTickets(response.data.data || []);
      } else {
        setError(response.data?.message || 'Failed to load tickets');
      }
    } catch (err) {
      console.error('Fetch tickets error:', err);
      setError(err.response?.data?.message || 'Failed to load tickets. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Filter logic
  const filteredTickets = tickets.filter(ticket => {
    if (selectedFilter === 'all') return true;
    return (ticket.status || '').toLowerCase() === selectedFilter.toLowerCase();
  });

  // Format date helper
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Shorten wallet address
  const shortenAddress = (address) => {
    if (!address) return 'Not connected';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Handle button clicks
  const handleShowQR = (ticket) => {
    setSelectedTicket(ticket);
    setIsQRModalOpen(true);
  };

  // Status Style Helper
  const getStatusConfig = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'active':
        return {
          label: 'Active',
          classes: 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20',
          dotColor: 'bg-[#22C55E]'
        };
      case 'used':
        return {
          label: 'Used',
          classes: 'bg-[#777777]/10 text-[#A0A0A0] border border-[#777777]/20',
          dotColor: 'bg-[#777777]'
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          classes: 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20',
          dotColor: 'bg-[#EF4444]'
        };
      default:
        return {
          label: status || 'Unknown',
          classes: 'bg-white/5 text-white/60 border border-white/10',
          dotColor: 'bg-white/40'
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <ParticipantNavbar />

      {/* Main Content */}
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            My Tickets
          </h1>
          <p className="text-lg text-[#A0A0A0]">
            Manage your blockchain tickets.
          </p>
        </div>

        {/* Ticket Count & Filters */}
        {!loading && tickets.length > 0 && (
          <div className="mb-8">
            {/* Ticket Count */}
            <div className="mb-4">
              <p className="text-sm text-[#A0A0A0]">
                <span className="text-white font-bold text-lg">{filteredTickets.length} Ticket</span>
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 ${selectedFilter === 'all'
                  ? 'bg-white text-black'
                  : 'bg-transparent text-[#A0A0A0] border border-white/12 hover:border-white/25 hover:text-white'
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedFilter('active')}
                className={`px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 ${selectedFilter === 'active'
                  ? 'bg-white text-black'
                  : 'bg-transparent text-[#A0A0A0] border border-white/12 hover:border-white/25 hover:text-white'
                  }`}
              >
                Active
              </button>
              <button
                onClick={() => setSelectedFilter('used')}
                className={`px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 ${selectedFilter === 'used'
                  ? 'bg-white text-black'
                  : 'bg-transparent text-[#A0A0A0] border border-white/12 hover:border-white/25 hover:text-white'
                  }`}
              >
                Used
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse mb-12">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-[#161616] border border-white/8 rounded-2xl overflow-hidden"
              >
                {/* Banner Skeleton */}
                <div className="h-48 bg-white/5" />
                {/* Content Skeleton */}
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-white/10 rounded-md w-3/4 mb-2" />
                  <div className="space-y-2">
                    <div className="h-4 bg-white/5 rounded-md w-1/2" />
                    <div className="h-4 bg-white/5 rounded-md w-2/3" />
                  </div>
                  <div className="pt-4 border-t border-white/6 space-y-2">
                    <div className="h-3 bg-white/5 rounded-md w-1/3" />
                    <div className="h-4 bg-white/5 rounded-md w-5/6" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <div className="flex-1 h-12 bg-white/5 rounded-xl" />
                    <div className="flex-1 h-12 bg-white/10 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="max-w-md mx-auto my-16 bg-[#1A1111]/80 backdrop-blur-md border border-red-500/20 rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-red-500/10 rounded-full text-red-500 mb-4 border border-red-500/20">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Failed to Load Tickets</h3>
            <p className="text-sm text-[#A0A0A0] mb-6 max-w-sm">
              {error}
            </p>
            <button
              onClick={fetchTickets}
              className="w-full px-6 py-3 text-sm font-semibold bg-white text-black rounded-xl hover:bg-[#EAEAEA] active:scale-[0.98] transition-all duration-200 shadow-md shadow-white/5"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && tickets.length === 0 && (
          <div className="flex flex-col items-center text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/5 border border-white/8 rounded-3xl mb-8 relative">
              <div className="absolute inset-0 bg-white/2 rounded-3xl blur-xl" />
              <Ticket className="w-12 h-12 text-[#A0A0A0] relative z-10" strokeWidth={1.5} />
            </div>

            <h3 className="text-2xl font-bold text-white mb-3">
              You don't have any NFT tickets yet.
            </h3>

            <p className="text-[#A0A0A0] mb-8 max-w-md mx-auto leading-relaxed">
              Explore upcoming premium blockchain events and secure your NFT tickets now.
            </p>
            <HashLink
              to="/participant/home#events"
              className="px-8 py-3.5 text-sm font-bold text-black bg-white rounded-xl hover:bg-[#EAEAEA] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-white/5"
            >
              Explore Events
            </HashLink>
          </div>
        )}

        {/* No Results After Filter */}
        {!loading && !error && tickets.length > 0 && filteredTickets.length === 0 && (
          <div className="flex flex-col items-center text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 border border-white/8 rounded-2xl mb-6">
              <Ticket className="w-10 h-10 text-[#777777]" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No tickets found
            </h3>
            <p className="text-sm text-[#A0A0A0] max-w-xs mx-auto">
              No tickets match the selected filter. Try changing your selection.
            </p>
          </div>
        )}

        {/* Tickets Grid */}
        {!loading && !error && filteredTickets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 animate-in fade-in duration-300">
            {filteredTickets.map((ticket) => {
              const statusCfg = getStatusConfig(ticket.status);
              return (
                <div
                  key={ticket.id}
                  className="bg-[#161616] border border-white/8 rounded-2xl overflow-hidden hover:border-white/15 hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    {/* Event Banner */}
                    <div className="relative h-48 overflow-hidden bg-[#0D0D0D]">
                      {ticket.event.banner_url ? (
                        <img
                          src={getImageUrl(ticket.event.banner_url)}
                          alt={ticket.event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#1F1F1F] to-[#0D0D0D] flex flex-col items-center justify-center text-[#555555] gap-2">
                          <Ticket className="w-12 h-12 stroke-[1.25]" />
                          <span className="text-xs uppercase tracking-wider text-white/20 font-semibold">NFT Ticket</span>
                        </div>
                      )}
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full backdrop-blur-md ${statusCfg.classes}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotColor} ${ticket.status === 'active' ? 'animate-pulse' : ''}`} />
                          {statusCfg.label}
                        </span>
                      </div>
                    </div>

                    {/* Ticket Content */}
                    <div className="p-6 space-y-4">
                      {/* Event Title */}
                      <h3 className="text-xl font-bold text-white line-clamp-2 group-hover:text-white/80 transition-colors duration-200">
                        {ticket.event.title}
                      </h3>

                      {/* Event Details */}
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-[#A0A0A0] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                          <span className="text-sm text-[#A0A0A0] line-clamp-1">{ticket.event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#A0A0A0] flex-shrink-0" strokeWidth={1.5} />
                          <span className="text-sm text-[#A0A0A0]">{formatDate(ticket.event.event_date)}</span>
                        </div>
                      </div>

                      {/* Ticket Info */}
                      <div className="pt-4 border-t border-white/6 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#777777] uppercase tracking-wider">NFT Ticket ID</span>
                          <span className="text-sm text-white font-mono font-semibold">#{ticket.token_id || ticket.ticket_id_onchain || '-'}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Wallet className="w-4 h-4 text-[#A0A0A0] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-[#777777] uppercase tracking-wider mb-1">Wallet</p>
                            <p className="text-sm text-white font-mono break-all">{shortenAddress(ticket.owner_wallet)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="px-6 pb-6 pt-2 flex gap-3">
                    <Link
                      to={`/participant/tickets/${ticket.id}`}
                      className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-transparent border border-white/12 rounded-xl hover:border-white/25 hover:bg-white/5 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" strokeWidth={1.5} />
                      View Detail
                    </Link>
                    <button
                      onClick={() => handleShowQR(ticket)}
                      className="flex-1 px-4 py-3 text-sm font-semibold text-black bg-white rounded-xl hover:bg-[#EAEAEA] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <QrCode className="w-4 h-4" strokeWidth={1.5} />
                      Show QR
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      <TicketQRModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        ticket={selectedTicket}
        getStatusConfig={getStatusConfig}
      />

      <Footer />
    </div>
  );
};

export default MyTickets;
