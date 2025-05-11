import { useState, useEffect } from 'react';
import { getProducts } from '../lib/medusa-client';
import type { Product } from '../types';

// Direct image URL function
function getDirectImageUrl(thumbnail: string | null): string {
  if (!thumbnail) {
    return 'https://via.placeholder.com/300x300?text=Product';
  }
  
  // Construct direct URL to Medusa
  if (thumbnail.startsWith('/')) {
    return `http://localhost:9000${thumbnail}`;
  }
  
  if (!thumbnail.startsWith('http')) {
    return `http://localhost:9000/${thumbnail}`;
  }
  
  // Add cache-busting parameter if not already present
  if (!thumbnail.includes('?')) {
    return `${thumbnail}?t=${Date.now()}`;
  }
  
  return thumbnail;
}

// Reliable fallback products if nothing works
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'fallback-1',
    name: 'Sample Product 1',
    price: 19.99,
    image: 'https://via.placeholder.com/300x300?text=Sample+1'
  },
  {
    id: 'fallback-2',
    name: 'Sample Product 2',
    price: 29.99,
    image: 'https://via.placeholder.com/300x300?text=Sample+2'
  }
];

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        
        // Fetch products from Medusa
        const medusaProducts = await getProducts();
        
        console.log('Raw Medusa products:', medusaProducts);
        
        if (!medusaProducts || medusaProducts.length === 0) {
          console.warn('No products from Medusa - using fallbacks');
          setProducts(FALLBACK_PRODUCTS);
          setLoading(false);
          return;
        }
        
        // Convert Medusa products to our Product format
        const formattedProducts = medusaProducts.map((medusaProduct: any) => {
          // Get the first variant's price or fallback
          const price = medusaProduct.variants?.[0]?.prices?.[0]?.amount 
            ? Number.parseFloat((medusaProduct.variants[0].prices[0].amount / 100).toFixed(2))
            : 19.99;
          
          // Get direct image URL
          const imageUrl = getDirectImageUrl(medusaProduct.thumbnail);
          
          console.log(`Product ${medusaProduct.title} image: ${imageUrl}`);
          
          return {
            id: medusaProduct.id || `product-${Math.random().toString(36).substr(2, 9)}`,
            name: medusaProduct.title || 'Product',
            price,
            image: imageUrl,
          };
        });
        
        if (formattedProducts.length > 0) {
          setProducts(formattedProducts);
        } else {
          console.warn('No formatted products - using fallbacks');
          setProducts(FALLBACK_PRODUCTS);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts(FALLBACK_PRODUCTS);
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, loading, error };
} 