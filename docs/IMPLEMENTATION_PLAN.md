# OnChain E-Commerce Transformation Plan

## Project Overview
Transform the current OnChain Commerce Template into a full-featured e-commerce hat store while preserving the existing minimalist styling. We'll integrate Medusa.js for backend functionality, Clerk for authentication, and maintain both crypto and traditional payment methods.

## Current Styling to Preserve

### Color Scheme & Visual Identity
- Clean white backgrounds (`bg-[white]`)
- Subtle gray borders (`border-gray-200`)
- Minimalist UI with ample whitespace
- Current font usage (Inter, IBM Plex Mono, Noto Sans Mono)

### Component Styling Patterns
- Rounded corners on modals (`rounded-[10px]`)
- Fixed position elements for header and cart
- Responsive layouts with Tailwind breakpoints (xs, sm, md, lg, xl)
- Current spacing system using padding/margin utilities

## Implementation Plan

### Phase 1: Project Setup & Git Configuration
1. Create a development branch
   ```
   git checkout -b medusa-integration
   ```
2. Install additional dependencies (Medusa.js client, Clerk, Stripe, etc.)
3. Set up environment variables for new integrations
4. Push branch to remote for parallel development

### Phase 2: Medusa.js Backend Integration
1. Install & configure Medusa.js backend
   - Set up product management
   - Configure shipping options
   - Set up tax configurations
   - Import initial product data
2. Connect frontend to Medusa backend
   - Replace hardcoded products with dynamic Medusa products
   - Integrate Medusa cart functionality
   - Update checkout flow to use Medusa orders
3. Migrate product images to Medusa's storage

### Phase 3: Authentication with Clerk
1. Install and configure Clerk SDK
2. Create authentication pages
   - Sign In
   - Sign Up
   - Reset Password
3. Implement protected routes
4. Add user profile functionality
5. Connect Clerk user identity with Medusa customer profiles

### Phase 4: Payment Methods
1. Maintain current OnchainKit crypto payments
2. Add Stripe integration through Medusa
   - Set up Stripe webhook handling
   - Configure payment success/failure flows
3. Update checkout UI to accommodate both payment options
4. Implement order confirmation and receipt emails

### Phase 5: Shadcn/UI Integration (Preserving Styling)
1. Install Shadcn/UI base
2. Create custom theme that matches current styling
3. Gradually replace components while preserving visual identity:
   - Replace buttons with Shadcn Button (styled to match current design)
   - Replace inputs with Shadcn Input (styled to match)
   - Add Shadcn Dialog for modals (styled to match current design)
4. Ensure all new components adhere to existing styling patterns

### Phase 6: E-Commerce Enhancements
1. Add product categories and filtering
2. Implement search functionality
3. Create product detail pages
4. Add wishlist functionality
5. Implement product reviews
6. Add related/recommended products

### Phase 7: Internationalization
1. Install and configure next-intl
2. Extract all UI text to translation files
3. Implement language switcher
4. Connect with Medusa's multi-currency support

## Technology Stack
- **Frontend:** Next.js, Tailwind CSS, Shadcn/UI (styled to match current design)
- **Backend:** Medusa.js
- **Authentication:** Clerk
- **Payments:** Stripe (traditional), OnchainKit (crypto)
- **Internationalization:** next-intl
- **State Management:** React Context API + Medusa SDK

## Styling Guidelines for ShadCN Integration

When integrating Shadcn components, always:
1. Override default Shadcn styles to match current design
2. Maintain current spacing and layout patterns
3. Use the existing color scheme
4. Keep the current minimalist aesthetic
5. Ensure responsive behavior matches current implementation

## Current Component Analysis (for Style Preservation)

### Navbar
```css
.navbar {
  fixed top-10 right-1/2 left-1/2 w-screen
  border-gray-200 border-b bg-[white]
}
```

### Banner
```css
.banner {
  fixed top-0 left-0 h-10 w-full
  flex items-center justify-center
}
```

### Cart
```css
.cart {
  fixed right-1/2 bottom-0 left-1/2 w-screen
  border-gray-200 border-t bg-[white]
}
```

### Product Items
```css
.product-item {
  w-full flex-col p-4 sm:mx-0 lg:p-6
}
```

### Buttons
```css
.button {
  flex h-8 w-8 items-center justify-center
  rounded border border-gray-200
}
```

## Git Workflow
1. Keep the `medusa-integration` branch for this implementation
2. Create a separate `supabase-integration` branch for parallel development
3. Use feature branches for major functionality
4. Merge back to main once both approaches are evaluated 