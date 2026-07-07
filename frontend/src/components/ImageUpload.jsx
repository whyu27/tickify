import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

const ImageUpload = ({ value, onChange, error }) => {
  const [preview, setPreview] = useState(value || null);
  const toast = useNotification();
  const [dragActive, setDragActive] = useState(false);
  const [dimensionWarning, setDimensionWarning] = useState('');
  const [selectedDimensions, setSelectedDimensions] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.warn('Only JPG, JPEG, PNG, and WEBP files are allowed');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.warn('File size must be less than 5 MB');
      return;
    }

    // Validate image dimensions
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const width = img.width;
      const height = img.height;
      setSelectedDimensions({ width, height });

      if (width < 1280 || height < 720) {
        setDimensionWarning(
          `Warning: Kualitas gambar banner mungkin menurun karena resolusi di bawah minimum 1280 × 720 px (ukuran saat ini: ${width} × ${height} px).`
        );
        toast.warn('Resolusi gambar banner terlalu kecil!');
      } else {
        setDimensionWarning('');
      }
      
      URL.revokeObjectURL(img.src);
    };

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Pass file to parent component
    onChange(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setDimensionWarning('');
    setSelectedDimensions(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
      />

      {preview ? (
        <div className="relative w-full rounded-xl overflow-hidden border border-white/10 bg-[#161616] aspect-[16/9]">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover object-center"
          />
          {selectedDimensions && (
            <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-sm text-[10px] font-mono text-white/80 rounded-md border border-white/10 select-none">
              {selectedDimensions.width} × {selectedDimensions.height} px
            </div>
          )}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-3 right-3 p-2 rounded-lg bg-black/80 hover:bg-black transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            w-full aspect-[16/9] rounded-xl border-2 border-dashed
            flex flex-col items-center justify-center gap-4
            cursor-pointer transition-all
            ${dragActive 
              ? 'border-white/30 bg-white/5' 
              : 'border-white/10 bg-[#161616] hover:border-white/20 hover:bg-white/[0.02]'
            }
          `}
        >
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
            {dragActive ? (
              <Upload className="w-8 h-8 text-white" />
            ) : (
              <ImageIcon className="w-8 h-8 text-white/60" />
            )}
          </div>
          <div className="text-center px-4">
            <p className="text-white font-medium mb-1">
              {dragActive ? 'Drop your image here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-[#777777] text-xs">
              JPG, PNG, WEBP • Max 5 MB
            </p>
          </div>
        </div>
      )}

      {/* Helper Guidelines Text */}
      <div className="mt-2.5 text-xs text-[#777777] flex flex-col gap-1 pl-1">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white/20 block" />
          <span>Recommended size: <strong className="text-white/60 font-semibold">1600 × 900 px (16:9)</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white/20 block" />
          <span>Minimum size: <strong className="text-white/60 font-semibold">1280 × 720 px</strong></span>
        </div>
      </div>

      {/* Dimension warning message */}
      {dimensionWarning && (
        <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs rounded-xl flex items-start gap-2 animate-fade-in font-medium">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{dimensionWarning}</span>
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-[#EF4444]">{error}</p>
      )}
    </div>
  );
};

export default ImageUpload;
