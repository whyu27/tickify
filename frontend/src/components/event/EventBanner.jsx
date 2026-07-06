import { Calendar } from 'lucide-react';
import { getImageUrl } from '../../utils/imageHelper';

const EventBanner = ({ event }) => {
  if (!event) return null;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/8 bg-[#161616] group h-[280px] sm:h-[350px] md:h-[450px]">
      {event.banner_url && (
        <div
          className="absolute inset-0 bg-cover bg-center blur-2xl opacity-25 scale-105 pointer-events-none"
          style={{ backgroundImage: `url(${getImageUrl(event.banner_url)})` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
      {event.banner_url ? (
        <img
          src={getImageUrl(event.banner_url)}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-[1.01]"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-[#777777] gap-3">
          <Calendar className="w-16 h-16 text-[#555555] stroke-[1.5]" />
          <span className="font-semibold text-lg">No Banner Available</span>
        </div>
      )}

      {/* Status Badge overlay */}
      <div className="absolute top-6 right-6 z-20">
        <span className={`px-4 py-1.5 text-xs font-bold rounded-full uppercase tracking-wider ${
          event.status === 'published'
            ? 'bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E]'
            : event.status === 'closed'
              ? 'bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444]'
              : 'bg-[#FACC15]/10 border border-[#FACC15]/30 text-[#FACC15]'
        }`}>
          {event.status === 'published' ? 'Live' : event.status}
        </span>
      </div>
    </div>
  );
};

export default EventBanner;
