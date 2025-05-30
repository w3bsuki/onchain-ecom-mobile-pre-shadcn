'use client';

import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/products/ProductCard';
import { useState } from 'react';

export default function ProductsPage() {
  const [category, setCategory] = useState<string | undefined>(undefined);
  const { products, loading, error, usingSampleData } = useProducts({ category });

  // Debug logging
  console.log('Products page data:', { 
    productsCount: products?.length || 0, 
    loading, 
    error: error?.message || null, 
    usingSampleData,
    firstProduct: products && products.length > 0 ? {
      id: products[0].id,
      title: products[0].title,
      imageUrl: products[0].image
    } : null
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Products</h1>
      
      {/* Sample data notice */}
      {usingSampleData && (
        <div className="bg-blue-50 mb-6 p-4 rounded-md text-blue-800">
          <p>
            <strong>Note:</strong> Displaying sample product data because the database connection
            couldn't be established. Check your Supabase configuration.
          </p>
        </div>
      )}
      
      {/* Category filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory(undefined)}
            className={`rounded-full px-4 py-2 text-sm ${
              category ? 'bg-gray-200 text-gray-800' : 'bg-black text-white'
            }`}
          >
            All
          </button>
          
          {/* Hardcoded categories - in a real app, these would be fetched from the API */}
          <button
            type="button"
            onClick={() => setCategory('b5f38845-1c58-4bcd-950a-3f4b607b0023')}
            className={`rounded-full px-4 py-2 text-sm ${
              category === 'b5f38845-1c58-4bcd-950a-3f4b607b0023' 
                ? 'bg-black text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            Men
          </button>
          
          <button
            type="button"
            onClick={() => setCategory('c2d7b1f6-3739-4bcf-9d75-1f1e77a07eb2')}
            className={`rounded-full px-4 py-2 text-sm ${
              category === 'c2d7b1f6-3739-4bcf-9d75-1f1e77a07eb2' 
                ? 'bg-black text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            Women
          </button>
          
          <button
            type="button"
            onClick={() => setCategory('e8f4d623-9e2d-4f3a-b8d0-7920c7d1c5b7')}
            className={`rounded-full px-4 py-2 text-sm ${
              category === 'e8f4d623-9e2d-4f3a-b8d0-7920c7d1c5b7' 
                ? 'bg-black text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            Kids
          </button>
        </div>
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <div className="my-8 text-center">
          <h2 className="text-2xl font-bold">Error loading products</h2>
          <p className="mt-2 text-gray-600">
            There was an error loading the products. Please check your Medusa configuration.
          </p>
        </div>
      )}
      
      {/* Products grid */}
      {!loading && !error && (
        products.length === 0 ? (
          <p className="my-8 text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )
      )}
    </div>
  );
} 