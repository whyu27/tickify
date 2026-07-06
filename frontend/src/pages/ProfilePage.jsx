import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import useWeb3 from '../hooks/useWeb3';
import { User, Mail, Shield, Wallet, Calendar, Edit, Globe, LogOut } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const { connectWallet, disconnectWallet, switchWallet, connectionStatus } = useWeb3();

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
      {!user && (
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-650 mx-auto"></div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading profil...</p>
          </div>
        </div>
      )}

      {/* Profile Details */}
      {user && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Avatar & Basic Info */}
          <div className="bg-white dark:bg-zinc-800 border border-gray-250 dark:border-zinc-700 rounded-3xl p-6 text-center shadow-sm space-y-4">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-650 text-white rounded-full flex items-center justify-center font-black text-3xl mx-auto shadow-md">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {user.name}
              </h2>
              <span className="inline-block px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full border border-purple-100 dark:border-purple-900/20">
                {user.role}
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
                    <p className="text-sm font-semibold text-gray-900 dark:text-zinc-200">{user.name}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-gray-50 dark:bg-zinc-900/40 border border-gray-100 dark:border-zinc-700 text-purple-600 dark:text-purple-400 rounded-xl flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Alamat Email</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-zinc-200">{user.email}</p>
                  </div>
                </div>

                {/* Role */}
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-gray-50 dark:bg-zinc-900/40 border border-gray-100 dark:border-zinc-700 text-purple-600 dark:text-purple-400 rounded-xl flex-shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Peran (Role)</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-zinc-200 capitalize">{user.role}</p>
                  </div>
                </div>

                {/* Created At */}
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-gray-50 dark:bg-zinc-900/40 border border-gray-100 dark:border-zinc-700 text-purple-600 dark:text-purple-400 rounded-xl flex-shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Bergabung Sejak</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-zinc-200">{formatDate(user.created_at)}</p>
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
                    <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">
                      {user.wallet_address ? 'Wallet Address' : 'Status'}
                    </p>
                    <p className="text-sm font-mono font-semibold text-gray-900 dark:text-zinc-200 break-all bg-gray-50 dark:bg-zinc-900/30 p-2 rounded-lg border border-gray-100 dark:border-zinc-700/50">
                      {user.wallet_address || 'No wallet connected'}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  {user.wallet_address ? (
                    <>
                      <button
                        onClick={switchWallet}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                      >
                        <Globe className="w-4 h-4" />
                        <span>Switch Wallet</span>
                      </button>
                      <button
                        onClick={disconnectWallet}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-650 hover:bg-red-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Disconnect Wallet</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={connectWallet}
                      disabled={connectionStatus === 'connecting'}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm rounded-xl shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
                    >
                      <Globe className="w-4 h-4" />
                      <span>{connectionStatus === 'connecting' ? 'Connecting...' : 'Connect Wallet'}</span>
                    </button>
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
