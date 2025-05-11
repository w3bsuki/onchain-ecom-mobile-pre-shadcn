'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MEDUSA_API_URL } from '../../config';
import { MedusaImage } from '../../components/MedusaImage';

// Helper function to format image URLs
const getImageUrl = (thumbnail: string | null) => {
  if (!thumbnail) return null;
  
  // Always use our proxy API for images to avoid CORS and domain issues
  return `/api/medusa-proxy?endpoint=${encodeURIComponent(thumbnail)}`;
};

interface Product {
  id: string;
  title: string;
  handle: string;
  description: string | null;
  thumbnail: string | null;
  variants: any[];
}

export default function MedusaProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publishableKey, setPublishableKey] = useState<string>('');

  useEffect(() => {
    // Get the publishable key from environment variables
    const key = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';
    setPublishableKey(key);

    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Try to fetch products through our proxy API
        const response = await fetch('/api/medusa-proxy?endpoint=/store/products', {
          headers: {
            'x-publishable-api-key': key,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const data = await response.json();
        setProducts(data.products || []);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError(err.message || 'Failed to fetch products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (key) {
      fetchProducts();
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Medusa Products</h1>
      
      {loading && (
        <div className="flex justify-center items-center h-32">
          <p className="text-lg">Loading products...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p><strong>Error:</strong> {error}</p>
          <p className="mt-2">Publishable Key: {publishableKey ? '✅ Found' : '❌ Missing'}</p>
          <p>API URL: {MEDUSA_API_URL}</p>
        </div>
      )}
      
      {!loading && !error && products.length === 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p>No products found. Have you created and published products in Medusa?</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg overflow-hidden shadow-lg">
            <div className="relative h-48 bg-gray-200">
              {product.thumbnail ? (
                <div className="relative h-full w-full">
                  <img 
                    src={`/api/medusa-image?path=${encodeURIComponent(product.thumbnail)}`}
                    alt={product.title}
                    className="object-cover w-full h-full"
                    width={300}
                    height={300}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No image</p>
                </div>
              )}
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {product.description || 'No description available'}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {product.variants?.length || 0} variants
                </span>
                <a 
                  href={`/products/${product.handle}`} 
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  View Details
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 