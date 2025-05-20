'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, X, Loader2, ArrowRight, History, Clock } from 'lucide-react';
import { useOnchainStoreContext } from './OnchainStoreProvider';
import Link from 'next/link';
import ProductImage from './ProductImage';
import { useDebounce } from 'src/hooks/useDebounce';
import type { Product } from 'src/types';
import { cn } from '@/lib/utils';

type SearchHistory = {
  term: string;
  timestamp: number;
};

export default function SearchBar({ className }: { className?: string }) {
  const { products } = useOnchainStoreContext();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [popularSearches] = useState(['t-shirts', 'sneakers', 'dress', 'hoodie', 'jacket']);
  const debouncedSearchTerm = useDebounce(searchTerm, 200);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load search history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setSearchHistory(parsedHistory);
      } catch (e) {
        console.error('Failed to parse search history');
      }
    }
  }, []);
  
  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

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

      setSearchResults(filteredProducts.slice(0, 6)); // Show only first 6 results
      setIsSearching(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [debouncedSearchTerm, products]);

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    // Focus back on the input after clearing
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const saveSearchToHistory = (term: string) => {
    if (!term.trim()) return;
    
    const newHistory = [
      { term, timestamp: Date.now() },
      ...searchHistory.filter(item => item.term !== term).slice(0, 4)
    ];
    
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    saveSearchToHistory(term);
  };

  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      saveSearchToHistory(searchTerm);
      // Optionally redirect to search results page
      // router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className={cn("relative w-full", className)} ref={searchRef}>
      <form onSubmit={handleSubmitSearch}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (e.target.value) {
                setIsOpen(true);
              }
            }}
            onFocus={() => setIsOpen(true)}
            className="w-full rounded-lg border border-zinc-200 py-2.5 pl-10 pr-8 text-sm shadow-sm transition-colors focus:border-zinc-400 focus:outline-none focus:ring-0"
          />
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search size={16} className="text-zinc-400" />
          </div>
          {searchTerm && (
            <button
              type="button"
              title="Clear search"
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 transition-colors hover:text-zinc-700"
            >
              {isSearching ? (
                <Loader2 size={16} className="animate-spin text-zinc-400" />
              ) : (
                <X size={16} />
              )}
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xl">
          {isSearching && (
            <div className="flex items-center justify-center p-4">
              <Loader2 size={18} className="mr-2 animate-spin text-zinc-400" />
              <span className="text-sm text-zinc-500">Searching...</span>
            </div>
          )}

          {!isSearching && searchResults.length > 0 && (
            <>
              <div className="border-b border-zinc-100 px-4 py-2">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Search Results
                </p>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.id}`}
                    className="flex items-center p-3 transition-colors hover:bg-zinc-50"
                    onClick={() => {
                      setIsOpen(false);
                      saveSearchToHistory(searchTerm);
                      setSearchTerm('');
                    }}
                  >
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded bg-zinc-50">
                      <ProductImage
                        src={typeof product.image === 'string' ? product.image : null}
                        alt={product.name}
                        className="h-auto max-h-[80%] w-auto max-w-[80%] object-contain transition-transform duration-200 group-hover:scale-105"
                        width={48}
                        height={48}
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-zinc-900 line-clamp-1">{product.name}</p>
                      <p className="text-xs font-medium text-zinc-500">${product.price.toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
                <div className="flex justify-between border-t border-zinc-100 bg-zinc-50 p-3">
                  <span className="text-xs text-zinc-500">Found {searchResults.length} results</span>
                  <Link
                    href={`/search?q=${encodeURIComponent(searchTerm)}`}
                    className="flex items-center text-xs font-medium text-zinc-900 hover:underline"
                    onClick={() => {
                      setIsOpen(false);
                      saveSearchToHistory(searchTerm);
                    }}
                  >
                    View all <ArrowRight size={14} className="ml-1" />
                  </Link>
                </div>
              </div>
            </>
          )}

          {/* History and Popular Searches - show when no current search or results */}
          {!isSearching && searchTerm.trim() === '' && (
            <>
              {/* Recent Searches */}
              {searchHistory.length > 0 && (
                <div className="border-b border-zinc-100 p-2">
                  <div className="mb-2 flex items-center justify-between px-2">
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1 text-zinc-400" />
                      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                        Recent Searches
                      </p>
                    </div>
                    <button
                      onClick={clearSearchHistory}
                      className="text-xs text-zinc-500 hover:text-zinc-900"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-1">
                    {searchHistory.map((item) => (
                      <button
                        key={item.timestamp}
                        className="flex w-full items-center px-3 py-2 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-50"
                        onClick={() => handleSearch(item.term)}
                      >
                        <History size={14} className="mr-2 text-zinc-400" />
                        {item.term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div className="p-2">
                <div className="mb-2 px-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Popular Searches
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 px-2 pb-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-200"
                      onClick={() => handleSearch(term)}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* No Results Message */}
          {!isSearching && searchTerm && searchResults.length === 0 && (
            <div className="p-6 text-center">
              <p className="text-sm font-medium text-zinc-900">No products found</p>
              <p className="mt-1 text-xs text-zinc-500">Try a different search term or browse our categories</p>
              
              {/* Popular searches suggestions */}
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium text-zinc-500">Try these popular searches:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-200"
                      onClick={() => handleSearch(term)}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 