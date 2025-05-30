import { Product } from '@/types';
import { transformMedusaProduct } from '@/services/medusa-service';

// Hard-coded publishable API key to guarantee it's set for any direct fetch request
const PUBLISHABLE_API_KEY = 'pk_8c83b91984f77e065ff8066c422062338290c16734aff13728862b5ba8c25d50';

/**
 * Direct fetch to Medusa store API to get products
 * This is a more reliable method than using the Medusa client in some cases
 */
export async function fetchMedusaStoreProducts(options: {
  limit?: number;
  category?: string;
  featured?: boolean;
  searchQuery?: string;
} = {}): Promise<Product[]> {
  try {
    // Try to use the proxy API endpoint if running in the browser to avoid CORS issues
    const isServer = typeof window === 'undefined';
    let url: string;
    
    if (!isServer) {
      // Use the Next.js API route to proxy the request
      url = `/api/medusa-proxy`;
      console.log('[FETCH DEBUG] Using Next.js API proxy for Medusa request');
    } else {
      // Direct Medusa connection for server-side requests
      const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
      url = `${baseUrl}/store/products`;
      console.log('[FETCH DEBUG] Using direct Medusa connection (server-side)');
    }
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    
    // Add path for proxy requests
    if (!isServer) {
      queryParams.append('path', 'store/products');
    }
    
    // Add limit
    if (options.limit) {
      queryParams.append('limit', options.limit.toString());
    } else {
      // Set a high limit to fetch all products
      queryParams.append('limit', '100');
    }
    
    // Add expand parameter to get more data
    queryParams.append('expand', 'variants');
    
    // Add category filter
    if (options.category && options.category !== 'all') {
      queryParams.append('collection_id[]', options.category);
    }
    
    // Add featured filter
    if (options.featured) {
      queryParams.append('tags[]', 'featured');
    }
    
    // Add search filter
    if (options.searchQuery) {
      queryParams.append('q', options.searchQuery);
    }
    
    // Always use the hardcoded API key to avoid issues
    console.log(`[FETCH DEBUG] Using API key: ${PUBLISHABLE_API_KEY.substring(0, 10)}...`);
    
    // Make the request with explicit UTF-8 encoding
    const fullUrl = `${url}?${queryParams.toString()}`;
    console.log(`[FETCH DEBUG] Fetching from: ${fullUrl}`);
    
    const response = await fetch(fullUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        'x-publishable-api-key': PUBLISHABLE_API_KEY
      }
    });
    
    if (!response.ok) {
      console.error(`[FETCH ERROR] Medusa API responded with status ${response.status}`);
      const errorText = await response.text();
      console.error('[FETCH ERROR] Error response text:', errorText);
      throw new Error(`Medusa API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log(`[FETCH DEBUG] Received ${data.products?.length || 0} products from Medusa API`);
    
    // Debug: Log raw product data
    if (data.products && data.products.length > 0) {
      console.log('[FETCH DEBUG] First product data:', {
        id: data.products[0].id,
        title: data.products[0].title,
        description: data.products[0].description?.substring(0, 50),
        thumbnail: data.products[0].thumbnail,
        variantsCount: data.products[0].variants?.length || 0
      });
    } else {
      console.warn('[FETCH WARN] No products returned from Medusa API');
      console.log('[FETCH DEBUG] Raw response data:', JSON.stringify(data).substring(0, 200) + '...');
    }
    
    if (!data.products || data.products.length === 0) {
      console.log('[FETCH WARN] Empty products array or missing products key');
      
      // Check if we're using the proxy and the response structure is different
      if (!isServer && data.response && data.response.products) {
        console.log('[FETCH DEBUG] Found products in proxy response structure');
        data.products = data.response.products;
      } else {
        return [];
      }
    }
    
    // Transform the products to match our application format
    const transformedProducts = data.products.map(product => {
      try {
        return transformMedusaProduct(product);
      } catch (error) {
        console.error(`[FETCH ERROR] Error transforming product ${product.id}:`, error);
        
        // Return a simplified product so we don't lose it completely
        return {
          id: product.id,
          title: product.title || 'Unknown Title',
          name: product.title || 'Unknown Title',
          description: product.description || 'No description',
          thumbnail: product.thumbnail || '/images/placeholder/product.png',
          price: (product.variants?.[0]?.prices?.[0]?.amount || 0) / 100,
          variants: product.variants || [],
        };
      }
    });
    
    console.log(`[FETCH DEBUG] Successfully transformed ${transformedProducts.length} products`);
    return transformedProducts;
  } catch (error) {
    console.error('[FETCH ERROR] Error fetching from Medusa API:', error);
    // Return empty array instead of throwing to prevent UI breakage
    return [];
  }
}
