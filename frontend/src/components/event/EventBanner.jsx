import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { getImageUrl } from '../../utils/imageHelper';

const EventBanner = ({ event }) => {
  const [imageError, setImageError] = useState(false);

  if (!event) return null;

  const showImage = event.banner_url && !imageError;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/8 bg-[#161616] group w-full aspect-[16/9] md:aspect-[16/7]">
      {showImage && (
        <div
          className="absolute inset-0 bg-cover bg-center blur-2xl opacity-25 scale-105 pointer-events-none animate-pulse"
          style={{ backgroundImage: `url(${getImageUrl(event.banner_url)})` }}
        />
      )}
      
      {/* Smooth bottom-up gradient overlay blending with #0A0A0A background */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent z-10 pointer-events-none" />

      {showImage ? (
        <img
          src={getImageUrl(event.banner_url)}
          alt={event.title}
          onError={() => setImageError(true)}
          className="absolute inset-0 w-full h-full object-cover object-center z-0 transition-transform duration-700 group-hover:scale-[1.01]"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1e1b4b] via-[#111827] to-[#090514] text-[#888888] gap-4 select-none overflow-hidden z-0">
          {/* Ambient glow effects */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute top-1/4 left-1/3 w-[200px] h-[200px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="p-4 rounded-full bg-white/5 border border-white/10 relative z-10 shadow-lg">
            <Calendar className="w-10 h-10 text-white/40 stroke-[1.2]" />
          </div>
          
          <div className="flex flex-col items-center gap-1 relative z-10 text-center px-4">
            <span className="font-semibold text-sm tracking-wider uppercase text-white/50">No Banner Available</span>
            <span className="text-xs text-[#777777]">Please check back later or contact the organizer</span>
          </div>
        </div>
      )}

      {/* Status Badge overlay */}
      <div className="absolute top-6 right-6 z-20">
        <span className={`px-4 py-1.5 text-xs font-bold rounded-full uppercase tracking-wider backdrop-blur-md shadow-lg ${
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
