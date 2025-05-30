'use client';

import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { OnchainStoreContextType } from '@/types';
import { demoProducts } from '@/lib/demo-products';

const OnchainStoreContext = createContext<OnchainStoreContextType | null>(null);

interface OnchainStoreProviderProps {
  children: ReactNode;
}

export function OnchainStoreProvider({ children }: OnchainStoreProviderProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFilter, setActiveFilter] = useState('newest');
  
  // Add cart management functions
  const setQuantity = useCallback((productId: string, quantity: number) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: quantity,
    }));
  }, []);

  const addToCart = useCallback((productId: string) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: (prevQuantities[productId] || 0) + 1,
    }));
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setQuantities((prevQuantities) => {
      const newQuantities = { ...prevQuantities };
      delete newQuantities[productId];
      return newQuantities;
    });
  }, []);
  
  // Filter products based on active category
  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') {
      return demoProducts;
    }
    
    return demoProducts.filter(product => {
      // Handle different category formats (lower case for case-insensitive comparison)
      const productCategory = product.category?.toLowerCase();
      return productCategory === activeCategory.toLowerCase();
    });
  }, [activeCategory]);

  // Sort products based on active filter
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (activeFilter) {
        case 'price-low': {
          return a.price - b.price;
        }
        case 'price-high': {
          return b.price - a.price;
        }
        case 'newest': {
          // Sort by createdAt date if available, otherwise use id as a proxy
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          // Assume higher ID = newer (common in sequential IDs)
          return b.id.localeCompare(a.id);
        }
        case 'best-selling': {
          // If sales data is available, sort by that
          return (b.salesCount || 0) - (a.salesCount || 0);
        }
        case 'rating': {
          // Sort by rating if available
          return (b.rating || 0) - (a.rating || 0);
        }
        case 'alphabetical': {
          return a.name.localeCompare(b.name);
        }
        case 'alphabetical-reverse': {
          return b.name.localeCompare(a.name);
        }
        default: {
          // Default to newest
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return b.id.localeCompare(a.id);
        }
      }
    });
  }, [filteredProducts, activeFilter]);

  // Handle category change
  const handleCategoryChange = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((filterId: string) => {
    setActiveFilter(filterId);
  }, []);

  const value = useMemo(() => ({
    quantities,
    setQuantities,
    setQuantity,
    addToCart,
    removeFromCart,
    products: sortedProducts,
    loading: false, // We're not loading data anymore
    handleCategoryChange,
    handleFilterChange,
    activeFilter,
    activeCategory,
  }), [
    quantities,
    setQuantity,
    addToCart,
    removeFromCart,
    sortedProducts,
    handleCategoryChange,
    handleFilterChange,
    activeFilter,
    activeCategory
  ]);

  return (
    <OnchainStoreContext.Provider value={value}>
      {children}
    </OnchainStoreContext.Provider>
  );
}

export function useOnchainStoreContext() {
  const context = useContext(OnchainStoreContext);
  if (!context) {
    throw new Error('useOnchainStoreContext must be used within an OnchainStoreProvider');
  }
  return context;
}
