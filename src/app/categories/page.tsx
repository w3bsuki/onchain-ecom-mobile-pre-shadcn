'use client';

import { useState } from 'react';
import { useOnchainStoreContext } from 'src/components/OnchainStoreProvider';
import { Banner } from 'src/components/Banner';
import Navbar from 'src/components/Navbar';
import Link from 'next/link';
import ProductImage from 'src/components/ProductImage';

// Define categories - in a real app, these would likely come from an API
const categories = [
  { id: 'clothing', name: 'Clothing' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'footwear', name: 'Footwear' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'home', name: 'Home & Living' }
];

export default function CategoriesPage() {
  const { products } = useOnchainStoreContext();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // For demo purposes, assign products to categories randomly
  const categorizedProducts = products?.map(product => ({
    ...product,
    category: categories[Math.floor(Math.random() * categories.length)].id
  })) || [];
  
  // Filter products by the selected category
  const filteredProducts = selectedCategory
    ? categorizedProducts.filter(product => product.category === selectedCategory)
    : categorizedProducts;

  return (
    <div className="flex min-h-screen flex-col font-sansMono">
      <Banner />
      <Navbar />
      
      <main className="container mx-auto flex-grow px-4 pt-24">
        <h1 className="mb-8 text-3xl font-bold">Shop by Category</h1>
        
        {/* Category filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            type="button"
            className={`rounded-full px-4 py-2 text-sm transition ${
              selectedCategory === null
                ? 'bg-black text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`rounded-full px-4 py-2 text-sm transition ${
                selectedCategory === category.id
                  ? 'bg-black text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Category description */}
        {selectedCategory && (
          <div className="mb-8">
            <h2 className="mb-2 text-xl font-bold">
              {categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-gray-600">
              Browse our selection of {categories.find(c => c.id === selectedCategory)?.name.toLowerCase()}.
              We offer the best quality products at competitive prices.
            </p>
          </div>
        )}
        
        {/* Products grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <Link
              href={`/products/${product.id}`}
              key={product.id}
              className="group flex flex-col rounded-lg border border-gray-200 p-4 transition hover:shadow-md"
            >
              <div className="mb-4 flex h-48 items-center justify-center overflow-hidden">
                <ProductImage
                  src={typeof product.image === 'string' ? product.image : null}
                  alt={product.name}
                  className="h-full w-auto max-w-full object-contain transition-transform group-hover:scale-105"
                  width={200}
                  height={200}
                />
              </div>
              <div className="mt-auto">
                <span className="mb-2 inline-block rounded-full bg-gray-100 px-2 py-1 text-xs">
                  {categories.find(c => c.id === product.category)?.name}
                </span>
                <h3 className="mb-1 font-medium">{product.name}</h3>
                <p className="font-bold">{product.price.toFixed(2)} USDC</p>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <div className="my-16 text-center">
            <h2 className="mb-2 text-xl font-bold">No products found</h2>
            <p className="mb-8 text-gray-600">
              We couldn't find any products in this category. Please try another category or check back later.
            </p>
            <button
              type="button"
              className="rounded bg-black px-6 py-2 text-white hover:bg-gray-800"
              onClick={() => setSelectedCategory(null)}
            >
              View All Products
            </button>
          </div>
        )}
      </main>
    </div>
  );
} 