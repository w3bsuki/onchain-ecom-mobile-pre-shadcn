import { cn } from "@/lib/utils";

interface ProductCardSkeletonProps {
  className?: string;
}

export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <div className={cn("group relative flex flex-col space-y-4", className)}>
      {/* Image skeleton */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100">
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      </div>

      {/* Content skeleton */}
      <div className="flex flex-col space-y-2">
        {/* Title */}
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        
        {/* Price and rating */}
        <div className="flex items-center justify-between">
          <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Color variants */}
        <div className="flex gap-1 pt-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-4 w-4 animate-pulse rounded-full bg-gray-200"
            />
          ))}
        </div>

        {/* Quick add button */}
        <div className="mt-2 h-9 w-full animate-pulse rounded-lg bg-gray-200" />
      </div>
    </div>
  );
} 