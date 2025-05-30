'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

export default function MedusaProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching all Medusa products...');
        setLoading(true);
        
        const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
        const response = await fetch(`${baseUrl}/store/products?expand=variants,images,collection,tags,options&limit=100`);
        
        if (!response.ok) {
          throw new Error(`API responded with status ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched data from Medusa API:', data);
        
        // Extract categories from products
        const uniqueCategories = new Map<string, {id: string, name: string}>();
        
        const transformedProducts = data.products.map((product: any) => {
          // Get default price from first variant
          const defaultVariant = product.variants?.[0];
          const price = defaultVariant?.prices?.[0]?.amount 
            ? defaultVariant.prices[0].amount / 100  // Convert from cents to dollars
            : 0;
            
          // Get image
          const image = product.thumbnail || 
            (product.images && product.images.length > 0 ? product.images[0].url : null);
          
          // Track categories
          if (product.collection) {
            uniqueCategories.set(product.collection.id, {
              id: product.collection.id,
              name: product.collection.title
            });
          }
            
          return {
            id: product.id,
            name: product.title,
            title: product.title,
            description: product.description,
            image: image,
            thumbnail: image,
            price: price,
            variants: product.variants,
            category: product.collection?.id || null,
            categoryName: product.collection?.title || 'Uncategorized'
          };
        });
        
        setProducts(transformedProducts);
        setCategories(Array.from(uniqueCategories.values()));
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Filter products by category
  const filteredProducts = activeCategory 
    ? products.filter(product => product.category === activeCategory)
    : products;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">All Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4 animate-pulse">
              <div className="bg-gray-200 h-48 w-full mb-4"></div>
              <div className="bg-gray-200 h-4 w-2/3 mb-2"></div>
              <div className="bg-gray-200 h-4 w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">All Products</h1>
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          <p className="font-medium">Error loading products</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      
      {/* Category filters */}
      {categories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-3">Categories</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === null 
                  ? 'bg-black text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id 
                    ? 'bg-black text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Products grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link 
              href={`/products/${product.id}`} 
              key={product.id}
              className="group rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square overflow-hidden bg-gray-100">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name || ''}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {product.name}
                </h3>
                
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                  {product.description || 'No description available'}
                </p>
                
                <div className="flex items-end justify-between mt-auto">
                  <p className="text-lg font-semibold">${product.price.toFixed(2)}</p>
                  
                  <span className="px-3 py-1 bg-black text-white text-xs font-medium rounded-full">
                    View Details
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
          <p>No products found for the selected category.</p>
        </div>
      )}
    </div>
  );
}
