import { cn } from "@/lib/utils";
import { memo } from "react";

interface CategoryTabsSkeletonProps {
  className?: string;
  itemCount?: number;
}

export const CategoryTabsSkeleton = memo(({ className, itemCount = 6 }: CategoryTabsSkeletonProps) => {
  // Generate skeleton items
  const skeletonKeys = Array.from({ length: itemCount }, (_, i) => `skeleton-${i}`);
  
  return (
    <div className={cn("relative w-full mb-8", className)}>
      {/* Skeleton progress indicator */}
      <div className="absolute -bottom-4 left-0 right-0 h-[2px] bg-zinc-100 rounded-full overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-[30%] bg-zinc-200" />
      </div>
      
      {/* Main skeleton container */}
      <div className="overflow-hidden w-full">
        <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-hide">
          {skeletonKeys.map((key) => (
            <div
              key={key}
              className="animate-pulse bg-zinc-50 border border-zinc-200 flex-shrink-0 h-[120px] min-w-[120px] overflow-hidden p-4 rounded-xl"
            >
              {/* Icon placeholder */}
              <div className="bg-zinc-200 h-12 mb-3 mx-auto rounded-full w-12" />
              
              {/* Text placeholder */}
              <div className="bg-zinc-200 h-4 mx-auto rounded w-16" />
              
              {/* Count placeholder */}
              <div className="bg-zinc-200 h-3 mx-auto mt-2 rounded-full w-8" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

CategoryTabsSkeleton.displayName = 'CategoryTabsSkeleton'; 