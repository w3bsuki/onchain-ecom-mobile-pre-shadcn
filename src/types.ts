import type { ReactNode } from 'react';

export type NavbarLinkReact = {
  link: string;
  label: string;
};

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string | null;
  status: 'draft' | 'published';
  variants?: ProductVariant[];
  categories?: ProductCategory[];
  tags?: ProductTag[];
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

export type OnchainStoreContextType = {
  quantities: Quantities;
  setQuantities: (
    quantities: Quantities | ((prev: Quantities) => Quantities),
  ) => void;
  products?: Product[];
};

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
