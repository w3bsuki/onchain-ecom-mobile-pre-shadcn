# Onchain Commerce Template Refactoring Plan

## Overview

This document outlines a comprehensive refactoring plan for the Onchain Commerce Template project to ensure consistency, maintainability, and adherence to best practices across Next.js, Medusa, Shadcn UI, Tailwind CSS, and TypeScript.

## 1. Package Management Standardization

### Issues Identified:
- Mixed usage of package managers (yarn and npm)
- Multiple lock files (yarn.lock and package-lock.json)
- Potentially conflicting dependencies

### Action Items:
1. **Choose a single package manager**
   - Standardize on npm (recommended for Next.js projects)
   - Remove yarn.lock and use only package-lock.json

2. **Clean up dependencies**
   - Audit and remove unused dependencies
   - Update outdated packages
   - Resolve conflicting versions
   - Ensure all dependencies are properly typed

3. **Standardize scripts**
   - Ensure consistent naming for scripts in package.json
   - Document script purposes in README

## 2. Project Structure Reorganization

### Issues Identified:
- Inconsistent folder organization
- Duplicate components and utilities
- Unclear separation of concerns

### Action Items:
1. **Implement Next.js App Router best practices**
   - Organize routes properly in `src/app` directory
   - Use proper layout components
   - Implement error and loading states consistently

2. **Organize components by domain**
   ```
   src/
     app/               # Next.js App Router routes
     components/        # Shared components
       ui/              # UI primitives (Shadcn)
       layout/          # Layout components
       products/        # Product-specific components
       checkout/        # Checkout components
       cart/            # Cart components
       auth/            # Authentication components
     hooks/             # Custom React hooks
     lib/               # Shared utilities
     services/          # API and service integrations
       medusa/          # Medusa client and utilities
     styles/            # Global styles
     types/             # TypeScript types
   ```

3. **Standardize naming conventions**
   - PascalCase for components
   - camelCase for functions, hooks, and utilities
   - kebab-case for files (except for components)
   - Consistent exports (named vs default)

## 3. Medusa Integration Cleanup

### Issues Identified:
- Multiple Medusa configurations
- Inconsistent API calls
- Redundant state management

### Action Items:
1. **Create a centralized Medusa client**
   - Single configuration file
   - Typed API responses
   - Proper error handling

2. **Implement proper data fetching patterns**
   - Use React Query for client-side data fetching
   - Use Server Components for initial data loading
   - Implement proper caching strategies

3. **Standardize Medusa hooks**
   - Create reusable hooks for common Medusa operations
   - Ensure proper TypeScript typing
   - Document usage patterns

## 4. Component Deduplication

### Issues Identified:
- Multiple category components with similar functionality
- Duplicate product card implementations
- Inconsistent styling approaches

### Action Items:
1. **Audit and merge duplicate components**
   - Identify all duplicate or similar components
   - Create unified components with proper prop interfaces
   - Ensure backward compatibility during migration

2. **Components to consolidate:**
   - CategoryGrid vs CategoryTabs
   - MobileCategoryNav vs MobileNavigation
   - Various filter components
   - Product card variants

3. **Create a component library documentation**
   - Document all shared components
   - Provide usage examples
   - Add prop documentation

## 5. State Management Optimization

### Issues Identified:
- Mixed state management approaches
- Prop drilling in some components
- Redundant context providers

### Action Items:
1. **Standardize state management**
   - Use React Context for global state
   - Use React Query for server state
   - Use local state for component-specific state

2. **Optimize context usage**
   - Consolidate providers
   - Split contexts by domain
   - Implement proper memoization

3. **Reduce re-renders**
   - Audit component rendering
   - Implement memoization where needed
   - Use performance optimization techniques

## 6. TypeScript Enhancements

### Issues Identified:
- Inconsistent type definitions
- Any types in some components
- Missing interface exports

### Action Items:
1. **Create centralized type definitions**
   - Define shared types in `src/types` directory
   - Create proper interfaces for all components
   - Ensure proper export of types

2. **Enhance type safety**
   - Remove any usage of `any`
   - Implement proper generics
   - Use discriminated unions where appropriate

3. **Add JSDoc comments**
   - Document complex types
   - Add component descriptions
   - Document non-obvious logic

## 7. UI/UX Standardization

### Issues Identified:
- Inconsistent styling approaches
- Mixed usage of Tailwind classes
- Duplicate style definitions

### Action Items:
1. **Implement Shadcn UI best practices**
   - Use consistent component patterns
   - Leverage cn utility for conditional classes
   - Follow the component structure guidelines

2. **Tailwind optimizations**
   - Create custom utilities for repeated patterns
   - Use Tailwind theme consistently
   - Sort classes using recommended tools

3. **Accessibility improvements**
   - Add proper ARIA attributes
   - Ensure keyboard navigation
   - Test with screen readers

## 8. Performance Optimization

### Issues Identified:
- Unnecessary re-renders
- Non-optimized images
- Heavy component trees

### Action Items:
1. **Implement code splitting**
   - Use dynamic imports where appropriate
   - Lazy load non-critical components
   - Optimize bundle size

2. **Image optimization**
   - Use Next.js Image component consistently
   - Implement proper sizing and formats
   - Add loading strategies

3. **Performance testing**
   - Implement Lighthouse CI
   - Add performance monitoring
   - Create performance budgets

## 9. Testing Strategy

### Issues Identified:
- Inconsistent test coverage
- Missing unit tests
- No integration testing

### Action Items:
1. **Implement test infrastructure**
   - Set up Jest with React Testing Library
   - Add Cypress for E2E tests
   - Configure test scripts

2. **Create test plan**
   - Identify critical paths for testing
   - Create test specifications
   - Document testing approach

3. **Add test coverage reporting**
   - Set up coverage thresholds
   - Integrate with CI/CD
   - Document coverage goals

## 10. Documentation

### Issues Identified:
- Insufficient documentation
- Unclear setup instructions
- Missing component documentation

### Action Items:
1. **Create comprehensive README**
   - Setup instructions
   - Development workflow
   - Deployment process

2. **Add code documentation**
   - Document complex functions
   - Add JSDoc comments
   - Create component stories

3. **Create architectural documentation**
   - System overview
   - Data flow diagrams
   - Integration points

## Implementation Strategy

The refactoring will be carried out in phases to minimize disruption:

### Phase 1: Infrastructure and Dependencies
- Standardize package management
- Clean up dependencies
- Set up project structure

### Phase 2: Core Components and Services
- Implement Medusa client
- Refactor core components
- Standardize state management

### Phase 3: UI/UX and Performance
- Consolidate duplicate components
- Enhance styling
- Implement performance optimizations

### Phase 4: Testing and Documentation
- Add test coverage
- Create documentation
- Final quality assurance

Each phase will include a review step to ensure quality and consistency before proceeding to the next phase. 