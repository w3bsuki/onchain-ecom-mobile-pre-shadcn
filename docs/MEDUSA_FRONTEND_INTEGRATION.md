# Medusa Frontend Integration Guide

## Overview

This guide explains how to integrate the Medusa backend with our Next.js frontend application. It covers essential implementation details, best practices, and common integration patterns to ensure smooth communication between the frontend and the Medusa e-commerce engine.

## Client Setup

### 1. Medusa Client Configuration

We use the `@medusajs/medusa-js` client library to interact with the Medusa backend:

```typescript
// src/lib/medusa-client.ts
import Medusa from "@medusajs/medusa-js";

// Use NEXT_PUBLIC_MEDUSA_BACKEND_URL environment variable with fallback
const NEXT_PUBLIC_MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

export const medusaClient = new Medusa({ 
  baseUrl: NEXT_PUBLIC_MEDUSA_BACKEND_URL,
  maxRetries: 3
});

// Configure the publishable API key - this should be fetched once and reused
let publishableApiKey: string | null = null;

// Initialize the publishable API key
export const initializeApiKey = async () => {
  if (!publishableApiKey) {
    try {
      // First try to get publishable API keys
      const { publishable_api_keys } = await medusaClient.publishableApiKeys.list();
      
      if (publishable_api_keys && publishable_api_keys.length > 0) {
        publishableApiKey = publishable_api_keys[0].id;
        medusaClient.setPublishableKey(publishableApiKey);
        console.log("Found and set publishable API key:", publishableApiKey);
        return publishableApiKey;
      } else {
        console.log("No publishable API keys found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching publishable API key:", error);
      return null;
    }
  }
  return publishableApiKey;
};

// Make sure to initialize the API key when the client is imported
initializeApiKey();
```

### 2. Environment Variables

Required environment variables in `.env.local`:

```
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_API_KEY=your_publishable_api_key (optional)
```

## Core Integration Points

### 1. Products Integration

#### Product Hooks

Create a custom hook for fetching products:

```typescript
// src/hooks/useProducts.ts
import { useState, useEffect } from 'react';
import { medusaClient } from '@/lib/medusa-client';

interface UseProductsOptions {
  limit?: number;
  category?: string;
  featured?: boolean;
}

export function useProducts({ limit = 12, category, featured }: UseProductsOptions = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Build filter options
        const options: any = { limit };
        
        if (featured) {
          options.collection_id = ['featured'];
        }
        
        if (category) {
          options.category_id = [category];
        }
        
        const { products: result } = await medusaClient.products.list(options);
        setProducts(result);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [limit, category, featured]);
  
  return { products, loading, error };
}
```

#### Product Component

Example of a product component using the Medusa data structure:

```tsx
// src/components/ProductCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

export default function ProductCard({ product }) {
  // Get the first variant price
  const price = product.variants?.[0]?.prices?.[0]?.amount || 0;
  const formattedPrice = formatPrice(price);
  
  // Get the first image
  const imageUrl = product.thumbnail || product.images?.[0]?.url;
  
  return (
    <Link href={`/products/${product.handle}`}>
      <div className="group relative">
        <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-200">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title}
              width={300}
              height={300}
              className="object-cover object-center transition-all duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">No image</div>
          )}
        </div>
        <div className="mt-2">
          <h3 className="text-sm font-medium text-gray-900">{product.title}</h3>
          <p className="mt-1 text-sm font-medium text-gray-900">{formattedPrice}</p>
        </div>
      </div>
    </Link>
  );
}
```

### 2. Cart Integration

#### Cart Hook

Create a custom hook for cart functionality:

```typescript
// src/hooks/useCart.ts
import { useState, useEffect } from 'react';
import { medusaClient } from '@/lib/medusa-client';

export function useCart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  
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
          } catch (err) {
            // Cart doesn't exist anymore, create a new one
            const { cart } = await medusaClient.carts.create();
            localStorage.setItem('medusa_cart_id', cart.id);
            setCart(cart);
          }
        } else {
          // Create a new cart
          const { cart } = await medusaClient.carts.create();
          localStorage.setItem('medusa_cart_id', cart.id);
          setCart(cart);
        }
      } catch (err) {
        console.error('Error initializing cart:', err);
      } finally {
        setLoading(false);
      }
    };
    
    initCart();
  }, []);
  
  const addItem = async (variantId, quantity = 1) => {
    if (!cart) return;
    
    try {
      const { cart: updatedCart } = await medusaClient.carts.lineItems.create(cart.id, {
        variant_id: variantId,
        quantity
      });
      
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      console.error('Error adding item to cart:', err);
      return null;
    }
  };
  
  const removeItem = async (lineId) => {
    if (!cart) return;
    
    try {
      const { cart: updatedCart } = await medusaClient.carts.lineItems.delete(cart.id, lineId);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      console.error('Error removing item from cart:', err);
      return null;
    }
  };
  
  const updateQuantity = async (lineId, quantity) => {
    if (!cart) return;
    
    try {
      const { cart: updatedCart } = await medusaClient.carts.lineItems.update(cart.id, lineId, {
        quantity
      });
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      console.error('Error updating item quantity:', err);
      return null;
    }
  };
  
  return {
    cart,
    loading,
    addItem,
    removeItem,
    updateQuantity
  };
}
```

### 3. Checkout Integration

#### Checkout Hook

Create a custom hook for checkout functionality:

```typescript
// src/hooks/useCheckout.ts
import { useState } from 'react';
import { medusaClient } from '@/lib/medusa-client';

export function useCheckout(cartId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const updateShippingAddress = async (address) => {
    setLoading(true);
    setError(null);
    
    try {
      const { cart } = await medusaClient.carts.update(cartId, {
        shipping_address: address
      });
      
      return cart;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const updateBillingAddress = async (address) => {
    setLoading(true);
    setError(null);
    
    try {
      const { cart } = await medusaClient.carts.update(cartId, {
        billing_address: address
      });
      
      return cart;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const selectShippingMethod = async (shippingMethodId) => {
    setLoading(true);
    setError(null);
    
    try {
      const { cart } = await medusaClient.carts.addShippingMethod(cartId, {
        option_id: shippingMethodId
      });
      
      return cart;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const completeCheckout = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await medusaClient.carts.complete(cartId);
      
      // Clear the cart from localStorage after successful checkout
      localStorage.removeItem('medusa_cart_id');
      
      return data;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    loading,
    error,
    updateShippingAddress,
    updateBillingAddress,
    selectShippingMethod,
    completeCheckout
  };
}
```

## Data Patterns

### 1. Product Data Structure

Understanding the Medusa product structure:

```typescript
interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  thumbnail: string | null;
  images: { url: string }[];
  variants: ProductVariant[];
  options: ProductOption[];
  categories: Category[];
  collection_id: string | null;
  // ... other fields
}

interface ProductVariant {
  id: string;
  title: string;
  sku: string | null;
  prices: {
    id: string;
    amount: number;
    currency_code: string;
  }[];
  options: Record<string, string>;
  // ... other fields
}
```

### 2. Cart Data Structure

Understanding the Medusa cart structure:

```typescript
interface Cart {
  id: string;
  items: LineItem[];
  region: Region;
  shipping_methods: ShippingMethod[];
  payment_sessions: PaymentSession[];
  shipping_address: Address | null;
  billing_address: Address | null;
  total: number;
  subtotal: number;
  tax_total: number;
  shipping_total: number;
  discount_total: number;
  // ... other fields
}

interface LineItem {
  id: string;
  title: string;
  quantity: number;
  variant: ProductVariant;
  unit_price: number;
  subtotal: number;
  total: number;
  // ... other fields
}
```

## Error Handling

### Common Medusa Error Patterns

```typescript
// Error handling utility
export const handleMedusaError = (error: any) => {
  if (error.response?.data?.message) {
    // API error with message
    return {
      message: error.response.data.message,
      status: error.response.status,
      type: 'api_error'
    };
  } else if (error.message) {
    // Network error or client-side error
    return {
      message: error.message,
      type: 'client_error'
    };
  } else {
    // Unknown error
    return {
      message: 'An unknown error occurred',
      type: 'unknown_error'
    };
  }
};

// Usage in components
try {
  await medusaClient.products.list();
} catch (error) {
  const formattedError = handleMedusaError(error);
  // Handle or display error
}
```

## Performance Optimization

### 1. Caching Strategies

Implement SWR for data fetching with caching:

```typescript
import useSWR from 'swr';
import { medusaClient } from '@/lib/medusa-client';

// Fetcher function for SWR
const fetcher = async (url, options) => {
  // Extract endpoint and parameters from url
  const [endpoint, queryString] = url.split('?');
  const params = new URLSearchParams(queryString);
  
  // Convert params to object
  const queryParams = {};
  params.forEach((value, key) => {
    queryParams[key] = value;
  });
  
  // Call Medusa client based on endpoint
  switch (endpoint) {
    case '/products':
      return medusaClient.products.list(queryParams);
    case '/collections':
      return medusaClient.collections.list(queryParams);
    default:
      throw new Error(`Unknown endpoint: ${endpoint}`);
  }
};

// Product hook with SWR
export function useProductsSWR(options = {}) {
  // Convert options to query string
  const queryParams = new URLSearchParams();
  Object.entries(options).forEach(([key, value]) => {
    queryParams.append(key, value);
  });
  
  const { data, error } = useSWR(`/products?${queryParams.toString()}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000 // 1 minute
  });
  
  return {
    products: data?.products || [],
    count: data?.count || 0,
    loading: !data && !error,
    error
  };
}
```

### 2. Optimistic Updates

Implement optimistic updates for cart operations:

```typescript
const addItemOptimistic = async (variantId, quantity = 1) => {
  if (!cart) return;
  
  // Clone current cart
  const optimisticCart = JSON.parse(JSON.stringify(cart));
  
  // Add item optimistically
  const variant = await medusaClient.products.variants.retrieve(variantId);
  
  optimisticCart.items.push({
    id: `temp_${Date.now()}`,
    title: variant.title,
    quantity,
    variant,
    unit_price: variant.prices[0].amount,
    // Estimate other fields
  });
  
  // Update UI immediately
  setCart(optimisticCart);
  
  // Perform actual API call
  try {
    const { cart: actualCart } = await medusaClient.carts.lineItems.create(cart.id, {
      variant_id: variantId,
      quantity
    });
    
    // Update with actual data
    setCart(actualCart);
  } catch (err) {
    // Revert to original cart on error
    setCart(cart);
    console.error('Error adding item to cart:', err);
  }
};
```

## Best Practices

1. **Error Handling**: Implement consistent error handling across all Medusa API calls
2. **Loading States**: Show appropriate loading states during API operations
3. **Optimistic Updates**: Use optimistic updates for better UX
4. **API Key Management**: Safely manage the Medusa API key
5. **Data Validation**: Validate data from Medusa before using it in the UI
6. **Environment Variables**: Use environment variables for configuration
7. **Type Safety**: Define TypeScript types for Medusa data structures

## Conclusion

This guide provides a comprehensive foundation for integrating the Medusa backend with your Next.js frontend. By following these patterns and best practices, you can build a robust, high-performance e-commerce application that leverages the power of Medusa for backend operations while maintaining a clean, efficient frontend implementation.

For more information, refer to the [Medusa API Reference](https://docs.medusajs.com/api/store) and [Medusa JS Client Documentation](https://docs.medusajs.com/js-client/overview).
