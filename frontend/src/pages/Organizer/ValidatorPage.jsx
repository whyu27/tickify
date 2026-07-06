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

  // Handle QR scan success
  const handleScanSuccess = (decodedText) => {
    console.log('QR Code scanned:', decodedText);
    let idToVerify = decodedText;
    try {
      const parsed = JSON.parse(decodedText);
      if (parsed && (parsed.tokenId !== undefined || parsed.ticketId !== undefined)) {
        idToVerify = parsed.tokenId || parsed.ticketId;
      }
    } catch (e) {
      // Not a JSON string, fallback to cleaning up string
      idToVerify = decodedText.replace('#', '').trim();
    }
    
    // Automatically trigger verification with parsed ID
    handleVerifyTicket(idToVerify);
  };

  // QR Scanner hook
  const { isScanning, error: scannerError, toggleScanner } = useQRScanner(handleScanSuccess);

  // Verify ticket via API
  const handleVerifyTicket = async (ticketIdToVerify = null) => {
    const idToVerify = ticketIdToVerify !== null ? String(ticketIdToVerify).replace('#', '').trim() : ticketId.replace('#', '').trim();

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

      // Clear manual input on verification attempt
      setTicketId('');

      if (response.data.success) {
        setVerificationData(response.data);
        if (response.data.status === 'valid') {
          setSuccessMessage('Ticket verified and checked in successfully!');
        } else if (response.data.status === 'used') {
          setErrorMessage('Ticket already used');
        }
      } else {
        // Failed database or blockchain verification
        setVerificationData({
          success: false,
          reason: response.data.reason || 'Invalid Ticket'
        });
        setErrorMessage(response.data.reason || 'Invalid Ticket');
      }
    } catch (error) {
      console.error('Verification error:', error);
      const msg = error.response?.data?.reason || error.response?.data?.message || 'Failed to verify ticket. Please try again.';
      setVerificationData({
        success: false,
        reason: msg
      });
      setErrorMessage(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  const formatWIBDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${day} ${month} ${year} ${hours}:${minutes} WIB`;
    } catch (err) {
      return dateString;
    }
  };

  const formatWalletAddress = (addr) => {
    if (!addr) return '';
    if (addr.length <= 12) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

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
                  placeholder="e.g. 5"
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
                    Verifying ticket...
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
            <div className="max-w-5xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-5 duration-300">
              {verificationData.success && verificationData.status === 'valid' && (
                /* VALID TICKET CARD */
                <div className="bg-[#161616] border border-emerald-500/20 rounded-2xl p-8 hover:border-emerald-500/30 transition-all duration-200 shadow-[0_8px_30px_rgb(16,185,129,0.05)]">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" strokeWidth={2} />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-emerald-500 uppercase tracking-widest">Verification Result</span>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
                        ✅ VALID TICKET
                      </h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <span className="text-xs text-[#777777] uppercase tracking-wider block">Event</span>
                      <span className="text-base font-semibold text-white mt-1 block">
                        {verificationData.ticket.eventName || 'N/A'}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs text-[#777777] uppercase tracking-wider block">Ticket ID</span>
                      <span className="text-base font-semibold text-white mt-1 block">
                        #{verificationData.ticket.ticketId || 'N/A'}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs text-[#777777] uppercase tracking-wider block">Owner Wallet</span>
                      <span className="text-base font-mono text-white mt-1 block break-all">
                        {formatWalletAddress(verificationData.ticket.walletAddress)}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs text-[#777777] uppercase tracking-wider block">Status</span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 mt-2 font-mono">
                        Active
                      </span>
                    </div>

                    <div>
                      <span className="text-xs text-[#777777] uppercase tracking-wider block">Blockchain</span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 mt-2">
                        Verified
                      </span>
                    </div>

                    <div>
                      <span className="text-xs text-[#777777] uppercase tracking-wider block">Check In</span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 mt-2">
                        Successful
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {verificationData.success && verificationData.status === 'used' && (
                /* ALREADY USED CARD */
                <div className="bg-[#161616] border border-yellow-500/20 rounded-2xl p-8 hover:border-yellow-500/30 transition-all duration-200 shadow-[0_8px_30px_rgb(234,179,8,0.05)]">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                    <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center border border-yellow-500/20">
                      <Clock className="w-5 h-5 text-yellow-500" strokeWidth={2} />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-yellow-500 uppercase tracking-widest">Verification Result</span>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
                        ⚠ Ticket Already Used
                      </h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <span className="text-xs text-[#777777] uppercase tracking-wider block">Event</span>
                      <span className="text-base font-semibold text-white mt-1 block">
                        {verificationData.ticket.eventName || 'N/A'}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs text-[#777777] uppercase tracking-wider block">Ticket ID</span>
                      <span className="text-base font-semibold text-white mt-1 block">
                        #{verificationData.ticket.ticketId || 'N/A'}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs text-[#777777] uppercase tracking-wider block">Checked in at</span>
                      <span className="text-base font-semibold text-white mt-1 block">
                        {formatWIBDate(verificationData.usedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {!verificationData.success && (
                /* INVALID TICKET CARD */
                <div className="bg-[#161616] border border-red-500/20 rounded-2xl p-8 hover:border-red-500/30 transition-all duration-200 shadow-[0_8px_30px_rgb(239,68,68,0.05)]">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                    <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
                      <XCircle className="w-5 h-5 text-red-500" strokeWidth={2} />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-red-500 uppercase tracking-widest">Verification Result</span>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
                        ❌ Invalid Ticket
                      </h2>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs text-[#777777] uppercase tracking-wider block">Reason</span>
                    <span className="text-base font-semibold text-red-500 mt-1 block">
                      {verificationData.reason || 'Invalid Ticket'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValidatorPage;
