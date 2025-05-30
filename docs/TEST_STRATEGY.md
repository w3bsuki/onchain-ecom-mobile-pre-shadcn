# Test Strategy

## Testing Layers

### 1. Unit Tests
Focus on testing isolated components and functions.

```tsx
// Example unit test for a product utility function
describe('calculateDiscount', () => {
  it('returns correct discount amount', () => {
    expect(calculateDiscount(100, 20)).toBe(20);
  });

  it('handles zero discount', () => {
    expect(calculateDiscount(100, 0)).toBe(0);
  });

  it('caps discount at product price', () => {
    expect(calculateDiscount(100, 120)).toBe(100);
  });
});
```

### 2. Component Tests
Test individual components in isolation with mocked dependencies.

```tsx
// Example component test for ProductCard
describe('ProductCard', () => {
  const mockProduct = {
    id: '123',
    name: 'Test Product',
    price: 99.99,
    image: '/test.jpg'
  };

  it('renders product details correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', expect.stringContaining('/test.jpg'));
  });

  it('calls onAddToCart when add button is clicked', () => {
    const onAddToCart = jest.fn();
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);
    
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(onAddToCart).toHaveBeenCalledWith('123');
  });
});
```

### 3. Integration Tests
Test interaction between multiple components and services.

```tsx
// Example integration test for cart functionality
describe('Cart Integration', () => {
  it('adds product to cart and updates total', async () => {
    render(
      <CartProvider>
        <ProductPage productId="123" />
        <CartSummary />
      </CartProvider>
    );
    
    // Add product to cart
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    
    // Check if cart gets updated
    expect(await screen.findByText('1 item in cart')).toBeInTheDocument();
    expect(screen.getByText('Total: $99.99')).toBeInTheDocument();
  });
});
```

### 4. End-to-End Tests
Test complete user flows across the application.

```tsx
// Example E2E test using Cypress
describe('Checkout Flow', () => {
  it('completes purchase successfully', () => {
    // Visit product page
    cy.visit('/products/123');
    
    // Add to cart
    cy.findByRole('button', { name: /add to cart/i }).click();
    
    // Go to cart
    cy.findByRole('link', { name: /view cart/i }).click();
    
    // Proceed to checkout
    cy.findByRole('button', { name: /checkout/i }).click();
    
    // Fill in shipping information
    cy.findByLabelText(/name/i).type('Test User');
    cy.findByLabelText(/email/i).type('test@example.com');
    cy.findByLabelText(/address/i).type('123 Test St');
    
    // Complete order
    cy.findByRole('button', { name: /complete order/i }).click();
    
    // Verify success page
    cy.url().should('include', '/order-confirmation');
    cy.findByText(/thank you for your order/i).should('exist');
  });
});
```

### 5. Performance Tests
Test application performance characteristics.

```tsx
// Example Lighthouse CI test
describe('Homepage Performance', () => {
  it('meets performance budget', async () => {
    const result = await lighthouse('https://example.com');
    
    expect(result.lhr.categories.performance.score).toBeGreaterThanOrEqual(0.9);
    expect(result.lhr.audits['first-contentful-paint'].numericValue).toBeLessThan(1000);
    expect(result.lhr.audits['total-blocking-time'].numericValue).toBeLessThan(300);
  });
});
```

## Testing Strategy By Component Type

### 1. UI Components
- Focus on rendering and interactions
- Test accessibility
- Test different states (loading, error, empty)
- Test responsiveness

### 2. Container Components
- Mock API calls and state
- Test data flow
- Test error handling
- Test loading states

### 3. Hooks and Utilities
- Test edge cases
- Test error conditions
- Test performance with large inputs

## Test Coverage Goals

| Type | Min Coverage | Focus Areas |
|------|--------------|-------------|
| Core UI | 90% | Rendering, interaction, accessibility |
| Business Logic | 95% | Edge cases, error handling |
| Utils/Helpers | 100% | All functionality |
| API Interaction | 80% | Happy path, error handling |

## Accessibility Testing

### 1. Automated Testing
```tsx
// Example jest-axe test for accessibility
describe('ProductCard accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<ProductCard product={mockProduct} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### 2. Manual Testing
- Keyboard navigation testing
- Screen reader testing
- Color contrast verification
- Focus management validation

## Performance Testing

### 1. Component Render Performance
```tsx
// Example render performance test
describe('ProductGrid performance', () => {
  it('renders 100 items efficiently', () => {
    const products = Array(100).fill().map((_, i) => ({
      id: `${i}`,
      name: `Product ${i}`,
      price: 99.99,
      image: '/test.jpg'
    }));
    
    const start = performance.now();
    render(<ProductGrid products={products} />);
    const duration = performance.now() - start;
    
    expect(duration).toBeLessThan(100); // Render in less than 100ms
  });
});
```

### 2. Memory Usage
- Test for memory leaks
- Test with large datasets
- Monitor re-render counts

## Test Environment Setup

### 1. Jest Configuration
```js
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/mocks/**',
    '!src/types/**'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.css$': 'identity-obj-proxy'
  }
};
```

### 2. Cypress Configuration
```js
// cypress.config.js
module.exports = {
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true
  }
};
```

## CI Integration

### 1. GitHub Actions Workflow
```yaml
name: Test Suite

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:e2e
      - run: npm run test:lighthouse
```

### 2. Performance Budgets
```js
// Next.js config with performance budgets
module.exports = {
  experimental: {
    webpackBuildWorker: true,
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.performance = {
        hints: 'error',
        maxEntrypointSize: 240000, // 240kb
        maxAssetSize: 240000, // 240kb
      }
    }
    return config
  }
}
```
