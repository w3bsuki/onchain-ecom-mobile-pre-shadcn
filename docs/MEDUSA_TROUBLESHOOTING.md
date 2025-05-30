# Troubleshooting Medusa Integration

This document provides guidance for troubleshooting common issues with the Medusa backend integration.

## Prerequisites

Before troubleshooting, ensure:

1. Medusa backend is running on port 9000 (`http://localhost:9000`)
2. Medusa database is properly seeded with products
3. `.env.local` file has the correct Medusa backend URL (`NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000`)

## Common Issues and Solutions

### No Products Displaying

If products from Medusa aren't showing:

1. **Verify Medusa Backend Status**
   - Ensure Medusa is running by visiting `http://localhost:9000/store/products` in your browser
   - You should see a JSON response with products

2. **Check Browser Console**
   - Open browser dev tools (F12) and look for errors in the console
   - Look for CORS errors or failed API calls

3. **Use Debug Page**
   - Visit `/medusa-debug` in your application to test the connection
   - This page shows direct API results vs. client results and helps identify where the issue might be

4. **Check Product Transformation**
   - Inspect the browser console logs for any errors in transforming product data
   - Verify the structure of the products returned from Medusa matches what your components expect

### CORS Issues

If you're seeing CORS errors:

1. Add the frontend URL to Medusa's CORS allowed origins in `medusa-config.js`:
   ```js
   module.exports = {
     projectConfig: {
       // ...
       cors: {
         origin: ["http://localhost:3000"],
         credentials: true,
       },
     },
     // ...
   };
   ```

2. Restart the Medusa server after making changes.

### Publishable API Key Issues

If you're having issues with publishable API keys:

1. Create a key manually in the Medusa admin (`http://localhost:9000/app`)
2. Add the key to `.env.local`:
   ```
   NEXT_PUBLIC_MEDUSA_API_KEY=your_key_here
   ```

## Using Direct API Access

For reliability, this integration includes two methods to fetch products:

1. **Medusa Client** - Uses the official Medusa JS client
2. **Direct API** - Uses fetch directly against Medusa's REST endpoints

The integration will attempt to use direct API access first, then fall back to the client if that fails.

## Accessing the Debug Page

A debug page is available at `/medusa-debug` that shows:

- Connection status
- Products from direct API
- Products from Medusa client
- Raw data samples
- Current backend URL

Use this page to diagnose Medusa connection issues.
