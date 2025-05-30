'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function MedusaDebugPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [medusaInfo, setMedusaInfo] = useState<any>(null);

  useEffect(() => {
    async function fetchDebugProducts() {
      try {
        setLoading(true);
        const response = await fetch('/api/debug-products');
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch products');
        }
        
        setProducts(data.products || []);
        setMedusaInfo({
          url: data.medusaUrl,
          productCount: data.productCount
        });
      } catch (err) {
        console.error('Error in debug page:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchDebugProducts();
  }, []);

  if (loading) {
    return (
      <div className="container p-4">
        <h1 className="text-2xl font-bold mb-4">Medusa Debug Page</h1>
        <div className="flex justify-center my-8">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container p-4">
        <h1 className="text-2xl font-bold mb-4">Medusa Debug Page</h1>
        <div className="bg-red-50 border border-red-400 rounded p-4 my-4">
          <h2 className="text-red-800 font-medium">Error</h2>
          <p className="text-red-700">{error}</p>
        </div>
        <Link href="/">
          <Button>Back to home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container p-4">
      <h1 className="text-2xl font-bold mb-4">Medusa Debug Page</h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
        <h2 className="font-medium mb-2">Medusa Connection Test</h2>
        <p>If products aren't loading, check your Medusa connection and API key.</p>
        <div className="mt-4 space-y-2">
          <button 
            onClick={async () => {
              try {
                const response = await fetch('/api/medusa-test');
                if (response.ok) {
                  const data = await response.json();
                  console.log('Diagnostic data:', data);
                  alert(`Diagnostic completed. Check console for details.\n\nHealth: ${data.results.healthCheck?.ok ? '✅' : '❌'}\nStore: ${data.results.storeInfo?.ok ? '✅' : '❌'}\nProducts: ${data.results.products?.ok ? '✅' : '❌'}`);
                } else {
                  alert('Diagnostic test failed');
                }
              } catch (e) {
                console.error('Error running diagnostic:', e);
                alert('Error running diagnostic. Check console.');
              }
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Run Diagnostic Test
          </button>
          
          <button 
            onClick={async () => {
              try {
                const response = await fetch('/api/setup-api-key');
                if (response.ok) {
                  const data = await response.json();
                  console.log('API Key check:', data);
                  alert(`API Key check complete. Check console for details.\n\nResult: ${data.apiKeyWorking ? '✅ Working' : '❌ Not working'}\n\nRecommendation: ${data.recommendedAction}`);
                } else {
                  alert('API key check failed');
                }
              } catch (e) {
                console.error('Error checking API key:', e);
                alert('Error checking API key. Check console.');
              }
            }}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Check API Key
          </button>
        </div>
      </div>
      
      {medusaInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
          <h2 className="font-medium mb-2">Medusa Information</h2>
          <p>API URL: {medusaInfo.url}</p>
          <p>Product Count: {medusaInfo.productCount}</p>
        </div>
      )}
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Products ({products.length})</h2>
        {products.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-300 rounded p-4">
            <p>No products found. Make sure your Medusa server is running.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-square relative bg-gray-100">
                  {product.thumbnail ? (
                    <Image 
                      src={product.thumbnail} 
                      alt={product.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-lg">{product.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                  
                  {product.variants && product.variants.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-medium">Variants:</h4>
                      <ul className="text-xs text-gray-500 mt-1">
                        {product.variants.map((variant: any) => (
                          <li key={variant.id}>
                            {variant.title} - 
                            {variant.prices && variant.prices.length > 0 ? 
                              (variant.prices[0].amount / 100).toFixed(2) + ' ' + variant.prices[0].currency_code 
                              : 'No price'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <p className="text-xs font-mono text-gray-500 break-all">ID: {product.id}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-6">
        <Link href="/">
          <Button>Back to home</Button>
        </Link>
      </div>
    </div>
  );
} 