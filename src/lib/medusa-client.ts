import Medusa from "@medusajs/medusa-js";

// Use NEXT_PUBLIC_MEDUSA_BACKEND_URL environment variable with fallback
const NEXT_PUBLIC_MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

console.log('Initializing Medusa client with URL:', NEXT_PUBLIC_MEDUSA_BACKEND_URL);

export const medusaClient = new Medusa({ 
  baseUrl: NEXT_PUBLIC_MEDUSA_BACKEND_URL,
  maxRetries: 3
});

// Hard-coded publishable API key to guarantee it's set for any direct fetch request
const PUBLISHABLE_API_KEY = 'pk_8c83b91984f77e065ff8066c422062338290c16734aff13728862b5ba8c25d50';

// Configure the publishable API key
let publishableApiKey: string | null = PUBLISHABLE_API_KEY;

// Initialize the publishable API key
export const initializeApiKey = async () => {
  if (publishableApiKey) {
    medusaClient.setPublishableKey(publishableApiKey);
    console.log("Setting publishable API key:", publishableApiKey);
    return publishableApiKey;
  }
  
  try {
    // First try to get publishable API keys
    const { publishable_api_keys } = await medusaClient.publishableApiKeys.list();
    
    if (publishable_api_keys && publishable_api_keys.length > 0) {
      publishableApiKey = publishable_api_keys[0].id;
      medusaClient.setPublishableKey(publishableApiKey);
      console.log("Found and set publishable API key:", publishableApiKey);
      return publishableApiKey;
    } else {
      console.log("No publishable API keys found, using hardcoded key");
      medusaClient.setPublishableKey(PUBLISHABLE_API_KEY);
      return PUBLISHABLE_API_KEY;
    }
  } catch (error) {
    console.error("Error fetching publishable API key:", error);
    console.log("Falling back to hardcoded API key");
    medusaClient.setPublishableKey(PUBLISHABLE_API_KEY);
    return PUBLISHABLE_API_KEY;
  }
};

// Make sure to initialize the API key when the client is imported
initializeApiKey();

// Simple development setup without API key
console.log("Using Medusa client in development mode");

export default medusaClient;

// Utility functions for common operations
export const getProducts = async (options: Record<string, unknown> = {}) => {
  try {
    const { products, count } = await medusaClient.products.list(options);
    return { products, count };
  } catch (error) {
    console.error("Error fetching products from Medusa:", error);
    return { products: [], count: 0 };
  }
};

export const getProduct = async (id: string) => {
  try {
    const { product } = await medusaClient.products.retrieve(id);
    return product;
  } catch (error) {
    console.error(`Error fetching product ${id} from Medusa:`, error);
    return null;
  }
};

export const getCategories = async (options: Record<string, unknown> = {}) => {
  try {
    const { product_categories } = await medusaClient.productCategories.list(options);
    return product_categories;
  } catch (error) {
    console.error("Error fetching categories from Medusa:", error);
    return [];
  }
};

export const getCategory = async (id: string) => {
  try {
    const { product_category } = await medusaClient.productCategories.retrieve(id);
    return product_category;
  } catch (error) {
    console.error(`Error fetching category ${id} from Medusa:`, error);
    return null;
  }
};

// Product type definition
export type Product = {
  id: string;
  title: string;
  description: string;
  handle: string;
  thumbnail: string;
  variants: ProductVariant[];
  collection_id?: string;
  collection?: { id: string; title: string; handle: string };
  prices?: { amount: number; currency_code: string }[];
  tags?: { id: string; value: string }[];
  categories?: { id: string; name: string; handle: string }[];
};

export type ProductVariant = {
  id: string;
  title: string;
  prices: {
    id: string;
    currency_code: string;
    amount: number;
  }[];
  options: {
    id: string;
    value: string;
    option_id: string;
  }[];
  inventory_quantity: number;
};

export type ProductCategory = {
  id: string;
  name: string;
  handle: string;
  parent_category_id: string | null;
  parent_category?: ProductCategory;
};

// Interface for product filtering parameters 
export interface ProductFilterOptions {
  limit?: number;
  offset?: number;
  category_id?: string[];
  collection_id?: string[];
  tags?: string[];
  title?: string;
  handle?: string;
  q?: string;
  id?: string[];
  created_at?: {
    lt?: string;
    gt?: string;
    lte?: string;
    gte?: string;
  };
  updated_at?: {
    lt?: string;
    gt?: string;
    lte?: string;
    gte?: string;
  };
} 