'use client';
import { useRef, useState, useEffect } from 'react';
import { MobileCategorySidebar } from '@/components/ui/MobileCategorySidebar';
import { Button } from '@/components/ui/button';
import { FiSearch, FiHome, FiUser, FiShoppingCart, FiSliders } from 'react-icons/fi';
import { Check, RotateCcw } from 'lucide-react';
import SiteFooter from '@/components/layout/site-footer';
import HeroCarousel from '@/components/products/hero-carousel';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import BottomSheet from '@/components/ui/bottom-sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";

// Import extracted data
import { categoryCards } from '@/data/categories';
import { filterOptions, DEFAULT_SIZES, DEFAULT_COLORS, DEFAULT_MAX_PRICE } from '@/data/filters';
import { DEFAULT_QUICK_FILTERS } from '@/data/quickFilters';
import { DEMO_PRODUCTS } from '@/data/products';
import { BRAND_LOGOS } from '@/data/brands';

// Import extracted components
import { BrandCarousel } from '@/components/sections/BrandCarousel';
import { CategoryGrid } from '@/components/sections/CategoryGrid';
import { FeaturedProducts } from '@/components/sections/FeaturedProducts';
import { QuickFilters } from '@/components/sections/QuickFilters';

// Import custom hooks
import { useFilters } from '@/hooks/useFilters';
import { useScrollPosition } from '@/hooks/useScrollPosition';

// Define product interface to fix any[] type issue
import type { Product } from '@/types';

export default function Home() {
  // Component state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const heroSectionRef = useRef<HTMLElement>(null);

  // Use custom hooks
  const { isScrolled: showBottomNav } = useScrollPosition({ 
    elementRef: heroSectionRef, 
    threshold: 0 
  });

  const { 
    activeFilter,
    activeQuickFilter,
    activeCategory,
    selectedSizes,
    selectedColors,
    priceRange,
    setActiveFilter,
    setActiveQuickFilter,
    setActiveCategory,
    setPriceRange,
    clearAll
  } = useFilters();

  // Products state with proper typing
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Filters state for bottom sheet
  const [tempActiveFilter, setTempActiveFilter] = useState(activeFilter);
  const [tempSelectedSizes, setTempSelectedSizes] = useState<string[]>([]);
  const [tempSelectedColors, setTempSelectedColors] = useState<string[]>([]);
  const [tempPriceRange, setTempPriceRange] = useState({ min: 0, max: DEFAULT_MAX_PRICE });
  
  // Sync filter states when opening drawer
  useEffect(() => {
    if (isFilterDrawerOpen) {
      setTempActiveFilter(activeFilter);
      setTempSelectedSizes(selectedSizes);
      setTempSelectedColors(selectedColors);
      setTempPriceRange(priceRange);
    }
  }, [isFilterDrawerOpen, activeFilter, selectedSizes, selectedColors, priceRange]);

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
        
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        console.log("Using demo products due to error");
        setProducts(DEMO_PRODUCTS);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const handleApplyFilters = () => {
    setActiveFilter(tempActiveFilter);
    setSelectedSizes(tempSelectedSizes);
    setSelectedColors(tempSelectedColors);
    setPriceRange(tempPriceRange);
    setIsFilterDrawerOpen(false);
  };

  const handleClearAll = () => {
    setTempSelectedSizes([]);
    setTempSelectedColors([]);
    setTempPriceRange({ min: 0, max: DEFAULT_MAX_PRICE });
  };

  return (
    <main className="pb-20 md:pb-0">
      {/* Mobile sidebar for categories */}
      <MobileCategorySidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      {/* Hero Section */}
      <section ref={heroSectionRef} className="relative bg-zinc-100">
        <HeroCarousel />
      </section>

      {/* Quick Filters */}
      <div className="bg-white pt-4 pb-2 border-b border-zinc-100">
        <div className="container mx-auto px-4">
          <QuickFilters 
            filters={DEFAULT_QUICK_FILTERS}
            activeFilter={activeQuickFilter}
            onFilterClick={setActiveQuickFilter}
          />
        </div>
      </div>

      {/* Main Content Container */}
      <div className="bg-white">
        <div className="container mx-auto px-4">
          {/* Filter Bar */}
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 text-xs"
                onClick={() => setIsFilterDrawerOpen(true)}
              >
                <FiSliders className="h-3.5 w-3.5" />
                Filter
              </Button>
              <select 
                value={activeFilter} 
                onChange={(e) => setActiveFilter(e.target.value)}
                className="text-xs bg-white border border-zinc-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-zinc-200"
                aria-label="Sort products"
                title="Sort products"
              >
                {filterOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-zinc-500"
              onClick={clearAll}
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>
          
          {/* Category Grid */}
          <CategoryGrid 
            categories={categoryCards}
            activeCategory={activeCategory}
            onCategoryClick={setActiveCategory}
          />
          
          {/* Brand Carousel */}
          <BrandCarousel brands={BRAND_LOGOS} />
          
          {/* Featured Products */}
          <FeaturedProducts 
            title="New Arrivals"
            viewAllLink="/products/new"
            products={products.slice(0, 4)}
          />
          
          {/* Top Selling Products */}
          <FeaturedProducts 
            title="Top Selling"
            viewAllLink="/products/top-selling"
            products={products.slice(0, 4).reverse()}
          />
        </div>
      </div>
      
      {/* Filter Bottom Sheet */}
      <BottomSheet 
        isOpen={isFilterDrawerOpen} 
        onClose={() => setIsFilterDrawerOpen(false)}
        title="Filter Products"
      >
        <div className="px-4 pb-20 overflow-y-auto">
          <Accordion type="single" defaultValue="category" collapsible={true}>
            <AccordionItem value="category">
              <AccordionTrigger className="text-sm font-medium">Categories</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-2">
                  {categoryCards.map((category) => (
                    <button
                      type="button"
                      key={category.id}
                      onClick={() => setActiveCategory(
                        category.id === activeCategory ? null : category.id
                      )}
                      className={`flex items-center gap-2 p-2 rounded ${
                        category.id === activeCategory
                          ? 'bg-black text-white'
                          : 'bg-zinc-50 text-zinc-900'
                      }`}
                    >
                      <span className="flex-shrink-0">
                        {category.icon}
                      </span>
                      <span className="text-xs font-medium">{category.name}</span>
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="size">
              <AccordionTrigger className="text-sm font-medium">Size</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_SIZES.map((size) => (
                    <button
                      type="button"
                      key={size}
                      onClick={() => {
                        if (tempSelectedSizes.includes(size)) {
                          setTempSelectedSizes(tempSelectedSizes.filter(s => s !== size));
                        } else {
                          setTempSelectedSizes([...tempSelectedSizes, size]);
                        }
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md border ${
                        tempSelectedSizes.includes(size)
                          ? 'border-black bg-black text-white'
                          : 'border-zinc-200 bg-white text-zinc-900'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="color">
              <AccordionTrigger className="text-sm font-medium">Color</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-3">
                  {DEFAULT_COLORS.map((color) => (
                    <button
                      type="button"
                      key={color.id}
                      onClick={() => {
                        if (tempSelectedColors.includes(color.id)) {
                          setTempSelectedColors(tempSelectedColors.filter(c => c !== color.id));
                        } else {
                          setTempSelectedColors([...tempSelectedColors, color.id]);
                        }
                      }}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className={`w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center ${
                        tempSelectedColors.includes(color.id)
                          ? 'ring-2 ring-black ring-offset-2'
                          : ''
                      }`} style={{ backgroundColor: color.hex }}>
                        {tempSelectedColors.includes(color.id) && (
                          <Check className={`h-4 w-4 ${color.id === 'white' ? 'text-black' : 'text-white'}`} />
                        )}
                      </div>
                      <span className="text-xs text-zinc-600">{color.name}</span>
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="price">
              <AccordionTrigger className="text-sm font-medium">Price Range</AccordionTrigger>
              <AccordionContent>
                <div className="px-2">
                  <Slider
                    defaultValue={[tempPriceRange.min, tempPriceRange.max]}
                    min={0}
                    max={DEFAULT_MAX_PRICE}
                    step={10}
                    onValueChange={(values) => {
                      setTempPriceRange({ min: values[0], max: values[1] });
                    }}
                    className="my-4"
                  />
                  <div className="flex items-center justify-between text-xs text-zinc-600 mt-1">
                    <div>${tempPriceRange.min}</div>
                    <div>${tempPriceRange.max}</div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-zinc-100">
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="w-1/3"
              onClick={handleClearAll}
            >
              Clear All
            </Button>
            <Button 
              variant="default" 
              className="w-2/3"
              onClick={handleApplyFilters}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </BottomSheet>
      
      {/* Bottom Navigation - fixed at bottom on mobile */}
      <div className={cn(
        "fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 flex items-center justify-around py-2 md:hidden z-20 transition-all duration-300",
        showBottomNav ? "translate-y-0" : "translate-y-16"
      )}>
        <Link href="/" className="flex flex-col items-center p-2 text-black">
          <FiHome className="h-5 w-5" />
          <span className="text-[10px] mt-1">Home</span>
        </Link>
        <Link href="/search" className="flex flex-col items-center p-2 text-zinc-400">
          <FiSearch className="h-5 w-5" />
          <span className="text-[10px] mt-1">Search</span>
        </Link>
        <Link href="/cart" className="flex flex-col items-center p-2 text-zinc-400">
          <FiShoppingCart className="h-5 w-5" />
          <span className="text-[10px] mt-1">Cart</span>
        </Link>
        <Link href="/account" className="flex flex-col items-center p-2 text-zinc-400">
          <FiUser className="h-5 w-5" />
          <span className="text-[10px] mt-1">Account</span>
        </Link>
      </div>
      
      <SiteFooter />
    </main>
  );
}

