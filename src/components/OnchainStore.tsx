"use client";

import { useState } from "react";
import { Banner } from "./Banner";
import Navbar from './Navbar';
import OnchainStoreCart from './OnchainStoreCart';
import MobileBottomNav from './MobileBottomNav';
import CategoryTabs from './ui/CategoryTabs';
import FilterScrollArea from './ui/FilterScrollArea';
import { categoryIcons } from './CategoryIcons';
import Footer from './ui/footer';
import MobileFilters from './ui/mobile-filters';
import { ProductGrid } from './ui/ProductGrid';
import { Separator } from './ui/separator';
import { useOnchainStoreContext } from './OnchainStoreProvider';
import { CategoryTabsSkeleton } from './ui/CategoryTabsSkeleton';
import { MobileCategoryNav } from './ui/MobileCategoryNav';

interface PriceRange {
  min: number;
  max: number;
}

export default function OnchainStore() {
  const [showModal, setShowModal] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: 500 });
  
  // Get products, loading state, and sorting/filtering handlers from context
  const { 
    products: sortedProducts, 
    loading, 
    activeCategory, 
    activeFilter,
    handleCategoryChange,
    handleFilterChange 
  } = useOnchainStoreContext();

  // Define all available sort options 
  const sortOptions = [
    { id: 'newest', name: 'Newest' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'best-selling', name: 'Best Selling' },
    { id: 'rating', name: 'Top Rated' },
    { id: 'alphabetical', name: 'A-Z' },
    { id: 'alphabetical-reverse', name: 'Z-A' }
  ];
  
  // Function to handle size selection
  const handleSizeChange = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size) 
        : [...prev, size]
    );
  };

  // Function to handle color selection
  const handleColorChange = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color) 
        : [...prev, color]
    );
  };

  // Function to handle price range change
  const handlePriceRangeChange = (range: PriceRange) => {
    setPriceRange(range);
  };

  // Get product counts per category for display
  const productCounts = {
    all: sortedProducts.length,
    jackets: sortedProducts.filter(p => p.category === 'jackets').length,
    hoodies: sortedProducts.filter(p => p.category === 'hoodies').length,
    shirts: sortedProducts.filter(p => p.category === 'shirts').length,
    shoes: sortedProducts.filter(p => p.category === 'shoes').length,
    accessories: sortedProducts.filter(p => p.category === 'accessories').length,
  };

  // Create categories data for both CategoryTabs and MobileCategoryNav
  const categoriesData = [
    { id: 'all', name: 'All Products', icon: categoryIcons.All, count: productCounts.all },
    { id: 'jackets', name: 'Jackets', icon: categoryIcons.Jackets, count: productCounts.jackets },
    { id: 'hoodies', name: 'Hoodies', icon: categoryIcons.Hoodies, count: productCounts.hoodies },
    { id: 'shirts', name: 'Shirts', icon: categoryIcons.Shirts, count: productCounts.shirts },
    { id: 'shoes', name: 'Shoes', icon: categoryIcons.Shoes, count: productCounts.shoes },
    { id: 'accessories', name: 'Accessories', icon: categoryIcons.Accessories, count: productCounts.accessories },
  ];

  // Prepare data for mobile category navigation
  const mobileCategories = [...categoriesData];

  // Handle click on mobile category 
  const handleMobileCategoryClick = (categoryId: string) => {
    // Prevent default to avoid page jump
    handleCategoryChange(categoryId);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Banner />
      <Navbar />
      
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero separator */}
        <Separator className="mb-8" />
        
        <div className="mb-2">
          {loading ? (
            <CategoryTabsSkeleton />
          ) : (
            <CategoryTabs
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
              categories={categoriesData}
            />
          )}
        </div>
        
        {/* Categories separator */}
        <Separator className="mb-8" />

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
          {/* Desktop filters */}
          <div className="hidden lg:block lg:col-span-3">
            <FilterScrollArea
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
              filters={sortOptions}
              selectedSizes={selectedSizes}
              onSizeChange={handleSizeChange}
              priceRange={priceRange}
              onPriceRangeChange={handlePriceRangeChange}
              selectedColors={selectedColors}
              onColorChange={handleColorChange}
            />
          </div>

          {/* Product grid and mobile filters */}
          <div className="lg:col-span-9">
            {/* Mobile Category Navigation */}
            <div className="mb-6 lg:hidden">
              {loading ? (
                <div className="animate-pulse bg-zinc-100 h-12 rounded-full" />
              ) : (
                <MobileCategoryNav
                  categories={mobileCategories}
                  activeId={activeCategory}
                  onClick={handleMobileCategoryClick}
                />
              )}
            </div>
            
            <div className="mb-6 flex items-center justify-between">
              <div className="flex-1 lg:hidden">
                <MobileFilters
                  filters={sortOptions}
                  activeFilter={activeFilter}
                  onFilterChange={handleFilterChange}
                  selectedSizes={selectedSizes}
                  onSizeChange={handleSizeChange}
                  selectedColors={selectedColors}
                  onColorChange={handleColorChange}
                />
              </div>
              
              <div className="hidden text-sm text-gray-500 lg:block">
                {!loading && `Showing ${sortedProducts.length} products`}
              </div>
            </div>
            
            {/* Filters separator (mobile only) */}
            <div className="lg:hidden">
              <Separator className="mb-6" />
            </div>

            <ProductGrid products={sortedProducts} isLoading={loading} />
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
      <OnchainStoreCart show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
