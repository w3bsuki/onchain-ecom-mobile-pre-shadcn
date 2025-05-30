# Performance Budget & Metrics

## Core Web Vitals Targets

### Loading Performance
- FCP (First Contentful Paint): < 1.5s
- LCP (Largest Contentful Paint): < 2.5s
- TTI (Time to Interactive): < 3.5s
- Speed Index: < 3s

### Interactivity
- FID (First Input Delay): < 100ms
- TBT (Total Blocking Time): < 300ms
- ICP (Interaction to Next Paint): < 200ms

### Visual Stability
- CLS (Cumulative Layout Shift): < 0.1
- No layout shifts after user input
- Stable loading states

## Bundle Size Budgets

### JavaScript
- Initial bundle: < 150KB (compressed)
- Route-based chunks: < 50KB each
- Third-party scripts: < 100KB total

### CSS
- Critical CSS: < 20KB
- Total CSS: < 50KB
- Unused CSS: < 5%

### Images
- Hero images: < 200KB
- Product images: < 100KB
- Thumbnails: < 20KB

## Performance Monitoring

### Real User Monitoring (RUM)
```typescript
// Implement Web Vitals reporting
export function reportWebVitals(metric: any) {
  switch (metric.name) {
    case 'FCP':
      // Report First Contentful Paint
      break;
    case 'LCP':
      // Report Largest Contentful Paint
      break;
    case 'CLS':
      // Report Cumulative Layout Shift
      break;
    case 'FID':
      // Report First Input Delay
      break;
    case 'TTFB':
      // Report Time to First Byte 
      break;
  }
}
```

### Error Tracking
```typescript
// Error boundary for component errors
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to monitoring service
    logError({
      error,
      errorInfo,
      componentStack: errorInfo.componentStack,
    });
  }
}
```

### Performance Marks
```typescript
// Add performance marks for critical paths
performance.mark('app-init-start');
// ... initialization code
performance.mark('app-init-end');
performance.measure('app-initialization', 'app-init-start', 'app-init-end');
```

## Optimization Techniques

### Code Splitting
```typescript
// Route-based code splitting
const ProductPage = dynamic(() => import('@/pages/ProductPage'), {
  loading: () => <ProductSkeleton />
});

// Component-based code splitting
const Modal = dynamic(() => import('@/components/Modal'), {
  ssr: false
});
```

### Image Optimization
```typescript
// Next.js Image component with optimization
<Image
  src={product.image}
  alt={product.name}
  width={300}
  height={300}
  loading="lazy"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  quality={75}
/>
```

### Caching Strategy
```typescript
// API response caching
export async function getStaticProps() {
  return {
    props: {
      products: await getProducts()
    },
    revalidate: 60 // Revalidate every minute
  };
}
```

## Performance Testing

### Automated Tests
- Lighthouse CI integration
- Bundle size monitoring
- Performance regression tests

### Manual Testing
- Cross-device testing
- Network throttling tests
- CPU throttling tests

### Load Testing
- Concurrent user simulation
- API endpoint stress testing
- Database query optimization

## Optimization Checklist

### Build Time
- [ ] Enable compression (Gzip/Brotli)
- [ ] Minimize JavaScript bundles
- [ ] Optimize CSS delivery
- [ ] Generate image sizes
- [ ] Create service worker

### Runtime
- [ ] Implement lazy loading
- [ ] Enable prefetching
- [ ] Optimize API calls
- [ ] Cache responses
- [ ] Monitor memory usage

### User Experience
- [ ] Add loading states
- [ ] Implement error boundaries
- [ ] Optimize animations
- [ ] Handle offline state
- [ ] Add progress indicators
