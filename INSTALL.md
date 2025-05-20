# Onchain Commerce Platform Installation Guide

This guide provides step-by-step instructions for setting up the Onchain Commerce platform with a Medusa.js backend.

## Step 1: Project Cleanup

First, let's clean up the existing project to remove any Supabase or old Medusa implementation:

**On Windows:**
```bash
cleanup.bat
```

**On macOS/Linux:**
```bash
chmod +x cleanup.sh
./cleanup.sh
```

## Step 2: Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and update the environment variables:
   ```
   # Medusa.js Backend
   NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000

   # Stripe (if using Stripe payments)
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...

   # Optional: Coinbase Commerce (if using crypto payments)
   COINBASE_COMMERCE_API_KEY=...
   ```

## Step 3: Install Dependencies

Clean up and install dependencies:

```bash
npm install
```

## Step 4: Install Medusa.js Backend

1. Create a new Medusa.js backend:
   ```bash
   npx create-medusa-app@latest
   ```

2. When prompted:
   - For project name, enter "medusa-backend" (or your preferred name)
   - Choose "Create a new Medusa project with required dependencies"
   - Select needed modules (products, customers, orders recommended)
   - Choose your database (PostgreSQL recommended for production)
   - Choose default admin interface
   - For storefront, select "Use existing storefront" and point to this project

## Step 5: Configure Medusa Backend

1. Navigate to your Medusa backend directory:
   ```bash
   cd ../medusa-backend
   ```

2. Start the Medusa backend:
   ```bash
   npm run start
   ```

3. The admin interface should be accessible at http://localhost:7001

4. Log in with your admin credentials (or create an account)

5. Add products through the admin interface

## Step 6: Start the Frontend

1. Return to this project directory:
   ```bash
   cd ../onchain-commerce-template
   ```

2. Start the Next.js development server:
   ```bash
   npm run dev
   ```

3. Visit http://localhost:3000 to see your store in action

## Step 7: Customize Your Store

1. Update store information in `src/config.ts`
2. Modify the UI components in `src/components`
3. Configure your payment methods as needed

## Testing the Integration

To ensure Medusa.js is properly integrated:

1. Go to your products page: http://localhost:3000/products
2. Verify products from Medusa are displayed
3. Test adding items to cart
4. Test checkout process

## Deployment

To deploy your Medusa.js store:

1. Deploy the Medusa backend to a suitable hosting platform
2. Update your `.env.local` with the production backend URL
3. Deploy your Next.js frontend to Vercel or similar platforms

## Troubleshooting

If you encounter any issues:

1. Check the browser console for errors
2. Verify Medusa.js backend is running
3. Ensure your environment variables are correctly set
4. Review the [Medusa documentation](https://docs.medusajs.com/)
5. Check CORS settings in the Medusa backend

## Additional Resources

- [Medusa Documentation](https://docs.medusajs.com/)
- [Medusa API Reference](https://docs.medusajs.com/api/store)
- [Next.js Documentation](https://nextjs.org/docs) 