/**
 * useProducts Hook
 * A React Query hook for fetching products from Medusa
 */

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { 
  fetchProducts, 
  fetchProductById, 
  fetchFeaturedProducts,
  fetchProductsByCategory,
  searchProducts,
  type ProductQueryOptions 
} from '@/services/medusa/products';
import type { Product } from '@/types/medusa';

// Query keys for caching
export const PRODUCTS_QUERY_KEY = 'products';
export const PRODUCT_QUERY_KEY = 'product';
export const FEATURED_PRODUCTS_QUERY_KEY = 'featuredProducts';
export const CATEGORY_PRODUCTS_QUERY_KEY = 'categoryProducts';
export const SEARCH_PRODUCTS_QUERY_KEY = 'searchProducts';

/**
 * Hook for fetching a list of products
 */
export const useProducts = (options?: ProductQueryOptions) => {
  return useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, options],
    queryFn: () => fetchProducts(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for fetching a single product by ID
 */
export const useProduct = (productId: string) => {
  return useQuery({
    queryKey: [PRODUCT_QUERY_KEY, productId],
    queryFn: () => fetchProductById(productId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!productId,
  });
};

/**
 * Hook for fetching featured products
 */
export const useFeaturedProducts = (limit: number = 4) => {
  return useQuery({
    queryKey: [FEATURED_PRODUCTS_QUERY_KEY, limit],
    queryFn: () => fetchFeaturedProducts(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for fetching products by category with pagination
 */
export const useCategoryProducts = (categoryId: string, limit: number = 12) => {
  return useInfiniteQuery({
    queryKey: [CATEGORY_PRODUCTS_QUERY_KEY, categoryId, limit],
    queryFn: ({ pageParam = 0 }) => 
      fetchProductsByCategory(categoryId, limit, pageParam * limit),
    getNextPageParam: (lastPage, allPages) => 
      lastPage.length === limit ? allPages.length : undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!categoryId,
  });
};

/**
 * Hook for searching products
 */
export const useSearchProducts = (query: string, limit: number = 12) => {
  return useQuery({
    queryKey: [SEARCH_PRODUCTS_QUERY_KEY, query, limit],
    queryFn: () => searchProducts(query, limit),
    staleTime: 1 * 60 * 1000, // 1 minute (shorter for search results)
    enabled: !!query && query.length >= 2,
  });
};

/**
 * Utility hook for getting products by IDs
 */
export const useProductsByIds = (productIds: string[]) => {
  return useQuery({
    queryKey: [PRODUCT_QUERY_KEY, 'batch', productIds],
    queryFn: async () => {
      const products = await Promise.all(
        productIds.map((id) => fetchProductById(id))
      );
      return products.filter((product): product is Product => product !== null);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: productIds.length > 0,
  });
}; 