import { useState, useEffect } from 'react';
import { getProducts } from '../lib/medusa-client';
import type { Product } from '../types';

// Direct image URL function
function getDirectImageUrl(thumbnail: string | null): string {
  if (!thumbnail) {
    // Better placeholder with a product image
    return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300&h=300&fit=crop';
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

// Reliable fallback products with better images if nothing works
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'fallback-1',
    name: 'Running Shoes',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500'
  },
  {
    id: 'fallback-2',
    name: 'Leather Wallet',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=500'
  },
  {
    id: 'fallback-3',
    name: 'Wireless Headphones',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500'
  },
  {
    id: 'fallback-4',
    name: 'Minimalist Watch',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500'
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