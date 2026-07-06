import { X } from 'lucide-react';

const TicketQRModal = ({ isOpen, onClose, ticket, getStatusConfig }) => {
  if (!isOpen || !ticket) return null;

  const statusCfg = getStatusConfig(ticket.status);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-[#161616] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#A0A0A0] hover:text-white bg-white/5 border border-white/8 rounded-full transition-all duration-200"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-6 mt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-white/5 border border-white/8 text-[#A0A0A0] mb-2">
            Participant Ticket
          </span>
          <h3 className="text-xl font-bold text-white">Your NFT Ticket</h3>
        </div>

        {/* QR Code Image */}
        <div className="p-4 bg-white rounded-2xl mb-6 flex justify-center items-center shadow-inner">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
              JSON.stringify({
                ticketId: ticket.id,
                tokenId: ticket.token_id || ticket.ticket_id_onchain,
                eventId: ticket.event.id || ticket.event_id
              })
            )}`}
            alt="Ticket QR Code"
            className="w-[200px] h-[200px] object-contain"
            loading="lazy"
          />
        </div>

        {/* Ticket Information */}
        <div className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 space-y-3 text-left">
          {/* Event Name */}
          <div>
            <span className="text-xs text-[#777777] uppercase tracking-wider block">Event</span>
            <span className="text-base font-semibold text-white line-clamp-1">{ticket.event.title}</span>
          </div>
          
          {/* Divider */}
          <div className="border-t border-white/5" />

          {/* Grid of details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-[#777777] uppercase tracking-wider block">NFT Token ID</span>
              <span className="text-sm text-white font-mono font-semibold">#{ticket.token_id || ticket.ticket_id_onchain || '-'}</span>
            </div>
            <div>
              <span className="text-xs text-[#777777] uppercase tracking-wider block">Status</span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full ${statusCfg.classes} mt-0.5`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotColor}`} />
                {statusCfg.label}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/5" />

          {/* Owner Wallet */}
          <div>
            <span className="text-xs text-[#777777] uppercase tracking-wider block mb-1">Owner Wallet</span>
            <span className="text-xs text-white font-mono break-all">{ticket.owner_wallet}</span>
          </div>
        </div>

        {/* Note */}
        <p className="text-xs text-[#777777] mt-6 max-w-[280px]">
          Present this QR Code at the event entrance for verification.
        </p>
      </div>
    </div>
  );
};

export default TicketQRModal;
