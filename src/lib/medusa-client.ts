import Medusa from '@medusajs/medusa-js';

// Medusa backend URL from environment variable
export const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_API_URL || 'http://localhost:9000';
export const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';

// Create client singleton
let medusaClient: Medusa | null = null;

export function getClient(): Medusa {
  if (!medusaClient) {
    medusaClient = new Medusa({
      baseUrl: MEDUSA_BACKEND_URL,
      maxRetries: 3,
      publishableApiKey: MEDUSA_PUBLISHABLE_KEY
    });
  }
  return medusaClient;
}

/**
 * Get publishable API key from Medusa
 * This is used for client-side requests that require authentication
 */
export async function getPublishableApiKey(): Promise<string> {
  // If we already have a key in the environment, use that
  if (MEDUSA_PUBLISHABLE_KEY) {
    return MEDUSA_PUBLISHABLE_KEY;
  }
  
  try {
    // Try to fetch the publishable API key from the Medusa server
    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/publishable-api-keys`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.warn('Could not fetch publishable API key from Medusa');
      return '';
    }
    
    const data = await response.json();
    if (data.publishable_api_keys && data.publishable_api_keys.length > 0) {
      return data.publishable_api_keys[0].id;
    }
    
    return '';
  } catch (error) {
    console.error('Error fetching publishable API key:', error);
    return '';
  }
}

// Helper functions for common Medusa operations

/**
 * Get all products from Medusa
 */
export async function getProducts() {
  try {
    console.log('Attempting to fetch products from Medusa...');
    console.log('Medusa backend URL:', MEDUSA_BACKEND_URL);
    
    // Try direct fetch first to bypass proxy issues
    try {
      console.log('Trying direct fetch to Medusa...');
      const directResponse = await fetch(`${MEDUSA_BACKEND_URL}/store/products`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });
      
      if (directResponse.ok) {
        console.log('Direct fetch successful!');
        const data = await directResponse.json();
        
        if (data.products?.length) {
          console.log(`Found ${data.products.length} products directly from Medusa`);
          data.products.forEach((p: any) => {
            // Update thumbnail URLs to use direct paths
            if (p.thumbnail) {
              console.log(`Product ${p.id} - ${p.title} has thumbnail: ${p.thumbnail}`);
              // Make sure thumbnail is a full URL
              if (p.thumbnail.startsWith('/')) {
                console.log(`Converting ${p.thumbnail} to full URL`);
                p.thumbnail = `${MEDUSA_BACKEND_URL}${p.thumbnail}`;
              } else if (!p.thumbnail.startsWith('http')) {
                console.log(`Converting ${p.thumbnail} to full URL with slash`);
                p.thumbnail = `${MEDUSA_BACKEND_URL}/${p.thumbnail}`;
              }
              
              // Add cache-busting parameter
              p.thumbnail = `${p.thumbnail}?t=${Date.now()}`;
              
              console.log(`Final thumbnail URL: ${p.thumbnail}`);
            } else {
              console.log(`Product ${p.id} - ${p.title} has NO thumbnail`);
              // Set better thumbnail for products without images
              p.thumbnail = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300&h=300&fit=crop';
            }
          });
        } else {
          console.warn('No products found in direct response');
        }
        
        return data.products || [];
      } else {
        console.warn(`Direct fetch failed with status ${directResponse.status}, falling back to proxy...`);
      }
    } catch (directError) {
      console.warn('Direct fetch error:', directError);
      console.log('Falling back to proxy...');
    }
    
    // Fall back to proxy method
    console.log('Using proxy API to fetch products...');
    const response = await fetch('/api/medusa-proxy?endpoint=/store/products', {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products via proxy: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.products?.length) {
      console.log(`Found ${data.products.length} products via proxy`);
      data.products.forEach((p: any) => {
        // Update thumbnail URLs to use direct paths
        if (p.thumbnail) {
          console.log(`Product ${p.id} - ${p.title} has thumbnail: ${p.thumbnail}`);
          // Make sure thumbnail is a full URL
          if (p.thumbnail.startsWith('/')) {
            console.log(`Converting ${p.thumbnail} to full URL`);
            p.thumbnail = `${MEDUSA_BACKEND_URL}${p.thumbnail}`;
          } else if (!p.thumbnail.startsWith('http')) {
            console.log(`Converting ${p.thumbnail} to full URL with slash`);
            p.thumbnail = `${MEDUSA_BACKEND_URL}/${p.thumbnail}`;
          }
          
          // Add cache-busting parameter
          p.thumbnail = `${p.thumbnail}?t=${Date.now()}`;
          
          console.log(`Final thumbnail URL: ${p.thumbnail}`);
        } else {
          console.log(`Product ${p.id} - ${p.title} has NO thumbnail`);
          // Set better thumbnail for products without images
          p.thumbnail = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300&h=300&fit=crop';
        }
      });
    } else {
      console.warn('No products found via proxy');
    }
    
    return data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Get a single product by ID
 */
export async function getProduct(id: string) {
  try {
    // Use the proxy API endpoint to avoid CORS issues
    const response = await fetch(`/api/medusa-proxy?endpoint=/store/products/${id}`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Log thumbnail URL for debugging
    if (data.product?.thumbnail) {
      console.log(`Product ${id} thumbnail: ${data.product.thumbnail}`);
    } else {
      console.log(`Product ${id} has no thumbnail`);
    }
    
    return data.product || null;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}

/**
 * Create a new cart
 */
export async function createCart() {
  const client = getClient();
  try {
    const { cart } = await client.carts.create({});
    return cart;
  } catch (error) {
    console.error('Error creating cart:', error);
    return null;
  }
}

/**
 * Add item to cart
 */
export async function addToCart(cartId: string, variantId: string, quantity: number) {
  const client = getClient();
  try {
    const { cart } = await client.carts.lineItems.create(cartId, {
      variant_id: variantId,
      quantity,
    });
    return cart;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return null;
  }
}

/**
 * Get cart by ID
 */
export async function getCart(cartId: string) {
  const client = getClient();
  try {
    const { cart } = await client.carts.retrieve(cartId);
    return cart;
  } catch (error) {
    console.error('Error fetching cart:', error);
    return null;
  }
}

export default getClient(); 