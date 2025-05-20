'use client';

import { cn } from "@/lib/utils";
import { useEffect, useState } from 'react';

interface SkeletonProductCardProps {
  className?: string;
}

/**
 * Skeleton loading placeholder for product cards
 * Used while product data is being fetched
 */
export default function SkeletonProductCard({ className }: SkeletonProductCardProps) {
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if we're on mobile for responsive design
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div 
      className={cn(
        "animate-pulse bg-zinc-50 border border-zinc-200 h-full overflow-hidden relative rounded-xl",
        className
      )}
      aria-hidden="true"
    >
      {/* TESTING BANNER - REMOVE AFTER TESTING */}
      <div className="absolute inset-x-0 top-0 bg-blue-600 text-white text-xs font-bold py-1 text-center z-50">
        NEW SKELETON COMPONENT
      </div>
    
      {/* Skeleton for product image */}
      <div className="bg-zinc-100 relative pt-[100%] w-full">
        {/* Random badge placeholders */}
        {Math.random() > 0.7 && (
          <div className="absolute bg-zinc-200 h-6 left-3 rounded top-3 w-16" />
        )}
        
        {/* Wishlist button placeholder */}
        <div className="absolute bg-zinc-200 h-8 right-3 rounded-full top-3 w-8" />
      </div>
      
      {/* Skeleton for product details */}
      <div className="p-4 space-y-3">
        {/* Title placeholder */}
        <div className="bg-zinc-200 h-5 rounded w-3/4" />
        
        {/* Rating placeholder */}
        <div className="flex items-center space-x-1">
          <div className="bg-zinc-200 h-3 rounded w-20" />
          <div className="bg-zinc-200 h-3 ml-2 rounded-full w-8" />
        </div>
        
        {/* Price placeholder */}
        <div className="bg-zinc-200 h-5 rounded w-16" />
        
        {/* Color options placeholder */}
        <div className="flex space-x-2">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="bg-zinc-200 h-6 rounded-full w-6" />
          ))}
        </div>
        
        {/* Button placeholder */}
        <div className={cn(
          "bg-teal-100 rounded-lg w-full",
          isMobile ? "h-12 mt-3" : "h-10 mt-2"
        )} />
      </div>
    </div>
  );
} 