/**
 * Medusa Categories Service
 * Provides functionality for category-related operations with Medusa backend
 */

import { getMedusaClient, handleMedusaError } from './client';
import type { Category } from '@/types/medusa';

/**
 * Category query options interface
 */
export interface CategoryQueryOptions {
  limit?: number;
  offset?: number;
  parent_category_id?: string | null;
  include_descendants_tree?: boolean;
  q?: string;
}

/**
 * Transforms a Medusa category/collection to our application's category format
 */
export const transformMedusaCategory = (medusaCategory: any): Category => {
  return {
    id: medusaCategory.id,
    name: medusaCategory.title || medusaCategory.name,
    handle: medusaCategory.handle,
    parent_category_id: medusaCategory.parent_category_id || null,
    description: medusaCategory.description || undefined,
    image: medusaCategory.image || null,
    products_count: medusaCategory.products_count || 0
  };
};

/**
 * Fetches categories from Medusa backend
 */
export const fetchCategories = async (options: CategoryQueryOptions = {}): Promise<Category[]> => {
  try {
    const client = getMedusaClient();
    
    // First try product categories
    try {
      const { product_categories } = await client.productCategories.list({
        limit: options.limit || 100,
        offset: options.offset || 0,
        parent_category_id: options.parent_category_id,
        include_descendants_tree: options.include_descendants_tree,
        q: options.q
      });
      
      if (product_categories && product_categories.length > 0) {
        return product_categories.map(transformMedusaCategory);
      }
    } catch (error) {
      console.log('Product categories not available, trying collections instead');
    }
    
    // Fall back to collections if product categories are not available
    const { collections } = await client.collections.list({
      limit: options.limit || 100,
      offset: options.offset || 0
    });
    
    return collections.map(transformMedusaCategory);
  } catch (error) {
    throw handleMedusaError(error);
  }
};

/**
 * Fetches a single category from Medusa backend by ID
 */
export const fetchCategoryById = async (categoryId: string): Promise<Category | null> => {
  try {
    const client = getMedusaClient();
    
    // First try product categories
    try {
      const { product_category } = await client.productCategories.retrieve(categoryId);
      
      if (product_category) {
        return transformMedusaCategory(product_category);
      }
    } catch (error) {
      console.log('Product category not found, trying collections instead');
    }
    
    // Fall back to collections if product categories are not available
    const { collection } = await client.collections.retrieve(categoryId);
    
    if (!collection) {
      return null;
    }
    
    return transformMedusaCategory(collection);
  } catch (error) {
    console.error(`Failed to fetch category with ID ${categoryId}:`, error);
    return null;
  }
};

/**
 * Fetches root categories (those without a parent)
 */
export const fetchRootCategories = async (limit: number = 100): Promise<Category[]> => {
  return fetchCategories({ 
    parent_category_id: null,
    limit
  });
};

/**
 * Fetches child categories for a given parent category ID
 */
export const fetchChildCategories = async (
  parentCategoryId: string,
  limit: number = 100
): Promise<Category[]> => {
  return fetchCategories({
    parent_category_id: parentCategoryId,
    limit
  });
}; 