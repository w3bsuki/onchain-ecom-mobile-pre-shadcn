import type { FilterOption, ColorOption } from '@/types';

// Pre-defined filter options
export const filterOptions: FilterOption[] = [
  { id: 'newest', name: 'Newest' },
  { id: 'price-asc', name: 'Price: Low to High' },
  { id: 'price-desc', name: 'Price: High to Low' },
  { id: 'popular', name: 'Popular' },
];

// Default sizes for filters
export const DEFAULT_SIZES: string[] = ["XS", "S", "M", "L", "XL", "XXL"];

// Default colors for filters
export const DEFAULT_COLORS: ColorOption[] = [
  { id: "black", name: "Black", hex: "#000000" },
  { id: "white", name: "White", hex: "#FFFFFF" },
  { id: "gray", name: "Gray", hex: "#808080" },
  { id: "blue", name: "Blue", hex: "#0000FF" },
  { id: "red", name: "Red", hex: "#FF0000" }
];

// Default max price for range slider
export const DEFAULT_MAX_PRICE = 500; 