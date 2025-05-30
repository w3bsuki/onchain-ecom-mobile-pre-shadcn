'use client';

import type { Product } from '@/types/medusa';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from './ProductCard';
import { useMemo } from 'react';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductGrid({ 
  products, 
  isLoading = false
}: ProductGridProps) {
  // Generate skeleton keys once 
  const skeletonKeys = useMemo(() => 
    Array.from({ length: 8 }).map((_, i) => `skeleton-card-${i}-${Math.random().toString(36).substring(2, 9)}`), 
    []
  );

  // Show skeleton cards when loading
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
        {skeletonKeys.map((key) => (
          <Card 
            key={key}
            className="rounded-lg overflow-hidden border-0 shadow-sm"
          >
            <div className="aspect-square">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="p-3">
              <Skeleton className="h-4 w-2/3 mb-2" />
              <Skeleton className="h-3 w-1/2 mb-2" />
              <Skeleton className="h-5 w-1/3" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // No products to display
  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-zinc-500">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
} 