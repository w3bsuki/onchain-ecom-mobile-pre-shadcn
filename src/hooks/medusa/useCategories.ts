/**
 * useCategories Hook
 * A React Query hook for fetching categories from Medusa
 */

import { useQuery } from '@tanstack/react-query';
import { 
  fetchCategories, 
  fetchCategoryById, 
  fetchRootCategories,
  fetchChildCategories,
  type CategoryQueryOptions 
} from '@/services/medusa/categories';

// Query keys for caching
export const CATEGORIES_QUERY_KEY = 'categories';
export const CATEGORY_QUERY_KEY = 'category';
export const ROOT_CATEGORIES_QUERY_KEY = 'rootCategories';
export const CHILD_CATEGORIES_QUERY_KEY = 'childCategories';

/**
 * Hook for fetching a list of categories
 */
export const useCategories = (options?: CategoryQueryOptions) => {
  return useQuery({
    queryKey: [CATEGORIES_QUERY_KEY, options],
    queryFn: () => fetchCategories(options),
    staleTime: 10 * 60 * 1000, // 10 minutes - categories change less frequently
  });
};

/**
 * Hook for fetching a single category by ID
 */
export const useCategory = (categoryId: string) => {
  return useQuery({
    queryKey: [CATEGORY_QUERY_KEY, categoryId],
    queryFn: () => fetchCategoryById(categoryId),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!categoryId,
  });
};

/**
 * Hook for fetching root categories (those without a parent)
 */
export const useRootCategories = (limit = 100) => {
  return useQuery({
    queryKey: [ROOT_CATEGORIES_QUERY_KEY, limit],
    queryFn: () => fetchRootCategories(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook for fetching child categories for a given parent category ID
 */
export const useChildCategories = (parentCategoryId: string, limit = 100) => {
  return useQuery({
    queryKey: [CHILD_CATEGORIES_QUERY_KEY, parentCategoryId, limit],
    queryFn: () => fetchChildCategories(parentCategoryId, limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!parentCategoryId,
  });
}; 