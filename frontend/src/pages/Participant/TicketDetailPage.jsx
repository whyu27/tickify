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
  AlertCircle,
  Ticket
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

  const handleCopyContract = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    triggerToast('Contract address copied.');
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
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-[10%] left-[-15%] w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-15%] w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[20%] w-[300px] h-[300px] bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none" />

      <ParticipantNavbar />

      <div className="flex-1 max-w-[1000px] w-full mx-auto px-6 py-8 relative z-10">

        {/* Back Link */}
        <Link
          to="/participant/tickets"
          className="inline-flex items-center gap-2 text-sm text-[#A0A0A0] hover:text-white transition-colors duration-200 mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to My Tickets
        </Link>

        {/* NFT Ticket Pass Visual */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#121212] to-[#080808] border border-white/8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col md:flex-row mb-10 group transition-all duration-300 hover:border-white/15">
          {/* Ambient Inner Shadow/Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-indigo-500/5 pointer-events-none" />

          {/* Left Part: Event Details (60% width on desktop) */}
          <div className="relative md:w-3/5 min-h-[260px] md:min-h-[340px] flex flex-col justify-between p-8 z-10">
            {/* Event Banner Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              {ticket.event.banner_url ? (
                <img
                  src={getImageUrl(ticket.event.banner_url)}
                  alt={ticket.event.title}
                  className="w-full h-full object-cover opacity-35 group-hover:scale-[1.03] transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#1F1F1F] to-[#0D0D0D]" />
              )}
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
            </div>

            {/* Left Part Content */}
            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
              {/* Top Row: Organizer & Type */}
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-white/5 border border-white/8 text-[#A0A0A0]">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  NFT PASS
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E]">
                  Verified Organizer
                </span>
              </div>

              {/* Middle Row: Title */}
              <div>
                <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight mb-2 drop-shadow-md">
                  {ticket.event.title}
                </h1>
                <p className="text-[#A0A0A0] text-xs md:text-sm max-w-md line-clamp-2">
                  Premium blockchain-verified admission pass.
                </p>
              </div>

              {/* Bottom Row: Metadata */}
              <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 mt-auto">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/8">
                    <Calendar className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <span className="text-[9px] text-[#777777] uppercase block tracking-wider font-semibold">Event Date</span>
                    <span className="text-xs text-white font-medium">{formatMintDate(ticket.event.event_date)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/8">
                    <MapPin className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-[9px] text-[#777777] uppercase block tracking-wider font-semibold">Location</span>
                    <span className="text-xs text-white font-medium line-clamp-1">{ticket.event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Punch/Stub Divider - Desktop (Vertical) */}
          <div className="hidden md:flex flex-col justify-between items-center relative w-[1px] py-4 bg-[#101010]/85">
            {/* Top punch hole */}
            <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#0A0A0A] border-b border-white/10 z-20" />
            {/* Vertical dashed line */}
            <div className="h-full border-l-2 border-dashed border-white/10" />
            {/* Bottom punch hole */}
            <div className="absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#0A0A0A] border-t border-white/10 z-20" />
          </div>

          {/* Ticket Punch/Stub Divider - Mobile (Horizontal) */}
          <div className="flex md:hidden items-center justify-between relative px-4 w-full h-[1px]">
            {/* Left punch hole */}
            <div className="absolute left-0 -translate-x-1/2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0A0A0A] border-r border-white/10 z-20" />
            {/* Horizontal dashed line */}
            <div className="w-full border-t-2 border-dashed border-white/10" />
            {/* Right punch hole */}
            <div className="absolute right-0 translate-x-1/2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0A0A0A] border-l border-white/10 z-20" />
          </div>

          {/* Right Part: QR Stub & Status (40% width on desktop) */}
          <div className="relative md:w-2/5 p-8 flex flex-col items-center justify-center bg-[#101010]/85 backdrop-blur-sm z-10">
            {/* Status Badge absolute corner */}
            <div className="absolute top-4 right-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full backdrop-blur-md ${statusCfg.classes}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotColor} ${ticket.status === 'active' ? 'animate-pulse' : ''}`} />
                {statusCfg.label}
              </span>
            </div>

            {/* Stub Content */}
            <div className="flex flex-col items-center w-full text-center space-y-5">
              {/* QR Container */}
              <button
                onClick={() => setIsQRModalOpen(true)}
                className="group/qr relative p-3.5 bg-white rounded-2xl flex justify-center items-center shadow-lg transition-transform duration-300 hover:scale-[1.03] cursor-pointer"
              >
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                    JSON.stringify({
                      ticketId: ticket.id,
                      tokenId: ticket.token_id || ticket.ticket_id_onchain,
                      eventId: ticket.event.id || ticket.event_id
                    })
                  )}`}
                  alt="Ticket QR Code"
                  className="w-[120px] h-[120px] object-contain transition-all duration-300"
                  loading="lazy"
                />
                {/* QR Hover overlay indicator */}
                <div className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover/qr:opacity-100 flex items-center justify-center transition-all duration-300">
                  <QrCode className="w-8 h-8 text-white animate-bounce" />
                </div>
              </button>

              <div className="space-y-1">
                <span className="text-[10px] text-[#777777] uppercase block tracking-wider font-semibold">NFT Token ID</span>
                <span className="text-lg text-white font-mono font-bold tracking-tight">#{ticket.token_id || ticket.ticket_id_onchain || '-'}</span>
              </div>

              <div className="w-full border-t border-white/5 my-1" />

              {/* Click to expand text */}
              <button
                onClick={() => setIsQRModalOpen(true)}
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
              >
                <QrCode className="w-3.5 h-3.5" />
                View & Scan QR Code
              </button>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

          {/* Card 1: NFT Credentials */}
          <div className="bg-[#121212]/50 backdrop-blur-md border border-white/8 rounded-2xl p-6 hover:border-white/12 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-4.5 h-4.5 text-green-400" />
                </div>
                <h3 className="text-lg font-bold text-white">NFT Credentials</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/4">
                  <span className="text-xs text-[#777777] uppercase tracking-wider font-semibold">Token Standard</span>
                  <span className="text-xs font-semibold text-white px-2.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">ERC-721 (NFT)</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-white/4">
                  <span className="text-xs text-[#777777] uppercase tracking-wider font-semibold">Wallet Owner</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-white" title={ticket.owner_wallet}>{shortenAddress(ticket.owner_wallet)}</span>
                    <button
                      onClick={handleCopyWallet}
                      className="p-1 text-[#777777] hover:text-white transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-white/4">
                  <span className="text-xs text-[#777777] uppercase tracking-wider font-semibold">Contract Address</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-white" title={CONTRACT_ADDRESS}>{shortenAddress(CONTRACT_ADDRESS)}</span>
                    <button
                      onClick={handleCopyContract}
                      className="p-1 text-[#777777] hover:text-white transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-white/4">
                  <span className="text-xs text-[#777777] uppercase tracking-wider font-semibold">Blockchain Network</span>
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    Ethereum Sepolia
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-xs text-[#777777] uppercase tracking-wider font-semibold">Mint Date</span>
                  <span className="text-xs text-white font-medium">{formatMintDate(ticket.created_at)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Ledger Transaction Ledger */}
          <div className="bg-[#121212]/50 backdrop-blur-md border border-white/8 rounded-2xl p-6 hover:border-white/12 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Cpu className="w-4.5 h-4.5 text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Ledger & Transaction</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/4">
                  <span className="text-xs text-[#777777] uppercase tracking-wider font-semibold">Mint Cost</span>
                  <span className="text-xs font-mono font-bold text-white">{ticket.event.price_eth || '0'} ETH</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-white/4">
                  <span className="text-xs text-[#777777] uppercase tracking-wider font-semibold">Gas Status</span>
                  <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">Success (Confirmed)</span>
                </div>

                <div className="flex flex-col py-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-[#777777] uppercase tracking-wider font-semibold">Transaction Hash</span>
                    {ticket.transaction_hash && (
                      <button
                        onClick={handleCopyTxHash}
                        className="p-1 text-[#777777] hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-medium"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copy Hash
                      </button>
                    )}
                  </div>
                  <span className="text-[11px] text-[#A0A0A0] font-mono break-all bg-black/40 border border-white/5 rounded-xl p-3 leading-relaxed">
                    {ticket.transaction_hash || 'No Transaction Hash Available'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4">
              {ticket.transaction_hash ? (
                <a
                  href={`https://sepolia.etherscan.io/tx/${ticket.transaction_hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-4 py-3 text-sm font-bold text-white bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer shadow-md"
                >
                  <ExternalLink className="w-4 h-4" />
                  Explore on Etherscan
                </a>
              ) : (
                <button
                  disabled
                  className="w-full px-4 py-3 text-sm font-semibold text-[#555555] bg-white/2 border border-white/5 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <ExternalLink className="w-4 h-4" />
                  Etherscan Link Unavailable
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
