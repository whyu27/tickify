import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { ArrowLeft } from 'lucide-react';

const CreateEventPage = () => {
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    eventDate: '',
    priceEth: '',
    quota: '',
    bannerUrl: '',
  });

  // UI States
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    const { title, description, location, eventDate, priceEth, quota, bannerUrl } = formData;

    if (!title.trim()) tempErrors.title = 'Event Title wajib diisi';
    if (!description.trim()) tempErrors.description = 'Description wajib diisi';
    if (!location.trim()) tempErrors.location = 'Location wajib diisi';
    
    if (!eventDate) {
      tempErrors.eventDate = 'Event Date wajib diisi';
    } else {
      const selected = new Date(eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        tempErrors.eventDate = 'Event Date tidak boleh tanggal yang sudah lewat';
      }
    }

    if (!priceEth) {
      tempErrors.priceEth = 'Ticket Price wajib diisi';
    } else {
      const priceNum = Number(priceEth);
      if (isNaN(priceNum) || priceNum <= 0) {
        tempErrors.priceEth = 'Ticket Price harus lebih besar dari 0';
      }
    }

    if (!quota) {
      tempErrors.quota = 'Quota wajib diisi';
    } else {
      const quotaNum = Number(quota);
      if (isNaN(quotaNum) || quotaNum < 1 || !Number.isInteger(quotaNum)) {
        tempErrors.quota = 'Quota minimal 1 dan harus berupa bilangan bulat';
      }
    }

    if (!bannerUrl.trim()) tempErrors.bannerUrl = 'Banner URL wajib diisi';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBackendError('');
    setSuccessMessage('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await api.post('/events', {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        event_date: formData.eventDate,
        price_eth: Number(formData.priceEth),
        quota: Number(formData.quota),
        banner_url: formData.bannerUrl.trim(),
      });

      if (response.data && response.data.success) {
        setSuccessMessage('Event berhasil dibuat!');
        alert('Event berhasil dibuat!'); // Tampilkan notifikasi sederhana
        // Redirect to /dashboard/organizer/events
        navigate('/dashboard/organizer/events');
      } else {
        setBackendError(response.data?.message || 'Gagal membuat event.');
      }
    } catch (error) {
      console.error('Create event error:', error);
      const msg = error.response?.data?.message || 'Terjadi kesalahan pada server';
      setBackendError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header / Back */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-150 dark:hover:bg-zinc-800 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-zinc-55 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Create New Event
        </h1>
      </div>

      {/* Main Form Container */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-200 dark:border-zinc-700 shadow-sm p-6 sm:p-8">
        {/* Alerts */}
        {backendError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
            {backendError}
          </div>
        )}
        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 rounded-xl text-sm font-medium">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Title - Full Width */}
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                Event Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="e.g. Jakarta Web3 Hackathon 2026"
                className={`w-full px-4 py-2.5 rounded-xl border bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all ${
                  errors.title ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 dark:border-zinc-700'
                }`}
              />
              {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
            </div>

            {/* Description - Full Width */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                disabled={isLoading}
                rows={4}
                placeholder="Describe your event, speaker details, rules, etc..."
                className={`w-full px-4 py-2.5 rounded-xl border bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all ${
                  errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 dark:border-zinc-700'
                }`}
              />
              {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="e.g. Jakarta Convention Center"
                className={`w-full px-4 py-2.5 rounded-xl border bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all ${
                  errors.location ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 dark:border-zinc-700'
                }`}
              />
              {errors.location && <p className="mt-1 text-xs text-red-500">{errors.location}</p>}
            </div>

            {/* Event Date */}
            <div>
              <label htmlFor="eventDate" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                Event Date
              </label>
              <input
                type="date"
                id="eventDate"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-4 py-2.5 rounded-xl border bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all ${
                  errors.eventDate ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 dark:border-zinc-700'
                }`}
              />
              {errors.eventDate && <p className="mt-1 text-xs text-red-500">{errors.eventDate}</p>}
            </div>

            {/* Ticket Price (ETH) */}
            <div>
              <label htmlFor="priceEth" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                Ticket Price (ETH)
              </label>
              <input
                type="number"
                id="priceEth"
                name="priceEth"
                step="0.0001"
                min="0.0001"
                value={formData.priceEth}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="e.g. 0.05"
                className={`w-full px-4 py-2.5 rounded-xl border bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all ${
                  errors.priceEth ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 dark:border-zinc-700'
                }`}
              />
              {errors.priceEth && <p className="mt-1 text-xs text-red-500">{errors.priceEth}</p>}
            </div>

            {/* Quota */}
            <div>
              <label htmlFor="quota" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                Quota
              </label>
              <input
                type="number"
                id="quota"
                name="quota"
                min="1"
                step="1"
                value={formData.quota}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="e.g. 100"
                className={`w-full px-4 py-2.5 rounded-xl border bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all ${
                  errors.quota ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 dark:border-zinc-700'
                }`}
              />
              {errors.quota && <p className="mt-1 text-xs text-red-500">{errors.quota}</p>}
            </div>

            {/* Banner URL - Full Width */}
            <div className="md:col-span-2">
              <label htmlFor="bannerUrl" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                Banner URL
              </label>
              <input
                type="text"
                id="bannerUrl"
                name="bannerUrl"
                value={formData.bannerUrl}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="e.g. https://example.com/banner.png"
                className={`w-full px-4 py-2.5 rounded-xl border bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all ${
                  errors.bannerUrl ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 dark:border-zinc-700'
                }`}
              />
              {errors.bannerUrl && <p className="mt-1 text-xs text-red-500">{errors.bannerUrl}</p>}
            </div>

          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100 dark:border-zinc-700">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 border border-gray-350 dark:border-zinc-705 text-sm font-semibold rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700/55 transition-colors cursor-pointer bg-transparent"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-purple-600/10 hover:shadow-purple-600/20 transition-all ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'
              } cursor-pointer`}
            >
              {isLoading ? 'Creating Event...' : 'Create Event'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;
