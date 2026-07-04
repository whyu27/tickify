import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

const RegisterPage = () => {
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('participant');

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-700">

        {/* Brand Logo & Welcome */}
        <div className="text-center">
          <div className="flex justify-center items-center gap-2 mb-2">
            <span className="text-3xl font-extrabold tracking-tight text-purple-600 dark:text-purple-400">
              🎟️ Tickify
            </span>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            Create Account
          </h2>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 p-3 rounded-lg text-sm text-center">
            {successMessage}
          </div>
        )}

        {/* Backend Error Alert */}
        {backendError && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm text-center">
            {backendError}
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
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
                className={`appearance-none block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-transparent text-gray-900 dark:text-white ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-zinc-600'
                  }`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email-address" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
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
                className={`appearance-none block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-transparent text-gray-900 dark:text-white ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-zinc-600'
                  }`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
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
                className={`appearance-none block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-transparent text-gray-900 dark:text-white ${errors.password ? 'border-red-500' : 'border-gray-300 dark:border-zinc-600'
                  }`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Role Field */}
            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={isLoading || !!successMessage}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-transparent text-gray-900 dark:text-white dark:bg-zinc-800"
              >
                <option value="participant" className="text-gray-900 dark:text-white bg-white dark:bg-zinc-800">
                  Participant
                </option>
                <option value="organizer" className="text-gray-900 dark:text-white bg-white dark:bg-zinc-800">
                  Organizer
                </option>
              </select>
              {errors.role && (
                <p className="mt-1 text-xs text-red-500">{errors.role}</p>
              )}
            </div>

          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading || !!successMessage}
              className={`group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors ${isLoading || !!successMessage ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              {isLoading ? 'Creating Account...' : 'Register'}
            </button>
          </div>
        </form>

        {/* Footer/Navigation link */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          Sudah punya akun?{' '}
          <Link to="/login" className="font-semibold text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300">
            Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
