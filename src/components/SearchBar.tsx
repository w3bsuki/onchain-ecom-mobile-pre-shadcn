'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useOnchainStoreContext } from './OnchainStoreProvider';
import Link from 'next/link';
import ProductImage from './ProductImage';
import { useDebounce } from 'src/hooks/useDebounce';
import type { Product } from 'src/types';

export default function SearchBar() {
  const { products } = useOnchainStoreContext();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products based on search term
  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const filteredProducts = products?.filter((product) => 
      product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    ) || [];

    setSearchResults(filteredProducts.slice(0, 5)); // Show only first 5 results
  }, [debouncedSearchTerm, products]);

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full rounded-full border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search size={16} className="text-gray-400" />
        </div>
        {searchTerm && (
          <button
            type="button"
            title="Clear search"
            onClick={() => {
              setSearchTerm('');
              setSearchResults([]);
            }}
            className="absolute flex inset-y-0 items-center right-0 pr-3"
          >
            <X size={16} className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && searchResults.length > 0 && (
        <div className="absolute bg-white border border-gray-200 mt-2 overflow-hidden rounded-md shadow-lg w-full z-50">
          {searchResults.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="flex hover:bg-gray-50 items-center p-3 transition"
              onClick={() => {
                setIsOpen(false);
                setSearchTerm('');
              }}
            >
              <div className="flex-shrink-0 h-12 w-12">
                <ProductImage
                  src={typeof product.image === 'string' ? product.image : null}
                  alt={product.name}
                  className="h-full object-contain w-full"
                  width={48}
                  height={48}
                />
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                <p className="text-gray-500 text-sm">{product.price.toFixed(2)} USDC</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {isOpen && searchTerm && searchResults.length === 0 && (
        <div className="absolute bg-white border border-gray-200 mt-2 p-4 rounded-md shadow-lg text-center text-gray-500 text-sm w-full z-50">
          No products found
        </div>
      )}
    </div>
  );
} 