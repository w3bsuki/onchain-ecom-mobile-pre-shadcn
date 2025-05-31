import type { Product } from '@/types';

// Demo products - Used as fallback
export const DEMO_PRODUCTS: Product[] = [
  {
    id: "demo1",
    title: "Basic T-Shirt",
    thumbnail: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop",
    price: 29.99,
    compare_at_price: 39.99
  },
  {
    id: "demo2",
    title: "Denim Jeans",
    thumbnail: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop",
    price: 59.99
  },
  {
    id: "demo3",
    title: "Casual Jacket",
    thumbnail: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop",
    price: 89.99,
    compare_at_price: 129.99
  },
  {
    id: "demo4",
    title: "Running Shoes",
    thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop",
    price: 79.99
  }
]; 