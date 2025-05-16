'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useOnchainStoreContext } from './OnchainStoreProvider';
import Link from 'next/link';
import ProductImage from './ProductImage';
import { cn } from '@coinbase/onchainkit/theme';

export default function MobileProductSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { products } = useOnchainStoreContext();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Open and close search modal
  const toggleSearch = () => {
    setIsOpen(!isOpen);
    setQuery('');
    setSearchResults([]);
  };
  
  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);
  
  // Filter products based on search query
  useEffect(() => {
    if (!query.trim() || !products) {
      setSearchResults([]);
      return;
    }
    
    const lowercaseQuery = query.toLowerCase();
    const filtered = products
      .filter(product => 
        product.name.toLowerCase().includes(lowercaseQuery)
      )
      .slice(0, 5); // Limit to 5 results for better mobile UI
    
    setSearchResults(filtered);
  }, [query, products]);
  
  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && e.target instanceof Node) {
        const searchContainer = document.getElementById('mobile-search-container');
        if (searchContainer && !searchContainer.contains(e.target)) {
          setIsOpen(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);
  
  return (
    <>
      {/* Search toggle button (used in MobileBottomNav) */}
      <button 
        type="button"
        onClick={toggleSearch}
        className="flex flex-col items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50"
        aria-label="Search products"
      >
        <Search size={22} strokeWidth={1.5} />
        <span className="mt-1 text-xs font-medium">Search</span>
      </button>
      
      {/* Mobile search modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-16 px-4 md:hidden">
          <div 
            id="mobile-search-container"
            className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
          >
            {/* Search header */}
            <div className="p-4 border-b border-gray-200 flex items-center">
              <Search size={20} className="text-gray-500 mr-2" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-grow border-none focus:outline-none text-base"
              />
              <button 
                type="button"
                onClick={toggleSearch}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
                aria-label="Close search"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Search results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {searchResults.length > 0 ? (
                <ul>
                  {searchResults.map(product => (
                    <li key={product.id} className="border-b border-gray-100 last:border-b-0">
                      <Link 
                        href={`/products/${product.id}`}
                        className="flex items-center p-3 hover:bg-gray-50"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden mr-3 flex-shrink-0">
                          <ProductImage 
                            src={typeof product.image === 'string' ? product.image : null}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                          <p className="text-gray-600 text-sm">{product.price.toFixed(2)} USDC</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : query.trim() ? (
                <div className="p-6 text-center text-gray-500">
                  <p>No products found matching "{query}"</p>
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <p>Start typing to search products</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 