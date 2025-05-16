import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { OnchainStoreContextType } from '../types';
import jacketImage from '../images/jacket.png';
import airpodsImage from '../images/airpods.png';
import mugImage from '../images/mug.png';
import bottleImage from '../images/bottle.png';
import type { Product } from 'src/types';
import { useProducts } from '../hooks/useProducts';
import { USE_FALLBACK_PRODUCTS } from '../config';

const emptyContext = {} as OnchainStoreContextType;

const OnchainStoreContext =
  createContext<OnchainStoreContextType>(emptyContext);

type OnchainStoreProviderReact = {
  children: ReactNode;
};

// Fallback products in case the API call fails
const fallbackProducts: Product[] = [
  // TEST PRODUCT - Added to verify our changes are working
  { 
    id: 'test-product', 
    name: `⚠️ TEST PRODUCT - MOBILE OPTIMIZED VERSION ⚠️`, 
    price: 99.99,
    image: bottleImage 
  },
  { id: 'product1', name: `'BUILDER' JACKET`, price: 0.04, image: jacketImage },
  {
    id: 'product2',
    name: `'DND, I'M BUILDING' AIRPODS`,
    price: 0.01,
    image: airpodsImage,
  },
  {
    id: 'product3',
    name: `'CAFFEINATED TO BUILD' MUG`,
    price: 0.02,
    image: mugImage,
  },
  {
    id: 'product4',
    name: `'HYDRATED TO BUILD' BOTTLE`,
    price: 0.01,
    image: bottleImage,
  },
];

export function OnchainStoreProvider({ children }: OnchainStoreProviderReact) {
  const [quantities, setQuantities] = useState({});
  const { products: medusaProducts, loading, error } = useProducts();
  
  // Use the config value instead of hard-coding
  const useFallback = USE_FALLBACK_PRODUCTS;
  
  // Add cart management functions
  const setQuantity = useCallback((productId: string, quantity: number) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: quantity,
    }));
  }, []);

  const addToCart = useCallback((productId: string) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: (prevQuantities[productId] || 0) + 1,
    }));
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setQuantities((prevQuantities) => {
      const newQuantities = { ...prevQuantities };
      delete newQuantities[productId];
      return newQuantities;
    });
  }, []);
  
  // Process Medusa products to ensure images work properly
  const processedMedusaProducts = useMemo(() => {
    if (!medusaProducts || medusaProducts.length === 0) {
      console.log('No Medusa products available');
      return [];
    }
    
    return medusaProducts.map(product => {
      // For images, we'll use our ProductImage component which handles various formats
      // Here we just make sure the image URL is stored properly
      let processedImage = product.image;
      
      // Just store the raw image path/URL - our ProductImage component will handle the rest
      if (typeof product.image === 'string') {
        // Store the raw image path - ProductImage component will handle URL construction
        processedImage = product.image;
        console.log(`Product ${product.name} will use image: ${processedImage}`);
      } else {
        console.log(`Product ${product.name} has non-string image`);
      }
      
      return {
        ...product,
        image: processedImage
      };
    });
  }, [medusaProducts]);
  
  // Use Medusa products if available, otherwise fallback to hardcoded products
  const products = useMemo(() => {
    if (useFallback || error || !processedMedusaProducts || processedMedusaProducts.length === 0) {
      console.log('Using fallback products');
      return fallbackProducts;
    }
    
    console.log('Using Medusa products with count:', processedMedusaProducts.length);
    for (const p of processedMedusaProducts) {
      console.log(`Product: ${p.name}, Image: ${p.image}`);
    }
    
    return processedMedusaProducts;
  }, [processedMedusaProducts, error, useFallback]);

  const value = useMemo(() => {
    return {
      quantities,
      setQuantities,
      setQuantity,
      addToCart,
      removeFromCart,
      products,
      loading: useFallback ? false : loading,
    };
  }, [quantities, setQuantities, setQuantity, addToCart, removeFromCart, products, loading, useFallback]);

  return (
    <OnchainStoreContext.Provider value={value}>
      {children}
    </OnchainStoreContext.Provider>
  );
}

export function useOnchainStoreContext() {
  return useContext(OnchainStoreContext);
}
