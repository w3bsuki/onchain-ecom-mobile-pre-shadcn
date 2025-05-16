import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from "@/lib/utils";

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
 */
export default function ProductImage({
  src,
  alt,
  width = 300,
  height = 300,
  className = '',
  priority = false,
}: ProductImageProps) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [blurDataUrl, setBlurDataUrl] = useState<string | undefined>(undefined);
  
  // Guaranteed working placeholder with transparent background
  const placeholderUrl = 'https://placehold.co/300x300/transparent/a1a1aa?text=Product&font=montserrat';
  
  // Generate blur data URL for smoother loading
  useEffect(() => {
    // Simple 10x10 blurred placeholder
    const generateBlurPlaceholder = () => {
      setBlurDataUrl('data:image/svg+xml;base64,PCFET0NUWVBFIHNWRyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMzAwIDMwMCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxuczpzZXJpZj0iaHR0cDovL3d3dy5zZXJpZi5jb20vIiBzdHlsZT0iZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjI7Ij4KICAgIDxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBzdHlsZT0iZmlsbDpyZ2IoMjQwLDI0MCwyNDApOyIvPgo8L3N2Zz4=');
    };
    
    generateBlurPlaceholder();
  }, []);
  
  // If no source or error, use placeholder
  if (!src || error) {
    return (
      <div className="relative flex h-full items-center justify-center w-full">
        <Image
          src={placeholderUrl}
          alt={alt || 'Product image'}
          width={width}
          height={height}
          className={cn(
            className,
            "mix-blend-multiply transition-opacity duration-300"
          )}
          onLoadingComplete={() => { 
            setIsLoading(false);
          }}
          priority={priority}
          quality={80}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
    );
  }
  
  // Prepare the final image URL
  let finalSrc = src;
  let isExternal = false;
  
  // Handle different source formats
  if (typeof src === 'string') {
    if (src.startsWith('/') || (!src.startsWith('http') && !src.startsWith('/api'))) {
      // Extract the path for our proxy
      const path = src.startsWith('/') ? src.substring(1) : src;
      // Use our dedicated image proxy API
      finalSrc = `/api/medusa-image?path=${encodeURIComponent(path)}`;
    } else {
      // External URLs
      isExternal = true;
    }
  }
  
  return (
    <div className="relative flex h-full items-center justify-center w-full">
      {isLoading && (
        <div className="absolute bg-transparent flex inset-0 items-center justify-center z-0">
          <div className="animate-spin border-2 border-gray-200 border-t-2 border-t-black h-8 rounded-full w-8" />
        </div>
      )}
      
      {isExternal ? (
        // For external images that Next.js Image won't optimize
        <img
          src={finalSrc}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            "relative mix-blend-multiply transform transition-all duration-300 z-10",
            className,
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            console.error(`Failed to load image ${finalSrc}, using fallback`);
            setError(true);
            setIsLoading(false);
          }}
        />
      ) : (
        // For internal/optimizable images using Next.js Image
        <Image
          src={finalSrc}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            "relative mix-blend-multiply transform transition-all duration-300 z-10",
            className,
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoadingComplete={() => setIsLoading(false)}
          onError={() => {
            console.error(`Failed to load image ${finalSrc}, using fallback`);
            setError(true);
            setIsLoading(false);
          }}
          placeholder={blurDataUrl ? "blur" : "empty"}
          blurDataURL={blurDataUrl}
          priority={priority}
          quality={85}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      )}
    </div>
  );
} 