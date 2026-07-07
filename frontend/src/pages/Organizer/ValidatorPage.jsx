import { useState, useEffect } from 'react';
import { QrCode, Search, CheckCircle2, XCircle, Clock, AlertCircle, ScanLine, Activity, Ticket, Check } from 'lucide-react';
import OrganizerNavbar from '../../components/organizer/OrganizerNavbar';
import useQRScanner from '../../hooks/useQRScanner';
import api from '../../api/axios';

const ValidatorPage = () => {
  useEffect(() => {
    document.title = 'Ticket Validator — Tickify';
  }, []);
  const [ticketId, setTicketId] = useState('');
  const [verificationData, setVerificationData] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStep, setVerifyStep] = useState(1);
  const [hasConfirmedCheckIn, setHasConfirmedCheckIn] = useState(false);
  const [recentCheckins, setRecentCheckins] = useState([]);

  // Handle timer triggers for visual verification progress stages
  useEffect(() => {
    if (!isVerifying) {
      setVerifyStep(1);
      return;
    }

    // Step 1: Reading Ticket Data (⏳)
    // Step 2: Verifying NFT Ownership (⏳) after 800ms
    const timer1 = setTimeout(() => {
      setVerifyStep(2);
    }, 800);

    // Step 3: Checking Check-in Status (⏳) after 2500ms
    const timer2 = setTimeout(() => {
      setVerifyStep(3);
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isVerifying]);

  // Verify ticket via API
  const handleVerifyTicket = async (ticketIdToVerify = null) => {
    if (isVerifying) return; // Prevent multiple concurrent verification requests

    const idToVerify = ticketIdToVerify !== null ? String(ticketIdToVerify).replace('#', '').trim() : ticketId.replace('#', '').trim();

    if (!idToVerify) {
      setVerificationData({ success: false, reason: 'Please enter a ticket ID' });
      return;
    }

    setIsVerifying(true);
    setVerificationData(null);
    setHasConfirmedCheckIn(false);

    try {
      const response = await api.post('/tickets/verify', {
        ticketIdOnChain: idToVerify,
      });

      // Clear manual input on verification attempt
      setTicketId('');

      if (response.data.success) {
        setVerificationData(response.data);
      } else {
        // Failed database or blockchain verification
        setVerificationData({
          success: false,
          reason: response.data.reason || 'Invalid Ticket'
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      const msg = error.response?.data?.reason || error.response?.data?.message || 'Failed to verify ticket. Please try again.';
      setVerificationData({
        success: false,
        reason: msg
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle QR scan success
  const handleScanSuccess = (decodedText) => {
    if (isVerifying) {
      console.log('Verification in progress, ignoring scan request.');
      return;
    }
    console.log('QR Code scanned:', decodedText);
    let idToVerify = decodedText;
    try {
      const parsed = JSON.parse(decodedText);
      if (parsed && (parsed.tokenId !== undefined || parsed.ticketId !== undefined)) {
        idToVerify = parsed.tokenId || parsed.ticketId;
      }
    } catch {
      // Not a JSON string, fallback to cleaning up string
      idToVerify = decodedText.replace('#', '').trim();
    }

    // Automatically trigger verification with parsed ID
    handleVerifyTicket(idToVerify);
  };

  // QR Scanner hook
  const { isScanning, error: scannerError, toggleScanner } = useQRScanner(handleScanSuccess);

  const handleConfirmCheckIn = () => {
    setHasConfirmedCheckIn(true);
    if (verificationData?.ticket) {
      const newCheckin = {
        id: verificationData.ticket.ticketId,
        wallet: verificationData.ticket.walletAddress,
        time: new Date().toISOString(),
        status: 'Success'
      };
      setRecentCheckins(prev => [newCheckin, ...prev].slice(0, 5));
    }
  };

  const formatWIBDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);

      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];

      const day = String(date.getDate()).padStart(2, '0');
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${day} ${month} ${year} ${hours}:${minutes} WIB`;
    } catch {
      return dateString;
    }
  };

  const formatWalletAddress = (addr) => {
    if (!addr) return '';
    if (addr.length <= 12) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-sans text-white">
      {/* Navbar */}
      <OrganizerNavbar />

      {/* Main Content */}
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          {/* Hero Section / Header */}
          <div className="flex flex-col items-center text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Ticket Validator
            </h1>
            <p className="max-w-xl text-[#A0A0A0] text-lg">
              Verify blockchain tickets quickly and securely.
            </p>
          </div>

          {/* Scanner Error Message */}
          {scannerError && (
            <div className="max-w-md mx-auto mb-8 animate-in fade-in">
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-500">{scannerError}</p>
              </div>
            </div>
          )}

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left Column: QR Scanner */}
            <div className="lg:col-span-5">

              {/* QR Scanner Card */}
              <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                      <ScanLine className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold">QR Scanner</h2>
                  </div>
                  {/* Status Indicator */}
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${isScanning ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-white/5 border-white/10 text-[#777777]'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${isScanning ? 'bg-emerald-500 animate-pulse' : 'bg-[#777777]'}`} />
                    {isScanning ? 'Scanner Active' : 'Scanner Inactive'}
                  </div>
                </div>

                {/* Scanner Area */}
                <div className="mb-6">
                  <div
                    className={`relative w-full aspect-square rounded-xl border-2 overflow-hidden transition-all duration-300 ${isScanning
                      ? 'border-emerald-500/30 bg-black shadow-[0_0_30px_rgba(16,185,129,0.1)]'
                      : 'border-white/10 border-dashed bg-[#0D0D0D]'
                      }`}
                  >
                    <div id="qr-reader" className="w-full h-full"></div>
                    {!isScanning && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
                        <QrCode className="w-12 h-12 text-[#444444]" strokeWidth={1.5} />
                        <p className="text-sm text-[#666666] font-medium">Ready to scan</p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={toggleScanner}
                  disabled={isVerifying}
                  className={`w-full py-3.5 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${isScanning
                    ? 'text-red-500 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20'
                    : 'text-black bg-white hover:bg-gray-200'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isScanning ? (
                    <>Stop Scanner</>
                  ) : (
                    <>
                      <ScanLine className="w-4 h-4" />
                      Start Scanner
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Right Column: Manual Verify & Result */}
            <div className="lg:col-span-7 space-y-6">

              {/* Manual Verification */}
              <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold">Manual Verification</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      value={ticketId}
                      onChange={(e) => setTicketId(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && ticketId.trim() && !isVerifying) {
                          handleVerifyTicket();
                        }
                      }}
                      placeholder="Enter NFT Ticket ID..."
                      disabled={isVerifying || isScanning}
                      className="w-full h-12 px-4 rounded-xl border border-white/10 bg-black/50 text-white placeholder:text-[#555555] focus:outline-none focus:border-white/30 focus:bg-black transition-all duration-200 disabled:opacity-50 text-sm"
                    />
                  </div>
                  <button
                    onClick={() => handleVerifyTicket()}
                    disabled={!ticketId.trim() || isVerifying || isScanning}
                    className="w-full py-3.5 text-sm font-semibold text-black bg-white border border-white/10 rounded-xl hover:bg-white/80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isVerifying ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                        Verifying...
                      </>
                    ) : (
                      'Verify Ticket'
                    )}
                  </button>
                </div>
              </div>

              {/* Verification Result Card or Loading State */}
              {isVerifying ? (
                <div className="bg-[#121212] border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-6 min-h-[300px] backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Glowing Spinner */}
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-white/5 animate-pulse" />
                    <div className="w-10 h-10 border-4 border-transparent border-t-white border-r-white/20 border-b-white/10 border-l-white/40 rounded-full animate-spin" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white tracking-tight">Verifying Ticket</h3>
                    <div className="text-sm text-[#A0A0A0] max-w-sm mx-auto leading-relaxed">
                      <p>Please wait while we verify the NFT ticket and blockchain information.</p>
                      <p className="text-[#777777] text-xs font-medium mt-1">This usually takes a few seconds.</p>
                    </div>
                  </div>

                  {/* Visual Progress Steps */}
                  <div className="w-full bg-white/2 border border-white/8 rounded-xl p-5 text-left space-y-3.5 mt-2">
                    {/* Step 1: Reading Ticket Data */}
                    <div className={`flex items-center gap-2.5 transition-all duration-300 ${verifyStep >= 1 ? 'opacity-100' : 'opacity-40'}`}>
                      <span className="text-base flex-shrink-0 w-5 h-5 flex items-center justify-center">
                        {verifyStep > 1 ? (
                          <span className="text-emerald-400 font-bold">✓</span>
                        ) : (
                          <span className="text-amber-400 animate-pulse">⏳</span>
                        )}
                      </span>
                      <span className={`text-sm ${verifyStep > 1 ? 'text-white/80' : 'text-white font-semibold'}`}>
                        Reading Ticket Data
                      </span>
                    </div>

                    {/* Step 2: Verifying NFT Ownership */}
                    <div className={`flex items-center gap-2.5 transition-all duration-300 ${verifyStep >= 2 ? 'opacity-100' : 'opacity-45'}`}>
                      <span className="text-base flex-shrink-0 w-5 h-5 flex items-center justify-center">
                        {verifyStep > 2 ? (
                          <span className="text-emerald-400 font-bold">✓</span>
                        ) : verifyStep === 2 ? (
                          <span className="text-amber-400 animate-pulse">⏳</span>
                        ) : (
                          <span className="text-[#555555]">○</span>
                        )}
                      </span>
                      <span className={`text-sm ${verifyStep > 2 ? 'text-white/80' : verifyStep === 2 ? 'text-white font-semibold' : 'text-white/40'}`}>
                        Verifying NFT Ownership
                      </span>
                    </div>

                    {/* Step 3: Checking Check-in Status */}
                    <div className={`flex items-center gap-2.5 transition-all duration-300 ${verifyStep >= 3 ? 'opacity-100' : 'opacity-45'}`}>
                      <span className="text-base flex-shrink-0 w-5 h-5 flex items-center justify-center">
                        {verifyStep === 3 ? (
                          <span className="text-amber-400 animate-pulse">⏳</span>
                        ) : (
                          <span className="text-[#555555]">○</span>
                        )}
                      </span>
                      <span className={`text-sm ${verifyStep === 3 ? 'text-white font-semibold' : 'text-white/40'}`}>
                        Checking Check-in Status
                      </span>
                    </div>
                  </div>
                </div>
              ) : verificationData ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

                  {/* VALID TICKET */}
                  {verificationData.success && verificationData.status === 'valid' && (
                    <div className="bg-[#121212] border border-emerald-500/30 rounded-2xl p-8 shadow-[0_0_40px_rgba(16,185,129,0.05)] relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0 opacity-50" />

                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 shrink-0 mt-1">
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-white mb-1">
                              {hasConfirmedCheckIn ? 'Check-in Successful' : 'Verification Successful'}
                            </h2>
                            <p className="text-[#A0A0A0] text-sm">Valid blockchain ticket found</p>
                          </div>
                        </div>

                        <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold tracking-widest flex items-center gap-1.5 shrink-0 ${hasConfirmedCheckIn ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'}`}>
                          {hasConfirmedCheckIn ? (
                            <>
                              <Check className="w-3.5 h-3.5" strokeWidth={3} />
                              CHECKED IN
                            </>
                          ) : (
                            'VALID'
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-8 p-6 bg-black/40 rounded-xl border border-white/5">
                        <div>
                          <span className="text-xs text-[#777777] uppercase tracking-wider block mb-1">Token ID</span>
                          <div className="flex items-center gap-2">
                            <Ticket className="w-4 h-4 text-[#A0A0A0]" />
                            <span className="text-lg font-semibold text-white">
                              #{verificationData.ticket.ticketId || 'N/A'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-[#777777] uppercase tracking-wider block mb-1">Wallet Address</span>
                          <span className="text-base font-mono text-white block">
                            {formatWalletAddress(verificationData.ticket.walletAddress)}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-[#777777] uppercase tracking-wider block mb-1">Status</span>
                          <span className="text-emerald-500 font-medium text-sm flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                            Ready for Check-in
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-[#777777] uppercase tracking-wider block mb-1">Time</span>
                          <span className="text-white text-sm">
                            {formatWIBDate(new Date().toISOString())}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleConfirmCheckIn}
                        disabled={hasConfirmedCheckIn}
                        className={`w-full py-4 text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${hasConfirmedCheckIn
                          ? 'bg-white/5 text-white/50 border border-white/10 cursor-not-allowed'
                          : 'bg-emerald-500 text-black hover:bg-emerald-400 hover:scale-[1.02] shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                          }`}
                      >
                        {hasConfirmedCheckIn ? (
                          <>
                            <Check className="w-4 h-4" strokeWidth={3} />
                            Checked In
                          </>
                        ) : (
                          'Check In'
                        )}
                      </button>
                    </div>
                  )}

                  {/* ALREADY USED TICKET */}
                  {verificationData.success && verificationData.status === 'used' && (
                    <div className="bg-[#121212] border border-yellow-500/30 rounded-2xl p-8 shadow-[0_0_40px_rgba(234,179,8,0.05)] relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500/0 via-yellow-500 to-yellow-500/0 opacity-50" />

                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center border border-yellow-500/20 shrink-0 mt-1">
                            <Clock className="w-6 h-6 text-yellow-500" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-white mb-1">Already Checked In</h2>
                            <p className="text-[#A0A0A0] text-sm">This ticket has already been used</p>
                          </div>
                        </div>

                        <div className="px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-xs font-bold tracking-widest shrink-0">
                          USED
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 p-6 bg-black/40 rounded-xl border border-white/5">
                        <div>
                          <span className="text-xs text-[#777777] uppercase tracking-wider block mb-1">Token ID</span>
                          <div className="flex items-center gap-2">
                            <Ticket className="w-4 h-4 text-[#A0A0A0]" />
                            <span className="text-lg font-semibold text-white">
                              #{verificationData.ticket.ticketId || 'N/A'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-[#777777] uppercase tracking-wider block mb-1">Wallet Address</span>
                          <span className="text-base font-mono text-white block">
                            {formatWalletAddress(verificationData.ticket.walletAddress)}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-xs text-[#777777] uppercase tracking-wider block mb-1">Previous Check-in Time</span>
                          <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 w-fit px-3 py-1.5 rounded-lg border border-yellow-500/20">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {formatWIBDate(verificationData.usedAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* INVALID TICKET */}
                  {!verificationData.success && (
                    <div className="bg-[#121212] border border-red-500/30 rounded-2xl p-8 shadow-[0_0_40px_rgba(239,68,68,0.05)] relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/0 via-red-500 to-red-500/0 opacity-50" />

                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 shrink-0 mt-1">
                            <XCircle className="w-6 h-6 text-red-500" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-white mb-1">Verification Failed</h2>
                            <p className="text-[#A0A0A0] text-sm">Ticket could not be validated</p>
                          </div>
                        </div>

                        <div className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-bold tracking-widest shrink-0">
                          INVALID
                        </div>
                      </div>

                      <div className="p-6 bg-red-500/5 rounded-xl border border-red-500/10 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs text-red-500/70 uppercase tracking-wider block mb-1">Reason</span>
                          <span className="text-base font-medium text-red-400">
                            {verificationData.reason || 'Invalid Ticket'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Empty state for Result */
                <div className="bg-[#121212] border border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px] text-center backdrop-blur-sm">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <ScanLine className="w-8 h-8 text-[#555555]" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Waiting for Scan</h3>
                  <p className="text-sm text-[#777777] max-w-sm">
                    Scan a QR code or enter a ticket ID manually to see the verification result here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidatorPage;
