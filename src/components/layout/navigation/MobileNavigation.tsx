'use client';

import { useState, useEffect } from 'react';
import { Filter, Tag, Circle, Sliders, SlidersHorizontal, X, ShoppingBag, Heart, User, Home, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from 'components/ui/button';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface Filter {
  id: string;
  label: string;
  icon: React.FC<{ size?: number; color?: string; className?: string }>;
  appliedCount?: number;
}

export function MobileNavigation() {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const pathname = usePathname();
  
  useEffect(() => {
    setIsMounted(true);
    
    // Add scroll listener to show/hide filters
    const handleScroll = () => {
      setIsScrolledDown(window.scrollY > 200);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
  
  if (!isMounted) return null;
  
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/' },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, href: '/wishlist' },
    { id: 'cart', label: 'Cart', icon: ShoppingBag, href: '/cart' },
    { id: 'account', label: 'Account', icon: User, href: '/account' },
  ];
  
  const filters: Filter[] = [
    { id: 'size', label: 'Size', icon: Tag },
    { id: 'color', label: 'Color', icon: Circle },
    { id: 'category', label: 'Category', icon: Filter },
    { id: 'price', label: 'Price', icon: Sliders },
    { id: 'sort', label: 'Sort', icon: SlidersHorizontal }
  ];
  
  const filterContent: Record<string, JSX.Element> = {
    size: (
      <div className="space-y-5">
        <h3 className="text-base font-medium">Select Size</h3>
        <div className="flex flex-wrap gap-2">
          {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
            <Button 
              key={size}
              variant="outline"
              className="h-12 w-16 text-base hover:bg-black hover:text-white"
            >
              {size}
            </Button>
          ))}
        </div>
      </div>
    ),
    
    color: (
      <div className="space-y-5">
        <h3 className="text-base font-medium">Select Color</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { name: 'Black', hex: '#000000' },
            { name: 'White', hex: '#FFFFFF' },
            { name: 'Gray', hex: '#808080' },
            { name: 'Red', hex: '#FF0000' },
            { name: 'Blue', hex: '#0000FF' }
          ].map(color => (
            <button 
              key={color.name}
              className="group flex h-[70px] w-[70px] flex-col items-center justify-center gap-1.5 rounded-lg border border-gray-200 p-0 transition-all hover:border-gray-400"
            >
              <div 
                className="relative h-8 w-8 rounded-full ring-1 ring-gray-200"
                style={{ backgroundColor: color.hex }}
              >
                {color.name === 'Black' && (
                  <Check className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-white" />
                )}
              </div>
              <span className="text-xs font-medium">{color.name}</span>
            </button>
          ))}
        </div>
      </div>
    ),
    
    category: (
      <div className="space-y-5">
        <h3 className="text-base font-medium">Shop by Category</h3>
        <div className="flex flex-col gap-2.5">
          {['All', 'T-Shirts', 'Jeans', 'Dresses', 'Shoes'].map(category => (
            <Button 
              key={category}
              variant={category === 'All' ? 'default' : 'outline'}
              className={cn(
                "justify-start text-base h-12 w-full",
                category === 'All' ? "bg-black text-white hover:bg-black/90" : ""
              )}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    ),
    
    price: (
      <div className="space-y-5">
        <h3 className="text-base font-medium">Price Range</h3>
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
        <div className="mt-5 flex flex-col gap-2.5">
          {['Under $25', '$25 - $50', '$50 - $100', '$100+'].map(range => (
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
      <div className="space-y-5">
        <h3 className="text-base font-medium">Sort By</h3>
        <div className="flex flex-col gap-2.5">
          {['Featured', 'Newest', 'Price: Low to High', 'Price: High to Low'].map((option, i) => (
            <Button 
              key={option}
              variant={i === 0 ? 'default' : 'outline'}
              className={cn(
                "justify-start text-base h-12 w-full",
                i === 0 ? "bg-black text-white hover:bg-black/90" : "hover:bg-black hover:text-white"
              )}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
    )
  };

  // Only show filters on product pages
  const showFilters = pathname === '/' || pathname.includes('/products') || pathname.includes('/categories');
  
  return (
    <>
      {/* Fixed bottom navigation bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-md shadow-[0_-1px_5px_rgba(0,0,0,0.05)] md:hidden">
        <div className="safe-area-bottom flex h-16 items-center justify-around px-1">
          {navItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex w-full flex-col items-center justify-center py-1.5",
                  "transition-colors active:opacity-70",
                  isActive ? "text-black" : "text-gray-500"
                )}
              >
                <div className={cn(
                  "mb-1 flex h-6 w-6 items-center justify-center",
                  isActive && "relative"
                )}>
                  <item.icon className={cn(
                    "h-6 w-6",
                    isActive ? "stroke-[2.5px]" : "stroke-[1.5px]"
                  )} />
                  {isActive && (
                    <div className="absolute -bottom-1 h-1 w-1 rounded-full bg-black" />
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Fixed filter bar - appears when scrolling down on product pages */}
      {showFilters && (
        <AnimatePresence>
          {isScrolledDown && (
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-16 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 shadow-lg backdrop-blur-md md:hidden"
            >
              <div className="flex h-14 items-center overflow-x-auto px-4 no-scrollbar">
                <div className="flex w-full justify-between gap-2">
                  {filters.map(filter => {
                    const isActive = activeFilter === filter.id;
                    return (
                      <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id === activeFilter ? null : filter.id)}
                        className={cn(
                          "flex flex-1 items-center justify-center gap-1.5 rounded-full border py-2 px-3",
                          "transition-all active:scale-95",
                          isActive 
                            ? "bg-black text-white border-black" 
                            : "text-gray-700 border-gray-300 bg-white/50"
                        )}
                      >
                        <filter.icon className="h-4 w-4" />
                        <span className="text-xs font-medium whitespace-nowrap">{filter.label}</span>
                        {filter.appliedCount && (
                          <span className="ml-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-medium text-white">
                            {filter.appliedCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Bottom Sheet */}
      <AnimatePresence>
        {activeFilter && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveFilter(null)}
              className="fixed bottom-0 left-0 right-0 top-0 z-40 bg-black/40"
            />
            
            {/* Sheet Content */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 flex max-h-[90vh] flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl"
            >
              {/* Handle */}
              <div className="flex justify-center py-2 touch-none">
                <div className="h-1 w-12 rounded-full bg-gray-300" />
              </div>
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                <h2 className="text-lg font-semibold">
                  {filters.find(f => f.id === activeFilter)?.label}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveFilter(null)}
                  className="rounded-full h-8 w-8"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto overscroll-contain p-5">
                {filterContent[activeFilter]}
              </div>
              
              {/* Actions */}
              <div className="sticky bottom-0 border-t border-gray-200 bg-white p-4 safe-area-bottom">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 h-12 rounded-full"
                    onClick={() => setActiveFilter(null)}
                  >
                    Clear All
                  </Button>
                  <Button
                    className="flex-1 h-12 rounded-full bg-black hover:bg-black/90"
                    onClick={() => setActiveFilter(null)}
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
      <div className="h-16 md:hidden" />
    </>
  );
}