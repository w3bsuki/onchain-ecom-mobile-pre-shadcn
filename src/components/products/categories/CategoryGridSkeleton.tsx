'use client';

import { cn } from "@/lib/utils";
import { memo } from "react";

interface CategoryGridSkeletonProps {
  className?: string;
  itemCount?: number;
}

export const CategoryGridSkeleton = memo(({ 
  className, 
  itemCount = 6 
}: CategoryGridSkeletonProps) => {
  // Generate skeleton items
  const skeletonKeys = Array.from({ length: itemCount }, (_, i) => `skeleton-${i}`);

  return (
    <div className={cn("relative w-full mb-3", className)}>
      {/* Horizontal Scrollable View Skeleton */}
      <div className="flex gap-3 pb-2 overflow-x-auto scrollbar-hide">
        {skeletonKeys.map((key) => (
          <div
            key={key}
            className="animate-pulse bg-zinc-50 border border-zinc-200 flex-shrink-0 h-[80px] min-w-[90px] md:min-w-[130px] md:w-[130px] overflow-hidden rounded-sm p-2"
          >
            {/* Icon placeholder */}
            <div className="bg-zinc-200 h-8 w-8 md:h-10 md:w-10 mb-2 mx-auto rounded-sm" />
            
            {/* Text placeholder */}
            <div className="bg-zinc-200 h-3 mx-auto rounded w-14" />
            
            {/* Count placeholder */}
            <div className="bg-zinc-200 h-2 mx-auto mt-1 rounded-sm w-6" />
          </div>
        ))}
      </div>
      
      {/* Indicators */}
      <div className="flex justify-center mt-2 gap-1">
        {skeletonKeys.slice(0, Math.min(skeletonKeys.length, 8)).map((key, index) => (
          <div 
            key={`indicator-${key}`}
            className={cn(
              "h-[3px] bg-zinc-200",
              index === 0 ? "w-4" : "w-1.5"
            )}
          />
        ))}
      </div>
    </div>
  );
});

CategoryGridSkeleton.displayName = 'CategoryGridSkeleton';
