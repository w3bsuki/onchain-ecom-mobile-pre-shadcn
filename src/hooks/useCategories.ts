import { useState, useEffect } from 'react';
import { medusaClient, type ProductCategory } from '@/lib/medusa-client';

interface UseCategoriesOptions {
  parentId?: string | null;
}

export function useCategories({ parentId }: UseCategoriesOptions = {}) {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        // Build filter options based on parent ID
        const options: Record<string, unknown> = {};
        
        if (parentId === null) {
          // Get top-level categories
          options.parent_category_id = null;
        } else if (parentId) {
          // Get subcategories of a specific parent
          options.parent_category_id = parentId;
        }
        
        const { product_categories } = await medusaClient.productCategories.list(options);
        setCategories(product_categories);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, [parentId]);
  
  return { categories, loading, error };
} 