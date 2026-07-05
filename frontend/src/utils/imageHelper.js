const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BASE_URL = API_BASE_URL.replace('/api', ''); // Remove /api suffix

export const getImageUrl = (path) => {
  if (!path) return null;
  
  // If already full URL (http/https), return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // If relative path, prepend base URL
  return `${BASE_URL}${path}`;
};
