import { cn } from "@/lib/utils";

interface SearchSkeletonProps {
  className?: string;
  showResults?: boolean;
}

export function SearchSkeleton({ className, showResults = true }: SearchSkeletonProps) {
  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Search input skeleton */}
      <div className="relative">
        <div className="animate-pulse bg-zinc-100 h-10 rounded-lg w-full" />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="animate-pulse bg-zinc-200 h-5 rounded-full w-5" />
        </div>
      </div>

      {/* Search results skeleton - only shown when showResults is true */}
      {showResults && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          {/* Recent searches */}
          <div className="mb-4">
            <div className="animate-pulse bg-zinc-200 h-4 mb-3 rounded w-24" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={`recent-${i}`} className="flex items-center space-x-2">
                  <div className="animate-pulse bg-zinc-100 h-4 rounded-full w-4" />
                  <div className="animate-pulse bg-zinc-100 h-4 rounded w-32" />
                </div>
              ))}
            </div>
          </div>

          {/* Popular searches */}
          <div className="mb-4">
            <div className="animate-pulse bg-zinc-200 h-4 mb-3 rounded w-28" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={`popular-${i}`}
                  className="animate-pulse bg-zinc-100 h-8 rounded-full w-20"
                />
              ))}
            </div>
          </div>

          {/* Suggested products */}
          <div>
            <div className="animate-pulse bg-zinc-200 h-4 mb-3 rounded w-36" />
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={`product-${i}`} className="flex items-center space-x-3">
                  <div className="animate-pulse bg-zinc-100 h-12 rounded-md w-12" />
                  <div className="flex-1 space-y-2">
                    <div className="animate-pulse bg-zinc-100 h-4 rounded w-3/4" />
                    <div className="animate-pulse bg-zinc-100 h-4 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 