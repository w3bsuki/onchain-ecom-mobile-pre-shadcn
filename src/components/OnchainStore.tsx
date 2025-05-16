import { useState } from 'react';
import { Banner } from './Banner';
import Navbar from './Navbar';
import OnchainStoreCart from './OnchainStoreCart';
import OnchainStoreItems from './OnchainStoreItems';
import { OnchainStoreProvider } from './OnchainStoreProvider';
import HeroFashion from './ui/hero-fashion';
import { ChevronDown } from 'lucide-react';
import MobileBottomNav from './MobileBottomNav';
import CategoryTabs from './ui/CategoryTabs';
import FilterScrollArea from './ui/FilterScrollArea';
import { categoryIcons } from './CategoryIcons';
import Footer from './ui/footer';
import MobileFilters from './ui/mobile-filters';

export default function OnchainStore() {
  const [showModal, setShowModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFilter, setActiveFilter] = useState('newest');

  // Function to handle category change
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  // Function to handle filter change
  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
  };

  // Updated categories with simplified options
  const categories = [
    { id: 'all', name: 'All', icon: categoryIcons.All },
    { id: 'new', name: 'New', icon: categoryIcons.All },
    { id: 'bestsellers', name: 'Bestsellers', icon: categoryIcons.All },
    { id: 'sale', name: 'Sale', icon: categoryIcons.All },
    { id: 'shoes', name: 'Shoes', icon: categoryIcons.Shoes },
    { id: 'shirts', name: 'Shirts', icon: categoryIcons.Shirts },
    { id: 'accessories', name: 'Accessories', icon: categoryIcons.Accessories }
  ];

  // Sample filter options
  const filterOptions = [
    { id: 'newest', name: 'New Arrivals' },
    { id: 'bestseller', name: 'Best Sellers' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'trending', name: 'Trending Now' }
  ];

  return (
    <OnchainStoreProvider>
      <div className="flex min-h-screen flex-col bg-white font-sansMono relative">
        <Banner />
        <Navbar />
        
        {/* Main content area */}
        <div className="pb-16 pt-4 w-full md:pt-8">
          {/* Mobile Hero Banner */}
          <div className="block mb-4 md:hidden px-4">
            <div className="overflow-hidden relative rounded-lg shadow-md">
              <HeroFashion />
            </div>
          </div>
          
          {/* Mobile Category Tabs - Enhanced for better clickability */}
          <div className="md:hidden px-4">
            <CategoryTabs 
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>
          
          {/* Mobile Filter Options - with horizontal scroll */}
          <div className="flex items-center justify-between mb-4 md:hidden px-4">
            <FilterScrollArea 
              options={filterOptions}
              activeOption={activeFilter}
              onOptionChange={handleFilterChange}
            />
            
            <MobileFilters
              options={filterOptions}
              activeOption={activeFilter}
              onOptionChange={handleFilterChange}
            />
          </div>
          
          <div className="container mx-auto max-w-[1440px] px-4 w-full lg:px-8">
            <div className="grid gap-8 grid-cols-1 md:grid-cols-[320px_1fr] lg:grid-cols-[350px_1fr] lg:gap-10">
              
              {/* Left column - desktop only: hero + categories */}
              <div className="hidden md:block">
                <div className="flex flex-col sticky top-[4.5rem]">
                  <div className="overflow-hidden relative rounded-lg shadow-md">
                    <HeroFashion />
                  </div>
                  
                  {/* Desktop Categories - improved styling */}
                  <div className="border border-gray-200 bg-white mt-6 p-5 rounded-lg">
                    <div className="space-y-3">
                      {categories.map(category => (
                        <button
                          key={category.id}
                          onClick={() => handleCategoryChange(category.id)}
                          className={`border flex items-center px-4 py-3 rounded-md transition-colors w-full ${
                            activeCategory === category.id 
                              ? 'bg-black border-black text-white' 
                              : 'border-gray-100 hover:bg-gray-50 hover:border-gray-200 text-gray-700'
                          }`}
                          type="button"
                        >
                          <span className="mr-3">{category.icon}</span>
                          <span className="font-medium">{category.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Desktop Filters */}
                  <div className="border border-gray-200 bg-white mt-4 p-5 rounded-lg">
                    <h3 className="font-semibold mb-4 text-lg">Filter By</h3>
                    <div className="space-y-3">
                      {filterOptions.map(option => (
                        <button
                          key={option.id}
                          onClick={() => handleFilterChange(option.id)}
                          className={`border px-4 py-3 rounded-md text-left transition-colors w-full ${
                            activeFilter === option.id 
                              ? 'bg-black border-black text-white' 
                              : 'border-gray-100 hover:bg-gray-50 hover:border-gray-200 text-gray-700'
                          }`}
                          type="button"
                        >
                          {option.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Main Products Grid */}
              <div className="flex flex-col">
                {/* Products section - Nike/Urban Monkeys style */}
                <div className="bg-white rounded-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="font-bold text-gray-900 text-xl">
                      {categories.find(c => c.id === activeCategory)?.name || 'All Products'}
                    </h1>
                    
                    {/* Sort dropdown - desktop only */}
                    <div className="hidden md:block relative">
                      <select 
                        className="appearance-none bg-white border border-gray-200 cursor-pointer font-medium pl-4 pr-10 py-2 rounded text-sm"
                        value={activeFilter}
                        onChange={(e) => handleFilterChange(e.target.value)}
                        aria-label="Sort products"
                      >
                        {filterOptions.map(option => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute pointer-events-none right-3 text-gray-500 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>
                  
                  <OnchainStoreItems />
                </div>
              </div>
            </div>

            {/* Cart modal */}
            <OnchainStoreCart showModal={showModal} setShowModal={setShowModal} />
          </div>
        </div>
        
        <Footer />
        
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </OnchainStoreProvider>
  );
}
