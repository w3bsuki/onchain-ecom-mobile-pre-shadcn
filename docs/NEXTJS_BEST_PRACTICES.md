# Next.js App Router Best Practices

## Server vs Client Components

### Server Components (Default)
Use for:
- Data fetching
- Database access
- Access to backend resources
- Large dependencies
- No client-side interactivity
- SEO content

Example:
```tsx
// app/products/page.tsx
async function ProductsPage() {
  const products = await getProducts();
  return <ProductList products={products} />;
}
```

### Client Components
Use for:
- Interactivity and event listeners
- useState, useEffect hooks
- Browser APIs
- Client-side routing
- Click handlers

Example:
```tsx
'use client';

function AddToCart() {
  const [loading, setLoading] = useState(false);
  return <Button onClick={() => setLoading(true)}>Add to Cart</Button>;
}
```

## Route Organization

### Route Groups
```
app/
├── (shop)/           # Shopping routes
│   ├── products/
│   ├── categories/
│   └── cart/
├── (auth)/           # Auth routes
│   ├── login/
│   └── register/
└── (account)/        # Account routes
    ├── profile/
    └── orders/
```

### Parallel Routes
Use for:
- Modals
- Split views
- Complex layouts

Example:
```
app/
├── layout.tsx
├── page.tsx
├── @modal/
│   └── (..)product/[id]/page.tsx  # Product modal
└── products/
    └── [id]/
        └── page.tsx               # Full product page
```

## Data Fetching

### Server-side
```tsx
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 } // Revalidate every hour
  });
  return res.json();
}
```

### Static Data
```tsx
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}
```

## Performance Optimizations

### Image Optimization
```tsx
import Image from 'next/image';

export default function ProductImage({ src, alt }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      placeholder="blur"
      loading="lazy"
    />
  );
}
```

### Route Prefetching
```tsx
import Link from 'next/link';

export default function ProductLink({ product }) {
  return (
    <Link 
      href={`/products/${product.id}`}
      prefetch={true}
    >
      {product.name}
    </Link>
  );
}
```

### Streaming
```tsx
import { Suspense } from 'react';

export default function ProductPage() {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductDetails />
    </Suspense>
  );
}
```

## Error Handling

### Error Boundaries
```tsx
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

### Loading States
```tsx
// app/products/loading.tsx
export default function Loading() {
  return <ProductGridSkeleton />;
}
```

## Metadata
```tsx
export const metadata = {
  title: 'Product Title',
  description: 'Product description',
  openGraph: {
    title: 'Product Title',
    description: 'Product description',
    images: ['/product-image.jpg'],
  },
};
```
