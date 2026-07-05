import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const ImageUpload = ({ value, onChange, error }) => {
  const [preview, setPreview] = useState(value || null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only JPG, JPEG, PNG, and WEBP files are allowed');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size must be less than 5 MB');
      return;
    }

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
        <div className="relative w-full rounded-xl overflow-hidden border border-white/10 bg-[#161616]">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover"
          />
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
            w-full h-64 rounded-xl border-2 border-dashed
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
          <div className="text-center">
            <p className="text-white font-medium mb-1">
              {dragActive ? 'Drop your image here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-[#777777] text-sm">
              JPG, PNG, WEBP • Max 5 MB
            </p>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-[#EF4444]">{error}</p>
      )}
    </div>
  );
};

export default ImageUpload;
