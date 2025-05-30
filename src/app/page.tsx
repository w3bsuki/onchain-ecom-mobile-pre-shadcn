'use client';
import React, { useRef, useState, useEffect } from 'react';
import { MobileCategorySidebar } from '@/components/ui/MobileCategorySidebar';
import { Button } from '@/components/ui/button';
import { FaShirt, FaLayerGroup, FaBagShopping, FaFire } from 'react-icons/fa6';
import { FiArrowRight, FiSearch, FiHome, FiUser, FiShoppingCart, FiSliders, FiTrendingUp, FiPercent } from 'react-icons/fi';
import { Check, RotateCcw } from 'lucide-react';
import SiteFooter from '@/components/layout/site-footer';
import HeroCarousel from '@/components/products/hero-carousel';
import Link from 'next/link';
import { ProductCard } from '@/components/products/ProductCard';
import { cn } from '@/lib/utils';
import BottomSheet from '@/components/ui/bottom-sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

// Pre-defined category cards data to avoid recreating on each render
const categoryCards = [
  { id: 'tshirts', name: 'T-Shirts', icon: <FaShirt size={18} />, count: 128 },
  { id: 'shirts', name: 'Shirts', icon: <FaShirt size={18} />, count: 96 },
  { id: 'shorts', name: 'Shorts', icon: <FaLayerGroup size={18} />, count: 64 },
  { id: 'shoes', name: 'Shoes', icon: <FaBagShopping size={18} />, count: 78 },
  { id: 'denim', name: 'Denim', icon: <FaLayerGroup size={18} />, count: 53 },
  { id: 'jackets', name: 'Jackets', icon: <FaFire size={18} />, count: 42 },
];

// Pre-defined filter options to avoid recreating on each render
const filterOptions = [
  { id: 'newest', name: 'Newest' },
  { id: 'price-asc', name: 'Price: Low to High' },
  { id: 'price-desc', name: 'Price: High to Low' },
  { id: 'popular', name: 'Popular' },
];

// Default quick filters
const DEFAULT_QUICK_FILTERS = [
  { id: 'new', name: 'NEW', icon: <FaFire size={16} /> },
  { id: 'hot', name: 'TRENDING', icon: <FiTrendingUp size={16} /> },
  { id: 'sale', name: 'SALE', icon: <FiPercent size={16} /> },
];

// Default sizes for filters
const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const DEFAULT_COLORS = [
  { id: "black", name: "Black", hex: "#000000" },
  { id: "white", name: "White", hex: "#FFFFFF" },
  { id: "gray", name: "Gray", hex: "#808080" },
  { id: "blue", name: "Blue", hex: "#0000FF" },
  { id: "red", name: "Red", hex: "#FF0000" }
];
const DEFAULT_MAX_PRICE = 500;

// Demo products - Used as fallback
const DEMO_PRODUCTS = [
  {
    id: "demo1",
    title: "Basic T-Shirt",
    thumbnail: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop",
    price: 29.99,
    compare_at_price: 39.99
  },
  {
    id: "demo2",
    title: "Denim Jeans",
    thumbnail: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop",
    price: 59.99
  },
  {
    id: "demo3",
    title: "Casual Jacket",
    thumbnail: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop",
    price: 89.99,
    compare_at_price: 129.99
  },
  {
    id: "demo4",
    title: "Running Shoes",
    thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop",
    price: 79.99
  }
];

// Brand logos for the carousel
const BRAND_LOGOS = [
  { 
    name: "Nike", 
    id: "nike",
    logoUrl: "https://cdn.iconscout.com/icon/free/png-256/free-nike-1-202653.png"
  },
  { 
    name: "Adidas", 
    id: "adidas",
    logoUrl: "https://cdn.iconscout.com/icon/free/png-256/free-adidas-282414.png"
  },
  { 
    name: "Puma", 
    id: "puma",
    logoUrl: "https://cdn.iconscout.com/icon/free/png-256/free-puma-3421676-2854595.png"
  },
  { 
    name: "Reebok", 
    id: "reebok",
    logoUrl: "https://cdn.iconscout.com/icon/free/png-256/free-reebok-3421498-2854417.png"
  },
  { 
    name: "New Balance", 
    id: "newbalance",
    logoUrl: "https://cdn.iconscout.com/icon/free/png-256/free-new-balance-3421505-2854424.png"
  },
  { 
    name: "Under Armour", 
    id: "underarmour",
    logoUrl: "https://cdn.iconscout.com/icon/free/png-256/free-under-armour-3421496-2854415.png"
  },
  { 
    name: "North Face", 
    id: "northface",
    logoUrl: "https://cdn.iconscout.com/icon/free/png-256/free-north-face-3421492-2854411.png"
  }
];

export default function Home() {
  // Component state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('newest');
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [showBottomNav, setShowBottomNav] = useState(false);
  const heroSectionRef = useRef<HTMLElement>(null);

  // Products state
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Filters state for bottom sheet
  const [tempActiveFilter, setTempActiveFilter] = useState(activeFilter);
  const [tempSelectedSizes, setTempSelectedSizes] = useState<string[]>([]);
  const [tempSelectedColors, setTempSelectedColors] = useState<string[]>([]);
  const [tempPriceRange, setTempPriceRange] = useState({ min: 0, max: DEFAULT_MAX_PRICE });
  
  // Add scroll event listener to detect when to show bottom nav
  useEffect(() => {
    const handleScroll = () => {
      if (heroSectionRef.current) {
        const heroBottom = heroSectionRef.current.getBoundingClientRect().bottom;
        // Only show nav when completely scrolled past hero section
        setShowBottomNav(heroBottom <= 0);
      } else {
        setShowBottomNav(false);
      }
    };
    
    // Run once on initial load to ensure correct state
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync filter states when opening drawer
  useEffect(() => {
    if (isFilterDrawerOpen) {
      setTempActiveFilter(activeFilter);
    }
  }, [isFilterDrawerOpen, activeFilter]);

  // Fetch products directly
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        console.log("Fetching products for home page...");
        
        // Use the proxy API endpoint
        const response = await fetch("/api/medusa-proxy?path=store%2Fproducts&limit=20");
        const data = await response.json();
        
        if (data?.products?.length > 0) {
          console.log(`Found ${data.products.length} products for home page`);
          setProducts(data.products);
        } else {
          console.log("No products found, using demo products");
          setProducts(DEMO_PRODUCTS);
        }
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(err);
        setProducts(DEMO_PRODUCTS);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  // Handle apply filters from bottom sheet
  const handleApplyFilters = () => {
    setActiveFilter(tempActiveFilter);
    setIsFilterDrawerOpen(false);
  };

  // Handle clear all filters from bottom sheet
  const handleClearAll = () => {
    setTempActiveFilter('newest');
    setTempSelectedSizes([]);
    setTempSelectedColors([]);
    setTempPriceRange({ min: 0, max: DEFAULT_MAX_PRICE });
  };

  // Simplified render with minimal animations
  return (
    <div className="flex min-h-screen flex-col">
      <MobileCategorySidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <main className="flex-grow">
        <section ref={heroSectionRef} className="h-[100svh] w-full relative overflow-hidden">
          <HeroCarousel />
        </section>

        {/* Shop by Category Quick Filters - Premium E-commerce Style */}
        <div className="border-b border-zinc-200 bg-white">
          <div className="mx-auto">
            <div className="grid grid-cols-3 divide-x divide-zinc-200 border-t border-zinc-200">
              {DEFAULT_QUICK_FILTERS.map((qf) => (
                <button
                  key={qf.id}
                  type="button"
                  onClick={() => setActiveQuickFilter(activeQuickFilter === qf.id ? null : qf.id)}
                  className={cn(
                    "relative flex flex-col items-center justify-center py-5 px-2 transition-colors",
                    activeQuickFilter === qf.id 
                      ? 'bg-zinc-50' 
                      : 'bg-white hover:bg-zinc-50'
                  )}
                >
                  <span className={cn(
                    "flex h-8 w-8 items-center justify-center mb-1.5",
                    activeQuickFilter === qf.id 
                      ? 'text-black' 
                      : 'text-zinc-500'
                  )}>
                    {qf.icon}
                  </span>
                  <span className={cn(
                    "text-sm font-semibold uppercase",
                    activeQuickFilter === qf.id ? 'text-black' : 'text-zinc-700'
                  )}>
                    {qf.name}
                  </span>
                  {activeQuickFilter === qf.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 pt-6 md:pt-8">
          {/* Category Cards - Improved Design */}
          <section className="mb-10">
            <div className="container mx-auto px-4">
              {/* Mobile: Horizontal scroll, Desktop: Grid */}
              <div className="relative">
                <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:gap-4 lg:grid-cols-6">
                  {categoryCards.map((category) => (
                    <Link 
                      key={category.id}
                      href={`/categories/${category.id}`} 
                      className="h-[160px] w-[130px] flex-shrink-0 rounded-md border border-zinc-200 bg-white p-4 text-center transition-all hover:border-black md:w-auto flex flex-col items-center justify-center"
                    >
                      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100">
                        {React.cloneElement(category.icon, { className: "text-black", size: 20 })}
                      </div>
                      <h3 className="text-sm font-medium">
                        {category.name}
                      </h3>
                      <p className="mt-1 text-xs text-zinc-500">
                        {category.count} products
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
          
          {/* Separator */}
          <Separator className="my-8" />
          
          {/* PRODUCTS GRID - Removed headings */}
          <section className="mb-12">
            {/* Loading state */}
            {loading && (
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
              </div>
            )}
            
            {/* Error state */}
            {error && (
              <div className="my-4 rounded-md border border-red-300 bg-red-50 p-4">
                <h3 className="text-lg font-medium text-red-800">Error Loading Products</h3>
                <p className="text-red-700">
                  {(error as any).message || "There was an error loading the products."}
                </p>
              </div>
            )}
            
            {/* Products grid - Simple implementation */}
            {!loading && !error && (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {products.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={{
                      id: product.id,
                      title: product.title,
                      name: product.title,
                      description: product.description,
                      thumbnail: product.thumbnail,
                      image: product.thumbnail,
                      price: product.variants?.[0]?.prices?.[0]?.amount ? 
                        product.variants[0].prices[0].amount / 100 : 0,
                      variants: product.variants || []
                    }} 
                  />
                ))}
          </div>
            )}
          </section>
        </div>
      </main>
      
      {/* Mobile Bottom Navigation + Filter Sheet - Mobile Only */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-30 md:hidden transition-all duration-300 ease-in-out ${
          showBottomNav ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
        }`}
      >
        {/* Filter Bottom Sheet - Redesigned to match MobileFilters exactly */}
        <BottomSheet 
          isOpen={isFilterDrawerOpen && showBottomNav} 
          onClose={() => setIsFilterDrawerOpen(false)}
          title="Product Filters"
          snapPoints={[0.9]}
        >
          <div className="h-full touch-pan-y overflow-y-auto pb-24 overscroll-none">
            <Accordion 
              type="multiple" 
              defaultValue={["sort", "size"]} 
              className="w-full [&>*]:border-b [&>*]:border-zinc-200"
            >
              {/* Sort By Section */}
              <AccordionItem value="sort" className="overflow-hidden">
                <AccordionTrigger className="px-3 py-4 text-sm font-semibold text-gray-800 hover:no-underline active:bg-gray-50">
                  Sort By 
                  {tempActiveFilter && filterOptions.find(f=>f.id === tempActiveFilter) && (
                    <span className="ml-auto mr-2 text-xs font-normal text-gray-500">
                      {filterOptions.find(f=>f.id === tempActiveFilter)?.name}
                    </span>
                  )}
                </AccordionTrigger>
                <AccordionContent className="px-1 pb-3 pt-1">
                  <div className="space-y-1.5">
                    {filterOptions.map((filter) => (
              <Button 
                        key={filter.id}
                        variant={tempActiveFilter === filter.id ? "default" : "ghost"}
                        onClick={() => setTempActiveFilter(filter.id)}
                        className={cn(
                          "flex h-auto w-full items-center justify-between rounded-lg px-3 py-3.5 text-left text-sm transition-colors active:bg-zinc-100",
                          tempActiveFilter === filter.id 
                            ? "bg-black text-white shadow-sm hover:bg-zinc-800" 
                            : "text-zinc-700 hover:bg-zinc-50"
                        )}
                      >
                        <span>{filter.name}</span>
                        {tempActiveFilter === filter.id && <Check className="h-4 w-4" />}
              </Button>
                ))}
              </div>
                </AccordionContent>
              </AccordionItem>
              
              {/* Size Section */}
              <AccordionItem value="size" className="overflow-hidden">
                <AccordionTrigger className="px-3 py-4 text-sm font-semibold text-gray-800 hover:no-underline active:bg-gray-50">
                  Size
                  {tempSelectedSizes.length > 0 && (
                    <span className="ml-auto mr-2 text-xs font-normal text-gray-500">
                      {tempSelectedSizes.length} selected
                    </span>
                  )}
                </AccordionTrigger>
                <AccordionContent className="px-1 pb-3 pt-1">
                  <div className="flex flex-wrap gap-2 px-2">
                    {DEFAULT_SIZES.map((size) => (
                      <div
                        key={size}
                        onClick={() => {
                          setTempSelectedSizes(prev => {
                            const newSizes = prev.includes(size) 
                              ? prev.filter(s => s !== size)
                              : [...prev, size];
                            return newSizes;
                          });
                        }}
                        onKeyUp={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setTempSelectedSizes(prev => {
                              const newSizes = prev.includes(size) 
                                ? prev.filter(s => s !== size)
                                : [...prev, size];
                              return newSizes;
                            });
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        className={cn(
                          "flex h-9 min-w-[48px] cursor-pointer select-none items-center justify-center rounded-lg border text-xs font-medium transition-colors",
                          tempSelectedSizes.includes(size)
                            ? "border-black bg-black text-white hover:bg-zinc-800 hover:border-zinc-800"
                            : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50"
                        )}
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              {/* Colors Section */}
              <AccordionItem value="colors" className="overflow-hidden">
                <AccordionTrigger className="px-3 py-4 text-sm font-semibold text-gray-800 hover:no-underline active:bg-gray-50">
                  Colors
                  {tempSelectedColors.length > 0 && (
                    <span className="ml-auto mr-2 text-xs font-normal text-gray-500">
                      {tempSelectedColors.length} selected
                    </span>
                  )}
                </AccordionTrigger>
                <AccordionContent className="px-1 pb-3 pt-1">
                  <div className="flex flex-wrap gap-2 px-2">
                    {DEFAULT_COLORS.map((color) => (
                      <Button
                        key={color.id}
                        variant="outline"
                        onClick={() => {
                          setTempSelectedColors(prev => 
                            prev.includes(color.id) 
                              ? prev.filter(c => c !== color.id)
                              : [...prev, color.id]
                          );
                        }}
                        className={cn(
                          "flex h-9 min-w-[48px] items-center gap-1 rounded-lg border px-2 text-xs font-medium transition-colors",
                          tempSelectedColors.includes(color.id)
                            ? "border-black bg-white text-black hover:bg-zinc-50" 
                            : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50"
                        )}
                      >
                        <span 
                          className={cn(
                            "h-3.5 w-3.5 rounded-full border border-zinc-200",
                            color.id === 'black' && "bg-black",
                            color.id === 'white' && "bg-white",
                            color.id === 'gray' && "bg-gray-500",
                            color.id === 'blue' && "bg-blue-600",
                            color.id === 'red' && "bg-red-600"
                          )} 
                        />
                        {color.name}
                        {tempSelectedColors.includes(color.id) && <Check className="ml-auto h-3 w-3" />}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              {/* Price Range Section */}
              <AccordionItem value="price" className="overflow-hidden">
                <AccordionTrigger className="px-3 py-4 text-sm font-semibold text-gray-800 hover:no-underline active:bg-gray-50">
                  Price Range
                  {(tempPriceRange.min > 0 || tempPriceRange.max < DEFAULT_MAX_PRICE) && (
                    <span className="ml-auto mr-2 text-xs font-normal text-gray-500">
                      ${tempPriceRange.min} - ${tempPriceRange.max}
                    </span>
                  )}
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-5 pt-2">
                  <div className="space-y-5">
                    <Slider 
                      defaultValue={[tempPriceRange.min, tempPriceRange.max]}
                      min={0}
                      max={DEFAULT_MAX_PRICE}
                      step={10}
                      onValueChange={(value) => {
                        setTempPriceRange({ min: value[0], max: value[1] });
                      }}
                      className="py-4"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex h-9 w-20 items-center rounded-md border border-zinc-200 px-2">
                        <span className="text-xs text-zinc-400">$</span>
                        <input
                          type="number"
                          min={0}
                          max={tempPriceRange.max}
                          value={tempPriceRange.min}
                          onChange={(e) => {
                            const value = Number.parseInt(e.target.value);
                            if (!Number.isNaN(value) && value >= 0 && value <= tempPriceRange.max) {
                              setTempPriceRange(prev => ({ ...prev, min: value }));
                            }
                          }}
                          className="w-full border-0 bg-transparent p-0 text-right text-sm focus:outline-none focus:ring-0"
                          aria-label="Minimum price"
                          title="Minimum price"
                        />
                      </div>
                      <div className="text-xs text-zinc-400">to</div>
                      <div className="flex h-9 w-20 items-center rounded-md border border-zinc-200 px-2">
                        <span className="text-xs text-zinc-400">$</span>
                        <input
                          type="number"
                          min={tempPriceRange.min}
                          max={DEFAULT_MAX_PRICE}
                          value={tempPriceRange.max}
                          onChange={(e) => {
                            const value = Number.parseInt(e.target.value);
                            if (!Number.isNaN(value) && value >= tempPriceRange.min && value <= DEFAULT_MAX_PRICE) {
                              setTempPriceRange(prev => ({ ...prev, max: value }));
                            }
                          }}
                          className="w-full border-0 bg-transparent p-0 text-right text-sm focus:outline-none focus:ring-0"
                          aria-label="Maximum price"
                          title="Maximum price"
                        />
                      </div>
              </div>
            </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            {/* Action Buttons - Fixed at the bottom */}
            <div className="fixed inset-x-0 bottom-0 z-10 flex gap-3 border-t border-gray-200 bg-white/80 p-4 shadow-lg backdrop-blur-sm">
              <Button 
                variant="outline" 
                onClick={handleClearAll}
                className="flex-1 rounded-xl border-gray-300 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-100 active:bg-gray-200"
              >
                <RotateCcw className="mr-1.5 h-4 w-4" />
                Clear All
              </Button>
              <Button 
                onClick={handleApplyFilters}
                className="flex-1 rounded-xl bg-black text-sm font-medium text-white shadow-sm hover:bg-zinc-800 active:bg-zinc-900"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </BottomSheet>
        
        {/* Bottom Navigation Bar - Improved Design */}
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white shadow-lg">
          <div className="grid h-16 grid-cols-5">
            {/* Home */}
            <Link 
              href="/"
              className="flex flex-col items-center justify-center gap-1 p-1"
            >
              <FiHome className="h-6 w-6" />
              <span className="text-xs font-medium">Home</span>
            </Link>
            
            {/* Search */}
            <Link 
              href="/search"
              className="flex flex-col items-center justify-center gap-1 p-1"
            >
              <FiSearch className="h-6 w-6" />
              <span className="text-xs font-medium">Search</span>
            </Link>
            
            {/* Filter Button - Center with larger touch target */}
            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className="relative flex flex-col items-center justify-center"
            >
              <div className="absolute -top-6 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-lg">
                <FiSliders className="h-6 w-6" />
              </div>
              <div className="mt-6">
                <span className="text-xs font-medium">Filter</span>
              </div>
            </button>
            
            {/* Cart */}
            <Link 
              href="/cart"
              className="flex flex-col items-center justify-center gap-1 p-1"
            >
              <FiShoppingCart className="h-6 w-6" />
              <span className="text-xs font-medium">Cart</span>
            </Link>
            
            {/* Account */}
            <Link 
              href="/account"
              className="flex flex-col items-center justify-center gap-1 p-1"
            >
              <FiUser className="h-6 w-6" />
              <span className="text-xs font-medium">Account</span>
            </Link>
          </div>
        </div>
      </div>
      
      <SiteFooter />
    </div>
  );
}
