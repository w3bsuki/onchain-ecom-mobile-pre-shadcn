'use client';

import { useState, useRef, useEffect } from 'react';
import ProductImage from './ProductImage';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@coinbase/onchainkit/theme';

interface ProductImageGalleryProps {
  mainImage: string | null;
  altImages?: (string | null)[];
  productName: string;
}

export default function ProductImageGallery({ 
  mainImage, 
  altImages = [], 
  productName 
}: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Combine main image with alt images
  const allImages = [mainImage, ...altImages.filter(img => img !== mainImage)].filter(Boolean) as string[];
  
  // If no images are provided, add a placeholder
  if (allImages.length === 0) {
    allImages.push(null);
  }
  
  // Check if on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Handle touch events for swiping on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe && currentIndex < allImages.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
    
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };
  
  const goToNext = () => {
    if (currentIndex < allImages.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };
  
  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };
  
  const selectImage = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Main image with swipe support on mobile */}
      <div 
        className="relative flex items-center justify-center overflow-hidden rounded-lg bg-gray-50 mb-4 h-[300px] md:h-[500px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <ProductImage 
          src={allImages[currentIndex]}
          alt={`${productName} - Image ${currentIndex + 1}`}
          className="h-full w-full object-contain md:object-cover"
          width={600}
          height={600}
        />
        
        {/* Navigation arrows - only visible on desktop or when hovering */}
        {allImages.length > 1 && (
          <>
            <button
              type="button"
              className={cn(
                "absolute left-3 p-2 rounded-full bg-white/70 text-gray-800 shadow-md hover:bg-white",
                "opacity-0 md:opacity-100 transition-opacity group-hover:opacity-100",
                currentIndex === 0 && "cursor-not-allowed opacity-40"
              )}
              onClick={goToPrev}
              disabled={currentIndex === 0}
              aria-label="Previous image"
            >
              <ChevronLeft size={isMobile ? 18 : 20} />
            </button>
            <button
              type="button"
              className={cn(
                "absolute right-3 p-2 rounded-full bg-white/70 text-gray-800 shadow-md hover:bg-white",
                "opacity-0 md:opacity-100 transition-opacity group-hover:opacity-100",
                currentIndex === allImages.length - 1 && "cursor-not-allowed opacity-40"
              )}
              onClick={goToNext}
              disabled={currentIndex === allImages.length - 1}
              aria-label="Next image"
            >
              <ChevronRight size={isMobile ? 18 : 20} />
            </button>
          </>
        )}
        
        {/* Image indicator for mobile */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {allImages.map((_, index) => (
              <button
                key={index}
                type="button"
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  index === currentIndex ? "bg-black" : "bg-gray-300"
                )}
                onClick={() => selectImage(index)}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Thumbnail gallery - only visible on larger screens */}
      {allImages.length > 1 && (
        <div className="hidden md:flex space-x-2 overflow-x-auto pb-2">
          {allImages.map((img, index) => (
            <button
              key={index}
              type="button"
              className={cn(
                "relative border overflow-hidden rounded min-w-[70px] h-[70px]",
                index === currentIndex ? "border-black" : "border-gray-200 hover:border-gray-300"
              )}
              onClick={() => selectImage(index)}
              aria-label={`View image ${index + 1}`}
            >
              <ProductImage 
                src={img}
                alt={`${productName} - Thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
                width={70}
                height={70}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 