/**
 * Medusa Products Service
 * Provides functionality for product-related operations with Medusa backend
 */

import { getMedusaClient, handleMedusaError } from './client';
import type { Product } from '@/types/medusa';

/**
 * Product query options interface
 */
export interface ProductQueryOptions {
  limit?: number;
  offset?: number;
  category_id?: string;
  collection_id?: string;
  tags?: string[];
  title?: string;
  handle?: string;
  q?: string;
  featured?: boolean;
  order?: string;
  cart_id?: string;
  region_id?: string;
  currency_code?: string;
}

/**
 * Transforms a Medusa product into our application's product format
 */
export const transformMedusaProduct = (medusaProduct: any): Product => {
  try {
    console.log(`Transforming product: ${medusaProduct.id} - ${medusaProduct.title}`);
    
    // Get the default variant (first variant)
    const defaultVariant = medusaProduct.variants?.[0];
    
    // Get the default price
    const price = defaultVariant?.prices?.[0]?.amount || 0;
    
    // Original price for calculating discount
    const originalPrice = medusaProduct.metadata?.original_price 
      ? Number(medusaProduct.metadata.original_price) 
      : undefined;
    
    // Calculate discount percentage if original price exists
    const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : undefined;

    // Get primary image or null
    let image = null;
    if (medusaProduct.thumbnail) {
      image = medusaProduct.thumbnail;
    } else if (medusaProduct.images && medusaProduct.images.length > 0) {
      image = medusaProduct.images[0].url || null;
    }
    console.log(`Product image: ${image}`);

    // Extract available colors if present in options
    let colors = [];
    if (medusaProduct.options && medusaProduct.options.length > 0) {
      const colorOption = medusaProduct.options.find((o: any) => 
        o.title.toLowerCase() === 'color' || o.title.toLowerCase() === 'colours'
      );
      
      if (colorOption && colorOption.values) {
        colors = colorOption.values.map((v: any) => ({
          name: v.value,
          hex: getColorHex(v.value.toLowerCase())
        })) || [];
      }
    }

    // Build variants array with proper structure
    const variants = Array.isArray(medusaProduct.variants) 
      ? medusaProduct.variants.map((variant: any) => ({
          id: variant.id,
          title: variant.title || 'Default',
          prices: Array.isArray(variant.prices) 
            ? variant.prices.map((price: any) => ({
                amount: price.amount || 0,
                currency_code: (price.currency_code || 'usd').toLowerCase()
              }))
            : []
        }))
      : [];

    // Get category name safely
    let categoryName = 'Uncategorized';
    if (medusaProduct.collection && typeof medusaProduct.collection === 'object') {
      categoryName = medusaProduct.collection.title || 'Uncategorized';
    }
    
    // Create Medusa-compatible format
    const product = {
      id: medusaProduct.id,
      name: medusaProduct.title || '',
      title: medusaProduct.title || '',
      description: medusaProduct.description || 'No description',
      image: image || '/images/placeholder/product.png',
      thumbnail: image || '/images/placeholder/product.png',
      price: (price / 100) || 0, // Convert from cents to dollars
      variants: variants,
      rating: medusaProduct.metadata?.rating ? Number(medusaProduct.metadata.rating) : undefined,
      reviewCount: medusaProduct.metadata?.review_count ? Number(medusaProduct.metadata.review_count) : undefined,
      discount: discount ? discount / 100 : undefined, // Convert percentage to decimal
      colors: colors,
      category: categoryName,
    };
    
    console.log(`Successfully transformed product: ${product.id}`);
    return product;
  } catch (error) {
    console.error(`Error transforming product:`, error);
    console.error(`Problem product data:`, JSON.stringify(medusaProduct, null, 2).substring(0, 500));
    
    // Return a basic product to prevent UI crashes
    return {
      id: medusaProduct.id || 'unknown',
      name: medusaProduct.title || 'Error Loading Product',
      title: medusaProduct.title || 'Error Loading Product',
      description: 'There was an error loading this product',
      image: medusaProduct.thumbnail || '/images/placeholder/product.png',
      thumbnail: medusaProduct.thumbnail || '/images/placeholder/product.png',
      price: 0,
      variants: [],
      colors: [],
      category: 'Uncategorized',
    };
  }
};

/**
 * Maps common color names to hex values
 */
const getColorHex = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    black: '#000000',
    white: '#FFFFFF',
    red: '#FF0000',
    green: '#008000',
    blue: '#0000FF',
    yellow: '#FFFF00',
    purple: '#800080',
    pink: '#FFC0CB',
    orange: '#FFA500',
    gray: '#808080',
    grey: '#808080',
    brown: '#A52A2A',
  };
  
  return colorMap[colorName] || '#CCCCCC'; // Default gray if color not found
};

/**
 * Fetches products from Medusa backend
 */
export const fetchProducts = async (options: ProductQueryOptions = {}): Promise<Product[]> => {
  try {
    console.log('Fetching products from Medusa with options:', options);
    
    // Build query parameters
    const queryParams: Record<string, any> = {
      limit: options.limit || 12,
    };
    
    // Add category filter
    if (options.category_id && options.category_id !== 'all') {
      queryParams.collection_id = [options.category_id];
    }
    
    // Add featured filter
    if (options.featured) {
      queryParams.tags = ['featured'];
    }
    
    // Add search filter
    if (options.q) {
      queryParams.q = options.q;
    }
    
    // Add pagination
    if (options.offset) {
      queryParams.offset = options.offset;
    }
    
    // Add sorting
    if (options.order) {
      queryParams.order = options.order;
    }
    
    try {
      // First try using the Medusa client
      const client = getMedusaClient();
      const response = await client.products.list(queryParams);
      
      if (response.products && response.products.length > 0) {
        // Transform Medusa products to our format
        const transformedProducts = response.products.map(transformMedusaProduct);
        console.log(`Successfully transformed ${transformedProducts.length} products via client`);
        return transformedProducts;
      }
    } catch (clientError) {
      console.warn('Client API failed, falling back to proxy API:', clientError);
    }
    
    // Fall back to our proxy API to avoid CORS issues
    console.log('Using proxy API to fetch products');
    
    // Convert query parameters to URL search params
    const urlParams = new URLSearchParams();
    urlParams.append('path', 'store/products');
    
    // Add all query parameters
    Object.entries(queryParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => urlParams.append(`${key}[]`, v));
      } else {
        urlParams.append(key, String(value));
      }
    });
    
    // Use our proxy API
    const proxyUrl = `/api/medusa-proxy?${urlParams.toString()}`;
    const proxyResponse = await fetch(proxyUrl);
    const data = await proxyResponse.json();
    
    if (!data.products || data.products.length === 0) {
      console.log('No products found in proxy API response');
      return [];
    }
    
    // Transform products
    const transformedProducts = data.products.map(transformMedusaProduct);
    console.log(`Successfully transformed ${transformedProducts.length} products via proxy`);
    return transformedProducts;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return []; // Return empty array instead of throwing
  }
};

/**
 * Fetches a single product from Medusa backend by ID
 */
export const fetchProductById = async (productId: string): Promise<Product | null> => {
  try {
    try {
      // First try using the Medusa client
      const client = getMedusaClient();
      // Fetch the product from Medusa
      const { product } = await client.products.retrieve(productId);
      
      if (product) {
        // Transform Medusa product to our format
        return transformMedusaProduct(product);
      }
    } catch (clientError) {
      console.warn(`Client API failed to fetch product ${productId}, falling back to proxy API:`, clientError);
    }
    
    // Fall back to our proxy API to avoid CORS issues
    console.log(`Using proxy API to fetch product ${productId}`);
    
    // Use our proxy API
    const proxyUrl = `/api/medusa-proxy?path=store/products/${productId}`;
    const proxyResponse = await fetch(proxyUrl);
    const data = await proxyResponse.json();
    
    if (!data.product) {
      console.log(`No product found with ID ${productId} in proxy API response`);
      return null;
    }
    
    // Transform product
    return transformMedusaProduct(data.product);
  } catch (error) {
    console.error(`Failed to fetch product with ID ${productId}:`, error);
    return null;
  }
};

/**
 * Fetches featured products from Medusa backend
 */
export const fetchFeaturedProducts = async (limit: number = 4): Promise<Product[]> => {
  return fetchProducts({ 
    featured: true,
    limit
  });
};

/**
 * Fetches products by category from Medusa backend
 */
export const fetchProductsByCategory = async (
  categoryId: string, 
  limit: number = 12,
  offset: number = 0
): Promise<Product[]> => {
  return fetchProducts({
    category_id: categoryId,
    limit,
    offset
  });
};

/**
 * Searches products by query string
 */
export const searchProducts = async (
  query: string,
  limit: number = 12
): Promise<Product[]> => {
  return fetchProducts({
    q: query,
    limit
  });
}; 