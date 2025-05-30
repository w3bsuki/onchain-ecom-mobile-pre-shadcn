/**
 * Medusa Types
 * This file defines TypeScript types for Medusa-related data structures
 */

/**
 * Product interface for our application
 * Adapted from Medusa's PricedProduct type but simplified for our needs
 */
export interface Product {
  id: string;
  name: string;
  title: string;
  description?: string;
  image: string | null;
  thumbnail: string | null;
  price: number;
  variants?: ProductVariant[];
  rating?: number;
  reviewCount?: number;
  discount?: number;
  colors?: ProductColor[];
  category: string;
  handle?: string;
  tags?: string[];
}

/**
 * Product variant interface
 */
export interface ProductVariant {
  id: string;
  title: string;
  prices?: ProductPrice[];
  options?: ProductOption[];
  inventory_quantity?: number;
}

/**
 * Product price interface
 */
export interface ProductPrice {
  amount: number;
  currency_code: string;
}

/**
 * Product option interface
 */
export interface ProductOption {
  id: string;
  value: string;
  option_id: string;
}

/**
 * Product color interface
 */
export interface ProductColor {
  name: string;
  hex: string;
}

/**
 * Category interface
 */
export interface Category {
  id: string;
  name: string;
  handle?: string;
  parent_category_id?: string | null;
  parent_category?: Category;
  description?: string;
  image?: string | null;
  products_count?: number;
}

/**
 * Collection interface
 */
export interface Collection {
  id: string;
  title: string;
  handle: string;
  products?: Product[];
}

/**
 * Cart interface
 */
export interface Cart {
  id: string;
  items: CartItem[];
  region_id: string;
  total: number;
  discount_total?: number;
  shipping_total?: number;
  tax_total?: number;
  subtotal: number;
}

/**
 * Cart item interface
 */
export interface CartItem {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  variant: ProductVariant;
  product: Product;
  subtotal: number;
}

/**
 * API error interface
 */
export interface MedusaError {
  message: string;
  type: string;
  code: string;
}

/**
 * Common query parameters for Medusa API requests
 */
export interface QueryParams {
  limit?: number;
  offset?: number;
  expand?: string | string[];
  fields?: string | string[];
  order?: string;
}

/**
 * Product query parameters
 */
export interface ProductQueryParams extends QueryParams {
  collection_id?: string[];
  category_id?: string[];
  tags?: string[];
  title?: string;
  handle?: string;
  q?: string;
  cart_id?: string;
  region_id?: string;
  currency_code?: string;
  price_list_id?: string[];
}

/**
 * Response format for list operations
 */
export interface ListResponse<T> {
  items: T[];
  count: number;
  offset: number;
  limit: number;
}

/**
 * Response format for retrieve operations
 */
export interface RetrieveResponse<T> {
  item: T;
} 