'use client';

import { useState } from 'react';
import { Shirt, Footprints, Glasses, Tag, Sparkles, Music, Watch, Heart, Gift, Coffee } from 'lucide-react';
import { MobileCategoryNav } from '@/components/ui/MobileCategoryNav';
import { cn } from '@/lib/utils';

// Demo categories with icons
const categoryData = [
  {
    id: 'all',
    name: 'All Products',
    href: '/categories/smooth-navigation?category=all',
    icon: <Tag size={16} />,
    count: 120
  },
  {
    id: 'mens',
    name: 'Men\'s Fashion',
    href: '/categories/smooth-navigation?category=mens',
    icon: <Shirt size={16} />,
    count: 32
  },
  {
    id: 'womens',
    name: 'Women\'s Fashion',
    href: '/categories/smooth-navigation?category=womens',
    icon: <Shirt size={16} />,
    count: 45
  },
  {
    id: 'accessories',
    name: 'Accessories',
    href: '/categories/smooth-navigation?category=accessories',
    icon: <Glasses size={16} />,
    count: 18
  },
  {
    id: 'footwear',
    name: 'Footwear',
    href: '/categories/smooth-navigation?category=footwear',
    icon: <Footprints size={16} />,
    count: 24
  },
  {
    id: 'new',
    name: 'New Arrivals',
    href: '/categories/smooth-navigation?category=new',
    icon: <Sparkles size={16} />,
    count: 15
  },
  {
    id: 'music',
    name: 'Music',
    href: '/categories/smooth-navigation?category=music',
    icon: <Music size={16} />,
    count: 8
  },
  {
    id: 'watches',
    name: 'Watches',
    href: '/categories/smooth-navigation?category=watches',
    icon: <Watch size={16} />,
    count: 12
  },
  {
    id: 'gifts',
    name: 'Gifts',
    href: '/categories/smooth-navigation?category=gifts',
    icon: <Gift size={16} />,
    count: 9
  },
  {
    id: 'coffee',
    name: 'Coffee',
    href: '/categories/smooth-navigation?category=coffee',
    icon: <Coffee size={16} />,
    count: 7
  },
  {
    id: 'sale',
    name: 'Sale',
    href: '/categories/smooth-navigation?category=sale',
    icon: <Heart size={16} />,
    count: 29
  }
];

export default function SmoothCategoryNavDemo() {
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-bold mb-8 text-2xl">Smooth Category Navigation</h1>
      
      {/* Primary category navigation */}
      <div className="mb-8">
        <h2 className="font-semibold mb-3 text-lg">Primary Style</h2>
        <MobileCategoryNav 
          categories={categoryData}
          activeId={activeCategory}
        />
      </div>
      
      {/* Alternative style */}
      <div className="mb-12">
        <h2 className="font-semibold mb-3 text-lg">Alternative Style</h2>
        <div className="bg-zinc-50 p-4 rounded-xl">
          <MobileCategoryNav 
            categories={categoryData.map(cat => ({
              ...cat,
              href: `#${cat.id}`
            }))}
            activeId={activeCategory}
          />
        </div>
      </div>
      
      {/* Example content */}
      <div className="bg-white border border-zinc-200 p-6 rounded-xl">
        <h2 className="font-bold mb-4 text-xl">
          {categoryData.find(c => c.id === activeCategory)?.name || 'All Products'}
        </h2>
        
        <p className="mb-6 text-zinc-600">
          Browse our selection of {categoryData.find(c => c.id === activeCategory)?.name.toLowerCase() || 'products'}.
          We offer the best quality items at competitive prices.
        </p>
        
        {/* Simulated product grid */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div 
              key={item} 
              className="aspect-square animate-pulse bg-zinc-100 rounded-lg"
            />
          ))}
        </div>
        
        {/* Category selection buttons for demo */}
        <div className="border-t border-zinc-200 flex flex-wrap gap-2 mt-8 pt-6">
          {categoryData.map((category) => (
            <button
              key={category.id}
              className={cn(
                "border px-3 py-1.5 rounded-md text-sm",
                activeCategory === category.id
                  ? "bg-teal-700 border-teal-700 text-white"
                  : "bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300"
              )}
              onClick={() => setActiveCategory(category.id)}
            >
              <span className="flex items-center gap-1.5">
                {category.icon}
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 