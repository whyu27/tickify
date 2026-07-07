import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import ParticipantNavbar from '../../components/participant/ParticipantNavbar';
import Footer from '../../components/landing/Footer';
import { ArrowLeft, AlertCircle, Ticket } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useWeb3 from '../../hooks/useWeb3';

// Shared Components
import EventBanner from '../../components/event/EventBanner';
import EventInfo from '../../components/event/EventInfo';
import EventSidebar from '../../components/event/EventSidebar';
import { EventLoading, EventError, EventNotFound } from '../../components/event/EventStates';
import PurchaseConfirmationModal from '../../components/participant/PurchaseConfirmationModal';

const ParticipantEventDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { connectWallet, connectionStatus } = useWeb3();

  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [purchaseError, setPurchaseError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchEventDetail = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await api.get(`/events/${id}`);
      if (response.data && response.data.success) {
        setEvent(response.data.data);
      } else {
        setErrorMsg(response.data?.message || 'Event not found.');
      }
    } catch (error) {
      console.error('Fetch event detail error:', error);
      const msg = error.response?.data?.message || 'An error occurred on the server while fetching event details.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyTicket = async () => {
    console.log("CURRENT USER:", user);
    console.log("Buy Ticket clicked");
    setPurchaseError('');
    setSuccessData(null);

    // 1. Cek apakah user sudah login
    if (!user) {
      setPurchaseError("Silakan login terlebih dahulu untuk membeli tiket.");
      return;
    }

    // 2. Cek wallet sudah connect
    if (!user.wallet_address) {
      setPurchaseError("Wallet belum terhubung. Silakan hubungkan wallet Anda terlebih dahulu.");
      return;
    }

    // 3. Cek wallet sudah verified
    if (!user.wallet_verified) {
      setPurchaseError("Wallet belum diverifikasi. Silakan lakukan Wallet Verification terlebih dahulu.");
      return;
    }

    setPurchaseLoading(true);

    const payload = { eventId: event.id };
    console.log("Purchase request:", payload);

    try {
      console.log("Sending purchase request...");
      const response = await api.post('/tickets/purchase', payload, { timeout: 60000 });
      console.log("Purchase response:", response.data);

      if (response.data && response.data.success) {
        setSuccessData(response.data.data);
        fetchEventDetail();
      } else {
        setPurchaseError(response.data?.message || 'Failed to purchase ticket.');
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'NFT gagal dibuat. Silakan coba beberapa saat lagi.';
      setPurchaseError(msg);
    } finally {
      setPurchaseLoading(false);
    }
  };

  const handleConfirmPurchase = () => {
    setShowConfirmModal(false);
    handleBuyTicket();
  };

  useEffect(() => {
    fetchEventDetail();
  }, [id]);

  const soldOut = event ? (event.quota - (event.tickets_sold || 0) <= 0) : false;
  const disabled = purchaseLoading || soldOut || (event ? event.status !== 'published' : true);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      <ParticipantNavbar />

      <main className="flex-grow max-w-[1280px] w-full mx-auto px-6 py-10 flex flex-col gap-8 animate-fade-in">
        {/* Back Link */}
        <div>
          <Link
            to="/participant/home"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#A0A0A0] hover:text-white transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" strokeWidth={2} />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && <EventLoading />}

        {/* Error State */}
        {!isLoading && errorMsg && (
          <EventError errorMsg={errorMsg} onRetry={fetchEventDetail} />
        )}

        {/* Not Found State */}
        {!isLoading && !errorMsg && !event && <EventNotFound />}

        {/* Event Content */}
        {!isLoading && !errorMsg && event && (
          <div className="space-y-8">
            <EventBanner event={event} />

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Main Content Column */}
              <div className="lg:col-span-2 space-y-6 order-2 md:order-1">
                <EventInfo event={event} />
              </div>

              {/* Sidebar Column */}
              <div className="space-y-6 order-1 md:order-2">
                <EventSidebar event={event}>
                  {/* Purchase error display */}
                  {purchaseError && (
                    <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] rounded-xl text-xs flex items-start gap-2 mb-4">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{purchaseError}</span>
                    </div>
                  )}

                  {/* Purchase Logic / Sections */}
                  {!user?.wallet_address || !user?.wallet_verified ? (
                    <div className="space-y-3">
                      <div className="p-3.5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-xs text-yellow-500 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 animate-pulse" />
                        <div>
                          <p className="font-semibold">Wallet Status: Disconnected</p>
                          <p className="mt-0.5 opacity-80">You need to connect and verify your MetaMask wallet to buy tickets.</p>
                        </div>
                      </div>
                      <button
                        onClick={connectWallet}
                        disabled={connectionStatus === 'connecting'}
                        className="w-full text-center block py-3.5 px-6 bg-white hover:bg-[#EAEAEA] text-black font-semibold rounded-xl transition-all duration-200 shadow-md hover:scale-[1.01] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {connectionStatus === 'connecting' ? 'Connecting & Verifying...' : 'Connect & Verify Wallet'}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Wallet Status Info */}
                      <div className="p-4 bg-white/2 border border-white/8 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#A0A0A0]">Wallet Address</span>
                          <span className="text-emerald-500 flex items-center gap-1 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Connected & Verified
                          </span>
                        </div>
                        <p className="text-xs font-mono text-white/85 break-all bg-white/2 p-2 rounded-lg border border-white/5">
                          {user.wallet_address}
                        </p>
                      </div>

                      {/* Buy Button */}
                      <button
                        onClick={() => setShowConfirmModal(true)}
                        disabled={disabled}
                        className="w-full text-center block py-3.5 px-6 bg-white hover:bg-[#EAEAEA] text-black font-semibold rounded-xl transition-all duration-200 shadow-md hover:scale-[1.01] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {soldOut
                          ? 'Ticket Sold Out'
                          : purchaseLoading
                            ? 'Processing...'
                            : 'Buy Ticket'}
                      </button>
                    </div>
                  )}
                </EventSidebar>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Purchase Confirmation Modal */}
      <PurchaseConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmPurchase}
        event={event}
        walletAddress={user?.wallet_address}
        purchaseLoading={purchaseLoading}
      />

      {/* Success Modal */}
      {successData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(255,255,255,0.05)] overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#22C55E]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] rounded-2xl flex items-center justify-center mb-6 shadow-inner animate-pulse">
                <Ticket className="w-8 h-8" strokeWidth={1.5} />
              </div>

              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">🎉 Ticket purchased successfully!</h3>
              <p className="text-sm text-[#A0A0A0] mb-6 leading-relaxed">
                NFT Ticket berhasil dibuat.
              </p>

              <div className="w-full bg-white/2 border border-white/8 rounded-xl p-4 mb-6 space-y-3 text-left font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-[#777777]">Token ID :</span>
                  <span className="text-white font-bold">#{successData.tokenId}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[#777777]">Transaction Hash :</span>
                  <span className="text-white font-semibold break-all text-[10px]">{successData.transactionHash}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full">
                <Link
                  to="/participant/tickets"
                  className="w-full inline-flex justify-center items-center px-5 py-3 text-sm font-semibold text-black bg-white rounded-xl hover:bg-[#EAEAEA] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                >
                  View My Tickets
                </Link>
                <a
                  href={`https://sepolia.etherscan.io/tx/${successData.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex justify-center items-center px-5 py-3 text-sm font-semibold text-white bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                >
                  View on Etherscan
                </a>
                <button
                  onClick={() => setSuccessData(null)}
                  className="w-full px-5 py-3 text-sm font-semibold text-[#777777] hover:text-white transition-all duration-200 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ParticipantEventDetailPage;
