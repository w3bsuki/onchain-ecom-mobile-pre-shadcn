# Onchain E-commerce Refactoring Plan

## Current Codebase Analysis

### Identified Issues
- **Monolithic Components**: Main page.tsx is over 850 lines
- **Duplicated Logic**: Filter state management duplicated
- **Static Data in Components**: Data should be extracted to dedicated files
- **Performance Issues**: Missing image optimization and code splitting
- **Limited Type Safety**: Inconsistent TypeScript usage

## Refactoring Goals
1. Improve code maintainability
2. Enhance performance
3. Strengthen type safety
4. Prepare for scaling

## Immediate Action Items

### 1. Data Extraction
- Extract all static arrays to `/src/data/` directory:
  ```
  /src/data/
    ├── categories.ts   // categoryCards
    ├── filters.ts      // filterOptions, DEFAULT_SIZES, DEFAULT_COLORS
    ├── products.ts     // DEMO_PRODUCTS
    ├── brands.ts       // BRAND_LOGOS
    └── quickFilters.ts // DEFAULT_QUICK_FILTERS
  ```

### 2. Component Decomposition
- Split page.tsx into manageable components:
  ```
  /src/components/sections/
    ├── HeroSection.tsx
    ├── BrandCarousel.tsx
    ├── CategoryGrid.tsx
    ├── FeaturedCollections.tsx
    ├── ProductGrid.tsx
    └── MobileNavigation.tsx
  ```

### 3. Custom Hooks Creation
- Create hooks for business logic:
  ```
  /src/hooks/
    ├── useProducts.ts      // Product fetching
    ├── useFilters.ts       // Filter state
    ├── useCategories.ts    // Category selection
    └── useScrollPosition.ts // UI based on scroll
  ```

## Implementation Plan

### Phase 1: Data Extraction
- **Files to modify**:
  - Create data files listed above
  - Update imports in page.tsx
  
- **Implementation steps**:
  1. Create each data file
  2. Move constants from page.tsx
  3. Add TypeScript interfaces
  4. Update imports

### Phase 2: Component Extraction
- **Files to modify**:
  - Create section component files
  - Update page.tsx to use components
  
- **Implementation steps**:
  1. Extract HeroSection
  2. Extract BrandCarousel
  3. Extract CategoryGrid
  4. Extract FeaturedCollections
  5. Extract ProductGrid
  6. Update page.tsx to import and use components

### Phase 3: Logic Extraction
- **Files to modify**:
  - Create hook files
  - Update components to use hooks
  
- **Implementation steps**:
  1. Implement useProducts
  2. Implement useFilters
  3. Implement useCategories
  4. Update components to use hooks

### Phase 4: Performance Optimization
- **Files to modify**:
  - All image-using components
  - Main layout components
  
- **Implementation steps**:
  1. Replace <img> with next/image
  2. Add proper sizing and loading priorities
  3. Implement React.memo for appropriate components
  4. Add suspense boundaries

## Specific Refactoring Tasks

### Product Fetching Logic
```typescript
// BEFORE
useEffect(() => {
  async function fetchProducts() {
    try {
      setLoading(true);
      console.log("Fetching products for home page...");
      
      const response = await fetch("/api/medusa-proxy?path=store%2Fproducts&limit=20");
      const data = await response.json();
      
      if (data?.products?.length > 0) {
        console.log(`Found ${data.products.length} products for home page`);
        setProducts(data.products);
      } else {
        console.log("No products found, using demo products");
        setProducts(DEMO_PRODUCTS as Product[]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setProducts(DEMO_PRODUCTS as Product[]);
    } finally {
      setLoading(false);
    }
  }
  
  fetchProducts();
}, []);

// AFTER - In hooks/useProducts.ts
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        
        const response = await fetch("/api/medusa-proxy?path=store%2Fproducts&limit=20");
        const data = await response.json();
        
        if (data?.products?.length > 0) {
          setProducts(data.products);
        } else {
          // Import from data file
          const { DEMO_PRODUCTS } = await import('@/data/products');
          setProducts(DEMO_PRODUCTS);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        
        // Import from data file
        const { DEMO_PRODUCTS } = await import('@/data/products');
        setProducts(DEMO_PRODUCTS);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  return { products, loading, error };
}
```

### Shop by Brand Component Extraction
```typescript
// In components/sections/BrandCarousel.tsx
import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BrandLogo } from '@/types';

interface BrandCarouselProps {
  brands: BrandLogo[];
}

export const BrandCarousel: FC<BrandCarouselProps> = ({ brands }) => {
  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm uppercase font-medium tracking-widest">Shop by Brand</h3>
          <Link href="/brands" className="text-xs font-medium hover:underline flex items-center gap-1 group">
            View All <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
          </Link>
        </div>
        
        <div className="scrollbar-hide grid grid-flow-col auto-cols-max gap-8 md:gap-12 overflow-x-auto pb-4 -mx-4 px-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.id}`}
              className="flex-shrink-0 group flex flex-col items-center"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 bg-zinc-50 rounded-lg flex items-center justify-center group-hover:bg-zinc-100 transition-all duration-200 group-hover:shadow-md">
                <Image 
                  src={brand.logoUrl} 
                  alt={brand.name}
                  width={56}
                  height={56}
                  className="object-contain opacity-80 group-hover:opacity-100 transition-opacity" 
                />
              </div>
              <span className="mt-3 text-xs md:text-sm font-medium text-zinc-700 group-hover:text-black transition-colors">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
```

### Types to Create

```typescript
// In types/index.ts

export interface CategoryCard {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
}

export interface FilterOption {
  id: string;
  name: string;
}

export interface QuickFilter {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
}

export interface BrandLogo {
  name: string;
  id: string;
  logoUrl: string;
}

export interface ProductVariant {
  id: string;
  prices?: {
    amount: number;
    currency_code?: string;
  }[];
}

export interface Product {
  id: string;
  title: string;
  name?: string;
  description?: string;
  thumbnail?: string;
  image?: string;
  variants?: ProductVariant[];
  price?: number;
  rating?: number;
  reviewCount?: number;
  colors?: ColorOption[];
  isNew?: boolean;
  discount?: number;
  category?: string;
}
```

## Detailed Testing Plan

### Unit Tests
- Create tests for:
  - Hook functionality
  - Component rendering
  - State transformations

### Component Tests
- Test each extracted component with various props
- Test responsive behavior
- Test interaction patterns

### Integration Tests
- Test product grid with filters
- Test category selection
- Test mobile navigation

## Success Metrics
- Line count reduction in page.tsx (target: 80% reduction)
- Improved Lighthouse performance score (target: 90+)
- Elimination of prop drilling
- Consistent component API patterns

## Directory Structure After Refactoring

```
src/
├── components/
│   ├── layout/
│   │   └── site-footer.tsx
│   ├── products/
│   │   ├── hero-carousel.tsx
│   │   └── ProductCard.tsx
│   ├── sections/
│   │   ├── BrandCarousel.tsx
│   │   ├── CategoryGrid.tsx
│   │   ├── FeaturedCollections.tsx
│   │   ├── HeroSection.tsx
│   │   ├── MobileNavigation.tsx
│   │   └── ProductGrid.tsx
│   └── ui/
│       ├── accordion.tsx
│       ├── bottom-sheet.tsx
│       ├── button.tsx
│       ├── MobileCategorySidebar.tsx
│       └── slider.tsx
├── contexts/
│   ├── FilterContext.tsx
│   └── UIContext.tsx
├── data/
│   ├── brands.ts
│   ├── categories.ts
│   ├── filters.ts
│   ├── products.ts
│   └── quickFilters.ts
├── hooks/
│   ├── useCategories.ts
│   ├── useFilters.ts
│   ├── useProducts.ts
│   └── useScrollPosition.ts
├── lib/
│   └── utils.ts
├── types/
│   └── index.ts
└── app/
    └── page.tsx
```

## Completion Checklist

- [ ] Create directory structure
- [ ] Extract data to separate files
- [ ] Create TypeScript interfaces
- [ ] Extract section components
- [ ] Create custom hooks
- [ ] Implement context providers
- [ ] Update image usage
- [ ] Add performance optimizations
- [ ] Create tests
- [ ] Update documentation 