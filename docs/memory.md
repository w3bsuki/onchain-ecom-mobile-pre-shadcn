# Project Memory

This document serves as a knowledge base and "memory" for key decisions, technical details, and solutions to problems encountered during development. This helps maintain consistency and prevent repeating past mistakes.

## Environment Setup

### Medusa Backend
- **Database**: PostgreSQL
- **Admin URL**: http://localhost:9000/app
- **API URL**: http://localhost:9000
- **Admin Credentials**: 
  - Email: admin@test.com
  - Password: supersecret
- **API Key**: Must have sales channels assigned to access products

### Frontend
- **Framework**: Next.js
- **Port**: 3001
- **Environment Variables**: Stored in `.env.local` (not committed to git)
  - `NEXT_PUBLIC_MEDUSA_API_URL=http://localhost:9000`
  - `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxxx`

## Technical Decisions

### API Communication
- Created a proxy API route at `/api/medusa-proxy` to handle CORS issues
- Using client-side fetching for product data
- Using server components for static content

### Authentication Strategy
- Admin authentication via Medusa admin panel
- Customer authentication planned via Medusa authentication endpoints
- Will potentially integrate Clerk for enhanced authentication features

### State Management
- Using React hooks for local state
- Planning to implement context for cart state
- No Redux or other global state library planned

## Issues Solved

### Medusa Connection Issues
- **Problem**: Unable to connect to Medusa backend from Next.js
- **Solution**: Created a proxy API route to forward requests and handle CORS
- **Date**: May 8, 2025

### Database Configuration
- **Problem**: Stock_location module errors in Medusa
- **Solution**: Properly configured PostgreSQL with correct connection string
- **Date**: May 8, 2025

### Products Not Displaying
- **Problem**: Products were created but not showing in frontend
- **Solution**: Assigned sales channels to the publishable API key
- **Date**: May 8, 2025

## Code Patterns

### API Routes
```typescript
// Standard pattern for API routes
export async function GET(request: NextRequest) {
  try {
    // Logic here
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### Component Structure
```tsx
// Standard component pattern
'use client';

import { useState, useEffect } from 'react';

interface ComponentProps {
  // Props definition
}

export default function Component({ prop1, prop2 }: ComponentProps) {
  // State and hooks
  
  useEffect(() => {
    // Side effects
  }, []);
  
  // Helper functions
  
  return (
    // JSX
  );
}
```

## Third-Party Integrations

### Medusa
- **Purpose**: E-commerce backend
- **Documentation**: https://docs.medusajs.com/
- **Implementation Notes**: 
  - Requires sales channels to be assigned to API keys
  - Admin panel accessible at /app path

### Stripe (Planned)
- **Purpose**: Payment processing
- **Implementation Plan**: 
  - Will use Medusa's Stripe integration
  - Will need webhook configuration

## Deployment Notes

*To be added when deployment is set up* 