import { useEffect, useState } from 'react';
import { Product } from '@/types';
import { fetchProductById } from '@/utils/fetch-product-by-id';
import { demoProducts } from '@/lib/demo-products';

export function useProduct(productId: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [usingSampleData, setUsingSampleData] = useState<boolean>(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      console.log(`useProduct hook - fetching product with ID: ${productId}`);
      
      try {
        // Try to fetch from Medusa
        const fetchedProduct = await fetchProductById(productId);
        
        if (fetchedProduct) {
          console.log('useProduct hook - using Medusa product data');
          setProduct(fetchedProduct);
          setUsingSampleData(false);
        } else {
          console.log('useProduct hook - Medusa product not found, looking for sample data');
          // Try to find a matching product in demo data
          const sampleProduct = demoProducts.find(p => p.id === productId);
          
          if (sampleProduct) {
            console.log('useProduct hook - using sample product data');
            setProduct(sampleProduct);
            setUsingSampleData(true);
          } else {
            console.log('useProduct hook - product not found in any data source');
            setProduct(null);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch product'));
        
        // Try to find a matching product in demo data
        const sampleProduct = demoProducts.find(p => p.id === productId);
        if (sampleProduct) {
          setProduct(sampleProduct);
          setUsingSampleData(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error, usingSampleData };
}
