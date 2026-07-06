import { Calendar, MapPin } from 'lucide-react';

const EventInfo = ({ event }) => {
  if (!event) return null;

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="bg-[#161616] border border-white/8 rounded-2xl p-6 md:p-8 space-y-6">
      {/* Title & Organizer */}
      <div className="space-y-4">
        {event.category_name && (
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold bg-white/5 border border-white/8 text-[#A0A0A0] rounded-full">
            {event.category_name}
          </span>
        )}
        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
          {event.title}
        </h1>

        {event.organizer_name && (
          <div className="flex items-center gap-3 pt-2">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/8 text-white flex items-center justify-center font-bold">
              {event.organizer_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-[#777777] font-semibold uppercase tracking-wider">Organized by</p>
              <p className="text-sm font-semibold text-white">{event.organizer_name}</p>
            </div>
          </div>
        )}
      </div>

      <hr className="border-white/6" />

      {/* Core Details (Date/Time & Location) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/5 border border-white/8 rounded-xl text-white">
            <Calendar className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-[#777777] font-semibold uppercase tracking-wider">Date & Time</p>
            <p className="text-sm font-medium text-white">{formatDate(event.event_date)}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/5 border border-white/8 rounded-xl text-white">
            <MapPin className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-[#777777] font-semibold uppercase tracking-wider">Location</p>
            <p className="text-sm font-medium text-white">{event.location}</p>
          </div>
        </div>
      </div>

      <hr className="border-white/6" />

      {/* Description */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Description</h3>
        <p className="text-[#A0A0A0] text-sm md:text-base leading-relaxed whitespace-pre-wrap">
          {event.description || 'No description available for this event.'}
        </p>
      </div>
    </div>
  );
};

export default EventInfo;
