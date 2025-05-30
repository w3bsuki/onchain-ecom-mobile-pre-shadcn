# Medusa Backend Integration

This document provides instructions on how to use the Medusa backend integration with your e-commerce frontend.

## Setup

1. Make sure you have the Medusa backend set up according to the instructions in `MEDUSA_SETUP.md`.

2. Configure your environment variables:
   - Create a `.env.local` file in the root of your project
   - Add the following variables:
     ```
     NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
     ```

3. Start the development environment:
   ```powershell
   # On Windows
   .\start-medusa-dev.ps1
   ```

## How It Works

The integration fetches products from your Medusa backend and displays them in your e-commerce frontend:

1. The `services/medusa-service.ts` file contains functions to fetch products from Medusa
2. The `MedusaProducts` component displays products from Medusa with customizable options
3. Products are transformed from the Medusa format to match your frontend's product schema

## Components

- **MedusaProducts**: Displays a section of products from Medusa with a title and subtitle
  ```tsx
  <MedusaProducts 
    title="New Arrivals" 
    subtitle="Check out our latest products" 
    featured={true}
    limit={4}
  />
  ```

- **OnchainStore**: The main store component, now enhanced to show Medusa products
  - Categorizes products based on their collection in Medusa
  - Properly handles loading states

## Customization

You can customize how Medusa products are displayed:

1. Edit the `transformMedusaProduct` function in `services/medusa-service.ts` to change how products are transformed
2. Modify the `MedusaProducts` component for different layouts or styles
3. Update the category mapping in `OnchainStore.tsx` to match your Medusa collections

## Testing

To verify the integration is working:

1. Create some products in your Medusa admin dashboard
2. Make sure the Next.js frontend is running
3. Visit your frontend and check that the products are displayed correctly

## Troubleshooting

- If products aren't showing up, check the browser console for errors
- Verify your Medusa backend is running (`http://localhost:9000/health` should return a 200 status)
- Make sure your `.env.local` file has the correct Medusa backend URL
