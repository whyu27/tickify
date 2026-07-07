import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../api/axios';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'organizer' ? 'organizer' : 'participant';

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(initialRole);

  // Validation and request states
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setBackendError('');
    setSuccessMessage('');

    // Frontend validation
    const tempErrors = {};
    if (!name.trim()) {
      tempErrors.name = 'Nama wajib diisi';
    }

    if (!email.trim()) {
      tempErrors.email = 'Email wajib diisi';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        tempErrors.email = 'Format email tidak valid';
      }
    }

    if (!password) {
      tempErrors.password = 'Password wajib diisi';
    } else if (password.length < 8) {
      tempErrors.password = 'Password minimal 8 karakter';
    }

    if (!role) {
      tempErrors.role = 'Role wajib dipilih';
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/auth/register', {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });

      if (response.data && response.data.success) {
        setSuccessMessage('Registrasi berhasil! Mengalihkan ke halaman login...');
        // Clear fields on success
        setName('');
        setEmail('');
        setPassword('');

        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setBackendError(response.data?.message || 'Registrasi gagal');
      }
    } catch (error) {
      console.error('Register error:', error);
      const msg = error.response?.data?.message || 'Terjadi kesalahan pada server';
      setBackendError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#A0A0A0] hover:text-white transition-all duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to Login</span>
        </Link>
      </div>

      {/* Background Glow Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-md w-full space-y-6 bg-[#161616] p-8 rounded-2xl border border-white/8 shadow-sm">

        {/* Brand Logo & Welcome */}
        <div className="text-center">
          <div className="flex justify-center items-center gap-2 mb-2">
            <span className="text-3xl font-bold tracking-tight text-white">
              Tickify
            </span>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-white">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-[#A0A0A0]">
            Join Tickify and start exploring events
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] p-3 rounded-xl text-sm text-center">
            {successMessage}
          </div>
        )}

        {/* Backend Error Alert */}
        {backendError && (
          <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] p-3 rounded-xl text-sm text-center">
            {backendError}
          </div>
        )}

        {/* Form */}
        <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading || !!successMessage}
                className={`appearance-none block w-full h-12 px-4 py-3 border rounded-xl placeholder-[#777777] focus:outline-none focus:border-white/25 text-base bg-transparent text-white transition-all duration-200 ${
                  errors.name ? 'border-[#EF4444]' : 'border-white/8 hover:border-white/15'
                }`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-2 text-xs text-[#EF4444]">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || !!successMessage}
                className={`appearance-none block w-full h-12 px-4 py-3 border rounded-xl placeholder-[#777777] focus:outline-none focus:border-white/25 text-base bg-transparent text-white transition-all duration-200 ${
                  errors.email ? 'border-[#EF4444]' : 'border-white/8 hover:border-white/15'
                }`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-2 text-xs text-[#EF4444]">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || !!successMessage}
                className={`appearance-none block w-full h-12 px-4 py-3 border rounded-xl placeholder-[#777777] focus:outline-none focus:border-white/25 text-base bg-transparent text-white transition-all duration-200 ${
                  errors.password ? 'border-[#EF4444]' : 'border-white/8 hover:border-white/15'
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-2 text-xs text-[#EF4444]">{errors.password}</p>
              )}
            </div>

            {/* Role Field */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-white mb-2">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={isLoading || !!successMessage}
                className="block w-full h-12 px-4 py-3 border border-white/8 rounded-xl focus:outline-none focus:border-white/25 text-base bg-[#161616] text-white hover:border-white/15 transition-all duration-200"
              >
                <option value="participant" className="text-white bg-[#161616]">
                  Participant
                </option>
                <option value="organizer" className="text-white bg-[#161616]">
                  Organizer
                </option>
              </select>
              {errors.role && (
                <p className="mt-2 text-xs text-[#EF4444]">{errors.role}</p>
              )}
            </div>

          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !!successMessage}
              className={`group relative w-full flex justify-center h-12 px-4 py-3 border border-transparent text-base font-semibold rounded-xl text-black bg-white hover:bg-[#EAEAEA] focus:outline-none transition-all duration-200 hover:scale-[1.02] ${
                isLoading || !!successMessage ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Creating Account...' : 'Register'}
            </button>
          </div>
        </form>

        {/* Footer/Navigation link */}
        <div className="text-center text-sm text-[#A0A0A0] mt-6">
          Sudah punya akun?{' '}
          <Link to="/login" className="font-semibold text-white hover:text-[#EAEAEA] transition-colors duration-200">
            Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
