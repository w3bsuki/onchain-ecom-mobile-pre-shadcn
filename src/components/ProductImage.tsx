import { useState } from 'react';

interface ProductImageProps {
  src: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

/**
 * A reliable component for displaying product images with fallbacks
 */
export default function ProductImage({
  src,
  alt,
  width = 300,
  height = 300,
  className = '',
}: ProductImageProps) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Guaranteed working placeholder
  const placeholderUrl = 'https://via.placeholder.com/300x300?text=Product';
  
  // If no source or error, use placeholder
  if (!src || error) {
    if (isLoading && error) {
      setIsLoading(false);
    }
    return (
      <img
        src={placeholderUrl}
        alt={alt || 'Product image'}
        width={width}
        height={height}
        className={className}
        onLoad={() => { 
          if (!src) {
            setIsLoading(false); 
          }
        }}
      />
    );
  }
  
  // Prepare the final image URL
  let finalSrc = src;
  
  // Handle different source formats
  if (typeof src === 'string') {
    if (src.startsWith('/') || (!src.startsWith('http') && !src.startsWith('/api'))) {
      // Extract the path for our proxy
      const path = src.startsWith('/') ? src.substring(1) : src;
      // Use our dedicated image proxy API
      finalSrc = `/api/medusa-image?path=${encodeURIComponent(path)}&t=${Date.now()}`;
    } else if (!src.includes('?')) {
      // Add cache-busting for any other URLs without query params
      finalSrc = `${src}?t=${Date.now()}`;
    }
  }
  
  return (
    <div className="flex h-full items-center justify-center relative w-full">
      {isLoading && (
        <div className="absolute bg-gray-100 flex inset-0 items-center justify-center">
          <span className="text-gray-400 text-sm">Loading...</span>
        </div>
      )}
      
      <img
        src={finalSrc}
        alt={alt}
        width={width}
        height={height}
        className={`relative z-10 ${className}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          console.error(`Failed to load image ${finalSrc}, using fallback`);
          setError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
} 