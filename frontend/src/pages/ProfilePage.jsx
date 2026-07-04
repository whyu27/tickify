import { useState, useEffect } from 'react';
import api from '../api/axios';
import { User, Mail, Shield, Wallet, Calendar, AlertCircle, Edit, Globe } from 'lucide-react';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [walletConnectMsg, setWalletConnectMsg] = useState('');

  const fetchProfile = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await api.get('/auth/profile');
      if (response.data && response.data.success) {
        setProfile(response.data.data);
      } else {
        setErrorMsg(response.data?.message || 'Gagal mengambil data profil.');
      }
    } catch (error) {
      console.error('Fetch profile error:', error);
      const msg = error.response?.data?.message || 'Terjadi kesalahan pada server saat memuat profil.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('id-ID', {
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

  const handleConnectWallet = () => {
    setWalletConnectMsg('Integrasi dompet MetaMask akan segera hadir.');
    setTimeout(() => {
      setWalletConnectMsg('');
    }, 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Profile Settings
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage your account information and linked Web3 wallets.
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-650 mx-auto"></div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading profil...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {!isLoading && errorMsg && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-650 dark:text-red-400 p-6 rounded-2xl flex items-start gap-4">
          <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="font-bold">Error Memuat Profil</h3>
            <p className="text-sm">{errorMsg}</p>
            <button
              onClick={fetchProfile}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      )}

      {/* Profile Details */}
      {!isLoading && !errorMsg && profile && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Avatar & Basic Info */}
          <div className="bg-white dark:bg-zinc-800 border border-gray-250 dark:border-zinc-700 rounded-3xl p-6 text-center shadow-sm space-y-4">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-650 text-white rounded-full flex items-center justify-center font-black text-3xl mx-auto shadow-md">
              {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {profile.name}
              </h2>
              <span className="inline-block px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full border border-purple-100 dark:border-purple-900/20">
                {profile.role}
              </span>
            </div>

            <hr className="border-gray-100 dark:border-zinc-700" />

            <div className="pt-2">
              <button
                disabled
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm font-semibold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-zinc-800/50 cursor-not-allowed"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          {/* Right Column: Detailed Info Form fields */}
          <div className="md:col-span-2 space-y-6">
            {/* Account Information Card */}
            <div className="bg-white dark:bg-zinc-800 border border-gray-250 dark:border-zinc-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-zinc-700 pb-3">
                Informasi Akun
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-gray-50 dark:bg-zinc-900/40 border border-gray-100 dark:border-zinc-700 text-purple-600 dark:text-purple-400 rounded-xl flex-shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Nama Lengkap</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-zinc-200">{profile.name}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-gray-50 dark:bg-zinc-900/40 border border-gray-100 dark:border-zinc-700 text-purple-600 dark:text-purple-400 rounded-xl flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Alamat Email</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-zinc-200">{profile.email}</p>
                  </div>
                </div>

                {/* Role */}
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-gray-50 dark:bg-zinc-900/40 border border-gray-100 dark:border-zinc-700 text-purple-600 dark:text-purple-400 rounded-xl flex-shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Peran (Role)</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-zinc-200 capitalize">{profile.role}</p>
                  </div>
                </div>

                {/* Created At */}
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-gray-50 dark:bg-zinc-900/40 border border-gray-100 dark:border-zinc-700 text-purple-600 dark:text-purple-400 rounded-xl flex-shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Bergabung Sejak</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-zinc-200">{formatDate(profile.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Web3 Wallet Card */}
            <div className="bg-white dark:bg-zinc-800 border border-gray-250 dark:border-zinc-700 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-700 pb-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Web3 Wallet Address
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-gray-50 dark:bg-zinc-900/40 border border-gray-100 dark:border-zinc-700 text-purple-600 dark:text-purple-400 rounded-xl flex-shrink-0">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 flex-grow min-w-0">
                    <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Alamat Wallet Terhubung</p>
                    <p className="text-sm font-mono font-semibold text-gray-900 dark:text-zinc-200 break-all bg-gray-50 dark:bg-zinc-900/30 p-2 rounded-lg border border-gray-100 dark:border-zinc-700/50">
                      {profile.wallet_address || 'Belum Terhubung'}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-3">
                  <button
                    onClick={handleConnectWallet}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Connect Wallet</span>
                  </button>

                  {walletConnectMsg && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-250 dark:border-amber-800 text-amber-850 dark:text-amber-400 rounded-xl text-xs">
                      {walletConnectMsg}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
