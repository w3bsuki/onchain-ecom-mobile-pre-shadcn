import { useState, useEffect } from 'react';
import { medusaClient, type Product } from '@/lib/medusa-client';

interface UseProductsOptions {
  limit?: number;
  categoryId?: string;
  featured?: boolean;
}

interface ProductFilterOptions {
  limit?: number;
  collection_id?: string[];
  category_id?: string[];
  [key: string]: unknown;
}

export function useProducts({ limit = 12, categoryId, featured }: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Build filter options
        const options: ProductFilterOptions = { limit };
        
        if (featured) {
          options.collection_id = ['featured'];
        }
        
        if (categoryId) {
          options.category_id = [categoryId];
        }
        
        const { products: result } = await medusaClient.products.list(options);
        setProducts(result);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [limit, categoryId, featured]);
  
  return { products, loading, error };
} 