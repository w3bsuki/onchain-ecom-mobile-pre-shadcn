'use client';

import { useEffect, useState } from 'react';
import { ProductGrid } from './ProductGrid';
import { fetchMedusaStoreProducts } from '@/utils/direct-medusa-fetch';
import { Product } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface CyrillicAwareProductsProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  className?: string;
}

export default function CyrillicAwareProducts({
  title = "Cyrillic Products",
  subtitle = "Special handling for Cyrillic characters",
  limit = 12,
  className = 'mb-12',
}: CyrillicAwareProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);
        
        // Enhanced error handling for Cyrillic products
        try {
          const directProducts = await fetchMedusaStoreProducts({ limit });
          
          if (directProducts && directProducts.length > 0) {
            // Process products for proper Cyrillic display
            const processedProducts = directProducts.map(product => {
              // Ensure proper encoding
              const title = product.title || product.name || "Untitled Product";
              const description = product.description || "";
              
              return {
                ...product,
                title,
                name: title,
                description
              };
            });
            
            console.log(`Found ${directProducts.length} products with Cyrillic support`);
            setProducts(processedProducts);
          } else {
            throw new Error("No products found");
          }
        } catch (err) {
          console.error("Cyrillic product fetch failed:", err);
          throw err;
        }
      } catch (e) {
        console.error("Error loading Cyrillic products:", e);
        setError(`Failed to load products: ${e instanceof Error ? e.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [limit]);

  if (error) {
    return (
      <div className="border border-red-300 bg-red-50 my-8 p-4 rounded-md">
        <h3 className="font-medium text-lg text-red-800">Error Loading Products</h3>
        <p className="text-red-700">{error}</p>
        <div className="mt-4">
          <Link href="/medusa-debug">
            <Button size="sm" variant="outline">
              Go to Debug Page
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {title && <h2 className="font-bold mb-2 text-2xl">{title}</h2>}
      {subtitle && <p className="mb-6 text-zinc-500">{subtitle}</p>}
      
      <div className="mb-4">
        <Link href="/medusa-debug">
          <Button size="sm" variant="outline">
            View Debug Page
          </Button>
        </Link>
      </div>
      
      <ProductGrid 
        products={products} 
        isLoading={loading}
        useEnhancedCards={true} 
      />
    </div>
  );
} 