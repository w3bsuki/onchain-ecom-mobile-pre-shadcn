'use client';

import { useState, useEffect } from 'react';
import { MEDUSA_API_URL } from '../../config';
import Link from 'next/link';

export default function MedusaDebugPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/medusa-proxy?endpoint=/store/products');
        if (!response.ok) {
          throw new Error(`Error fetching products: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data.products || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  // Helper function to render different versions of the image URL
  const renderImageVersions = (thumbnail: string | null) => {
    if (!thumbnail) return <p>No thumbnail available</p>;
    
    // Create different versions of the URL
    const asIs = thumbnail;
    const withMedusaUrl = `${MEDUSA_API_URL}${thumbnail.startsWith('/') ? '' : '/'}${thumbnail}`;
    const withoutLeadingSlash = thumbnail.startsWith('/') ? thumbnail.substring(1) : thumbnail;
    const medusaWithoutLeadingSlash = `${MEDUSA_API_URL}/${withoutLeadingSlash}`;
    
    return (
      <div className="grid gap-2">
        <div>
          <h4 className="font-semibold">Original URL:</h4>
          <p className="break-all text-xs bg-gray-100 p-1">{asIs}</p>
          <div className="mt-1 mb-3">
            <img 
              src={asIs} 
              alt="Original URL" 
              className="h-12 border"
              onError={(e) => e.currentTarget.classList.add('border-red-500')}
              onLoad={(e) => e.currentTarget.classList.add('border-green-500')}
            />
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold">With Medusa URL:</h4>
          <p className="break-all text-xs bg-gray-100 p-1">{withMedusaUrl}</p>
          <div className="mt-1 mb-3">
            <img 
              src={withMedusaUrl} 
              alt="With Medusa URL" 
              className="h-12 border"
              onError={(e) => e.currentTarget.classList.add('border-red-500')}
              onLoad={(e) => e.currentTarget.classList.add('border-green-500')}
            />
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold">With Medusa URL (no leading slash):</h4>
          <p className="break-all text-xs bg-gray-100 p-1">{medusaWithoutLeadingSlash}</p>
          <div className="mt-1 mb-3">
            <img 
              src={medusaWithoutLeadingSlash} 
              alt="With Medusa URL (no leading slash)" 
              className="h-12 border"
              onError={(e) => e.currentTarget.classList.add('border-red-500')}
              onLoad={(e) => e.currentTarget.classList.add('border-green-500')}
            />
          </div>
        </div>

        <div>
          <h4 className="font-semibold">Proxy URL:</h4>
          <p className="break-all text-xs bg-gray-100 p-1">{`/api/medusa-proxy?endpoint=${thumbnail}`}</p>
          <div className="mt-1 mb-3">
            <img 
              src={`/api/medusa-proxy?endpoint=${thumbnail}`}
              alt="Proxy URL" 
              className="h-12 border"
              onError={(e) => e.currentTarget.classList.add('border-red-500')}
              onLoad={(e) => e.currentTarget.classList.add('border-green-500')}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Medusa Image Debug</h1>
      
      <Link href="/" className="text-blue-500 hover:underline mb-6 block">
        ← Back to home
      </Link>
      
      <div className="mb-4 bg-yellow-100 p-4 rounded">
        <h2 className="font-semibold">Medusa API URL: <span className="font-normal">{MEDUSA_API_URL}</span></h2>
        <p className="text-sm mt-2">This page tests different ways of loading images from the Medusa backend.</p>
      </div>
      
      {loading && <p>Loading products...</p>}
      
      {error && (
        <div className="bg-red-100 p-4 rounded mb-4">
          <p className="text-red-700">Error: {error}</p>
        </div>
      )}
      
      {!loading && !error && products.length === 0 && (
        <p>No products found in your Medusa store.</p>
      )}
      
      {products.map(product => (
        <div key={product.id} className="border p-4 rounded mb-4">
          <h2 className="text-xl font-bold">{product.title}</h2>
          
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Testing Thumbnail Image:</h3>
            {renderImageVersions(product.thumbnail)}
          </div>
        </div>
      ))}
    </div>
  );
} 