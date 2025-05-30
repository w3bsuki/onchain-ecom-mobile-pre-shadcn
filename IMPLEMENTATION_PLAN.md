# Phase 1: Implementation Plan

Based on our analysis of the Onchain Commerce Template codebase, here's a detailed implementation plan for Phase 1 of our refactoring effort.

## Package Management Standardization

### Current State:
- Using multiple package managers: npm (package-lock.json) and Bun (bun.lockb)
- Dependencies in package.json include a mix of Medusa, UI components, and web3 libraries
- Scripts include a variety of commands for different tools (Biome, Vitest, etc.)

### Implementation Steps:

1. **Standardize on npm**
   - Remove bun.lockb
   - Run `npm install` to ensure package-lock.json is up-to-date
   - Update documentation to clearly state npm is the package manager

2. **Audit and Clean Dependencies**
   - Run `npm outdated` to identify outdated packages
   - Run `npm audit` to identify security issues
   - Remove unused dependencies:
     - Check for duplicate functionality (e.g., motion + framer-motion)
     - Evaluate web3 dependencies if not actively used
   - Update dependencies to latest compatible versions
   - Organize dependencies in package.json by category

3. **Refine Scripts**
   - Standardize naming conventions for scripts
   - Add descriptions for each script in package.json
   - Create npm scripts for common development tasks
   - Add scripts for the refactoring process

## Project Structure Improvements

### Current State:
- UI components are mixed in a single directory (`src/components/ui`)
- Duplicate components exist (e.g., multiple category-related components)
- Two separate Medusa client implementations:
  - `src/lib/medusa-client.ts`
  - `src/services/medusa-service.ts`
- Inconsistent file naming (e.g., PascalCase vs. kebab-case)

### Implementation Steps:

1. **Create New Directory Structure**
   - Create the following folders if they don't exist:
     - `src/components/layout`
     - `src/components/products`
     - `src/components/checkout`
     - `src/components/cart`
     - `src/services/medusa`
     - `src/types/medusa`
     - `src/hooks/medusa`

2. **Consolidate Medusa Integration**
   - Create `src/services/medusa/client.ts` for the centralized Medusa client
   - Create `src/services/medusa/products.ts` for product-related operations
   - Create `src/services/medusa/categories.ts` for category-related operations
   - Create `src/types/medusa/index.ts` for shared Medusa types
   - Create appropriate hook files in `src/hooks/medusa`

3. **Begin Component Organization**
   - Identify UI primitives (from shadcn/ui) and leave them in `src/components/ui`
   - Move layout-specific components to `src/components/layout`
   - Move product-specific components to `src/components/products`
   - Create a plan for dealing with duplicate components

## Initial Clean-up Tasks

### Current State:
- Multiple category components with overlapping functionality:
  - CategoryGrid.tsx
  - CategoryTabs.tsx
  - MobileCategoryNav.tsx
  - CategoryTabsScroller.tsx
- Multiple filter implementations:
  - mobile-filters.tsx
  - mobile-filters-optimized.tsx
  - FilterScrollArea.tsx
- Mixed file naming conventions:
  - PascalCase: CategoryGrid.tsx
  - kebab-case: mobile-filters.tsx

### Implementation Steps:

1. **Document Component Inventory**
   - Create a spreadsheet or document cataloging all components
   - Document component purpose, usage, and dependencies
   - Identify duplicate functionality
   - Mark components for consolidation or removal

2. **Create Component Transition Plan**
   - Define which components will be kept vs. merged
   - Document the migration strategy for each component
   - Create mapping between old and new component structure
   - Prioritize components based on usage and complexity

3. **Begin Basic File Reorganization**
   - Standardize file naming conventions
   - Organize files by domain/purpose
   - Move files to appropriate directories
   - Update imports in affected files

## Dependency Clean-up Tasks

### Current State:
- Mix of React state management approaches
- Multiple UI libraries and utilities
- Potentially unused dependencies

### Implementation Steps:

1. **Audit Dependency Usage**
   - Analyze imports to identify unused dependencies
   - Document dependencies and their purpose
   - Create a dependency map showing relationships

2. **Clean up package.json**
   - Remove unused dependencies
   - Update outdated dependencies
   - Organize dependencies by category
   - Add comments for non-obvious dependencies

3. **Document External Dependencies**
   - Create documentation for key dependencies
   - Document integration points with external services
   - Create configuration guide for environment variables

## Next Steps After Phase 1

Once the foundational work in Phase 1 is complete, we'll move on to:

1. Implementing the consolidated Medusa client
2. Creating unified component interfaces
3. Implementing proper state management with React Query
4. Enhancing TypeScript type definitions
5. Improving UI consistency with Shadcn UI best practices

## Phase 2: Component Consolidation and Cleanup

After analyzing the codebase, we've identified several duplicate or overlapping components that need to be consolidated or removed:

### Components to Consolidate

1. **Product Card Components**:
   - src/components/products/ProductCard.tsx - Keep and enhance this as the main product card
   - src/components/products/UIProductCard.tsx - Merge features into main ProductCard
   - src/app/products/page.tsx - Update import paths to use consolidated card

2. **Product Skeleton Components**:
   - src/components/SkeletonProductCard.tsx - Redundant
   - src/components/products/ProductCardSkeleton.tsx - Keep and enhance this

3. **Medusa Product Components**:
   - src/components/products/BasicMedusaProducts.tsx
   - src/components/products/EnhancedMedusaProducts.tsx
   - src/components/products/MedusaProducts.tsx
   - Consolidate these into a single MedusaProducts component with configuration options

4. **Category Components**:
   - src/components/products/categories/CategoryGrid.tsx
   - src/components/products/categories/CategoryTabs.tsx
   - src/components/products/categories/MobileCategoryNav.tsx
   - Create a unified Category component system with responsive variants

### Implementation Steps

1. **Consolidate Product Card Components**:
   - Update src/components/products/ProductCard.tsx to incorporate features from UIProductCard
   - Update all import references to use the new consolidated component
   - Remove UIProductCard.tsx after migration

2. **Consolidate Product Skeleton Components**:
   - Enhance src/components/products/ProductCardSkeleton.tsx with any missing features
   - Update all import references
   - Remove src/components/SkeletonProductCard.tsx

3. **Consolidate Medusa Product Components**:
   - Create a unified MedusaProducts component with configuration options
   - Update import references
   - Remove redundant components

4. **Update Import Paths**:
   - Update import paths in:
     - src/components/OnchainStore.tsx
     - src/app/products/page.tsx
     - src/components/OnchainStoreItems.tsx
     - src/app/categories/smooth-navigation/page.tsx
     - Any other files referencing the old components

5. **Test Component Changes**:
   - Verify all pages still render correctly
   - Check for any styling inconsistencies
   - Ensure all functionality works as expected

### Components to Delete After Consolidation

Once consolidation is complete and all import paths have been updated, delete these files:

- src/components/products/UIProductCard.tsx
- src/components/SkeletonProductCard.tsx
- src/components/products/BasicMedusaProducts.tsx (after consolidation)
- src/components/products/EnhancedMedusaProducts.tsx (after consolidation) 