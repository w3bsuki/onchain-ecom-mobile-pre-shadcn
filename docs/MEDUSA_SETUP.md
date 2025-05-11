# Medusa Backend Setup Guide

This guide will help you set up and connect to a Medusa backend for your Onchain Commerce Template.

## Prerequisites

- Node.js (v16 or higher)
- Git

## Step 1: Install Medusa CLI

```bash
npm install -g @medusajs/medusa-cli
```

## Step 2: Create a Medusa Backend

```bash
# Create a new Medusa store
medusa new medusa-store

# Change directory to the newly created store
cd medusa-store

# Start development server
npm run start
```

The Medusa server will start on `http://localhost:9000`.

## Step 3: Configure CORS (Important!)

In your Medusa backend, you need to configure CORS to allow requests from your frontend.

Edit the `medusa-config.js` file in your Medusa store:

```javascript
// In medusa-config.js
module.exports = {
  projectConfig: {
    // ... other configs
    store_cors: "http://localhost:3000", // Allow requests from your Next.js app
    admin_cors: "http://localhost:7000", // Only needed if using admin
  },
  // ... other configurations
};
```

After changing the configuration, restart your Medusa server.

## Step 4: Configure the Frontend

Create a `.env.local` file in your project root with:

```
NEXT_PUBLIC_MEDUSA_API_URL=http://localhost:9000
```

Restart your Next.js development server to apply the changes.

## Step 5: Add Products to Medusa

1. Access the Medusa admin at `http://localhost:9000/admin`
2. Create an account
3. Add products, categories, and other data

## Troubleshooting

### Cannot connect to Medusa backend

1. **Check if Medusa is running**
   - Make sure the Medusa server is running at `http://localhost:9000`
   - Try accessing `http://localhost:9000/health` in your browser

2. **CORS Issues**
   - Ensure CORS is properly configured in `medusa-config.js`
   - Verify the `store_cors` URL matches your frontend

3. **API URL Configuration**
   - Check your `.env.local` file has the correct `NEXT_PUBLIC_MEDUSA_API_URL`

4. **Proxy API Method**
   - This project uses a Next.js API route to proxy requests to Medusa
   - The proxy handles CORS issues between your frontend and Medusa

### No Products Found

If you're connected but no products appear:
1. Log in to the Medusa admin
2. Add some products with variants and prices
3. Publish the products

## Testing the Connection

You can test your Medusa connection at:
- `/medusa-check` - Tests the connection to Medusa
- `/medusa-test` - Shows products from your Medusa store

## Need More Help?

Refer to the [Medusa Documentation](https://docs.medusajs.com/) for detailed setup instructions. 