# Setting Up Medusa Backend for Onchain Commerce

This guide will help you set up a Medusa backend to work with the Onchain Commerce Template.

## Prerequisites

- Node.js 16 or higher
- PostgreSQL (recommended) or SQLite

## 1. Install Medusa CLI

```bash
npm install -g @medusajs/medusa-cli
```

## 2. Create a new Medusa project

Create a new directory for your Medusa backend outside of the Next.js project:

```bash
mkdir medusa-backend
cd medusa-backend
```

Initialize a new Medusa project:

```bash
npx create-medusa-app@latest
```

- Select "Backend only" when prompted
- Choose PostgreSQL (recommended) or SQLite for the database
- Follow the prompts to complete the setup

## 3. Configure CORS

Open `medusa-config.js` in your Medusa backend directory and update the CORS settings:

```js
// In your medusa-config.js
const STORE_CORS = process.env.STORE_CORS || "http://localhost:3000";

// Add this to your exported configuration object
module.exports = {
  projectConfig: {
    // ... other config
    store_cors: STORE_CORS,
    admin_cors: ADMIN_CORS,
  },
  // ... plugins, etc.
};
```

## 4. Start the Medusa server

```bash
cd medusa-backend
npm start
```

The server will run on http://localhost:9000 by default.

## 5. Verify the connection

1. Make sure the Medusa server is running
2. Start your Next.js development server: `bun run dev`
3. Visit http://localhost:3000/medusa-check to test the connection
4. If the connection is successful, you'll see a confirmation message

## 6. Create test products

1. Access the Medusa admin panel at http://localhost:9000/admin
2. Create an admin user if prompted
3. Add products, with titles, descriptions, prices, and images
4. Make sure to publish the products so they appear in the store

## 7. Configure environment variables

Create a `.env.local` file in your Next.js project root with:

```
NEXT_PUBLIC_MEDUSA_API_URL=http://localhost:9000
```

## Troubleshooting

### Connection issues
- Make sure the Medusa server is running on the correct port
- Check that CORS is properly configured to allow requests from your frontend
- Verify that the `NEXT_PUBLIC_MEDUSA_API_URL` environment variable is set correctly

### No products showing
- Verify that you've created and published products in the Medusa admin
- Check the browser console for any API errors
- Use the Products endpoint test button on the `/medusa-check` page to see the raw API response

## Next Steps

Once your Medusa backend is properly connected, you can:

1. Remove the mock products from the OnchainStoreProvider
2. Implement cart functionality using Medusa's cart API
3. Set up proper checkout using Medusa's checkout API
4. Add user authentication if needed

For more information, visit the [Medusa documentation](https://docs.medusajs.com/). 