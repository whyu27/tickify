import { AlertCircle, Calendar } from 'lucide-react';

export const EventLoading = () => {
  return (
    <div className="min-h-[400px] flex items-center justify-center flex-grow w-full">
      <div className="text-center space-y-4">
        <div className="inline-block w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-[#A0A0A0]">Loading event details...</p>
      </div>
    </div>
  );
};

export const EventError = ({ errorMsg, onRetry }) => {
  return (
    <div className="w-full flex items-center justify-center min-h-[400px] flex-grow">
      <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] p-8 rounded-2xl flex flex-col items-center justify-center gap-4 text-center max-w-lg mx-auto w-full my-12 animate-fade-in">
        <AlertCircle className="w-12 h-12 stroke-[1.5]" />
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white">Error Loading Event</h3>
          <p className="text-sm text-[#A0A0A0]">{errorMsg}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 px-6 py-2.5 bg-white text-black font-semibold text-sm rounded-xl hover:bg-[#EAEAEA] transition-all duration-200 cursor-pointer"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export const EventNotFound = () => {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center text-center py-12 w-full">
      <div className="w-16 h-16 bg-white/5 border border-white/8 text-[#A0A0A0] rounded-2xl flex items-center justify-center mb-6">
        <Calendar className="w-8 h-8 stroke-[1.5]" />
      </div>
      <h3 className="text-xl font-bold text-white">Event Not Found</h3>
      <p className="mt-2 text-sm text-[#A0A0A0] max-w-sm">
        The event you are looking for does not exist or may have been deleted.
      </p>
    </div>
  );
};
