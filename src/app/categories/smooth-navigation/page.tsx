'use client';

import React, { useState } from 'react';
import CategoryGrid from '@/components/products/categories/CategoryGrid';
import { 
  Shirt, 
  ShoppingBag, 
  Footprints, 
  Watch, 
  Gift, 
  Tag, 
  Star,
  Zap,
  Heart,
  Sparkles,
  ChevronRight
} from 'lucide-react';

// Demo categories with icons - refined for visual appeal
const categories = [
  {
    id: 'all',
    name: 'All Products',
    icon: <ShoppingBag size={18} strokeWidth={1.5} />,
    count: 120,
  },
  {
    id: 'new',
    name: 'New Arrivals',
    icon: <Sparkles size={18} strokeWidth={1.5} />,
    count: 24,
  },
  {
    id: 'mens',
    name: 'Men\'s',
    icon: <Shirt size={18} strokeWidth={1.5} />,
    count: 42,
  },
  {
    id: 'womens',
    name: 'Women\'s',
    icon: <Shirt size={18} strokeWidth={1.5} />,
    count: 38,
  },
  {
    id: 'footwear',
    name: 'Footwear',
    icon: <Footprints size={18} strokeWidth={1.5} />,
    count: 26,
  },
  {
    id: 'accessories',
    name: 'Accessories',
    icon: <Watch size={18} strokeWidth={1.5} />,
    count: 32,
  },
  {
    id: 'bestsellers',
    name: 'Best Sellers',
    icon: <Star size={18} strokeWidth={1.5} />,
    count: 18,
  },
  {
    id: 'sale',
    name: 'Sale',
    icon: <Tag size={18} strokeWidth={1.5} />,
    count: 15,
  },
  {
    id: 'gifts',
    name: 'Gift Ideas',
    icon: <Gift size={18} strokeWidth={1.5} />,
    count: 12,
  },
  {
    id: 'trending',
    name: 'Trending',
    icon: <Zap size={18} strokeWidth={1.5} />,
    count: 20,
  },
  {
    id: 'favorites',
    name: 'Favorites',
    icon: <Heart size={18} strokeWidth={1.5} />,
    count: 8,
  },
];

export default function CategoryNavigationPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const selectedCategory = categories.find(c => c.id === activeCategory);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-16">
        <h5 className="font-medium mb-2 text-center text-indigo-600 text-sm tracking-wide uppercase">Components</h5>
        <h1 className="font-serif font-medium leading-tight mb-3 text-center text-4xl tracking-tight sm:text-5xl">
          Category Navigation
        </h1>
        <p className="mx-auto max-w-2xl text-center text-lg text-zinc-500">
          Elegant category cards with refined typography and visual hierarchy
        </p>
      </div>
      
      {/* Primary category grid */}
      <div className="mb-20">
        <CategoryGrid
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>
      
      {/* Selected category showcase */}
      <div className="bg-gradient-to-b from-zinc-50 to-white border border-zinc-100 overflow-hidden relative rounded-2xl shadow-sm">
        <div className="absolute bg-gradient-to-r from-indigo-500/10 to-purple-500/10 h-40 inset-0 opacity-50" />
        
        <div className="px-8 py-12 relative">
          <div className="flex flex-col gap-4 items-center justify-center text-center sm:flex-row sm:gap-6 sm:text-left">
            <div className="flex h-16 items-center justify-center overflow-hidden relative rounded-full w-16 sm:h-20 sm:w-20">
              <div className="absolute bg-gradient-to-b from-zinc-50 to-zinc-100 inset-0" />
              <div className="relative">
                {selectedCategory?.icon && React.cloneElement(selectedCategory.icon as React.ReactElement, { 
                  size: 28,
                  strokeWidth: 1.5,
                  className: 'text-zinc-700' 
                })}
              </div>
            </div>
            
            <div>
              <div className="font-medium mb-1 text-sm text-indigo-600 tracking-wide uppercase">
                Selected Category
              </div>
              <h2 className="font-serif font-medium mb-2 text-3xl tracking-tight">
                {selectedCategory?.name}
              </h2>
              <p className="text-zinc-600">
                This category contains <span className="font-medium">{selectedCategory?.count}</span> products
              </p>
            </div>
          </div>
          
          <div className="mt-8 border-t border-zinc-200 pt-8">
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="group">
                  <div className="aspect-[4/5] bg-zinc-100 overflow-hidden relative rounded-lg">
                    <div className="absolute bg-gradient-to-b from-black/0 to-black/10 inset-0 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <div className="mt-3">
                    <h3 className="font-medium mb-1 text-sm">Product {item}</h3>
                    <p className="flex items-center justify-between text-sm text-zinc-500">
                      <span>$129.00</span>
                      <span className="flex items-center text-xs text-zinc-400">
                        View
                        <ChevronRight size={12} className="ml-1" />
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 