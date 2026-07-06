import { Ticket, Users, AlertCircle } from 'lucide-react';

const EventSidebar = ({ event, children }) => {
  if (!event) return null;

  return (
    <div className="bg-[#161616] border border-white/8 rounded-2xl p-6 space-y-6 lg:sticky lg:top-24 shadow-sm hover:border-white/12 transition-all duration-300">
      <h3 className="text-lg font-bold text-white">Ticket Details</h3>

      {/* Ticket pricing & availability metadata */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white/2 border border-white/8 rounded-xl">
          <div className="flex items-center gap-2 text-[#A0A0A0]">
            <Ticket className="w-5 h-5 stroke-[1.5]" />
            <span className="text-sm font-medium">Ticket Price</span>
          </div>
          <span className="text-lg font-bold text-white">
            {event.price_eth} ETH
          </span>
        </div>

        <div className="flex items-center justify-between p-4 bg-white/2 border border-white/8 rounded-xl">
          <div className="flex items-center gap-2 text-[#A0A0A0]">
            <Users className="w-5 h-5 stroke-[1.5]" />
            <span className="text-sm font-medium">Remaining</span>
          </div>
          <span className="text-base font-bold text-white">
            {event.quota - (event.tickets_sold || 0)} / {event.quota}
          </span>
        </div>

        <div className="flex items-center justify-between p-4 bg-white/2 border border-white/8 rounded-xl">
          <div className="flex items-center gap-2 text-[#A0A0A0]">
            <AlertCircle className="w-5 h-5 stroke-[1.5]" />
            <span className="text-sm font-medium">Status</span>
          </div>
          <span className={`text-sm font-bold capitalize ${event.status === 'published' ? 'text-[#22C55E]' : 'text-[#EF4444]'
            }`}>
            {event.status === 'published' ? 'Live' : event.status}
          </span>
        </div>
      </div>

      {children}
    </div>
  );
};

export default EventSidebar;
