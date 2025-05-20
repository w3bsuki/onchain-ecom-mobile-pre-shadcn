import { cn } from "@/lib/utils";

interface CategoryTabsSkeletonProps {
  className?: string;
}

export function CategoryTabsSkeleton({ className }: CategoryTabsSkeletonProps) {
  // Generate unique keys for skeleton items
  const skeletonKeys = ['all', 'jackets', 'hoodies', 'shirts', 'shoes', 'accessories'];
  
  return (
    <div className={cn("mb-8 relative w-full", className)}>
      <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-hide">
        {skeletonKeys.map((key) => (
          <div
            key={`category-skeleton-${key}`}
            className="animate-pulse bg-zinc-50 border-zinc-200 flex-shrink-0 h-[120px] min-w-[120px] overflow-hidden p-4 rounded-xl"
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
  );
} 