'use client';
import React, { useRef, useState, useEffect } from 'react';
import { MobileCategorySidebar } from '@/components/ui/MobileCategorySidebar';
import { Button } from '@/components/ui/button';
import { FaShirt, FaLayerGroup, FaBagShopping } from 'react-icons/fa6';
import { FiSearch, FiHome, FiUser, FiShoppingCart, FiSliders, FiTrendingUp, FiPercent, FiPlus } from 'react-icons/fi';
import { Check, RotateCcw } from 'lucide-react';
import SiteFooter from '@/components/layout/site-footer';
import HeroCarousel from '@/components/products/hero-carousel';
import Link from 'next/link';
import { ProductCard } from '@/components/products/ProductCard';
import { cn } from '@/lib/utils';
import BottomSheet from '@/components/ui/bottom-sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";

// Pre-defined category cards data to avoid recreating on each render
const categoryCards = [
  { id: 'tshirts', name: 'T-Shirts', icon: <FaShirt size={18} />, count: 128 },
  { id: 'shirts', name: 'Shirts', icon: <FaShirt size={18} />, count: 96 },
  { id: 'shorts', name: 'Shorts', icon: <FaLayerGroup size={18} />, count: 64 },
  { id: 'shoes', name: 'Shoes', icon: <FaBagShopping size={18} />, count: 78 },
  { id: 'denim', name: 'Denim', icon: <FaLayerGroup size={18} />, count: 53 },
  { id: 'jackets', name: 'Jackets', icon: <FaBagShopping size={18} />, count: 42 },
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
  { id: 'new', name: 'NEW ARRIVALS', icon: <FiPlus size={14} /> },
  { id: 'trending', name: 'TRENDING', icon: <FiTrendingUp size={14} /> },
  { id: 'sale', name: 'SALE', icon: <FiPercent size={14} /> },
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

// Define product interface to fix any[] type issue
interface ProductVariant {
  id: string;
  prices?: {
    amount: number;
    currency_code?: string;
  }[];
}

interface Product {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  variants?: ProductVariant[];
}

export default function Home() {
  // Component state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('newest');
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(false);
  const heroSectionRef = useRef<HTMLElement>(null);

  // Products state with proper typing
  const [products, setProducts] = useState<Product[]>([]);
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
          setProducts(DEMO_PRODUCTS as Product[]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setProducts(DEMO_PRODUCTS as Product[]);
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
        {/* Hero Section - Fixed height to avoid whitespace */}
        <section className="relative w-full h-screen">
          <div ref={heroSectionRef} className="h-full w-full">
            <HeroCarousel />
          </div>
          
          {/* Premium Quick Filters - Attached directly to bottom of hero */}
          <div className="absolute bottom-0 left-0 right-0 bg-white border-b border-zinc-200 z-10">
            <div className="grid grid-cols-3 divide-x divide-zinc-200">
              {DEFAULT_QUICK_FILTERS.map((qf) => (
                <button
                  key={qf.id}
                  type="button"
                  onClick={() => setActiveQuickFilter(activeQuickFilter === qf.id ? null : qf.id)}
                  className={cn(
                    "relative flex items-center justify-center py-5 transition-all duration-200",
                    activeQuickFilter === qf.id 
                      ? 'bg-black text-white' 
                      : 'bg-white text-black hover:bg-zinc-50'
                  )}
                >
                  <span className="flex items-center space-x-2.5">
                    <span className="text-current">{qf.icon}</span>
                    <span className="text-xs font-medium tracking-widest uppercase">
                      {qf.name}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Shop by Brand - Updated Design */}
        <section className="py-10 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm uppercase font-medium tracking-widest">Shop by Brand</h3>
              <Link href="/brands" className="text-xs font-medium hover:underline flex items-center gap-1 group">
                View All <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </Link>
            </div>
            
            <div className="scrollbar-hide grid grid-flow-col auto-cols-max gap-8 md:gap-12 overflow-x-auto pb-4 -mx-4 px-4">
              {BRAND_LOGOS.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.id}`}
                  className="flex-shrink-0 group flex flex-col items-center"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-zinc-50 rounded-lg flex items-center justify-center group-hover:bg-zinc-100 transition-all duration-200 group-hover:shadow-md">
                    <img 
                      src={brand.logoUrl} 
                      alt={brand.name} 
                      className="w-12 h-12 md:w-14 md:h-14 object-contain opacity-80 group-hover:opacity-100 transition-opacity" 
                    />
                  </div>
                  <span className="mt-3 text-xs md:text-sm font-medium text-zinc-700 group-hover:text-black transition-colors">
                    {brand.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4">
          {/* Shop by Category - Updated Design with Horizontal Scroll */}
          <section className="py-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm uppercase font-medium tracking-widest">Shop by Category</h3>
              <Link href="/categories" className="text-xs font-medium hover:underline flex items-center gap-1 group">
                View All <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </Link>
            </div>
            
            {/* Horizontal scroll for all devices */}
            <div className="scrollbar-hide grid grid-flow-col auto-cols-max gap-4 overflow-x-auto pb-4 -mx-4 px-4">
              {categoryCards.map((category) => (
                <Link 
                  key={category.id}
                  href={`/categories/${category.id}`} 
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveCategory(activeCategory === category.id ? null : category.id);
                  }}
                  className={cn(
                    "group relative flex flex-col items-center justify-center px-6 py-5 rounded-lg transition-colors min-w-[150px] md:min-w-[160px]",
                    activeCategory === category.id
                      ? "bg-black text-white" 
                      : "bg-zinc-50 hover:bg-zinc-100"
                  )}
                >
                  <div className={cn(
                    "flex h-14 w-14 items-center justify-center mb-3 rounded-full transition-colors",
                    activeCategory === category.id
                      ? "bg-zinc-800" 
                      : "bg-white group-hover:bg-white"
                  )}>
                    {React.cloneElement(category.icon, { 
                      className: activeCategory === category.id ? "text-white" : "text-black", 
                      size: 20 
                    })}
                  </div>
                  <h3 className="text-sm font-medium text-center">
                    {category.name}
                  </h3>
                  <p className={cn(
                    "mt-1 text-xs font-medium",
                    activeCategory === category.id ? "text-zinc-400" : "text-zinc-500"
                  )}>
                    {category.count} products
                  </p>
                </Link>
              ))}
            </div>
          </section>
          
          {/* Featured Collections - Updated Design */}
          <section className="py-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm uppercase font-medium tracking-widest">Featured Collections</h3>
              <Link href="/collections" className="text-xs font-medium hover:underline flex items-center gap-1 group">
                View All <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </Link>
            </div>

            <div className="relative w-full overflow-hidden rounded-xl">
              {/* Collection Carousel */}
              <div className="relative">
                <div className="overflow-hidden rounded-xl">
                  <div className="flex snap-x snap-mandatory overflow-x-auto scrollbar-hide">
                    {/* First Collection Slide */}
                    <div className="min-w-full shrink-0 snap-center">
                      <div className="relative flex h-[350px] sm:h-[400px] w-full items-center overflow-hidden bg-black text-white rounded-xl">
                        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black via-transparent to-black opacity-40" />
                        
                        <div className="absolute inset-0 flex items-center">
                          <img 
                            src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=2187&auto=format&fit=crop"
                            alt="Strike Collection" 
                            className="h-full w-full object-cover object-center opacity-80"
                          />
                        </div>
                        
                        <div className="relative z-20 w-full px-6 sm:px-10">
                          <div className="max-w-xl">
                            <h2 className="mb-3 text-3xl sm:text-5xl font-bold tracking-tight">
                              STRIKE
                            </h2>
                            <p className="mb-6 sm:mb-8 text-sm sm:text-lg font-light tracking-wider text-zinc-200">
                              Premium essentials crafted for the modern lifestyle
                            </p>
                            <Button 
                              variant="outline"
                              size="lg"
                              className="bg-transparent border-white text-white hover:bg-white hover:text-black rounded-full px-6"
                              asChild={true}
                            >
                              <Link href="/collections/strike">Shop Collection</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Second Collection Slide */}
                    <div className="min-w-full shrink-0 snap-center">
                      <div className="relative flex h-[350px] sm:h-[400px] w-full items-center overflow-hidden bg-zinc-900 text-white rounded-xl">
                        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black via-transparent to-black opacity-40" />
                        
                        <div className="absolute inset-0 flex items-center">
                          <img 
                            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop"
                            alt="Exclusive Collection" 
                            className="h-full w-full object-cover object-center opacity-80"
                          />
                        </div>
                        
                        <div className="relative z-20 w-full px-6 sm:px-10">
                          <div className="max-w-xl">
                            <h2 className="mb-3 text-3xl sm:text-5xl font-bold tracking-tight">
                              EXCLUSIVE
                            </h2>
                            <p className="mb-6 sm:mb-8 text-sm sm:text-lg font-light tracking-wider text-zinc-200">
                              Limited edition pieces for those who stand out
                            </p>
                            <Button 
                              variant="outline"
                              size="lg"
                              className="bg-transparent border-white text-white hover:bg-white hover:text-black rounded-full px-6"
                              asChild={true}
                            >
                              <Link href="/collections/exclusive">Shop Collection</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Third Collection Slide */}
                    <div className="min-w-full shrink-0 snap-center">
                      <div className="relative flex h-[350px] sm:h-[400px] w-full items-center overflow-hidden bg-zinc-800 text-white rounded-xl">
                        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black via-transparent to-black opacity-40" />
                        
                        <div className="absolute inset-0 flex items-center">
                          <img 
                            src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2070&auto=format&fit=crop"
                            alt="Essentials Collection" 
                            className="h-full w-full object-cover object-center opacity-80"
                          />
                        </div>
                        
                        <div className="relative z-20 w-full px-6 sm:px-10">
                          <div className="max-w-xl">
                            <h2 className="mb-3 text-3xl sm:text-5xl font-bold tracking-tight">
                              ESSENTIALS
                            </h2>
                            <p className="mb-6 sm:mb-8 text-sm sm:text-lg font-light tracking-wider text-zinc-200">
                              Timeless basics for your everyday wardrobe
                            </p>
                            <Button 
                              variant="outline"
                              size="lg"
                              className="bg-transparent border-white text-white hover:bg-white hover:text-black rounded-full px-6"
                              asChild={true}
                            >
                              <Link href="/collections/essentials">Shop Collection</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Carousel Navigation Dots - Enhanced */}
                <div className="mt-6 flex justify-center gap-3">
                  {[0, 1, 2].map((index) => (
                    <button
                      key={`nav-dot-${index}`}
                      type="button"
                      className="h-2 w-8 rounded-full bg-zinc-300 transition-colors hover:bg-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2"
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
          
          {/* Products Grid Section */}
          <section className="py-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm uppercase font-medium tracking-widest">All Products</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-zinc-500" id="sort-label">Sort by:</span>
                <select 
                  className="text-xs font-medium border-none bg-transparent focus:outline-none focus:ring-0"
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                  aria-labelledby="sort-label"
                  title="Sort products"
                >
                  {filterOptions.map(option => (
                    <option key={option.id} value={option.id}>{option.name}</option>
                  ))}
                </select>
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
              <div className="my-4 rounded-md border border-red-300 bg-red-50 p-4">
                <h3 className="text-lg font-medium text-red-800">Error Loading Products</h3>
                <p className="text-red-700">
                  {error.message || "There was an error loading the products."}
                </p>
              </div>
            )}
            
            {/* Products grid - Simple implementation */}
            {!loading && !error && (
              <>
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
                        variants: product.variants || [],
                        // Add demo data for showcase
                        rating: Math.random() * 2 + 3, // Random rating between 3-5
                        reviewCount: Math.floor(Math.random() * 50) + 5,
                        colors: product.id.charCodeAt(0) % 3 === 0 ? [
                          { name: "Black", hex: "#000000" },
                          { name: "White", hex: "#FFFFFF" },
                          { name: "Blue", hex: "#3b82f6" }
                        ] : undefined,
                        isNew: product.id.charCodeAt(0) % 5 === 0,
                        discount: product.id.charCodeAt(0) % 7 === 0 ? 0.2 : undefined,
                        category: ["Clothing", "Accessories", "Footwear"][product.id.charCodeAt(0) % 3],
                      }} 
                      aspectRatio={product.id.charCodeAt(0) % 2 === 0 ? "portrait" : "square"}
                    />
                  ))}
                </div>
                
                {/* Mobile view all button */}
                <div className="mt-8 text-center md:hidden">
                  <Button
                    variant="outline"
                    className="h-10 w-full max-w-xs rounded-md border-zinc-300 text-sm font-medium"
                  >
                    View All Products
                  </Button>
                </div>
              </>
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
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          setTempSelectedSizes(prev => {
                            const newSizes = prev.includes(size) 
                              ? prev.filter(s => s !== size)
                              : [...prev, size];
                            return newSizes;
                          });
                        }}
                        className={cn(
                          "flex h-9 min-w-[48px] cursor-pointer select-none items-center justify-center rounded-lg border text-xs font-medium transition-colors",
                          tempSelectedSizes.includes(size)
                            ? "border-black bg-black text-white hover:bg-zinc-800 hover:border-zinc-800"
                            : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50"
                        )}
                      >
                        {size}
                      </button>
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
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
          <div className="border-t border-zinc-200 bg-black shadow-lg">
            <div className="flex h-16 items-center justify-around px-1">
              {/* Home */}
              <Link 
                href="/"
                className="relative flex w-full flex-col items-center justify-center py-1"
              >
                <FiHome className="h-[22px] w-[22px] stroke-white/80" />
                <span className="mt-1 text-[10px] font-medium tracking-wide text-white/70">HOME</span>
              </Link>
              
              {/* Search */}
              <Link 
                href="/search"
                className="relative flex w-full flex-col items-center justify-center py-1"
              >
                <FiSearch className="h-[22px] w-[22px] stroke-white/80" />
                <span className="mt-1 text-[10px] font-medium tracking-wide text-white/70">SEARCH</span>
              </Link>
              
              {/* Filter Button */}
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
                className="relative flex w-full flex-col items-center justify-center py-1"
              >
                <FiSliders className="h-[22px] w-[22px] stroke-white/80" />
                <span className="mt-1 text-[10px] font-medium tracking-wide text-white/70">FILTERS</span>
              </button>
              
              {/* Cart */}
              <Link 
                href="/cart"
                className="relative flex w-full flex-col items-center justify-center py-1"
              >
                <FiShoppingCart className="h-[22px] w-[22px] stroke-white/80" />
                <span className="mt-1 text-[10px] font-medium tracking-wide text-white/70">CART</span>
              </Link>
              
              {/* Account */}
              <Link 
                href="/account"
                className="relative flex w-full flex-col items-center justify-center py-1"
              >
                <FiUser className="h-[22px] w-[22px] stroke-white/80" />
                <span className="mt-1 text-[10px] font-medium tracking-wide text-white/70">ACCOUNT</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom spacing to prevent content from being hidden behind navigation */}
      <div className="h-20 md:h-0" />
      
      <SiteFooter />
    </div>
  );
}

