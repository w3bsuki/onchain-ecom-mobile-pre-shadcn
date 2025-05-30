# API Integration & Data Flow

## API Architecture

### 1. Data Flow Diagram
```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Next.js   │      │   API Routes│      │   Medusa    │
│   Frontend  │<─────│   (Server)  │<─────│   Backend   │
└─────────────┘      └─────────────┘      └─────────────┘
       │                                         │
       │                                         │
       v                                         v
┌─────────────┐                          ┌─────────────┐
│   Client    │                          │  Database   │
│   State     │                          │  (Postgres) │
└─────────────┘                          └─────────────┘
```

### 2. API Layer Structure
- **Server Components** - Direct database access
- **API Routes** - REST endpoints for client components
- **External Services** - Third-party integrations

## Data Fetching Strategies

### 1. Server-Side Fetching
```tsx
// In a Server Component
async function ProductsPage() {
  const products = await getProducts();
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// Data fetching function
async function getProducts() {
  // Direct database/API access on server
  const response = await fetch(`${process.env.API_URL}/products`, {
    headers: {
      Authorization: `Bearer ${process.env.API_TOKEN}`
    },
    next: { revalidate: 60 } // ISR - revalidate every minute
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  
  return response.json();
}
```

### 2. Client-Side Fetching
```tsx
'use client';

import { useQuery } from '@tanstack/react-query';

function ProductSearch() {
  const [search, setSearch] = useState('');
  
  const { data, isLoading } = useQuery({
    queryKey: ['products', search],
    queryFn: () => searchProducts(search),
    enabled: search.length > 2
  });
  
  return (
    <div>
      <input 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
      />
      
      {isLoading ? (
        <ProductGridSkeleton />
      ) : (
        <ProductGrid products={data || []} />
      )}
    </div>
  );
}

async function searchProducts(query) {
  const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
  
  if (!response.ok) {
    throw new Error('Failed to search products');
  }
  
  return response.json();
}
```

### 3. Hybrid Fetching
```tsx
// In a layout or page component
export async function generateStaticParams() {
  // Fetch all category slugs at build time
  const categories = await getCategories();
  
  return categories.map(category => ({
    slug: category.slug
  }));
}

export default async function CategoryPage({ params }) {
  // Fetch initial data server-side
  const initialProducts = await getProductsByCategory(params.slug);
  
  // Client component that handles pagination, filtering, etc.
  return (
    <CategoryProducts 
      initialProducts={initialProducts} 
      categorySlug={params.slug} 
    />
  );
}

// Client component for interactive features
'use client';

function CategoryProducts({ initialProducts, categorySlug }) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(1);
  
  const { data, isLoading } = useQuery({
    queryKey: ['products', categorySlug, page],
    queryFn: () => loadMoreProducts(categorySlug, page),
    enabled: page > 1 // Only fetch when paginating
  });
  
  useEffect(() => {
    if (data && page > 1) {
      setProducts(prev => [...prev, ...data]);
    }
  }, [data, page]);
  
  return (
    <div>
      <ProductGrid products={products} />
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Button onClick={() => setPage(p => p + 1)}>
          Load More
        </Button>
      )}
    </div>
  );
}
```

## API Endpoint Design

### 1. REST API Routes
```tsx
// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { medusaClient } from '@/lib/medusa-client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') || '10';
  const offset = searchParams.get('offset') || '0';
  
  try {
    const { products, count } = await medusaClient.products.list({
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    return NextResponse.json({
      products,
      count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
```

### 2. API Response Shape
```typescript
// Standard success response
interface SuccessResponse<T> {
  data: T;
  meta?: {
    count?: number;
    limit?: number;
    offset?: number;
  };
}

// Standard error response
interface ErrorResponse {
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
}

// Example typed API client function
async function fetchProducts<T>(options?: FetchOptions): Promise<SuccessResponse<T[]>> {
  const response = await fetch('/api/products', {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  });
  
  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.error.message);
  }
  
  return response.json();
}
```

## Data Caching Strategies

### 1. Server-Side Caching
```tsx
// Using Next.js built-in caching
async function getProducts() {
  return fetch('https://api.example.com/products', {
    next: { revalidate: 3600 } // Revalidate every hour
  }).then(res => res.json());
}

// Using Redis for caching
async function getProductWithRedis(id) {
  const cacheKey = `product:${id}`;
  
  // Try to get from cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Fetch from API
  const product = await medusaClient.products.retrieve(id);
  
  // Cache for 1 hour
  await redis.set(cacheKey, JSON.stringify(product), 'EX', 3600);
  
  return product;
}
```

### 2. Client-Side Caching
```tsx
// Using TanStack Query for client caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Usage in component
function ProductDetail({ productId }) {
  const { data, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId)
  });
  
  // Component implementation
}
```

### 3. Persistence Layer
```tsx
// Using localStorage for offline data
function usePersistentCart() {
  const [cart, setCart] = useState(() => {
    if (typeof window === 'undefined') return [];
    
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  return [cart, setCart];
}
```

## Error Handling

### 1. API Error Handling
```tsx
async function fetchWithErrorHandling(url) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      // Handle different HTTP error codes
      if (response.status === 404) {
        throw new NotFoundError('Resource not found');
      }
      
      if (response.status === 401) {
        throw new UnauthorizedError('Authentication required');
      }
      
      // Try to parse error response
      const errorData = await response.json().catch(() => null);
      throw new ApiError(
        errorData?.message || 'An error occurred',
        response.status,
        errorData
      );
    }
    
    return response.json();
  } catch (error) {
    // Log error for monitoring
    console.error('API Error:', error);
    
    // Re-throw for component handling
    throw error;
  }
}
```

### 2. Component Error Handling
```tsx
'use client';

function ProductDetailWithErrorBoundary({ productId }) {
  return (
    <ErrorBoundary 
      fallback={<ProductErrorState onRetry={() => window.location.reload()} />}
    >
      <ProductDetail productId={productId} />
    </ErrorBoundary>
  );
}

function ProductDetail({ productId }) {
  const { data, error, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId)
  });
  
  if (isLoading) {
    return <ProductSkeleton />;
  }
  
  if (error) {
    return (
      <div>
        <p>Failed to load product: {error.message}</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }
  
  return <ProductDisplay product={data} />;
}
```
