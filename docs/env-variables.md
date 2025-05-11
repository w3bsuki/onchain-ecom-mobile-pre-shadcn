# Environment Variables

This document describes all environment variables needed for the project.

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```sh
# Coinbase Commerce API Key
# See https://beta.commerce.coinbase.com/
COINBASE_COMMERCE_API_KEY="YOUR_COINBASE_COMMERCE_API_KEY"

# OnchainKit API Key
# See https://portal.cdp.coinbase.com/products/onchainkit
NEXT_PUBLIC_ONCHAINKIT_API_KEY="YOUR_ONCHAINKIT_API_KEY"

# Medusa Backend API URL
# Default is http://localhost:9000 for local development
NEXT_PUBLIC_MEDUSA_API_URL="http://localhost:9000"

# Medusa Backend API Key (if required)
MEDUSA_API_KEY=""
```

## Future Environment Variables

These variables will be added in later phases:

```sh
# Stripe API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_SECRET_KEY=""

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""
``` 