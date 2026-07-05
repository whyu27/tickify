import { useState } from 'react';
import { QrCode, Search, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import OrganizerNavbar from '../../components/organizer/OrganizerNavbar';
import useQRScanner from '../../hooks/useQRScanner';
import api from '../../api/axios';

const ValidatorPage = () => {
  const [ticketId, setTicketId] = useState('');
  const [verificationData, setVerificationData] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  // Handle QR scan success
  const handleScanSuccess = (decodedText) => {
    console.log('QR Code scanned:', decodedText);
    // Remove any '#' prefix if present and verify
    const cleanTicketId = decodedText.replace('#', '').trim();
    handleVerifyTicket(cleanTicketId);
  };

  // QR Scanner hook
  const { isScanning, error: scannerError, toggleScanner } = useQRScanner(handleScanSuccess);

  // Verify ticket via API
  const handleVerifyTicket = async (ticketIdToVerify = null) => {
    const idToVerify = ticketIdToVerify || ticketId.replace('#', '').trim();

    if (!idToVerify) {
      setErrorMessage('Please enter a ticket ID');
      return;
    }

    setIsVerifying(true);
    setErrorMessage('');
    setSuccessMessage('');
    setVerificationData(null);

    try {
      const response = await api.post('/tickets/verify', {
        ticketIdOnChain: idToVerify,
      });

      if (response.data.success) {
        setVerificationData(response.data.data);
        setSuccessMessage('Ticket verified successfully');
      } else {
        setErrorMessage(response.data.message || 'Failed to verify ticket');
      }
    } catch (error) {
      console.error('Verification error:', error);
      const msg = error.response?.data?.message || 'Failed to verify ticket. Please try again.';
      setErrorMessage(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  // Check in ticket via API
  const handleCheckIn = async () => {
    if (!verificationData || verificationData.status !== 'active') {
      return;
    }

    setIsCheckingIn(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await api.post('/tickets/check-in', {
        ticketIdOnChain: verificationData.ticketId,
      });

      if (response.data.success) {
        setSuccessMessage('Ticket checked in successfully!');
        // Update verification data to reflect new status
        setVerificationData({
          ...verificationData,
          status: 'used',
        });
      } else {
        setErrorMessage(response.data.message || 'Failed to check in ticket');
      }
    } catch (error) {
      console.error('Check-in error:', error);
      const msg = error.response?.data?.message || 'Failed to check in ticket. Please try again.';
      setErrorMessage(msg);
    } finally {
      setIsCheckingIn(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'active':
        return {
          label: 'Active',
          color: 'text-[#22C55E]',
          bgColor: 'bg-[#22C55E]/10',
          borderColor: 'border-[#22C55E]/20',
          icon: CheckCircle2,
        };
      case 'used':
        return {
          label: 'Used',
          color: 'text-[#FACC15]',
          bgColor: 'bg-[#FACC15]/10',
          borderColor: 'border-[#FACC15]/20',
          icon: Clock,
        };
      case 'invalid':
        return {
          label: 'Invalid',
          color: 'text-[#EF4444]',
          bgColor: 'bg-[#EF4444]/10',
          borderColor: 'border-[#EF4444]/20',
          icon: XCircle,
        };
      default:
        return {
          label: 'Unknown',
          color: 'text-[#777777]',
          bgColor: 'bg-[#777777]/10',
          borderColor: 'border-[#777777]/20',
          icon: XCircle,
        };
    }
  };

  const statusConfig = verificationData ? getStatusConfig(verificationData.status) : null;
  const StatusIcon = statusConfig?.icon;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Navbar */}
      <OrganizerNavbar />

      {/* Main Content */}
      <div className="py-12">
        <div className="max-w-[1280px] mx-auto px-6">
          {/* Hero Section */}
          <div className="flex flex-col items-center text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ticket Validator
            </h1>
            <p className="max-w-2xl text-base md:text-lg text-[#A0A0A0]">
              Verify blockchain tickets quickly and securely.
            </p>
          </div>

          {/* Global Error Message */}
          {errorMessage && (
            <div className="max-w-5xl mx-auto mb-6">
              <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <p className="text-sm text-[#EF4444]">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Global Success Message */}
          {successMessage && (
            <div className="max-w-5xl mx-auto mb-6">
              <div className="bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#22C55E] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <p className="text-sm text-[#22C55E]">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Scanner Error Message */}
          {scannerError && (
            <div className="max-w-5xl mx-auto mb-6">
              <div className="bg-[#FACC15]/10 border border-[#FACC15]/20 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#FACC15] flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                <p className="text-sm text-[#FACC15]">{scannerError}</p>
              </div>
            </div>
          )}

          {/* Main Grid */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* QR Scanner Card */}
            <div className="bg-[#161616] border border-white/8 rounded-2xl p-8 hover:border-white/15 transition-all duration-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-white" strokeWidth={1.5} />
                </div>
                <h2 className="text-xl font-bold text-white">QR Scanner</h2>
              </div>

              {/* Scanner Area */}
              <div className="mb-6">
                <div
                  className={`relative w-full aspect-square rounded-xl border-2 border-dashed overflow-hidden transition-all duration-300 ${isScanning
                      ? 'border-white/25 bg-black'
                      : 'border-white/8 bg-[#0D0D0D]'
                    }`}
                >
                  {/* Scanner container - managed by html5-qrcode, not React */}
                  <div id="qr-reader" className="w-full h-full"></div>
                  
                  {/* Placeholder overlay when not scanning */}
                  {!isScanning && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none">
                      <QrCode className="w-16 h-16 text-[#555555]" strokeWidth={1.5} />
                      <p className="text-sm text-[#777777]">Scanner inactive</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Scanner Button */}
              <button
                onClick={toggleScanner}
                disabled={isVerifying}
                className={`w-full py-3 text-base font-semibold rounded-xl transition-all duration-200 ${isScanning
                    ? 'text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 hover:bg-[#EF4444]/15'
                    : 'text-black bg-white hover:bg-[#EAEAEA] hover:scale-105'
                  } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
              >
                {isScanning ? 'Stop Scanner' : 'Start Scanner'}
              </button>
            </div>

            {/* Manual Verification Card */}
            <div className="bg-[#161616] border border-white/8 rounded-2xl p-8 hover:border-white/15 transition-all duration-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" strokeWidth={1.5} />
                </div>
                <h2 className="text-xl font-bold text-white">Manual Verification</h2>
              </div>

              {/* Input Section */}
              <div className="mb-6">
                <label htmlFor="ticketId" className="block text-sm font-semibold text-white mb-2">
                  NFT Ticket ID
                </label>
                <input
                  type="text"
                  id="ticketId"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && ticketId.trim() && !isVerifying) {
                      handleVerifyTicket();
                    }
                  }}
                  placeholder="e.g. 12345"
                  disabled={isVerifying || isScanning}
                  className="w-full h-12 px-4 rounded-xl border border-white/8 bg-transparent text-white placeholder:text-[#777777] focus:outline-none focus:border-white/15 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Verify Button */}
              <button
                onClick={() => handleVerifyTicket()}
                disabled={!ticketId.trim() || isVerifying || isScanning}
                className="w-full py-3 text-base font-semibold text-black bg-white rounded-xl hover:bg-[#EAEAEA] hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isVerifying ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
                    Verifying...
                  </span>
                ) : (
                  'Verify Ticket'
                )}
              </button>

              {/* Info */}
              <p className="mt-4 text-sm text-[#777777] text-center">
                Enter the ticket ID to verify manually
              </p>
            </div>
          </div>

          {/* Verification Result Card */}
          {verificationData && (
            <div className="max-w-5xl mx-auto">
              <div className="bg-[#161616] border border-white/8 rounded-2xl p-8 hover:border-white/15 transition-all duration-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Verification Result</h2>
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.bgColor} border ${statusConfig.borderColor}`}
                  >
                    <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} strokeWidth={2} />
                    <span className={`text-sm font-semibold ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                </div>

                {/* Result Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Event Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#777777] mb-2">
                      Event Name
                    </label>
                    <p className="text-base font-semibold text-white">
                      {verificationData.eventName || 'N/A'}
                    </p>
                  </div>

                  {/* Wallet Address */}
                  <div>
                    <label className="block text-sm font-medium text-[#777777] mb-2">
                      Wallet Address
                    </label>
                    <p className="text-base font-mono text-white break-all">
                      {verificationData.walletAddress || 'N/A'}
                    </p>
                  </div>

                  {/* NFT Ticket ID */}
                  <div>
                    <label className="block text-sm font-medium text-[#777777] mb-2">
                      NFT Ticket ID
                    </label>
                    <p className="text-base font-semibold text-white">
                      #{verificationData.ticketId}
                    </p>
                  </div>

                  {/* Ticket Status */}
                  <div>
                    <label className="block text-sm font-medium text-[#777777] mb-2">
                      Ticket Status
                    </label>
                    <p className={`text-base font-semibold ${statusConfig.color}`}>
                      {statusConfig.label}
                    </p>
                  </div>
                </div>

                {/* Check In Button */}
                <div className="pt-6 border-t border-white/6">
                  <button
                    onClick={handleCheckIn}
                    disabled={verificationData.status !== 'active' || isCheckingIn}
                    className="w-full md:w-auto px-8 py-3 text-base font-semibold text-black bg-white rounded-xl hover:bg-[#EAEAEA] hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isCheckingIn ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="inline-block w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
                        Checking In...
                      </span>
                    ) : (
                      'Check In'
                    )}
                  </button>
                  {verificationData.status !== 'active' && (
                    <p className="mt-3 text-sm text-[#777777]">
                      Check-in is only available for active tickets
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValidatorPage;
