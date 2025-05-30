'use client';

/**
 * Enhanced Medusa Products Component
 * This component fetches and displays products from Medusa backend
 * with improved error handling and format compatibility
 */

import { useEffect, useState } from 'react';
import { ProductGrid } from './ProductGrid';
import { fetchMedusaProducts } from '@/services/medusa-service';
import { fetchMedusaStoreProducts } from '@/utils/direct-medusa-fetch';
import { Product } from '@/types';
import { demoProducts } from '@/lib/demo-products';

interface MedusaProductsProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  category?: string;
  featured?: boolean;
  className?: string;
  fallbackToDemo?: boolean;
  showDebug?: boolean;
  useEnhancedCards?: boolean;
}

export default function EnhancedMedusaProducts({
  title = "Products",
  subtitle = "Browse our collection",
  limit = 12,
  category,
  featured = false,
  className = 'mb-12',
  fallbackToDemo = true, // Always use demo products as fallback
  showDebug = true, // Always show debug info
  useEnhancedCards = true // Enable enhanced 2x2 grid cards by default
}: MedusaProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingDemoProducts, setUsingDemoProducts] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      console.log(`[PRODUCTS DEBUG] Loading products for section "${title}"`);
      console.log(`[PRODUCTS DEBUG] Params: limit=${limit}, category=${category}, featured=${featured}`);
      
      try {
        setLoading(true);
        setError(null);
        
        // First try direct Medusa fetch (more reliable for store products)
        let fetchedProducts: Product[] = [];
        try {
          console.log("[PRODUCTS DEBUG] Attempting direct Medusa fetch...");
          const directProducts = await fetchMedusaStoreProducts({
            limit,
            category,
            featured
          });
          
          if (directProducts && directProducts.length > 0) {
            console.log(`[PRODUCTS DEBUG] Found ${directProducts.length} products via direct Medusa fetch`);
            console.log(`[PRODUCTS DEBUG] First product:`, directProducts[0]);
            fetchedProducts = directProducts;
          } else {
            console.log("[PRODUCTS DEBUG] Direct fetch returned no products");
          }
        } catch (directError) {
          console.error("[PRODUCTS DEBUG] Direct Medusa fetch failed:", directError);
          
          // Try the service-based fetch as backup
          try {
            console.log("[PRODUCTS DEBUG] Attempting service-based Medusa fetch...");
            const serviceProducts = await fetchMedusaProducts({
              limit,
              category,
              featured
            });
            
            if (serviceProducts && serviceProducts.length > 0) {
              console.log(`[PRODUCTS DEBUG] Found ${serviceProducts.length} products via Medusa service`);
              console.log(`[PRODUCTS DEBUG] First product:`, serviceProducts[0]);
              fetchedProducts = serviceProducts;
            } else {
              console.log("[PRODUCTS DEBUG] Service fetch returned no products");
            }
          } catch (serviceError) {
            console.error("[PRODUCTS DEBUG] Medusa service fetch also failed:", serviceError);
          }
        }
        
        // If we have products, use them
        if (fetchedProducts && fetchedProducts.length > 0) {
          console.log(`[PRODUCTS DEBUG] Using ${fetchedProducts.length} real products from Medusa`);
          setProducts(fetchedProducts);
          setUsingDemoProducts(false);
        } 
        // Otherwise fallback to demo products if enabled
        else if (fallbackToDemo) {
          console.log("[PRODUCTS DEBUG] No Medusa products found, using demo products");
          setProducts(demoProducts.slice(0, limit));
          setUsingDemoProducts(true);
        }
        // Last resort - empty array
        else {
          console.log("[PRODUCTS DEBUG] No products found and no fallback enabled");
          setProducts([]);
        }
      } catch (e) {
        console.error("[PRODUCTS DEBUG] Error in product loading flow:", e);
        setError(`Failed to load products: ${e instanceof Error ? e.message : 'Unknown error'}`);
        
        // Fallback to demo products if enabled
        if (fallbackToDemo) {
          console.log("[PRODUCTS DEBUG] Using demo products due to error");
          setProducts(demoProducts.slice(0, limit));
          setUsingDemoProducts(true);
        }
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [limit, category, featured, fallbackToDemo, title, Date.now]); // Force refresh with Date.now()

  // Show error state if there was an error and we're not showing demo products
  if (error && !usingDemoProducts) {
    return (
      <div className="border border-red-300 bg-red-50 my-8 p-4 rounded-md">
        <h3 className="font-medium text-lg text-red-800">Error Loading Products</h3>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {title && <h2 className="font-bold mb-2 text-2xl">{title}</h2>}
      {subtitle && <p className="mb-6 text-zinc-500">{subtitle}</p>}
      
      {usingDemoProducts && (
        <div className="bg-yellow-50 border border-yellow-200 mb-4 p-2 rounded-md text-sm text-yellow-700">
          <p><strong>Note:</strong> Showing demo products because the Medusa backend connection failed.</p>
        </div>
      )}
      
      <ProductGrid 
        products={products} 
        isLoading={loading}
        useEnhancedCards={useEnhancedCards} 
      />
    </div>
  );
}
