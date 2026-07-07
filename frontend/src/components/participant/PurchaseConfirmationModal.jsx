import { X, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
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
  const [progressStep, setProgressStep] = useState(1);

  // Keyboard accessibility & ESC block
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape' && !purchaseLoading) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose, purchaseLoading]);

  // Handle dynamic visual progress transitions
  useEffect(() => {
    if (!purchaseLoading) {
      setProgressStep(1);
      return;
    }

    // Step 1: Transaction Submitted (⏳)
    // Step 2: Waiting for Blockchain Confirmation... (⏳) after 3s
    const timer1 = setTimeout(() => {
      setProgressStep(2);
    }, 3000);

    // Step 3: Finalizing Ticket (⏳) after 15s
    const timer2 = setTimeout(() => {
      setProgressStep(3);
    }, 15000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [purchaseLoading]);

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
        className={`relative w-full ${purchaseLoading ? 'max-w-md' : 'max-w-xl'} bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ease-out animate-scale-in max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow effect */}
        <div className={`absolute -top-24 -right-24 w-48 h-48 ${purchaseLoading ? 'bg-white/3' : 'bg-white/5'} rounded-full blur-3xl pointer-events-none transition-all duration-300`} />

        {/* Close Button - Hidden when loading */}
        {!purchaseLoading && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-[#A0A0A0] hover:text-white bg-white/5 border border-white/8 rounded-full transition-all duration-200 z-10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {purchaseLoading ? (
          /* Loading State Content */
          <div className="p-8 sm:p-10 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px] animate-fade-in">
            {/* Spinning Glowy Web3 Loader */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-full border-4 border-white/5 animate-pulse" />
              {/* Rotating spinner */}
              <div className="w-14 h-14 border-4 border-transparent border-t-white border-r-white/20 border-b-white/10 border-l-white/40 rounded-full animate-spin" />
            </div>

            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Minting Your NFT Ticket
              </h3>
              <div className="text-sm text-[#A0A0A0] max-w-sm mx-auto space-y-1 leading-relaxed font-normal">
                <p>Please wait while your NFT ticket is being minted on the Ethereum Sepolia network.</p>
                <p className="text-[#777777] text-xs font-medium">This process may take up to 30 seconds.</p>
              </div>
            </div>

            {/* Steps Visual Progress */}
            <div className="w-full bg-white/2 border border-white/8 rounded-xl p-5 text-left space-y-3.5 mt-4">
              {/* Step 1: Transaction Submitted */}
              <div className={`flex items-center gap-2.5 transition-all duration-300 ${progressStep >= 1 ? 'opacity-100' : 'opacity-40'}`}>
                <span className="text-base flex-shrink-0 w-5 h-5 flex items-center justify-center">
                  {progressStep > 1 ? (
                    <span className="text-emerald-400 font-bold">✓</span>
                  ) : (
                    <span className="text-amber-400 animate-pulse">⏳</span>
                  )}
                </span>
                <span className={`text-sm ${progressStep > 1 ? 'text-white/80' : 'text-white font-semibold'}`}>
                  Transaction Submitted
                </span>
              </div>

              {/* Step 2: Waiting for Blockchain Confirmation */}
              <div className={`flex items-center gap-2.5 transition-all duration-300 ${progressStep >= 2 ? 'opacity-100' : 'opacity-45'}`}>
                <span className="text-base flex-shrink-0 w-5 h-5 flex items-center justify-center">
                  {progressStep > 2 ? (
                    <span className="text-emerald-400 font-bold">✓</span>
                  ) : progressStep === 2 ? (
                    <span className="text-amber-400 animate-pulse">⏳</span>
                  ) : (
                    <span className="text-[#555555]">○</span>
                  )}
                </span>
                <span className={`text-sm ${progressStep > 2 ? 'text-white/80' : progressStep === 2 ? 'text-white font-semibold' : 'text-white/40'}`}>
                  Waiting for Blockchain Confirmation...
                </span>
              </div>

              {/* Step 3: Finalizing Ticket */}
              <div className={`flex items-center gap-2.5 transition-all duration-300 ${progressStep >= 3 ? 'opacity-100' : 'opacity-45'}`}>
                <span className="text-base flex-shrink-0 w-5 h-5 flex items-center justify-center">
                  {progressStep === 3 ? (
                    <span className="text-amber-400 animate-pulse">⏳</span>
                  ) : (
                    <span className="text-[#555555]">○</span>
                  )}
                </span>
                <span className={`text-sm ${progressStep === 3 ? 'text-white font-semibold' : 'text-white/40'}`}>
                  Finalizing Ticket
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Normal Confirmation State Content */
          <>
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
                Confirm Purchase
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PurchaseConfirmationModal;
