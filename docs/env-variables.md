# Environment Variables

This document describes all environment variables needed for the project.

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```sh
# Supabase Configuration
# Get these from your Supabase project settings
NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"

# Coinbase Commerce API Key
# See https://beta.commerce.coinbase.com/
COINBASE_COMMERCE_API_KEY="YOUR_COINBASE_COMMERCE_API_KEY"

# OnchainKit API Key
# See https://portal.cdp.coinbase.com/products/onchainkit
NEXT_PUBLIC_ONCHAINKIT_API_KEY="YOUR_ONCHAINKIT_API_KEY"

# Medusa Configuration
# See https://docs.medusajs.com/
NEXT_PUBLIC_MEDUSA_API_URL="YOUR_MEDUSA_API_URL"
```

## Future Environment Variables

These variables will be added in later phases:

```sh
# Stripe API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""
``` 