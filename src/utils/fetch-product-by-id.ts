/**
 * Utility to fetch a single product from Medusa by ID
 */
import { transformMedusaProduct } from '@/services/medusa-service';
import { Product } from '@/types';

export async function fetchProductById(productId: string): Promise<Product | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
    const url = `${baseUrl}/store/products/${productId}`;
    
    // Get the API key from the environment or use a fallback
    const apiKey = process.env.NEXT_PUBLIC_MEDUSA_API_KEY || 'pk_8c83b91984f77e065ff8066c422062338290c16734aff13728862b5ba8c25d50';
    
    console.log(`Fetching single product from Medusa API: ${url}`);
    const response = await fetch(url, {
      headers: {
        'x-publishable-api-key': apiKey
      }
    });
    
    if (!response.ok) {
      console.error(`Medusa API responded with status ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    console.log('Received product data from Medusa API:', data.product ? 'success' : 'empty');
    
    if (!data.product) {
      return null;
    }
    
    // Transform the product to match our application format
    const transformedProduct = transformMedusaProduct(data.product);
    return transformedProduct;
  } catch (error) {
    console.error('Error fetching product from Medusa API:', error);
    return null;
  }
}
