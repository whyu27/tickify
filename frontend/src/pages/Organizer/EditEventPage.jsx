import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import { ArrowLeft } from 'lucide-react';
import OrganizerNavbar from '../../components/organizer/OrganizerNavbar';
import ImageUpload from '../../components/ImageUpload';
import { getImageUrl } from '../../utils/imageHelper';

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    eventDate: '',
    priceEth: '',
    quota: '',
    categoryId: '',
  });

  const [existingBannerUrl, setExistingBannerUrl] = useState('');
  const [bannerFile, setBannerFile] = useState(null);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // UI States
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Helper to parse date to YYYY-MM-DD
  const parseDateToYYYYMMDD = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      return '';
    }
  };

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await api.get('/categories');
        if (response.data && response.data.success) {
          setCategories(response.data.data || []);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch initial event data
  useEffect(() => {
    const fetchEvent = async () => {
      setIsInitialLoading(true);
      setBackendError('');
      try {
        const response = await api.get(`/events/${id}`);
        if (response.data && response.data.success) {
          const event = response.data.data;
          setFormData({
            title: event.title || '',
            description: event.description || '',
            location: event.location || '',
            eventDate: parseDateToYYYYMMDD(event.event_date),
            priceEth: event.price_eth || '',
            quota: event.quota || '',
            categoryId: event.category_id || event.category?.id || '',
          });
          setExistingBannerUrl(event.banner_url || '');
        } else {
          setBackendError(response.data?.message || 'Gagal mengambil data event.');
        }
      } catch (error) {
        console.error('Fetch event error:', error);
        const msg = error.response?.data?.message || 'Terjadi kesalahan saat memuat data event.';
        setBackendError(msg);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field error
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    const { title, description, location, eventDate, priceEth, quota, categoryId } = formData;

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

    if (!categoryId) {
      tempErrors.categoryId = 'Category wajib dipilih';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBackendError('');
    setSuccessMessage('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('location', formData.location.trim());
      formDataToSend.append('event_date', formData.eventDate);
      formDataToSend.append('price_eth', Number(formData.priceEth));
      formDataToSend.append('quota', Number(formData.quota));
      formDataToSend.append('category_id', Number(formData.categoryId));
      
      // Only append banner if a new file is selected
      if (bannerFile) {
        formDataToSend.append('banner', bannerFile);
      }

      const response = await api.put(`/events/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.success) {
        setSuccessMessage('Event berhasil diperbarui!');
        alert('Event berhasil diperbarui!');
        navigate('/dashboard/organizer/home');
      } else {
        setBackendError(response.data?.message || 'Gagal memperbarui event.');
      }
    } catch (error) {
      console.error('Update event error:', error);
      const msg = error.response?.data?.message || 'Terjadi kesalahan pada server';
      setBackendError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Navbar */}
      <OrganizerNavbar />

      {/* Main Content */}
      <div className="py-12">
        <div className="max-w-[1280px] mx-auto px-6">

          {/* Page Header */}
          <div className="flex flex-col items-center text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Edit Event
            </h1>
            <p className="max-w-2xl text-base text-[#A0A0A0]">
              Update your blockchain event details on Tickify.
            </p>
          </div>

          {/* Form Card */}
          <div className="max-w-4xl mx-auto bg-[#161616] border border-white/8 rounded-2xl p-8 md:p-12">
            
            {/* Loading Spinner for initial fetch */}
            {isInitialLoading && (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <div className="inline-block w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <p className="text-[#A0A0A0] text-base">Loading event data...</p>
              </div>
            )}

            {!isInitialLoading && (
              <>
                {/* Alerts */}
                {backendError && (
                  <div className="mb-8 p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] rounded-xl text-sm font-medium">
                    {backendError}
                  </div>
                )}
                {successMessage && (
                  <div className="mb-8 p-4 bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] rounded-xl text-sm font-medium">
                    {successMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {/* Event Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-semibold text-white mb-2">
                      Event Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      placeholder="e.g. Jakarta Web3 Hackathon 2026"
                      className={`w-full h-12 px-4 rounded-xl border bg-transparent text-white placeholder:text-[#777777] focus:outline-none transition-all duration-200 ${
                        errors.title ? 'border-[#EF4444] focus:border-[#EF4444]' : 'border-white/8 focus:border-white/15'
                      }`}
                    />
                    {errors.title && <p className="mt-2 text-sm text-[#EF4444]">{errors.title}</p>}
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="categoryId" className="block text-sm font-semibold text-white mb-2">
                      Category
                    </label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      disabled={isSubmitting || categoriesLoading}
                      className={`w-full h-12 px-4 rounded-xl border bg-[#161616] text-white focus:outline-none transition-all duration-200 ${
                        errors.categoryId ? 'border-[#EF4444] focus:border-[#EF4444]' : 'border-white/8 focus:border-white/15'
                      }`}
                    >
                      <option value="" className="text-[#777777] bg-[#161616]">
                        {categoriesLoading ? 'Loading categories...' : 'Select Category'}
                      </option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id} className="text-white bg-[#161616]">
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && <p className="mt-2 text-sm text-[#EF4444]">{errors.categoryId}</p>}
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-white mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      rows={5}
                      placeholder="Describe your event, speaker details, rules, etc..."
                      className={`w-full px-4 py-3 rounded-xl border bg-transparent text-white placeholder:text-[#777777] focus:outline-none transition-all duration-200 resize-none ${
                        errors.description ? 'border-[#EF4444] focus:border-[#EF4444]' : 'border-white/8 focus:border-white/15'
                      }`}
                    />
                    {errors.description && <p className="mt-2 text-sm text-[#EF4444]">{errors.description}</p>}
                  </div>

                  {/* Location & Date Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Location */}
                    <div>
                      <label htmlFor="location" className="block text-sm font-semibold text-white mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        placeholder="e.g. Jakarta Convention Center"
                        className={`w-full h-12 px-4 rounded-xl border bg-transparent text-white placeholder:text-[#777777] focus:outline-none transition-all duration-200 ${
                          errors.location ? 'border-[#EF4444] focus:border-[#EF4444]' : 'border-white/8 focus:border-white/15'
                        }`}
                      />
                      {errors.location && <p className="mt-2 text-sm text-[#EF4444]">{errors.location}</p>}
                    </div>

                    {/* Event Date */}
                    <div>
                      <label htmlFor="eventDate" className="block text-sm font-semibold text-white mb-2">
                        Event Date
                      </label>
                      <input
                        type="date"
                        id="eventDate"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className={`w-full h-12 px-4 rounded-xl border bg-transparent text-white focus:outline-none transition-all duration-200 ${
                          errors.eventDate ? 'border-[#EF4444] focus:border-[#EF4444]' : 'border-white/8 focus:border-white/15'
                        }`}
                      />
                      {errors.eventDate && <p className="mt-2 text-sm text-[#EF4444]">{errors.eventDate}</p>}
                    </div>
                  </div>

                  {/* Price & Quota Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Ticket Price */}
                    <div>
                      <label htmlFor="priceEth" className="block text-sm font-semibold text-white mb-2">
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
                        disabled={isSubmitting}
                        placeholder="e.g. 0.05"
                        className={`w-full h-12 px-4 rounded-xl border bg-transparent text-white placeholder:text-[#777777] focus:outline-none transition-all duration-200 ${
                          errors.priceEth ? 'border-[#EF4444] focus:border-[#EF4444]' : 'border-white/8 focus:border-white/15'
                        }`}
                      />
                      {errors.priceEth && <p className="mt-2 text-sm text-[#EF4444]">{errors.priceEth}</p>}
                    </div>

                    {/* Quota */}
                    <div>
                      <label htmlFor="quota" className="block text-sm font-semibold text-white mb-2">
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
                        disabled={isSubmitting}
                        placeholder="e.g. 100"
                        className={`w-full h-12 px-4 rounded-xl border bg-transparent text-white placeholder:text-[#777777] focus:outline-none transition-all duration-200 ${
                          errors.quota ? 'border-[#EF4444] focus:border-[#EF4444]' : 'border-white/8 focus:border-white/15'
                        }`}
                      />
                      {errors.quota && <p className="mt-2 text-sm text-[#EF4444]">{errors.quota}</p>}
                    </div>
                  </div>

                  {/* Banner Image Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Event Banner
                    </label>
                    
                    {/* Show existing banner if no new file selected */}
                    {existingBannerUrl && !bannerFile && (
                      <div className="mb-4 rounded-xl overflow-hidden border border-white/8">
                        <img
                          src={getImageUrl(existingBannerUrl)}
                          alt="Current Banner"
                          className="w-full h-64 object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <div className="p-3 bg-[#0D0D0D] text-xs text-[#A0A0A0]">
                          Current banner. Upload a new image to replace it.
                        </div>
                      </div>
                    )}
                    
                    <ImageUpload
                      value={bannerFile}
                      onChange={setBannerFile}
                      error={errors.banner}
                    />
                  </div>

                  {/* Form Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-8 border-t border-white/6">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => navigate(-1)}
                      className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-white bg-transparent border border-white/12 rounded-xl hover:border-white/25 hover:bg-white/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full sm:w-auto px-6 py-3 text-base font-semibold text-black bg-white rounded-xl transition-all duration-200 ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#EAEAEA] hover:scale-105'
                      }`}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="inline-block w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
                          Saving...
                        </span>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>

                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEventPage;
