import { useState } from 'react';
import Image from 'next/image';
import { NEXT_PUBLIC_MEDUSA_BACKEND_URL } from '@/config';

const DEFAULT_PRODUCT_IMAGE = 'https://placehold.co/500x500/f5f5f5/999999?text=Product';

interface ProductImageProps {
  src: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

/**
 * An optimized component for displaying product images with Next.js Image
 * Features:
 * - Modern formats (WebP/AVIF) automatic support
 * - Lazy loading with priority option for LCP images
 * - Placeholder fallbacks
 * - Proper error handling
 * - Handles various Medusa URL formats
 */
export function ProductImage({ 
  src, 
  alt, 
  width = 500,
  height = 500,
  className = '',
  priority = false
}: ProductImageProps) {
  const [error, setError] = useState(false);
  
  // Prepare the final image URL
  let finalSrc = DEFAULT_PRODUCT_IMAGE;
  
  // Handle different source formats
  if (src && typeof src === 'string') {
    if (src.startsWith('http')) {
      // External URLs remain unchanged
      finalSrc = src;
    } else if (src.startsWith('/')) {
      // Medusa image handling - these are typically paths like /uploads/images/product.jpg
      finalSrc = `${NEXT_PUBLIC_MEDUSA_BACKEND_URL}${src}`;
    } else {
      // If it doesn't have a protocol or leading slash, assume it's a relative path
      finalSrc = src;
    }
  }
  
  // Fallback in case of loading errors
  if (error) {
    finalSrc = DEFAULT_PRODUCT_IMAGE;
  }
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={finalSrc}
        alt={alt}
        width={width}
        height={height}
        className="object-cover"
        priority={priority}
        onError={() => setError(true)}
      />
    </div>
  );
}

export default ProductImage; 