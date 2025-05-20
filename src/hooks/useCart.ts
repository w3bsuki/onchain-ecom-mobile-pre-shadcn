import { useState, useEffect } from 'react';
import { medusaClient } from '@/lib/medusa-client';

interface Cart {
  id: string;
  items: CartItem[];
  region: {
    currency_code: string;
  };
  total?: number;
  subtotal?: number;
  tax_total?: number;
  shipping_total?: number;
}

interface CartItem {
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
}

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const initCart = async () => {
      setLoading(true);
      
      try {
        // Try to get cart from localStorage
        const existingCartId = localStorage.getItem('medusa_cart_id');
        
        if (existingCartId) {
          try {
            const { cart } = await medusaClient.carts.retrieve(existingCartId);
            setCart(cart);
            setError(null);
          } catch (err) {
            // Cart doesn't exist anymore, create a new one
            const { cart } = await medusaClient.carts.create();
            localStorage.setItem('medusa_cart_id', cart.id);
            setCart(cart);
            setError(null);
          }
        } else {
          // Create a new cart
          const { cart } = await medusaClient.carts.create();
          localStorage.setItem('medusa_cart_id', cart.id);
          setCart(cart);
          setError(null);
        }
      } catch (err) {
        console.error('Error initializing cart:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };
    
    initCart();
  }, []);
  
  const addItem = async (variantId: string, quantity = 1) => {
    if (!cart) {
      return;
    }
    
    try {
      const { cart: updatedCart } = await medusaClient.carts.lineItems.create(cart.id, {
        variant_id: variantId,
        quantity
      });
      
      setCart(updatedCart);
      setError(null);
    } catch (err) {
      console.error('Error adding item to cart:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  };
  
  const removeItem = async (lineId: string) => {
    if (!cart) {
      return;
    }
    
    try {
      const { cart: updatedCart } = await medusaClient.carts.lineItems.delete(cart.id, lineId);
      setCart(updatedCart);
      setError(null);
    } catch (err) {
      console.error('Error removing item from cart:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  };
  
  const updateQuantity = async (lineId: string, quantity: number) => {
    if (!cart) {
      return;
    }
    
    try {
      const { cart: updatedCart } = await medusaClient.carts.lineItems.update(cart.id, lineId, {
        quantity
      });
      setCart(updatedCart);
      setError(null);
    } catch (err) {
      console.error('Error updating item quantity:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  };
  
  return {
    cart,
    loading,
    error,
    addItem,
    removeItem,
    updateQuantity
  };
} 