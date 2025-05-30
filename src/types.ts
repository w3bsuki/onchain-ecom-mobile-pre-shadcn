import type { ReactNode } from 'react';

export type NavbarLinkReact = {
  link: string;
  label: string;
};

export interface Product {
  id: string;
  name: string;
  title?: string;  // For Medusa compatibility
  description?: string;
  image: string | null;
  thumbnail?: string | null;  // For Medusa compatibility
  price: number;
  variants?: Array<{  // For Medusa compatibility
    id: string;
    title?: string;
    prices?: Array<{
      amount: number;
      currency_code: string;
    }>;
  }>;
  category?: string;
  createdAt?: string;
  salesCount?: number;
  rating?: number;
  reviewCount?: number;
  discount?: number;
  colors?: Array<{ name: string; hex: string }>;
  handle?: string;  // For Medusa compatibility
}

export interface ProductVariant {
  id: string;
  title: string;
  sku?: string;
  price: number;
  inventory_quantity: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  handle: string;
  parent_category?: ProductCategory;
}

export interface ProductTag {
  id: string;
  value: string;
}

export type Quantities = Record<string, number>;

export type QuantityInputReact = {
  productId: string;
};

export interface OnchainStoreContextType {
  quantities: Record<string, number>;
  setQuantities: (quantities: Record<string, number>) => void;
  setQuantity: (productId: string, quantity: number) => void;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  products: Product[];
  loading: boolean;
  handleCategoryChange: (categoryId: string) => void;
  handleFilterChange: (filterId: string) => void;
  activeFilter: string;
  activeCategory: string;
}

export type QuantityInputButtonReact = {
  onClick: () => void;
  svg: ReactNode;
  label: string;
};

export type OnchainStoreCartReact = {
  setShowModal?: (value: boolean) => void;
  showModal?: boolean;
};

export type OnchainStoreModalReact = {
  closeModal: () => void;
};

export type MockCheckoutButtonReact = {
  onClick: () => void;
};

export type ChargeDetails = {
  name?: string;
  description?: string;
  pricing_type?: string;
  local_price?: {
    amount: string;
    currency: string;
  };
};
