# Setting Up Medusa.js with Next.js Frontend

This guide provides step-by-step instructions for setting up a new Medusa.js backend and connecting it to your Next.js frontend. Follow these steps after completing the cleanup process.

## Prerequisites

- Node.js 16+
- npm or yarn
- PostgreSQL (recommended for production)

## Step 1: Run the Cleanup Script

Before proceeding, make sure you've run the cleanup script to remove Supabase and existing Medusa integrations:

**On Windows:**
```bash
cleanup.bat
```

**On Unix-based systems (Linux/macOS):**
```bash
chmod +x cleanup.sh
./cleanup.sh
```

## Step 2: Install Medusa.js Backend

1. Create a new Medusa.js project in a separate directory:

```bash
npx create-medusa-app@latest
```

2. Follow the prompts:
   - When asked for project name, enter a name like "medusa-backend"
   - For the setup: Choose "Create a new Medusa project with required dependencies"
   - For modules: Select the modules you need (Recommendation: start with Products, Orders, Customers)
   - For database: Select PostgreSQL for production or SQLite for development
   - For admin dashboard: Select "Medusa Admin" (default)
   - For storefront: Select "Use an existing storefront" and provide your Next.js path

3. After installation completes, your directory structure should look like:
   ```
   your-project/
   ├── medusa-backend/   # New Medusa backend
   └── onchain-commerce-template/  # Your Next.js frontend (this project)
   ```

## Step 3: Configure the Medusa Backend

1. Navigate to your Medusa backend directory:
   ```bash
   cd ../medusa-backend
   ```

2. Update the CORS settings in `medusa-config.js` to allow your frontend:
   ```js
   // In medusa-config.js
   module.exports = {
     projectConfig: {
       // other config...
       store_cors: process.env.STORE_CORS || "http://localhost:3000",
       admin_cors: process.env.ADMIN_CORS || "http://localhost:7001",
     },
     // other config...
   };
   ```

3. Start the Medusa backend:
   ```bash
   npm run start
   ```

## Step 4: Connect Next.js Frontend to Medusa

1. Navigate back to your Next.js project:
   ```bash
   cd ../onchain-commerce-template
   ```

2. Create a Medusa client file:
   ```bash
   mkdir -p src/lib
   touch src/lib/medusa-client.ts
   ```

3. Add the following code to `src/lib/medusa-client.ts`:
   ```typescript
   import Medusa from "@medusajs/medusa-js";

   const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

   export const medusaClient = new Medusa({ 
     baseUrl: MEDUSA_BACKEND_URL,
     maxRetries: 3
   });

   export default medusaClient;

   // Utility functions for common operations
   export const getProducts = async (options = {}) => {
     try {
       const { products, count } = await medusaClient.products.list(options);
       return { products, count };
     } catch (error) {
       console.error("Error fetching products from Medusa:", error);
       return { products: [], count: 0 };
     }
   };

   export const getProduct = async (id) => {
     try {
       const { product } = await medusaClient.products.retrieve(id);
       return product;
     } catch (error) {
       console.error(`Error fetching product ${id} from Medusa:`, error);
       return null;
     }
   };
   ```

4. Update your `.env.local` file:
   ```
   NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
   ```

## Step 5: Create Necessary Hooks

1. Create a products hook in `src/hooks/useProducts.ts`:
   ```typescript
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

2. Create a cart hook in `src/hooks/useCart.ts`:
   ```typescript
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
       } catch (err) {
         console.error('Error adding item to cart:', err);
       }
     };
     
     const removeItem = async (lineId) => {
       if (!cart) return;
       
       try {
         const { cart: updatedCart } = await medusaClient.carts.lineItems.delete(cart.id, lineId);
         setCart(updatedCart);
       } catch (err) {
         console.error('Error removing item from cart:', err);
       }
     };
     
     const updateQuantity = async (lineId, quantity) => {
       if (!cart) return;
       
       try {
         const { cart: updatedCart } = await medusaClient.carts.lineItems.update(cart.id, lineId, {
           quantity
         });
         setCart(updatedCart);
       } catch (err) {
         console.error('Error updating item quantity:', err);
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

## Step 6: Update UI Components

1. Update your product components to work with Medusa's data structure
2. Update `src/components/ProductImage.tsx` to use Medusa's image URLs
3. Adapt `src/components/ProductCard.tsx` to work with Medusa product data

## Step 7: Testing

1. Start your Medusa backend (in a separate terminal):
   ```bash
   cd ../medusa-backend
   npm run start
   ```

2. Start your Next.js frontend:
   ```bash
   cd ../onchain-commerce-template
   npm run dev
   ```

3. Visit http://localhost:3000 to verify your store is working correctly

## Troubleshooting

If you encounter issues with the Medusa connection:

1. Check your .env.local file has the correct Medusa backend URL
2. Verify the Medusa server is running and accessible
3. Check CORS settings in your Medusa backend configuration
4. Verify you're using the correct product structure from Medusa in your components

## Additional Resources

- [Medusa Documentation](https://docs.medusajs.com/)
- [Next.js + Medusa Integration Guide](https://docs.medusajs.com/starters/nextjs-medusa-starter)
- [Medusa Admin Setup](https://docs.medusajs.com/admin/quickstart)
- [Medusa API Reference](https://docs.medusajs.com/api/store) 