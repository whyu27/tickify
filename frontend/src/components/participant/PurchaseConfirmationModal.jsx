import { X, AlertCircle } from 'lucide-react';
import { useEffect } from 'react';
import { getImageUrl } from '../../utils/imageHelper';

const PurchaseConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  event,
  walletAddress,
  network = 'Ethereum Sepolia',
  purchaseLoading = false
}) => {
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
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in pointer-events-auto"
      onClick={purchaseLoading ? undefined : onClose}
    >
      <div
        className="relative w-full max-w-xl bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={purchaseLoading}
          className="absolute top-4 right-4 p-1.5 text-[#A0A0A0] hover:text-white bg-white/5 border border-white/8 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed z-10 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 shrink-0">
          <h3 className="text-xl font-bold text-white tracking-tight">Purchase NFT Ticket</h3>
          <p className="text-sm text-[#A0A0A0] mt-1">Review your purchase before continuing.</p>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto px-5 sm:px-6 pb-2 space-y-4 min-h-0 flex-1">
          {/* Event Banner */}
          {event.banner_url && (
            <div className="aspect-[16/7] w-full rounded-xl overflow-hidden border border-white/10 bg-[#0D0D0D] shrink-0">
              <img
                src={getImageUrl(event.banner_url)}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Compact Summary & Wallet */}
          <div className="bg-[#161616]/60 border border-white/8 rounded-xl p-4 space-y-3 shrink-0">
            {/* Event Details */}
            <div className="flex justify-between items-start gap-4">
              <div className="min-w-0">
                <h4 className="font-bold text-white text-base leading-tight truncate">{event.title}</h4>
                <p className="text-xs text-[#A0A0A0] mt-1 truncate">
                  {event.organizer_name || event.organizer_username || event.organizer?.name || 'Organizer'} • {formatDate(event.date || event.event_date)}
                </p>
                <p className="text-xs text-[#777777] mt-0.5 truncate">{event.location}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] text-[#777777] uppercase tracking-wider">Price</p>
                <p className="text-lg font-bold text-white">{event.price_eth} ETH</p>
              </div>
            </div>

            {/* Wallet Info */}
            <div className="flex justify-between items-center text-xs pt-3 border-t border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-[#777777]">Wallet</span>
                <span className="font-mono text-white bg-white/5 px-2 py-0.5 rounded border border-white/5 font-semibold">
                  {formatWallet(walletAddress)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#777777]">Network</span>
                <span className="text-white font-medium flex items-center gap-1.5 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {network}
                </span>
              </div>
            </div>
          </div>

          {/* Warning Box */}
          <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-3 flex gap-2.5 items-center shrink-0">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" strokeWidth={1.5} />
            <p className="text-[11px] text-[#A0A0A0] leading-normal font-medium">
              You are about to mint an NFT ticket on Ethereum Sepolia. Once completed, this action cannot be undone.
            </p>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="p-5 sm:p-6 shrink-0 bg-[#0A0A0A] flex flex-col-reverse sm:flex-row gap-3">
          <button
            onClick={onClose}
            disabled={purchaseLoading}
            className="w-full sm:flex-1 py-3 px-5 text-sm font-semibold text-[#A0A0A0] bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={purchaseLoading}
            className="w-full sm:flex-1 py-3 px-5 text-sm font-semibold text-black bg-white hover:bg-[#EAEAEA] rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {purchaseLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
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
