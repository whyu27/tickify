import { X, AlertCircle, Loader } from 'lucide-react';
import { useEffect } from 'react';
import { getImageUrl } from '../../utils/imageHelper';

const PurchaseConfirmationModal = ({ isOpen, onClose, onConfirm, event, walletAddress, network = 'Ethereum Sepolia', purchaseLoading = false }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape' && !purchaseLoading) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose, purchaseLoading]);

  if (!isOpen || !event) return null;

  const formatWallet = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in"
      onClick={purchaseLoading ? undefined : onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.05)] overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          disabled={purchaseLoading}
          className="absolute top-4 right-4 p-1.5 text-[#A0A0A0] hover:text-white bg-white/5 border border-white/8 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed z-10 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 pb-0">
          <h3 className="text-xl font-bold text-white tracking-tight">Purchase NFT Ticket</h3>
          <p className="text-sm text-[#A0A0A0] mt-1">Please review your purchase before continuing.</p>
        </div>

        <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
          <div className="bg-[#161616] border border-white/8 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-semibold text-[#777777] uppercase tracking-wider">Event Summary</h4>

            {event.banner_url && (
              <div className="relative rounded-lg overflow-hidden h-24">
                <div
                  className="absolute inset-0 bg-cover bg-center blur-xl opacity-30 scale-105"
                  style={{ backgroundImage: `url(${getImageUrl(event.banner_url)})` }}
                />
                <img
                  src={getImageUrl(event.banner_url)}
                  alt={event.title}
                  className="w-full h-full object-cover relative z-0"
                />
              </div>
            )}

            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-[#A0A0A0]">Event Name</span>
                <span className="text-white font-semibold text-right max-w-[200px] truncate">{event.title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#A0A0A0]">Organizer</span>
                <span className="text-white font-semibold">{event.organizer_name || event.organizer_username || event.organizer?.name || '-'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#A0A0A0]">Event Date</span>
                <span className="text-white font-semibold">{formatDate(event.date || event.event_date)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#A0A0A0]">Location</span>
                <span className="text-white font-semibold text-right max-w-[200px] truncate">{event.location}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white/5">
                <span className="text-[#A0A0A0]">Ticket Price</span>
                <span className="text-white font-bold">{event.price_eth} ETH</span>
              </div>
            </div>
          </div>

          <div className="bg-[#161616] border border-white/8 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-semibold text-[#777777] uppercase tracking-wider">Blockchain Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-[#A0A0A0]">Wallet Address</span>
                <span className="text-white font-mono text-xs bg-white/5 px-2 py-1 rounded-md border border-white/5">
                  {formatWallet(walletAddress)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#A0A0A0]">Network</span>
                <span className="text-white font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {network}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#22C55E]/5 border border-[#22C55E]/15 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-[#22C55E] flex-shrink-0 mt-0.5" strokeWidth={2} />
            <div className="space-y-1 text-xs text-[#A0A0A0]">
              <p>• NFT Ticket akan langsung di-mint ke wallet Anda.</p>
              <p>• Tiket akan tersimpan permanen pada blockchain.</p>
              <p>• Pembelian tidak dapat dibatalkan.</p>
              <p>• Proses minting membutuhkan beberapa detik.</p>
            </div>
          </div>
        </div>

        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onClose}
            disabled={purchaseLoading}
            className="flex-1 py-3 px-5 text-sm font-semibold text-[#A0A0A0] bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={purchaseLoading}
            className="flex-1 py-3 px-5 text-sm font-semibold text-black bg-white hover:bg-[#EAEAEA] active:scale-[0.98] rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {purchaseLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Confirm Purchase'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseConfirmationModal;
