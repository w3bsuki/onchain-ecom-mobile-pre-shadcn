# Project Memory & Technical Decisions

## Core Architecture

### Frontend Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Server Components + Context
- **Testing**: Vitest + Playwright

### Backend Integration
- **E-commerce**: Medusa
- **Database**: Supabase
- **Authentication**: Next.js Auth + Supabase
- **File Storage**: Supabase Storage
- **API Layer**: Next.js API Routes

## Environment Configuration

### Development Setup
- **Node Version**: 18.x+
- **Package Manager**: npm
- **Development Port**: 3000
- **API URL**: http://localhost:3000/api
- **Environment Variables**: See `.env.example`

### API Configuration
- Using Next.js API routes for backend communication
- Rate limiting implemented on API routes
- CORS configured for development and production
- Error handling middleware in place

## Technical Decisions

### State Management Strategy
- Server Components for most UI
- React Context for client state
- Local storage for persistence
- Server actions for mutations
- Optimistic updates for UX

### Performance Optimizations
- Image optimization via next/image
- Font optimization via next/font
- Route prefetching
- Partial prerendering
- Streaming SSR

### Component Architecture
- Atomic design principles
- Server/Client component split
- Composition over inheritance
- Props interface definitions
- Error boundaries implementation

## Solved Issues & Solutions

### Next.js App Router Setup
- **Issue**: Route group organization
- **Solution**: Implemented feature-based route groups
- **Date**: [Current Date]

### TypeScript Configuration
- **Issue**: Strict mode errors
- **Solution**: Proper type definitions and interfaces
- **Date**: [Current Date]

### Component Library Integration
- **Issue**: shadcn/ui setup
- **Solution**: Custom component configuration
- **Date**: [Current Date]

## Code Patterns

### API Routes
```typescript
// Standard API route pattern
import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

export async function GET(request: Request) {
  try {
    // Rate limiting
    const limiter = await rateLimit.check()
    if (!limiter.success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    // Logic here
    return NextResponse.json({ data })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Component Pattern
```typescript
// Standard component pattern
import { type FC } from 'react'
import { cn } from '@/lib/utils'

interface ComponentProps {
  className?: string
  children: React.ReactNode
}

export const Component: FC<ComponentProps> = ({
  className,
  children
}) => {
  return (
    <div className={cn('base-styles', className)}>
      {children}
    </div>
  )
}
```

## Important Dependencies

### UI Components
- shadcn/ui: Custom component library
- Tailwind CSS: Utility-first CSS
- Lucide Icons: Icon system
- next/font: Font optimization

### Development Tools
- ESLint: Code linting
- Prettier: Code formatting
- Husky: Git hooks
- lint-staged: Staged file linting

### Testing Tools
- Vitest: Unit testing
- Playwright: E2E testing
- Testing Library: Component testing
- MSW: API mocking

## Deployment Strategy

### Vercel Deployment
- Production branch: main
- Preview branches: feature/*
- Environment variables configured
- Edge functions enabled
- Analytics enabled

### Performance Monitoring
- Vercel Analytics
- Core Web Vitals tracking
- Error tracking
- User analytics

## Notes
- This document should be updated when making significant technical decisions
- All solved issues should be documented with solutions
- Code patterns should be kept up to date
- Dependencies should be reviewed regularly

# Memory

This document captures important insights, lessons learned, and development knowledge to maintain continuity throughout the project.

## Mobile Navigation Insights

### Bottom Navigation Best Practices
- Keep to 4-5 items maximum for bottom navigation
- Use recognizable icons with clear labels
- Ensure active state is highly visible
- Position most frequently used actions within thumb reach
- Consider using a larger, centered action button for primary function

### Search Experience
- Mobile search should expand to full screen when activated
- Use input with clear button for easy text removal
- Show recent/popular searches for quick access
- Implement autocomplete for efficiency
- Provide visual feedback during search (loading indicators)

### Back Navigation Patterns
- Consistent back button placement in top left
- Use gestures (swipe) for additional navigation options
- Maintain navigation history properly
- Consider "up" vs "back" navigation distinctions

## Product Display Considerations

### Product Card Optimization
- Focus on product image as primary element
- Keep information minimal: title, price, maybe one key feature
- Use subtle visual cues for actions (wishlist, quick view)
- Ensure touch targets are large enough (min 44x44px)
- Consider loading patterns (skeleton vs. blur)

### Product Detail Page
- Lead with large, swipeable product images
- Keep key purchase information (price, variants, add to cart) above the fold
- Use expandable sections for additional details
- Sticky add-to-cart button that remains visible during scroll
- Clear visual hierarchy: image > title > price > options > action

### Image Gallery Patterns
- Swipeable main image with dot indicators
- Thumbnail strip for quick navigation on larger screens
- Pinch-to-zoom capability
- Full-screen gallery mode
- Consider performance implications of high-res images

## Cart & Checkout Optimization

### Cart Design
- Clear visual indication of cart item count
- Easy-to-scan line items with image + title
- Simple quantity adjustment controls
- Prominent "Proceed to Checkout" button
- Show order summary with subtotal, shipping, tax, total

### Checkout Flow
- Single-column layout for mobile forms
- Break into logical steps (info, shipping, payment, review)
- Minimize form fields and use appropriate input types
- Autofill support for addresses and payment
- Persistent summary of purchase throughout checkout
- Clear error messages tied to specific fields

### Payment UX
- Support digital wallets for faster checkout (Apple Pay, Google Pay)
- Remember payment methods for returning customers
- Show security indicators to build trust
- Provide clear feedback during processing

## Performance Lessons

### Image Optimization
- Use Next.js Image component with appropriate sizing
- Implement responsive image srcsets
- Consider WebP format with fallbacks
- Lazy-load images below the fold
- Use blur placeholders for perceived performance

### JavaScript Performance
- Implement code splitting for route-based chunks
- Defer non-critical JavaScript
- Use React.memo for expensive renders
- Optimize event handlers with debounce/throttle
- Virtualize long lists

### CSS Performance
- Use Tailwind's JIT mode to minimize CSS size
- Avoid complex CSS selectors
- Minimize CSS variables changes during animations
- Use transform/opacity for animations
- Consider content-visibility for off-screen content

## Authentication Patterns

### Sign-Up Flow
- Minimize required fields for initial registration
- Allow guest checkout with option to create account later
- Use social login options to reduce friction
- Implement progressive profiling (gather more info over time)
- Clear password requirements and strength indicators

### Login Experience
- Remember email/username between sessions
- Provide "forgot password" option prominently
- Implement biometric authentication when available
- Use secure but user-friendly password recovery

## Technical Insights

### React Server Components
- Use RSC for data-heavy, non-interactive components
- Keep client components focused on interactivity
- Be mindful of the "use client" boundary
- Leverage streaming for improved loading experience
- Structure directories to clearly separate server/client concerns

### Next.js App Router
- Group related routes in directories
- Use loading.tsx for loading states
- Implement error.tsx for fallbacks
- Leverage route groups for organization without affecting URL structure
- Use parallel routes for complex layouts

### Medusa.js Integration
- Cache product data where appropriate
- Use webhooks for inventory/status updates
- Implement optimistic UI updates for cart changes
- Carefully handle user session state
- Consider region/currency handling early

## Common Pitfalls

### Mobile Usability Issues
- Forgetting to account for on-screen keyboards
- Touch targets too small or too close together
- Not testing on actual mobile devices
- Overlooking gesture conflicts
- Fixed positioning breaking on iOS

### Performance Traps
- Too many client components causing large JS bundles
- Unoptimized images causing poor LCP
- Layout shifts from dynamically loaded content
- Excessive re-renders from context changes
- Network waterfalls from nested data fetching

### State Management Challenges
- Context providers that are too broad causing unnecessary renders
- Prop drilling making components hard to maintain
- Local state that should be shared or persisted
- Not handling loading/error states consistently
- Forgetting to cleanup effects

---

**REMINDER**: Update this document with new insights as they are discovered.

---

[Back to Master Plan](./MASTER_PLAN.md) 