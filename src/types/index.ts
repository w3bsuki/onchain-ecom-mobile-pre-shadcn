import type { ReactNode } from 'react';

export interface CategoryCard {
  id: string;
  name: string;
  icon: ReactNode;
  count: number;
}

export interface FilterOption {
  id: string;
  name: string;
}

export interface QuickFilter {
  id: string;
  name: string;
  icon: ReactNode;
}

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
}

export interface BrandLogo {
  name: string;
  id: string;
  logoUrl: string;
}

export interface ProductVariant {
  id: string;
  prices?: {
    amount: number;
    currency_code?: string;
  }[];
}

export interface Product {
  id: string;
  title: string;
  name?: string;
  description?: string;
  thumbnail?: string;
  image?: string;
  variants?: ProductVariant[];
  price?: number;
  rating?: number;
  reviewCount?: number;
  colors?: ColorOption[];
  isNew?: boolean;
  discount?: number;
  category?: string;
  compare_at_price?: number;
} 