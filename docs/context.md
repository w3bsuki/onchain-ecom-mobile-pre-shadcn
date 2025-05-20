# Project Context

## Project Vision
Transform the OnChain Commerce Template into a modern, minimal e-commerce hat store while preserving the clean, minimalist aesthetic of the original design.

## Key Objectives
1. Maintain the existing minimalist UI design throughout all changes
2. Integrate Medusa.js as a full-featured e-commerce backend
3. Add user authentication with Clerk
4. Support both traditional (Stripe) and crypto payments
5. Ensure responsive design works across all devices
6. Implement internationalization for global market reach

## User Personas

### Hat Enthusiast
- Wants to browse a clean, distraction-free catalog of hats
- Appreciates high-quality product images and minimal UI
- Values both traditional and crypto payment options

### Shop Owner
- Needs easy product management through Medusa.js
- Wants to track inventory, orders, and customer data
- Requires analytics and reporting capabilities

## Technical Requirements

### Frontend
- Preserve the existing minimalist UI aesthetic
- Use Shadcn/UI components with custom styling to match the current design
- Responsive design for mobile, tablet, and desktop
- Fast loading times and optimized performance

### Backend
- Medusa.js for product management, cart, checkout, and orders
- Secure user authentication with Clerk
- Robust error handling and logging
- Easy deployment and maintenance

### Integration Points
- Connect Medusa.js with the frontend
- Integrate Stripe for traditional payments
- Maintain OnchainKit for crypto payments
- Link Clerk authentication with Medusa customer profiles

## Design Principles
1. **Minimalism First**: Maintain clean, uncluttered interfaces
2. **Consistency**: Keep consistent styling throughout the application
3. **Performance**: Optimize for speed and responsiveness
4. **Accessibility**: Ensure the store is usable by everyone

## Success Criteria
- Complete e-commerce functionality (browsing, cart, checkout)
- Seamless integration of Medusa.js backend
- Preserved minimalist aesthetic
- Successful processing of both traditional and crypto payments
- Secure user authentication and account management

# Context

This document serves as the knowledge base for our e-commerce platform, capturing architectural decisions, technical considerations, and rationale behind key choices.

## Project Architecture

### Frontend Architecture

Our e-commerce platform follows a layered architecture using Next.js App Router:

1. **Presentation Layer** (src/app, src/components)
   - Pages and layouts (src/app) 
   - UI components (src/components/ui)
   - Feature components (src/components)

2. **Application Layer** (src/hooks, src/context)
   - Business logic
   - Data transformations
   - State management

3. **Data Access Layer** (src/lib)
   - API clients
   - Data fetching utilities
   - External service integrations

### Key Design Patterns

1. **Server Components for Initial Render**
   - Using Next.js React Server Components for initial page load
   - Reduces client-side JavaScript
   - Improves SEO and performance

2. **Client Components for Interactive Elements**
   - Interactive UI elements use client components
   - State management contained within component trees
   - Minimize prop drilling with context where appropriate

3. **Responsive Patterns**
   - Mobile-first CSS approach
   - Conditional rendering for different viewport sizes
   - Component-aware responsiveness using container queries

4. **Component Composition**
   - Building complex interfaces from smaller, reusable components
   - Using composition over inheritance
   - Leveraging shadcn/ui component patterns

## Key Decisions

### Technology Stack Selection

**Next.js with App Router**
- Decision: Use Next.js App Router for routing and page structure
- Rationale: Provides optimal server-side rendering, API routes, and modern React patterns
- Implications: Requires adapting to RSC model and managing client/server component boundaries

**Tailwind CSS**
- Decision: Use Tailwind for styling all components
- Rationale: Enables rapid development, consistent design system, and optimal mobile styling
- Implications: Team needs familiarity with utility-first approach

**shadcn/ui Component System**
- Decision: Use shadcn/ui as the foundation for our component library
- Rationale: Provides accessible, customizable components that follow best practices
- Implications: Need to extend and customize components for e-commerce specific needs

**Medusa.js for E-Commerce Backend**
- Decision: Use Medusa.js for product management, cart, checkout, and order processing
- Rationale: Open-source, headless e-commerce platform with flexible API
- Implications: Need to integrate with Next.js frontend and customize for specific requirements

### State Management

**React Context for Global State**
- Decision: Use React Context for global state management
- Rationale: Built-in to React, sufficient for our needs without additional libraries
- Implications: Need to carefully design context providers to avoid performance issues

**Server-Side State Management**
- Decision: Leverage Next.js data fetching patterns for server state
- Rationale: Optimizes initial page load and reduces client-side code
- Implications: Need to carefully manage cache invalidation and revalidation

**Client-Side State Management**
- Decision: Use React hooks for local component state
- Rationale: Simplifies component logic and maintains React patterns
- Implications: Need to avoid prop drilling through careful component composition

### Performance Optimization

**Image Optimization**
- Decision: Use Next.js Image component for all product images
- Rationale: Automatic optimization, responsive sizes, and lazy loading
- Implications: Need to configure appropriate sizes and loading strategies

**Code Splitting**
- Decision: Use dynamic imports for non-critical components
- Rationale: Reduces initial JavaScript bundle size
- Implications: Need to manage loading states for dynamically imported components

**Lazy Loading**
- Decision: Implement lazy loading for below-the-fold content
- Rationale: Improves initial page load performance
- Implications: Need to implement appropriate loading indicators

## Component Structure

We follow the Atomic Design methodology for organizing components:

1. **Atoms** (src/components/ui)
   - Basic UI components: Button, Input, Card
   - No business logic, purely presentational
   - Highly reusable across the application

2. **Molecules** (src/components/ui, src/components)
   - Combinations of atoms: SearchBar, ProductCard
   - Limited business logic
   - Specific to certain features but still reusable

3. **Organisms** (src/components)
   - Complex UI sections: Navigation, ProductGrid
   - May contain business logic
   - Feature-specific and less reusable

4. **Templates** (src/app layout.tsx files)
   - Page layouts and structure
   - No business logic, purely structural
   - Define the overall page organization

5. **Pages** (src/app page.tsx files)
   - Complete interfaces composed of organisms
   - Entry points for data fetching
   - Minimal logic, mostly composition of components

## API Integration

### Medusa.js Integration

- Using RESTful API endpoints for product catalog, cart, and checkout
- Custom API routes for additional functionality
- Token-based authentication for user sessions

### Payment Processing

- Primary integration with Stripe for payment processing
- API routes for secure handling of payment intents
- Client-side Stripe Elements for secure card input

## Development Workflow

### Component Development Process

1. Create component specification based on design system
2. Start with mobile implementation
3. Add desktop/tablet responsiveness
4. Implement core functionality
5. Add loading states, error handling, and edge cases
6. Document component with PropTypes and examples

### Code Quality Standards

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Vitest for unit and component testing
- Mobile-first implementation approach

---

**REMINDER**: Update this document when making significant architectural decisions.

---

[Back to Master Plan](./MASTER_PLAN.md) 