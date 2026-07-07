import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Validation and request states
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setBackendError('');

    // Frontend validation
    const tempErrors = {};
    if (!email.trim()) {
      tempErrors.email = 'Email wajib diisi';
    }
    if (!password) {
      tempErrors.password = 'Password wajib diisi';
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password,
      });

      if (response.data && response.data.success) {
        const { token, user } = response.data.data;
        // Save token and user details to Context
        login(token, user);

        // Redirect based on role and location state
        const redirectTo = location.state?.redirectTo;
        if (redirectTo && user.role === 'participant') {
          navigate(redirectTo);
        } else if (user.role === 'organizer') {
          navigate('/dashboard/organizer/home');
        } else if (user.role === 'participant') {
          navigate('/participant/home');
        } else {
          navigate('/dashboard');
        }
      } else {
        setBackendError(response.data?.message || 'Login gagal');
      }
    } catch (error) {
      console.error('Login error:', error);
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
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#A0A0A0] hover:text-white transition-all duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to Home</span>
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
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-[#A0A0A0]">
            Login to access your account
          </p>
        </div>

        {/* Backend Error Alert */}
        {backendError && (
          <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] p-3 rounded-xl text-sm text-center">
            {backendError}
          </div>
        )}

        {/* Form */}
        <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            
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
                disabled={isLoading}
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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className={`appearance-none block w-full h-12 px-4 py-3 border rounded-xl placeholder-[#777777] focus:outline-none focus:border-white/25 text-base bg-transparent text-white transition-all duration-200 ${
                  errors.password ? 'border-[#EF4444]' : 'border-white/8 hover:border-white/15'
                }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-2 text-xs text-[#EF4444]">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center h-12 px-4 py-3 border border-transparent text-base font-semibold rounded-xl text-black bg-white hover:bg-[#EAEAEA] focus:outline-none transition-all duration-200 hover:scale-[1.02] ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        {/* Footer/Navigation link */}
        <div className="text-center text-sm text-[#A0A0A0] mt-6">
          Belum punya akun?{' '}
          <Link to="/register" className="font-semibold text-white hover:text-[#EAEAEA] transition-colors duration-200">
            Register
          </Link>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
