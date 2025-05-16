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
        "animate-pulse border border-blue-300 rounded-xl overflow-hidden h-full",
        "relative bg-blue-50",
        className
      )}
      aria-hidden="true"
    >
      {/* TESTING BANNER - REMOVE AFTER TESTING */}
      <div className="absolute inset-x-0 top-0 bg-blue-600 text-white text-xs font-bold py-1 text-center z-50">
        NEW SKELETON COMPONENT
      </div>
    
      {/* Skeleton for product image */}
      <div className="w-full pt-[100%] relative bg-blue-100 mt-6">
        {/* Random badge placeholders */}
        {Math.random() > 0.7 && (
          <div className="absolute left-3 top-3 w-16 h-6 bg-blue-200 rounded" />
        )}
        
        {/* Wishlist button placeholder */}
        <div className="absolute right-3 top-3 w-8 h-8 rounded-full bg-blue-200" />
      </div>
      
      {/* Skeleton for product details */}
      <div className={cn("p-4 space-y-3 md:p-6 md:space-y-4")}>
        {/* Title placeholder */}
        <div className="h-5 bg-blue-200 rounded w-3/4" />
        
        {/* Rating placeholder */}
        <div className="flex space-x-1 items-center">
          <div className="h-3 bg-blue-200 rounded w-20" />
          <div className="h-3 bg-blue-200 rounded-full w-8 ml-2" />
        </div>
        
        {/* Price placeholder */}
        <div className="h-5 bg-blue-200 rounded w-16" />
        
        {/* Color options placeholder */}
        <div className="flex space-x-2 pt-1">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="w-6 h-6 rounded-full bg-blue-200" />
          ))}
        </div>
        
        {/* Button placeholder */}
        <div className={cn(
          "w-full rounded-lg bg-blue-300",
          isMobile ? "h-12 mt-3" : "h-10 mt-2"
        )} />
      </div>
    </div>
  );
} 