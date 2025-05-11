import React, { createContext, useContext, useState, useEffect } from 'react';
import { getClient } from '../lib/medusa-client';
import type Medusa from '@medusajs/medusa-js';

interface MedusaContextType {
  client: Medusa | null;
  cart: any | null;
  cartId: string | null;
  loading: boolean;
  createNewCart: () => Promise<void>;
  fetchCart: (id: string) => Promise<void>;
  addItem: (variantId: string, quantity: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  clearCart: () => void;
}

const MedusaContext = createContext<MedusaContextType | undefined>(undefined);

export function MedusaProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState<Medusa>(() => getClient());
  const [cart, setCart] = useState<any | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Initialize cart on mount
  useEffect(() => {
    // Check if there's a cart ID in localStorage
    const storedCartId = localStorage.getItem('medusa_cart_id');
    if (storedCartId) {
      setCartId(storedCartId);
      fetchCart(storedCartId);
    }
  }, []);

  // Create a new cart
  const createNewCart = async () => {
    try {
      setLoading(true);
      const { cart } = await client.carts.create({});
      setCart(cart);
      setCartId(cart.id);
      localStorage.setItem('medusa_cart_id', cart.id);
      setLoading(false);
      return cart;
    } catch (error) {
      console.error('Error creating cart:', error);
      setLoading(false);
      throw error;
    }
  };

  // Fetch an existing cart
  const fetchCart = async (id: string) => {
    try {
      setLoading(true);
      const { cart } = await client.carts.retrieve(id);
      setCart(cart);
      setLoading(false);
      return cart;
    } catch (error) {
      console.error('Error fetching cart:', error);
      // If the cart doesn't exist, remove it from localStorage
      localStorage.removeItem('medusa_cart_id');
      setCartId(null);
      setCart(null);
      setLoading(false);
      throw error;
    }
  };

  // Add an item to the cart
  const addItem = async (variantId: string, quantity: number) => {
    try {
      setLoading(true);
      
      // If there's no cart, create one
      let currentCartId = cartId;
      if (!currentCartId) {
        const newCart = await createNewCart();
        currentCartId = newCart.id;
      }
      
      // Add the item to the cart
      const { cart } = await client.carts.lineItems.create(currentCartId, {
        variant_id: variantId,
        quantity,
      });
      
      setCart(cart);
      setLoading(false);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      setLoading(false);
      throw error;
    }
  };

  // Update item quantity in the cart
  const updateItem = async (lineId: string, quantity: number) => {
    if (!cartId) return;
    
    try {
      setLoading(true);
      const { cart } = await client.carts.lineItems.update(cartId, lineId, {
        quantity,
      });
      setCart(cart);
      setLoading(false);
    } catch (error) {
      console.error('Error updating item in cart:', error);
      setLoading(false);
      throw error;
    }
  };

  // Remove an item from the cart
  const removeItem = async (lineId: string) => {
    if (!cartId) return;
    
    try {
      setLoading(true);
      const { cart } = await client.carts.lineItems.delete(cartId, lineId);
      setCart(cart);
      setLoading(false);
    } catch (error) {
      console.error('Error removing item from cart:', error);
      setLoading(false);
      throw error;
    }
  };

  // Clear the cart from state and localStorage
  const clearCart = () => {
    localStorage.removeItem('medusa_cart_id');
    setCartId(null);
    setCart(null);
  };

  return (
    <MedusaContext.Provider
      value={{
        client,
        cart,
        cartId,
        loading,
        createNewCart,
        fetchCart,
        addItem,
        updateItem,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </MedusaContext.Provider>
  );
}

// Hook to use the Medusa context
export function useMedusa() {
  const context = useContext(MedusaContext);
  if (context === undefined) {
    throw new Error('useMedusa must be used within a MedusaProvider');
  }
  return context;
} 