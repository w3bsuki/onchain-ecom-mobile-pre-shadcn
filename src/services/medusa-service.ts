import { medusaClient } from '@/lib/medusa-client';
import type { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { Product } from '@/types';

/**
 * Transforms a Medusa product into our application's product format
 * Ensures proper UTF-8 encoding for all text fields
 */
export const transformMedusaProduct = (medusaProduct: PricedProduct): Product => {
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
  const image = medusaProduct.thumbnail || 
    (medusaProduct.images?.[0]?.url || null);

  // Extract available colors if present in options
  const colorOption = medusaProduct.options?.find(o => 
    o.title.toLowerCase() === 'color' || o.title.toLowerCase() === 'colours'
  );
  
  const colors = colorOption?.values?.map(v => ({
    name: v.value,
    hex: getColorHex(v.value.toLowerCase())
  })) || [];

  // Build variants array with proper structure
  const variants = medusaProduct.variants?.map(variant => ({
    id: variant.id,
    title: variant.title,
    prices: variant.prices?.map(price => ({
      amount: price.amount,
      currency_code: price.currency_code.toLowerCase()
    }))
  }));
  
  // For debugging - log the original title to see what we're getting from Medusa
  console.log(`Original Medusa product title: "${medusaProduct.title}"`);
  
  // Decode product title and description if needed
  const title = medusaProduct.title || '';
  const description = medusaProduct.description || '';

  // Create Medusa-compatible format
  return {
    id: medusaProduct.id,
    name: title,
    title: title,  // Add title for ProductCard compatibility
    description: description,
    image,
    thumbnail: image, // Add thumbnail for ProductCard compatibility
    price: price / 100, // Convert from cents to dollars
    variants, // Add variants for ProductCard compatibility
    rating: medusaProduct.metadata?.rating ? Number(medusaProduct.metadata.rating) : undefined,
    reviewCount: medusaProduct.metadata?.review_count ? Number(medusaProduct.metadata.review_count) : undefined,
    discount: discount ? discount / 100 : undefined, // Convert percentage to decimal
    colors,
    category: medusaProduct.collection?.title || 'Uncategorized',
  };
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
    // Add more colors as needed
  };
  
  return colorMap[colorName] || '#CCCCCC'; // Default gray if color not found
};

/**
 * Fetches products from Medusa backend
 */
export const fetchMedusaProducts = async (options: { 
  limit?: number;
  category?: string;
  featured?: boolean;
  searchQuery?: string;
} = {}): Promise<Product[]> => {
  try {    console.log('Fetching products from Medusa with options:', options);
    console.log('Using Medusa backend URL:', process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL);
    
    // Build query parameters
    const queryParams: Record<string, any> = {
      limit: options.limit || 12,
    };
    
    // Add category filter
    if (options.category && options.category !== 'all') {
      queryParams.collection_id = [options.category];
    }
    
    // Add featured filter
    if (options.featured) {
      queryParams.tags = ['featured'];
    }
    
    // Add search filter
    if (options.searchQuery) {
      queryParams.q = options.searchQuery;
    }
      // Fetch products from Medusa
    const response = await medusaClient.products.list(queryParams);
    console.log('Medusa response:', JSON.stringify(response, null, 2));
    
    if (!response.products || response.products.length === 0) {
      console.log('No products found in Medusa response');
      return [];
    }
    
    // Transform Medusa products to our format
    const transformedProducts = response.products.map(transformMedusaProduct);
    console.log(`Successfully transformed ${transformedProducts.length} products`);
    return transformedProducts;
  } catch (error) {
    console.error('Failed to fetch products from Medusa:', error);
    throw error;
  }
};

/**
 * Fetches a single product from Medusa backend by ID
 */
export const fetchMedusaProductById = async (productId: string): Promise<Product | null> => {
  try {
    // Fetch the product from Medusa
    const { product } = await medusaClient.products.retrieve(productId);
    
    if (!product) {
      return null;
    }
    
    // Transform Medusa product to our format
    return transformMedusaProduct(product);
  } catch (error) {
    console.error(`Failed to fetch product with ID ${productId}:`, error);
    return null;
  }
};

/**
 * Fetches categories from Medusa
 */
export const fetchMedusaCategories = async () => {
  try {
    // Ensure API key is initialized
    await initializeApiKey();
    
    // Fetch collections from Medusa
    const { collections } = await medusaClient.collections.list();
    
    return collections.map(collection => ({
      id: collection.id,
      name: collection.title,
    }));
  } catch (error) {
    console.error('Failed to fetch categories from Medusa:', error);
    return [];
  }
};
