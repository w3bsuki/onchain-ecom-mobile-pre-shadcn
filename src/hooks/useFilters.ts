import { useState, useCallback } from 'react';
import { DEFAULT_MAX_PRICE } from '@/data/filters';

export interface FiltersState {
  activeFilter: string;
  activeQuickFilter: string | null;
  activeCategory: string | null;
  selectedSizes: string[];
  selectedColors: string[];
  priceRange: {
    min: number;
    max: number;
  };
}

export interface UseFiltersReturn extends FiltersState {
  setActiveFilter: (filter: string) => void;
  setActiveQuickFilter: (filter: string | null) => void;
  setActiveCategory: (category: string | null) => void;
  toggleSize: (size: string) => void;
  toggleColor: (color: string) => void;
  setPriceRange: (range: { min: number; max: number }) => void;
  clearAll: () => void;
}

export function useFilters(initialState?: Partial<FiltersState>): UseFiltersReturn {
  const [activeFilter, setActiveFilter] = useState(initialState?.activeFilter || 'newest');
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(initialState?.activeQuickFilter || null);
  const [activeCategory, setActiveCategory] = useState<string | null>(initialState?.activeCategory || null);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(initialState?.selectedSizes || []);
  const [selectedColors, setSelectedColors] = useState<string[]>(initialState?.selectedColors || []);
  const [priceRange, setPriceRange] = useState({ 
    min: initialState?.priceRange?.min || 0, 
    max: initialState?.priceRange?.max || DEFAULT_MAX_PRICE 
  });

  const toggleSize = useCallback((size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size) 
        : [...prev, size]
    );
  }, []);

  const toggleColor = useCallback((color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color) 
        : [...prev, color]
    );
  }, []);

  const clearAll = useCallback(() => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange({ min: 0, max: DEFAULT_MAX_PRICE });
  }, []);

  return {
    activeFilter,
    activeQuickFilter,
    activeCategory,
    selectedSizes,
    selectedColors,
    priceRange,
    setActiveFilter,
    setActiveQuickFilter,
    setActiveCategory,
    toggleSize,
    toggleColor,
    setPriceRange,
    clearAll
  };
} 