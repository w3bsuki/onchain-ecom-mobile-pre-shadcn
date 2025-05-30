'use client';

import { createContext, useContext, useState, useCallback } from 'react';
// Remove the import of the missing hook
// import { useCart } from '@/hooks/useCart';

// Define a proper cart type based on the Medusa structure
interface Cart {
  id: string;
  items: Array<{
    id: string;
    title: string;
    variant: {
      id: string;
      title: string;
      product: {
        id: string;
        title: string;
        thumbnail: string;
      };
    };
    quantity: number;
    unit_price: number;
    subtotal: number;
  }>;
  region?: {
    currency_code: string;
  };
  total?: number;
  subtotal?: number;
  tax_total?: number;
  shipping_total?: number;
}

interface StoreContextType {
  cart: Cart | null;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  loading: boolean;
  error: Error | null;
}

const StoreContext = createContext<StoreContextType>({
  cart: null,
  addItem: async () => {},
  removeItem: async () => {},
  updateQuantity: async () => {},
  loading: true,
  error: null,
});

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Mock implementation instead of using the missing useCart hook
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const addItem = useCallback(async (variantId: string, quantity: number = 1) => {
    console.log('Adding item to cart:', variantId, quantity);
    // Implement proper cart functionality later
  }, []);

  const removeItem = useCallback(async (lineId: string) => {
    console.log('Removing item from cart:', lineId);
    // Implement proper cart functionality later
  }, []);

  const updateQuantity = useCallback(async (lineId: string, quantity: number) => {
    console.log('Updating item quantity:', lineId, quantity);
    // Implement proper cart functionality later
  }, []);

  return (
    <StoreContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        loading,
        error,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}; 