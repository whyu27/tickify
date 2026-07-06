import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ParticipantNavbar from '../../components/participant/ParticipantNavbar';
import Footer from '../../components/landing/Footer';
import TicketQRModal from '../../components/participant/TicketQRModal';
import api from '../../api/axios';
import { getImageUrl } from '../../utils/imageHelper';
import { 
  ArrowLeft, 
  Copy, 
  ExternalLink, 
  QrCode, 
  MapPin, 
  Calendar, 
  Wallet, 
  ShieldCheck,
  Cpu,
  Clock,
  CircleDollarSign,
  AlertCircle
} from 'lucide-react';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x8237B8afe65bCAfEE2509bfEfb48237dafc92d43';

const TicketDetailPage = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal & Toast states
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all participant tickets and filter by the URL's ticketId
      const response = await api.get('/tickets/my-tickets');
      if (response.data && response.data.success) {
        const userTickets = response.data.data || [];
        const foundTicket = userTickets.find(t => String(t.id) === String(ticketId));
        
        if (foundTicket) {
          setTicket(foundTicket);
        } else {
          setError('TICKET_NOT_FOUND');
        }
      } else {
        setError(response.data?.message || 'Failed to load ticket details.');
      }
    } catch (err) {
      console.error('Error fetching ticket details:', err);
      setError(err.response?.data?.message || 'Failed to load ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketDetails();
  }, [ticketId]);

  // Shorten address helper
  const shortenAddress = (address) => {
    if (!address) return '-';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Format date: e.g. "9 July 2026"
  const formatMintDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Toast handler
  const triggerToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  // Clipboard copies
  const handleCopyWallet = () => {
    if (ticket?.owner_wallet) {
      navigator.clipboard.writeText(ticket.owner_wallet);
      triggerToast('Wallet copied.');
    }
  };

  const handleCopyTxHash = () => {
    if (ticket?.transaction_hash) {
      navigator.clipboard.writeText(ticket.transaction_hash);
      triggerToast('Transaction hash copied.');
    }
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

  // loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
        <ParticipantNavbar />
        <div className="flex-1 max-w-[1000px] w-full mx-auto px-6 py-8 animate-pulse space-y-8">
          {/* Back button skeleton */}
          <div className="h-6 bg-white/5 rounded-md w-32" />
          
          {/* Banner skeleton */}
          <div className="h-64 md:h-80 bg-white/5 rounded-3xl" />

          {/* Header text skeleton */}
          <div className="space-y-3">
            <div className="h-10 bg-white/10 rounded-md w-2/3" />
            <div className="h-6 bg-white/5 rounded-md w-24" />
          </div>

          {/* Cards skeleton grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="bg-[#161616] border border-white/8 rounded-2xl p-6 h-56 space-y-4">
                <div className="h-6 bg-white/10 rounded-md w-1/3" />
                <div className="space-y-2 pt-2">
                  <div className="h-4 bg-white/5 rounded-md w-5/6" />
                  <div className="h-4 bg-white/5 rounded-md w-3/4" />
                  <div className="h-4 bg-white/5 rounded-md w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error ticket not found
  if (error === 'TICKET_NOT_FOUND') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
        <ParticipantNavbar />
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
          <div className="bg-[#161616]/80 backdrop-blur-md border border-white/8 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl flex flex-col items-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 border border-white/8 rounded-2xl mb-6">
              <AlertCircle className="w-8 h-8 text-[#EF4444]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Ticket not found.</h3>
            <p className="text-[#A0A0A0] text-sm mb-8 leading-relaxed">
              We couldn't find the NFT Ticket you were looking for. It may have been transferred or doesn't belong to this account.
            </p>
            <Link
              to="/participant/tickets"
              className="w-full py-3.5 text-sm font-bold text-black bg-white rounded-xl hover:bg-[#EAEAEA] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-white/5"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to My Tickets
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error server failure
  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
        <ParticipantNavbar />
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
          <div className="bg-[#1A1111]/80 backdrop-blur-md border border-red-500/20 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl flex flex-col items-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl mb-6">
              <AlertCircle className="w-8 h-8 text-[#EF4444]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 font-sans">Unable to load ticket.</h3>
            <p className="text-[#A0A0A0] text-sm mb-8 leading-relaxed">
              {error}
            </p>
            <button
              onClick={fetchTicketDetails}
              className="w-full py-3.5 text-sm font-bold bg-white text-black rounded-xl hover:bg-[#EAEAEA] active:scale-[0.98] transition-all duration-200"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const statusCfg = getStatusConfig(ticket?.status);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <ParticipantNavbar />

      <div className="flex-1 max-w-[1000px] w-full mx-auto px-6 py-8">
        
        {/* Back Link */}
        <Link 
          to="/participant/tickets" 
          className="inline-flex items-center gap-2 text-sm text-[#A0A0A0] hover:text-white transition-colors duration-200 mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to My Tickets
        </Link>

        {/* Hero / Banner Header */}
        <div className="relative rounded-3xl overflow-hidden bg-[#0D0D0D] border border-white/8 shadow-xl mb-8 group">
          <div className="h-64 md:h-80 w-full relative">
            {ticket.event.banner_url ? (
              <img
                src={getImageUrl(ticket.event.banner_url)}
                alt={ticket.event.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#1F1F1F] to-[#0D0D0D] flex flex-col items-center justify-center text-[#555555] gap-3">
                <Ticket className="w-16 h-16 stroke-[1.25]" />
                <span className="text-xs uppercase tracking-widest text-white/20 font-bold">NFT Ticket Banner</span>
              </div>
            )}
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>

          {/* Banner Meta details */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 space-y-4">
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {ticket.event.title}
            </h1>
            <div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full backdrop-blur-md ${statusCfg.classes}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotColor} ${ticket.status === 'active' ? 'animate-pulse' : ''}`} />
                {statusCfg.label}
              </span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: NFT Information */}
          <div className="bg-[#161616]/60 backdrop-blur-md border border-white/8 rounded-2xl p-6 hover:border-white/12 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <ShieldCheck className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-bold text-white">NFT Information</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-[#777777]">NFT Token ID</span>
                  <span className="text-sm font-mono text-white font-bold">#{ticket.token_id || ticket.ticket_id_onchain || '-'}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-[#777777]">Wallet Owner</span>
                  <span className="text-sm font-mono text-white" title={ticket.owner_wallet}>{shortenAddress(ticket.owner_wallet)}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-[#777777]">Contract Address</span>
                  <span className="text-sm font-mono text-white" title={CONTRACT_ADDRESS}>{shortenAddress(CONTRACT_ADDRESS)}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-[#777777]">Network</span>
                  <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                    Ethereum Sepolia
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-[#777777]">Mint Date</span>
                  <span className="text-sm text-white font-medium">{formatMintDate(ticket.created_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Event Information */}
          <div className="bg-[#161616]/60 backdrop-blur-md border border-white/8 rounded-2xl p-6 hover:border-white/12 transition-all duration-300">
            <div className="flex items-center gap-2.5 mb-5">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-white">Event Information</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3 py-1">
                <Cpu className="w-4 h-4 text-[#777777] mt-1 flex-shrink-0" />
                <div>
                  <span className="text-xs text-[#777777] uppercase tracking-wider block">Organizer</span>
                  <span className="text-sm text-white font-medium">Verified Organizer</span>
                </div>
              </div>
              <div className="flex items-start gap-3 py-1">
                <MapPin className="w-4 h-4 text-[#777777] mt-1 flex-shrink-0" />
                <div>
                  <span className="text-xs text-[#777777] uppercase tracking-wider block">Location</span>
                  <span className="text-sm text-white font-medium">{ticket.event.location}</span>
                </div>
              </div>
              <div className="flex items-start gap-3 py-1">
                <Clock className="w-4 h-4 text-[#777777] mt-1 flex-shrink-0" />
                <div>
                  <span className="text-xs text-[#777777] uppercase tracking-wider block">Event Date</span>
                  <span className="text-sm text-white font-medium">{formatMintDate(ticket.event.event_date)}</span>
                </div>
              </div>
              <div className="flex items-start gap-3 py-1">
                <CircleDollarSign className="w-4 h-4 text-[#777777] mt-1 flex-shrink-0" />
                <div>
                  <span className="text-xs text-[#777777] uppercase tracking-wider block">Ticket Price</span>
                  <span className="text-sm text-white font-mono font-semibold">{ticket.event.price_eth || '0'} ETH</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Blockchain Information */}
          <div className="bg-[#161616]/60 backdrop-blur-md border border-white/8 rounded-2xl p-6 hover:border-white/12 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 mb-1">
                <Cpu className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Blockchain Information</h3>
              </div>
              <div>
                <span className="text-xs text-[#777777] uppercase tracking-wider block mb-1.5">Transaction Hash</span>
                <span className="text-xs text-[#A0A0A0] font-mono break-all bg-black/40 border border-white/5 rounded-xl p-3 block leading-relaxed selection:bg-white/10 selection:text-white">
                  {ticket.transaction_hash || 'No Transaction Hash Available'}
                </span>
              </div>
            </div>
            
            <div className="pt-4">
              {ticket.transaction_hash ? (
                <a
                  href={`https://sepolia.etherscan.io/tx/${ticket.transaction_hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-4 py-3 text-sm font-semibold text-[#A0A0A0] hover:text-white bg-white/5 border border-white/8 hover:border-white/15 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on Etherscan
                </a>
              ) : (
                <button
                  disabled
                  className="w-full px-4 py-3 text-sm font-semibold text-[#555555] bg-white/2 border border-white/5 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on Etherscan (Unavailable)
                </button>
              )}
            </div>
          </div>

          {/* Card 4: Actions */}
          <div className="bg-[#161616]/60 backdrop-blur-md border border-white/8 rounded-2xl p-6 hover:border-white/12 transition-all duration-300 flex flex-col justify-between">
            <div className="mb-4">
              <div className="flex items-center gap-2.5">
                <Cpu className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Actions</h3>
              </div>
              <p className="text-sm text-[#777777] mt-2 leading-relaxed">
                Scan or copy parameters of your digital asset credentials.
              </p>
            </div>

            <div className="space-y-3">
              {/* Show QR */}
              <button
                onClick={() => setIsQRModalOpen(true)}
                className="w-full px-4 py-3.5 text-sm font-bold text-black bg-white rounded-xl hover:bg-[#EAEAEA] transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <QrCode className="w-4 h-4" />
                Show QR
              </button>

              {/* Copy Wallet */}
              <button
                onClick={handleCopyWallet}
                className="w-full px-4 py-3.5 text-sm font-semibold text-white bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Copy className="w-4 h-4" />
                Copy Wallet Address
              </button>

              {/* Copy Transaction Hash */}
              {ticket.transaction_hash ? (
                <button
                  onClick={handleCopyTxHash}
                  className="w-full px-4 py-3.5 text-sm font-semibold text-white bg-transparent border border-white/10 hover:border-white/20 hover:bg-white/5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Copy className="w-4 h-4" />
                  Copy Transaction Hash
                </button>
              ) : (
                <button
                  disabled
                  className="w-full px-4 py-3.5 text-sm font-semibold text-[#555555] bg-transparent border border-white/5 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <Copy className="w-4 h-4" />
                  Copy Transaction Hash (Unavailable)
                </button>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Reusable QR Modal component */}
      <TicketQRModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        ticket={ticket}
        getStatusConfig={getStatusConfig}
      />

      {/* Copy Alert Toast */}
      {toast.show && (
        <div className="fixed bottom-8 right-8 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="px-6 py-4 rounded-xl shadow-lg border bg-[#22C55E]/10 border-[#22C55E]/20 text-[#22C55E] backdrop-blur-md">
            <p className="text-sm font-semibold">{toast.message}</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default TicketDetailPage;
