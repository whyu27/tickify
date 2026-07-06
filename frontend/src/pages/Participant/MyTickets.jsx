import { useState, useEffect } from 'react';
import ParticipantNavbar from '../../components/participant/ParticipantNavbar';
import Footer from '../../components/landing/Footer';
import { Ticket, Calendar, MapPin, QrCode, Eye, Wallet } from 'lucide-react';
import api from '../../api/axios';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');

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
    return ticket.status === selectedFilter;
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

  // Handle button clicks (UI only)
  const handleViewDetail = (ticketId) => {
    console.log('View detail for ticket:', ticketId);
  };

  const handleShowQR = (ticketId) => {
    console.log('Show QR for ticket:', ticketId);
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
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <p className="text-[#A0A0A0] text-lg mt-4">Loading tickets...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-20">
            <p className="text-[#EF4444] text-lg mb-4">{error}</p>
            <button
              onClick={fetchTickets}
              className="px-6 py-2.5 text-sm font-semibold bg-white text-black rounded-xl hover:bg-[#EAEAEA] transition-all duration-200"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && tickets.length === 0 && (
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 border border-white/8 rounded-2xl mb-6">
              <Ticket className="w-10 h-10 text-[#777777]" strokeWidth={1.5} />
            </div>

            <h3 className="text-2xl font-bold text-white mb-3">
              You don't have any tickets yet.
            </h3>

            <p className="text-[#A0A0A0] mb-8 max-w-md mx-auto text-center">
              Browse available events and get your tickets now.
            </p>
            <a
              href="/participant/home#events"
              className="inline-block px-6 py-3 mb-4 mt-4 text-sm font-semibold text-black bg-white rounded-xl hover:bg-[#EAEAEA] transition-all duration-200"
            >
              Explore Events
            </a>
          </div>
        )}

        {/* No Results After Filter */}
        {!loading && tickets.length > 0 && filteredTickets.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 border border-white/8 rounded-2xl mb-6">
              <Ticket className="w-10 h-10 text-[#777777]" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              No tickets found.
            </h3>
            <p className="text-[#A0A0A0] mb-8 max-w-md mx-auto">
              No tickets match the selected filter.
            </p>
          </div>
        )}

        {/* Tickets Grid */}
        {!loading && filteredTickets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-[#161616] border border-white/8 rounded-2xl overflow-hidden hover:border-white/15 hover:shadow-lg transition-all duration-300"
              >
                {/* Event Banner */}
                <div className="relative h-48 overflow-hidden bg-[#0D0D0D]">
                  {ticket.event.banner_url ? (
                    <img
                      src={ticket.event.banner_url}
                      alt={ticket.event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#777777] text-sm font-semibold">
                      No Banner
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${ticket.status === 'active'
                      ? 'bg-[#22C55E] text-white'
                      : 'bg-[#777777] text-white'
                      }`}>
                      {ticket.status === 'active' ? 'Active' : 'Used'}
                    </span>
                  </div>
                </div>

                {/* Ticket Content */}
                <div className="p-6 space-y-4">
                  {/* Event Title */}
                  <h3 className="text-xl font-bold text-white line-clamp-2">
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
                      <span className="text-sm text-white font-mono font-semibold">#{ticket.ticket_id_onchain}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Wallet className="w-4 h-4 text-[#A0A0A0] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#777777] uppercase tracking-wider mb-1">Wallet</p>
                        <p className="text-sm text-white font-mono break-all">{shortenAddress(ticket.owner_wallet)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleViewDetail(ticket.id)}
                      className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-transparent border border-white/12 rounded-xl hover:border-white/25 hover:bg-white/5 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" strokeWidth={1.5} />
                      View Detail
                    </button>
                    <button
                      onClick={() => handleShowQR(ticket.id)}
                      className="flex-1 px-4 py-3 text-sm font-semibold text-black bg-white rounded-xl hover:bg-[#EAEAEA] transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <QrCode className="w-4 h-4" strokeWidth={1.5} />
                      Show QR
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MyTickets;
