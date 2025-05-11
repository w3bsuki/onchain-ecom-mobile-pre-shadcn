'use client';

import { useState, useEffect } from 'react';
import { getProducts } from '../../lib/medusa-client';

export default function ImageDebugPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        console.log('Fetching products for debug page...');
        const fetchedProducts = await getProducts();
        console.log('Fetched products:', fetchedProducts);
        setProducts(fetchedProducts || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  function createDirectUrl(thumbnail: string | null): string {
    if (!thumbnail) return 'https://via.placeholder.com/300x300?text=No+Image';
    
    if (thumbnail.startsWith('/')) {
      return `http://localhost:9000${thumbnail}`;
    } else if (!thumbnail.startsWith('http')) {
      return `http://localhost:9000/${thumbnail}`;
    }
    
    return thumbnail;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Image Debug Page</h1>
      
      {loading && <p className="mb-4">Loading products...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {!loading && products.length === 0 && (
        <p className="mb-4">No products found</p>
      )}
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Raw Product Data</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-x-auto mb-4">
          {JSON.stringify(products, null, 2)}
        </pre>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: any) => (
          <div key={product.id} className="border rounded p-4">
            <h3 className="font-semibold mb-2">{product.title}</h3>
            
            <div className="mb-4">
              <p className="text-sm mb-1">Original Image URL:</p>
              <div className="bg-gray-50 p-2 rounded text-xs break-all mb-2">
                {product.thumbnail || 'No image URL'}
              </div>
              
              <p className="text-sm mb-1">Direct Image URL:</p>
              <div className="bg-gray-50 p-2 rounded text-xs break-all mb-2">
                {createDirectUrl(product.thumbnail)}
              </div>
            </div>
            
            <div className="mb-4">
              <p className="font-medium mb-2">Original Image:</p>
              {product.thumbnail ? (
                <img 
                  src={product.thumbnail} 
                  alt={product.title}
                  className="max-h-[200px] object-contain mx-auto border"
                  onError={(e) => {
                    console.error(`Failed to load original image: ${product.thumbnail}`);
                    e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Error';
                  }}
                />
              ) : (
                <div className="h-[200px] bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
            
            <div>
              <p className="font-medium mb-2">Direct Image:</p>
              <img 
                src={createDirectUrl(product.thumbnail)} 
                alt={product.title}
                className="max-h-[200px] object-contain mx-auto border"
                onError={(e) => {
                  console.error(`Failed to load direct image: ${createDirectUrl(product.thumbnail)}`);
                  e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Error';
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 