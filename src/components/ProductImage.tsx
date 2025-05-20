import { useState } from 'react';
import Image from 'next/image';
import { NEXT_PUBLIC_MEDUSA_BACKEND_URL } from '@/config';

interface ProductImageProps {
  src: string;
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
  let finalSrc = src;
  
  // Handle different source formats
  if (typeof src === 'string') {
    if (src.startsWith('http')) {
      // External URLs remain unchanged
      finalSrc = src;
    } else if (src.startsWith('/')) {
      // Medusa image handling - these are typically paths like /uploads/images/product.jpg
      finalSrc = `${NEXT_PUBLIC_MEDUSA_BACKEND_URL}${src}`;
    }
  }
  
  // Fallback in case of loading errors
  if (error) {
    finalSrc = `https://placehold.co/${width}x${height}/f5f5f5/999999?text=Product`;
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