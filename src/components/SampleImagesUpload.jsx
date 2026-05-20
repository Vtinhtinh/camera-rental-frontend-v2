import { useState, useRef } from 'react';
import { uploadApi } from '../api/endpoints';

const getImageUrl = (url) => url?.startsWith('http') ? url : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${url}`;

const SampleImagesUpload = ({ value = [], onChange, maxImages = 8 }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);
  const dragCounterRef = useRef(0);

  const images = Array.isArray(value) ? value : [];

  const handleFileSelect = async (files) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    if (images.length + fileArray.length > maxImages) {
      setError(`Chỉ được tải tối đa ${maxImages} ảnh mẫu`);
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    for (const file of fileArray) {
      if (!allowedTypes.includes(file.type)) {
        setError('Chỉ chấp nhận file hình ảnh (JPEG, PNG, GIF, WEBP)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File quá lớn. Kích thước tối đa là 5MB');
        return;
      }
    }

    setError('');
    setUploading(true);

    try {
      const newImages = [];
      for (const file of fileArray) {
        const res = await uploadApi.uploadImage(file);
        if (res.success) {
          newImages.push(res.data.url);
        }
      }

      if (newImages.length > 0) {
        onChange([...images, ...newImages]);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Không thể kết nối đến server');
    } finally {
      setUploading(false);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    dragCounterRef.current = 0;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleClick = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
    e.target.value = '';
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <label className="text-sm font-semibold text-gray-700">Ảnh mẫu chụp</label>
        <span className="text-xs text-gray-500">(máy này chụp được)</span>
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {images.map((img, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group"
          >
            <img
              src={getImageUrl(img)}
              alt={`Ảnh mẫu ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                title="Xóa ảnh"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {/* Upload zone */}
        {images.length < maxImages && (
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClick}
            className={`
              relative aspect-square rounded-lg overflow-hidden border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center gap-2
              ${dragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }
              ${uploading ? 'pointer-events-none opacity-50' : ''}
            `}
          >
            {uploading ? (
              <>
                <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-gray-500">Đang tải...</p>
              </>
            ) : (
              <>
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-xs text-gray-500 text-center px-2">
                  Thêm ảnh mẫu
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        multiple
        onChange={handleChange}
        className="hidden"
      />

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}

      <p className="text-xs text-gray-500 mt-2">
        Tối đa {maxImages} ảnh mẫu. Đây là những ảnh được chụp bằng máy này để khách hàng tham khảo chất lượng ảnh.
      </p>
    </div>
  );
};

export default SampleImagesUpload;
