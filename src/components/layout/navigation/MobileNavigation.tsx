'use client';

import { useState, useEffect } from 'react';
import { Filter, ShoppingBag, Search, User, Home, X, ChevronDown, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from 'components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

interface FilterOption {
  id: string;
  label: string;
  icon: React.FC<{ size?: number; color?: string; className?: string }>;
  appliedCount?: number;
}

export function MobileNavigation() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only lock scrolling when a filter is active
  useEffect(() => {
    if (activeFilter) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeFilter]);
  
  if (!isMounted) {
    return null;
  }
  
  const navItems = [
    { id: 'home', label: 'HOME', icon: Home, href: '/' },
    { id: 'search', label: 'SEARCH', icon: Search, href: '/search' },
    { id: 'filters', label: 'FILTERS', icon: Filter, href: '#', onClick: () => setActiveFilter('category') },
    { id: 'cart', label: 'CART', icon: ShoppingBag, href: '/cart' },
    { id: 'account', label: 'ACCOUNT', icon: User, href: '/account' },
  ];
  
  const filters: FilterOption[] = [
    { id: 'category', label: 'Category', icon: Filter, appliedCount: 0 },
    { id: 'size', label: 'Size', icon: Filter, appliedCount: 0 },
    { id: 'color', label: 'Color', icon: Filter, appliedCount: 0 },
    { id: 'price', label: 'Price', icon: Filter, appliedCount: 0 },
    { id: 'sort', label: 'Sort By', icon: ChevronDown, appliedCount: 0 },
  ];
  
  const filterContent: Record<string, JSX.Element> = {
    size: (
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
            <Button 
              key={size}
              variant="outline"
              className="h-12 w-[calc(33.33%-8px)] text-base hover:bg-black hover:text-white"
            >
              {size}
            </Button>
          ))}
        </div>
      </div>
    ),
    
    color: (
      <div className="space-y-5">
        <div className="grid grid-cols-4 gap-3">
          {[
            { name: 'Black', hex: '#000000' },
            { name: 'White', hex: '#FFFFFF' },
            { name: 'Gray', hex: '#808080' },
            { name: 'Red', hex: '#FF0000' },
            { name: 'Blue', hex: '#0000FF' },
            { name: 'Green', hex: '#008000' },
            { name: 'Yellow', hex: '#FFFF00' },
            { name: 'Purple', hex: '#800080' }
          ].map(color => (
            <button 
              key={color.name}
              type="button"
              className="group flex flex-col items-center justify-center gap-1.5 rounded-lg p-2 transition-all"
            >
              <div 
                className="relative h-12 w-12 rounded-full shadow-sm transition-transform group-hover:scale-110 group-active:scale-95"
                style={{ backgroundColor: color.hex, border: color.hex === '#FFFFFF' ? '1px solid #e5e5e5' : 'none' }}
              >
                {color.name === 'Black' && (
                  <CheckCircle2 className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-white text-black" />
                )}
              </div>
              <span className="text-xs font-medium">{color.name}</span>
            </button>
          ))}
        </div>
      </div>
    ),
    
    category: (
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          {['All Products', 'T-Shirts', 'Jeans', 'Dresses', 'Shoes', 'Accessories', 'Jackets'].map((category, index) => (
            <Button 
              key={category}
              variant={index === 0 ? "default" : "outline"}
              className={cn(
                "justify-between text-base h-12 w-full rounded-lg font-medium",
                index === 0 ? "bg-black text-white hover:bg-black/90" : "",
                index === 0 && "after:ml-2 after:h-5 after:w-5 after:rounded-full after:content-[''] after:bg-white/20"
              )}
            >
              {category}
              {index === 0 && <CheckCircle2 className="h-5 w-5 text-white" />}
            </Button>
          ))}
        </div>
      </div>
    ),
    
    price: (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input 
              type="number" 
              placeholder="Min"
              className="w-full rounded-md border border-gray-200 p-3 pl-7 text-base"
            />
          </div>
          <span className="text-gray-500">to</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input 
              type="number" 
              placeholder="Max"
              className="w-full rounded-md border border-gray-200 p-3 pl-7 text-base"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {['Under $25', '$25 - $50', '$50 - $100', 'Over $100'].map(range => (
            <Button 
              key={range}
              variant="outline"
              className="justify-start text-base h-12 w-full hover:bg-black hover:text-white"
            >
              {range}
            </Button>
          ))}
        </div>
      </div>
    ),
    
    sort: (
      <div className="space-y-2">
        <div className="flex flex-col gap-2">
          {[
            { name: 'Featured', desc: 'Our curated selection' },
            { name: 'Newest', desc: 'Recently added items' },
            { name: 'Price: Low to High', desc: 'Lowest price first' },
            { name: 'Price: High to Low', desc: 'Highest price first' },
            { name: 'Ratings', desc: 'Highest rated first' },
            { name: 'Popularity', desc: 'Best sellers first' }
          ].map((option, i) => (
            <Button 
              key={option.name}
              variant="outline"
              className={cn(
                "flex h-auto w-full flex-col items-start justify-start gap-0.5 p-4 rounded-lg",
                i === 1 ? "border-black bg-black text-white hover:bg-black/90" : "hover:border-black"
              )}
            >
              <span className="font-medium">{option.name}</span>
              <span className="text-xs text-left opacity-70">{option.desc}</span>
              {i === 1 && <CheckCircle2 className="absolute right-3 h-5 w-5 text-white" />}
            </Button>
          ))}
        </div>
      </div>
    )
  };
  
  return (
    <>
      {/* Premium Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        {/* Floating Navigation Bar */}
        <div className="mx-4 mb-4">
          <div className="flex h-16 items-center justify-around rounded-xl bg-black/95 px-1 backdrop-blur-lg shadow-[0_8px_16px_rgba(0,0,0,0.25)]">
            {navItems.map(item => {
              const isActive = item.id === 'filters' 
                ? !!activeFilter 
                : pathname === item.href;
              
              const NavItemContent = (
                <div key={`content-${item.id}`} className="relative flex w-full flex-col items-center justify-center py-1">
                  <div className="relative">
                    {isActive && (
                      <motion.div
                        layoutId="navBackground"
                        className="absolute inset-0 h-10 w-10 -translate-x-2.5 -translate-y-2.5 rounded-full bg-white"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <div className="relative z-10 flex h-5 w-5 items-center justify-center">
                      <item.icon 
                        className={cn(
                          "h-[22px] w-[22px] transition-all",
                          isActive ? "stroke-black" : "stroke-white/80"
                        )} 
                      />
                    </div>
                  </div>
                  
                  <span 
                    className={cn(
                      "mt-1 text-[10px] font-medium tracking-wide transition-all",
                      isActive ? "text-white" : "text-white/70"
                    )}
                  >
                    {item.label}
                  </span>
                </div>
              );
              
              return item.id === 'filters' ? (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveFilter('category')}
                  className="w-full"
                >
                  {NavItemContent}
                </button>
              ) : (
                <Link
                  key={item.id}
                  href={item.href}
                  className="w-full"
                >
                  {NavItemContent}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter Bottom Sheet */}
      <AnimatePresence>
        {activeFilter && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveFilter(null)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />
            
            {/* Sheet Content */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 flex max-h-[85vh] flex-col overflow-hidden rounded-t-3xl bg-white shadow-xl"
            >
              {/* Handle */}
              <div className="flex justify-center py-3 touch-none">
                <div className="h-1 w-16 rounded-full bg-zinc-300" />
              </div>
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
                <h2 className="text-xl font-semibold text-zinc-900">
                  {filters.find(f => f.id === activeFilter)?.label}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveFilter(null)}
                  className="rounded-full h-10 w-10 hover:bg-zinc-100"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
              
              {/* Content */}
              <div className="scrollbar-hide flex-1 overflow-y-auto overscroll-contain p-6">
                {filterContent[activeFilter]}
              </div>
              
              {/* Actions */}
              <div className="sticky bottom-0 border-t border-zinc-100 bg-white p-5 safe-area-bottom">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 h-14 rounded-xl border-zinc-200 font-medium text-base"
                    onClick={() => setActiveFilter(null)}
                  >
                    Clear All
                  </Button>
                  <Button
                    className="flex-1 h-14 rounded-xl bg-black hover:bg-black/90 font-medium text-base"
                    onClick={() => {
                      setActiveFilter(null);
                      // In a real app, this would apply filters
                      // For demo, just navigate to show the filter works
                      if (activeFilter === 'category') {
                        router.push('/categories/all');
                      }
                    }}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom spacing */}
      <div className="h-24 md:hidden" />
    </>
  );
}