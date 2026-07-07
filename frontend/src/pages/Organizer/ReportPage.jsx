import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Ticket,
  Layers,
  Cpu,
  CheckSquare,
  Copy,
  Check,
  ExternalLink,
  Inbox,
  Tag
} from 'lucide-react';
import OrganizerNavbar from '../../components/organizer/OrganizerNavbar';
import Footer from '../../components/landing/Footer';
import api from '../../api/axios';
import { getImageUrl } from '../../utils/imageHelper';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const BLOCKCHAIN_NETWORK = import.meta.env.VITE_BLOCKCHAIN_NETWORK || 'Ethereum Sepolia';

const ReportPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    const fetchEventReport = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/events/${eventId}`);
        if (response.data && response.data.success) {
          const eventData = response.data.data;
          setEvent(eventData);
          setRecentTickets(eventData.recent_tickets || []);
        } else {
          setError(response.data?.message || 'Failed to load report data.');
        }
      } catch (err) {
        console.error('Fetch event report error:', err);
        setError(err.response?.data?.message || 'Failed to load report data.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventReport();
  }, [eventId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatMintDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const triggerToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  const handleCopyContract = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    triggerToast('Contract address copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const shortenAddress = (address) => {
    if (!address) return '';
    if (address.length <= 13) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-between">
        <OrganizerNavbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-20">
          <div className="inline-block w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          <p className="text-[#A0A0A0] text-sm font-semibold">Loading performance report...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-between">
        <OrganizerNavbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-6 py-20 max-w-md mx-auto px-6 text-center">
          <p className="text-[#EF4444] text-lg font-semibold">{error || 'Event report not found.'}</p>
          <button
            onClick={() => navigate('/dashboard/organizer/home')}
            className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-black bg-white rounded-xl hover:bg-[#EAEAEA] transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const totalTickets = Number(event.quota) || 0;
  const ticketsSold = Number(event.tickets_sold) || 0;
  const remainingTickets = Math.max(0, totalTickets - ticketsSold);
  const progressPercent = totalTickets > 0 ? parseFloat(((ticketsSold / totalTickets) * 100).toFixed(2)) : 0;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-between">
      <OrganizerNavbar />

      <main className="flex-grow flex justify-center py-8 md:py-12">
        <div className="max-w-5xl w-full mx-auto px-6 space-y-8">

          {/* Toast Notification */}
          {toast.show && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white text-black px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xl border border-white/10 animate-fade-in flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.5} />
              {toast.message}
            </div>
          )}

          {/* Navigation Back */}
          <div>
            <Link
              to="/dashboard/organizer/home"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#A0A0A0] hover:text-white transition-colors duration-200 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
              Back to My Events
            </Link>
          </div>

          {/* Section 1: Header Event Card */}
          <div className="bg-[#161616]/40 border border-white/8 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-stretch">
            {/* Banner Image */}
            <div className="w-full md:w-72 h-44 md:h-auto rounded-xl overflow-hidden border border-white/8 bg-[#0D0D0D] flex-shrink-0 relative">
              {event.banner_url ? (
                <img
                  src={getImageUrl(event.banner_url)}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#555] font-semibold text-xs">
                  No Banner Image
                </div>
              )}
            </div>

            {/* Event Info Details */}
            <div className="flex flex-col justify-between flex-grow py-1 space-y-4">
              <div className="space-y-3">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  {event.category_name && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider bg-white/5 border border-white/8 text-[#A0A0A0] rounded-full">
                      <Tag className="w-2.5 h-2.5" />
                      {event.category_name}
                    </span>
                  )}
                  <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-full border ${event.status === 'published'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : event.status === 'closed'
                      ? 'bg-[#EF4444]/10 border-[#EF4444]/20 text-[#EF4444]'
                      : 'bg-white/5 border-white/10 text-[#777]'
                    }`}>
                    {event.status === 'published' ? 'Active' : event.status === 'closed' ? 'Closed' : event.status}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight m-0">
                  {event.title}
                </h1>

                {/* Date & Location */}
                <div className="space-y-2 text-xs text-[#A0A0A0] font-medium pt-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#555] flex-shrink-0" strokeWidth={2} />
                    <span>{formatDate(event.event_date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#555] flex-shrink-0" strokeWidth={2} />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>

              {/* Organizer Row */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#555] font-semibold uppercase tracking-wider">
                <span>Organizer</span>
                <span className="text-xs font-semibold text-[#A0A0A0] tracking-normal normal-case">{event.organizer_name || 'Tickify Organizer'}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Tickets Sold */}
            <div className="bg-[#161616]/40 border border-white/8 rounded-xl p-5 flex flex-col justify-between min-h-[110px] hover:border-white/15 transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <Ticket className="w-4 h-4 text-[#A0A0A0]" strokeWidth={2} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white tracking-tight">{ticketsSold}</div>
                <div className="text-xs font-semibold text-[#555] uppercase tracking-wider mt-1">Tickets Sold</div>
              </div>
            </div>

            {/* Card 2: Remaining Tickets */}
            <div className="bg-[#161616]/40 border border-white/8 rounded-xl p-5 flex flex-col justify-between min-h-[110px] hover:border-white/15 transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <Layers className="w-4 h-4 text-[#A0A0A0]" strokeWidth={2} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white tracking-tight">{remainingTickets}</div>
                <div className="text-xs font-semibold text-[#555] uppercase tracking-wider mt-1">Remaining Tickets</div>
              </div>
            </div>

            {/* Card 3: NFT Minted */}
            <div className="bg-[#161616]/40 border border-white/8 rounded-xl p-5 flex flex-col justify-between min-h-[110px] hover:border-white/15 transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <Cpu className="w-4 h-4 text-[#A0A0A0]" strokeWidth={2} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white tracking-tight">{event.nft_minted || 0}</div>
                <div className="text-xs font-semibold text-[#555] uppercase tracking-wider mt-1">NFT Minted</div>
              </div>
            </div>

            {/* Card 4: Check-ins */}
            <div className="bg-[#161616]/40 border border-white/8 rounded-xl p-5 flex flex-col justify-between min-h-[110px] hover:border-white/15 transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <CheckSquare className="w-4 h-4 text-[#A0A0A0]" strokeWidth={2} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white tracking-tight">{event.checked_in_tickets || 0}</div>
                <div className="text-xs font-semibold text-[#555] uppercase tracking-wider mt-1">Check-ins</div>
              </div>
            </div>
          </div>

          {/* Section 3: Ticket Progress */}
          <div className="bg-[#161616]/40 border border-white/8 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
              <span className="text-[#555]">Ticket Sales Progress</span>
              <span className="text-[#FFF] normal-case font-bold">{progressPercent}%</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-semibold text-[#A0A0A0]">
                Sold <span className="text-white font-bold">{ticketsSold}</span> of <span className="text-white font-bold">{totalTickets}</span> Tickets
              </span>
            </div>
            <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5">
              <div
                className="bg-[#FFF] h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Section 4: Recent NFT Tickets */}
          <div className="bg-[#161616]/40 border border-white/8 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-semibold text-[#555] uppercase tracking-wider">Recent NFT Tickets</h3>

            {recentTickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-3">
                <div className="w-10 h-10 bg-white/2 rounded-full flex items-center justify-center border border-white/5">
                  <Inbox className="w-5 h-5 text-[#555]" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-[#A0A0A0]">No tickets minted yet</p>
                  <p className="text-xs font-normal text-[#555] mt-0.5">Tickets will appear here as soon as users purchase them.</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-xs text-[#555] uppercase tracking-wider font-semibold">
                      <th className="pb-3 font-semibold">Token ID</th>
                      <th className="pb-3 font-semibold">Wallet</th>
                      <th className="pb-3 font-semibold">Mint Date</th>
                      <th className="pb-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {recentTickets.map((t, index) => (
                      <tr key={t.tokenId || index} className="hover:bg-white/2 transition-colors duration-150">
                        <td className="py-3 font-mono font-bold text-white">
                          {t.tokenId !== null && t.tokenId !== undefined ? `#${t.tokenId}` : '-'}
                        </td>
                        <td className="py-3 font-mono text-[#A0A0A0]" title={t.wallet}>
                          {shortenAddress(t.wallet)}
                        </td>
                        <td className="py-3 text-[#A0A0A0]">{formatMintDate(t.mintDate)}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold tracking-wider uppercase ${t.status === 'SUCCESS'
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                            : t.status === 'PENDING'
                              ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                              : 'bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444]'
                            }`}>
                            {t.status === 'SUCCESS' ? 'Success' : t.status === 'PENDING' ? 'Pending' : 'Failed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section 5: Blockchain Information */}
          <div className="bg-[#161616]/40 border border-white/8 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-semibold text-[#555] uppercase tracking-wider">Blockchain Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
              {/* Network */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#555] uppercase tracking-wider">Network</span>
                <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#c084fc] animate-pulse"></div>
                  {BLOCKCHAIN_NETWORK}
                </div>
              </div>

              {/* Total NFT Minted */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#555] uppercase tracking-wider">Total NFT Minted</span>
                <div className="text-xs font-semibold text-white">{event.nft_minted || 0} NFTs</div>
              </div>

              {/* Smart Contract Address */}
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#555] uppercase tracking-wider">Contract Address</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#A0A0A0]">{shortenAddress(CONTRACT_ADDRESS)}</span>
                  <button
                    onClick={handleCopyContract}
                    className="p-1 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/8 text-[#555] hover:text-white transition-all duration-150 cursor-pointer"
                    title="Copy Smart Contract Address"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 flex justify-end">
              <a
                href={CONTRACT_ADDRESS ? `https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}` : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:border-white/15 transition-all duration-150 active:scale-[0.98] cursor-pointer"
              >
                View on Etherscan
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReportPage;
