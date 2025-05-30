/**
 * Re-export of useProducts hook from Medusa
 * This file exists to maintain backward compatibility with existing imports
 */

import { useProducts as useMedusaProducts, type ProductQueryOptions } from '@/hooks/medusa/useProducts';
import { useState, useEffect } from 'react';
import type { Product } from '@/types/medusa';

// Interface for the hook options
interface UseProductsOptions {
  limit?: number;
  category?: string;
  featured?: boolean;
}

// Interface for the hook return value
interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: Error | null;
  usingSampleData: boolean;
}

// This hook provides a simplified interface compatible with the products page
export function useProducts({ limit = 12, category, featured }: UseProductsOptions = {}): UseProductsReturn {
  // Convert options to Medusa format
  const queryOptions: ProductQueryOptions = {
    limit,
    ...(category && { category_id: category }),
    ...(featured && { featured: true })
  };

  // Use the Medusa products hook
  const { data: products, isLoading, error } = useMedusaProducts(queryOptions);
  
  // State for processed products
  const [processedProducts, setProcessedProducts] = useState<Product[]>([]);
  const [usingSampleData, setUsingSampleData] = useState(false);
  
  useEffect(() => {
    if (products) {
      setProcessedProducts(products);
      setUsingSampleData(false);
    } else if (!isLoading && !error) {
      // If there's no data but also no loading state or error,
      // we might be in a disconnected state, show empty array
      setProcessedProducts([]);
      setUsingSampleData(false);
    }
  }, [products, isLoading, error]);

  return {
    products: processedProducts,
    loading: isLoading,
    error: error as Error | null,
    usingSampleData
  };
} 