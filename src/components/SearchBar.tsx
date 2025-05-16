'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useOnchainStoreContext } from './OnchainStoreProvider';
import Link from 'next/link';
import ProductImage from './ProductImage';
import { useDebounce } from 'src/hooks/useDebounce';
import type { Product } from 'src/types';

export default function SearchBar() {
  const { products } = useOnchainStoreContext();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close search dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    // Close on Escape key
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Filter products based on search term
  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Simulate a more realistic search experience with a slight delay
    const timer = setTimeout(() => {
      const filteredProducts = products?.filter((product) => 
        product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      ) || [];

      setSearchResults(filteredProducts.slice(0, 5)); // Show only first 5 results
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [debouncedSearchTerm, products]);

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setIsOpen(false);
    // Focus back on the input after clearing
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (e.target.value) {
              setIsOpen(true);
            }
          }}
          onFocus={() => searchTerm && setIsOpen(true)}
          className="border-gray-200 focus:border-gray-400 focus:outline-none focus:ring-0 pl-10 pr-8 py-2.5 rounded-md text-sm w-full"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search size={16} className="text-gray-400" />
        </div>
        {searchTerm && (
          <button
            type="button"
            title="Clear search"
            onClick={handleClearSearch}
            className="absolute flex inset-y-0 items-center right-0 pr-3 hover:text-gray-700 text-gray-400 transition-colors"
          >
            {isSearching ? (
              <Loader2 size={16} className="animate-spin text-gray-400" />
            ) : (
              <X size={16} />
            )}
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute bg-white border border-gray-200 mt-1 overflow-hidden rounded-md shadow-lg w-full z-50">
          {isSearching && (
            <div className="flex items-center justify-center p-4">
              <Loader2 size={18} className="animate-spin mr-2 text-gray-400" />
              <span className="text-gray-500 text-sm">Searching...</span>
            </div>
          )}

          {!isSearching && searchResults.length > 0 && (
            <>
              <div className="border-b border-gray-100 px-4 py-2">
                <p className="font-medium text-xs text-gray-500 uppercase tracking-wider">
                  Search Results
                </p>
              </div>
              {searchResults.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="flex group hover:bg-gray-50 items-center p-3 transition-colors"
                  onClick={() => {
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  <div className="bg-gray-50 flex-shrink-0 flex h-14 items-center justify-center overflow-hidden rounded w-14">
                    <ProductImage
                      src={typeof product.image === 'string' ? product.image : null}
                      alt={product.name}
                      className="h-auto max-h-[80%] max-w-[80%] object-contain transition-transform duration-200 w-auto group-hover:scale-105"
                      width={48}
                      height={48}
                    />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium group-hover:text-black text-gray-900 text-sm">{product.name}</p>
                    <p className="font-medium text-gray-500 text-xs">${product.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
              <div className="bg-gray-50 border-t border-gray-100 p-2 text-center">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-xs w-full"
                >
                  Close
                </button>
              </div>
            </>
          )}

          {/* No Results Message */}
          {!isSearching && searchTerm && searchResults.length === 0 && (
            <div className="p-4 text-center">
              <p className="font-medium text-gray-900 text-sm">No products found</p>
              <p className="mt-1 text-gray-500 text-xs">Try a different search term or browse our categories</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 