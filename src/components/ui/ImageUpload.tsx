'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Upload, X, Link as LinkIcon, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
}

type UploadMethod = 'file' | 'url';

export function ImageUpload({ images, onChange, maxImages = 10, maxSizeMB = 5 }: ImageUploadProps) {
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>('file');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    
    // Check if adding these files would exceed max images
    if (images.length + files.length > maxImages) {
      setError(`You can only upload up to ${maxImages} images`);
      return;
    }

    // Validate each file
    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} is not an image file`);
        continue;
      }

      // Check file size (convert MB to bytes)
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        setError(`${file.name} is larger than ${maxSizeMB}MB`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // Upload files to Cloudinary via backend
    setUploading(true);
    try {
      const uploadedUrls: string[] = [];
      
      for (const file of validFiles) {
        const formData = new FormData();
        formData.append('image', file);

        const token = localStorage.getItem('auth_token');
        if (!token) {
          throw new Error('Authentication required. Please log in again.');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v2/upload/image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
          console.error('Upload failed:', errorData);
          throw new Error(errorData.message || `Upload failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log('Upload successful:', data);
        
        if (!data.data || !data.data.url) {
          throw new Error('Invalid response from server');
        }
        
        uploadedUrls.push(data.data.url);
      }

      onChange([...images, ...uploadedUrls]);
      setError(null);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload images');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlAdd = () => {
    if (!imageUrl.trim()) return;

    // Basic URL validation
    try {
      new URL(imageUrl);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    if (images.length >= maxImages) {
      setError(`You can only have up to ${maxImages} images`);
      return;
    }

    onChange([...images, imageUrl.trim()]);
    setImageUrl('');
    setError(null);
  };

  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Upload Method Selection */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setUploadMethod('file')}
          className={cn(
            'flex-1 py-2 px-4 rounded-lg border-2 transition-all font-medium text-sm',
            uploadMethod === 'file'
              ? 'border-black bg-black text-white'
              : 'border-gray-200 text-gray-600 hover:border-gray-300'
          )}
        >
          <Upload className="inline h-4 w-4 mr-2" />
          Upload Files
        </button>
        <button
          type="button"
          onClick={() => setUploadMethod('url')}
          className={cn(
            'flex-1 py-2 px-4 rounded-lg border-2 transition-all font-medium text-sm',
            uploadMethod === 'url'
              ? 'border-black bg-black text-white'
              : 'border-gray-200 text-gray-600 hover:border-gray-300'
          )}
        >
          <LinkIcon className="inline h-4 w-4 mr-2" />
          Image URL
        </button>
      </div>

      {/* Upload Interface */}
      {uploadMethod === 'file' ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading || images.length >= maxImages}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || images.length >= maxImages}
            className={cn(
              'w-full py-8 px-4 border-2 border-dashed rounded-xl transition-all',
              uploading || images.length >= maxImages
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                : 'border-gray-300 hover:border-black hover:bg-gray-50 cursor-pointer'
            )}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                <span className="text-sm text-gray-500">Uploading...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <ImageIcon className="h-8 w-8 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">
                  Click to upload images
                </span>
                <span className="text-xs text-gray-500">
                  PNG, JPG up to {maxSizeMB}MB ({images.length}/{maxImages})
                </span>
              </div>
            )}
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            disabled={images.length >= maxImages}
          />
          <Button
            type="button"
            onClick={handleUrlAdd}
            disabled={!imageUrl.trim() || images.length >= maxImages}
          >
            Add
          </Button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group"
            >
              <img
                src={image}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                  Cover
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
