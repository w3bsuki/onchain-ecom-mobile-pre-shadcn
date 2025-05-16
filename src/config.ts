// Add your API key from Coinbase Commerce
export const COINBASE_COMMERCE_API_KEY =
  process.env.COINBASE_COMMERCE_API_KEY || '';
// use NODE_ENV to not have to change config based on where it's deployed
export const NEXT_PUBLIC_URL =
  process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
// Add your API KEY from the Coinbase Developer Portal
export const NEXT_PUBLIC_ONCHAINKIT_API_KEY =
  process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || '';
// Medusa backend API URL
export const NEXT_PUBLIC_MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
// Medusa backend API key (if required)
export const MEDUSA_API_KEY = 
  process.env.MEDUSA_API_KEY || '';
// Flag to use fallback products instead of Medusa
export const USE_FALLBACK_PRODUCTS =
  process.env.NEXT_PUBLIC_USE_FALLBACK_PRODUCTS === 'true';

export const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
