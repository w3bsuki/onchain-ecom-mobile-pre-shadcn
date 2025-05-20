# E-Commerce Project Cleanup Plan

This document outlines everything that needs to be removed to clean up the project before installing a fresh Medusa.js backend.

## Remove Supabase Integration

- [ ] Delete `src/lib/supabase-client.ts`
- [ ] Remove Supabase environment variables from `.env.local`
- [ ] Delete all API routes that interact with Supabase:
  - [ ] `src/app/api/debug-products/route.ts`
  - [ ] `src/app/api/seed-products/route.ts`
  - [ ] `src/app/api/setup-database/route.ts`
  - [ ] Any other Supabase-specific API routes
- [ ] Delete `src/utils/supabase/middleware.ts`
- [ ] Remove Supabase references from `src/middleware.ts`
- [ ] Delete `src/context/SupabaseProvider.tsx`
- [ ] Clean up `src/config.ts` to remove Supabase configuration variables

## Remove Current Hooks and Components

- [ ] Delete `src/hooks/useProducts.ts`
- [ ] Delete `src/hooks/useCart.ts`
- [ ] Clean up or replace `src/components/ProductImage.tsx` (currently has Supabase dependency)
- [ ] Clean up `src/components/ProductCard.tsx` (may have Supabase dependency)

## Remove Supabase Database Files

- [ ] Delete `supabase/` directory and all migration files
- [ ] Delete Supabase documentation files:
  - [ ] `supabase_image_storage_setup.md`
  - [ ] `supabase_json_field_guide.md`
  - [ ] `troubleshooting_supabase.md`

## Remove Current Medusa Implementation

- [ ] Delete `my-medusa-store/` directory (includes medusa-config.ts and other Medusa files)
- [ ] Clean up any existing Medusa.js configurations and dependencies in `package.json`
- [ ] Delete or update Medusa-specific components:
  - [ ] `src/components/MedusaImage.tsx`
  - [ ] `src/components/errors/MedusaConnectionError.tsx`
- [ ] Delete or update Medusa-specific API routes:
  - [ ] `src/app/api/medusa-direct-test/route.ts`
  - [ ] `src/app/api/medusa-image/route.ts` (if exists)
  - [ ] `src/app/api/medusa-proxy/route.ts` (if exists)
  - [ ] `src/app/api/medusa-status/route.ts` (if exists)
  - [ ] `src/app/api/medusa-test/route.ts` (if exists)
- [ ] Clean up test pages:
  - [ ] `src/app/image-test/page.tsx`
  - [ ] `src/app/image-proxy-test/page.tsx`
  - [ ] `src/app/image-debug/page.tsx`
- [ ] Check for and remove any `lib/medusa-client.ts` or similar files

## Clean up Next.js Configuration

- [ ] Update `next.config.js` if it has Supabase or Medusa-specific configurations
- [ ] Update `vercel.json` to remove any Medusa backend URLs
- [ ] Clean up `tsconfig.json` to remove Medusa exclusions
- [ ] Review and update environment variables in deployment configurations

## Dependencies to Remove/Update

- [ ] `@supabase/supabase-js` and any other Supabase-related packages
- [ ] Review current Medusa packages in `package.json`:
  - [ ] `@medusajs/medusa-js`
  - [ ] Any other Medusa-related packages that need to be updated

## Steps to Prepare for Fresh Medusa.js Install

1. After removing all the above components, run:
   ```bash
   npm prune
   npm install
   ```

2. Clear Next.js cache:
   ```bash
   rm -rf .next
   ```

3. Update `package.json` name and version as needed (currently "medusa-ecommerce-template")

## Setting Up New Medusa.js Backend

1. Create a new Medusa.js project using their CLI:
   ```bash
   npx create-medusa-app@latest
   ```

2. Follow the interactive prompts to set up:
   - Backend (Medusa)
   - Admin dashboard
   - Storefront (select "Use existing storefront" and point to this Next.js project)

3. Configure the new Medusa backend:
   - Update CORS settings in medusa-config.js to allow your frontend URL
   - Set up database connection
   - Configure any additional plugins needed

## Connecting Next.js to New Medusa Backend

1. Create a new Medusa client file:
   ```typescript
   // src/lib/medusa-client.ts
   import Medusa from "@medusajs/medusa-js"
   
   const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
   
   export const medusaClient = new Medusa({ 
     baseUrl: MEDUSA_BACKEND_URL,
     maxRetries: 3
   })
   
   export default medusaClient
   ```

2. Update your environment variables:
   ```
   NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
   ```

3. Create hooks for interacting with Medusa (products, cart, etc.)

4. Update UI components to use Medusa data and APIs 