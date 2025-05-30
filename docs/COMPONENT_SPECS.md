# Component Specifications

## Component Interface Standards

### Base Component Structure
```tsx
interface ComponentProps {
  // Required props
  id: string;
  
  // Optional props with defaults
  variant?: "default" | "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  
  // Callback props
  onClick?: (event: React.MouseEvent) => void;
  
  // Content props
  children: React.ReactNode;
  
  // Extension props
  className?: string;
}

export function Component({
  id,
  variant = "default",
  size = "md",
  onClick,
  children,
  className,
}: ComponentProps) {
  // Implementation
}
```

## Component Categories

### 1. Core UI Components
These are base shadcn/ui components extended for our needs:
- Button
- Input
- Select 
- Modal
- Tabs
- Accordion

### 2. Layout Components
Components that define page structure:
- Grid
- Container
- Section
- Card
- Sidebar

### 3. E-commerce Components
Domain-specific components:
- ProductCard
- ProductGrid
- CartItem
- CategoryNav
- FilterGroup
- PriceDisplay

### 4. Feature Components
Complex components with business logic:
- QuickViewModal
- CheckoutForm
- ProductGallery
- SearchBar
- WishlistButton

## Component Performance Guidelines

### 1. Component Load Performance
- Implement code splitting for larger components
- Lazy load below-the-fold components
- Use React.memo for pure components
- Implement proper prop types for early error catching

### 2. Render Performance
- Avoid unnecessary re-renders
- Implement useMemo/useCallback correctly
- Avoid inline function props when possible
- Use key prop correctly in lists

### 3. Animation Performance
- Prefer CSS transitions over JS animations
- Use transform/opacity for animations
- Avoid layout thrashing
- Implement will-change for heavy animations

## Component Architecture

### 1. Composition Pattern
```tsx
// Button component that composes smaller pieces
function Button({ children, ...props }) {
  return (
    <ButtonRoot {...props}>
      <ButtonIcon />
      <ButtonText>{children}</ButtonText>
    </ButtonRoot>
  );
}

// Usage with composition
<Button>
  <ButtonIcon icon={ShoppingCart} />
  <ButtonText>Add to Cart</ButtonText>
</Button>
```

### 2. Container/Presenter Pattern
```tsx
// Container handles logic
function ProductCardContainer({ productId }) {
  const { data } = useProductData(productId);
  const { addToCart } = useCart();
  
  const handleAddToCart = () => {
    addToCart(productId);
  };
  
  return (
    <ProductCardPresenter
      product={data}
      onAddToCart={handleAddToCart}
    />
  );
}

// Presenter is purely presentational
function ProductCardPresenter({ product, onAddToCart }) {
  return (
    <Card>
      <ProductImage src={product.image} />
      <ProductTitle>{product.name}</ProductTitle>
      <Button onClick={onAddToCart}>Add to Cart</Button>
    </Card>
  );
}
```

### 3. Hook Pattern
```tsx
function useProductActions(productId) {
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  
  const handleAddToCart = () => {
    addToCart(productId);
  };
  
  const handleAddToWishlist = () => {
    addToWishlist(productId);
  };
  
  return {
    handleAddToCart,
    handleAddToWishlist
  };
}

// Usage in component
function ProductCard({ productId }) {
  const { handleAddToCart, handleAddToWishlist } = useProductActions(productId);
  
  return (
    <Card>
      {/* Component content */}
      <Button onClick={handleAddToCart}>Add to Cart</Button>
      <Button onClick={handleAddToWishlist}>Add to Wishlist</Button>
    </Card>
  );
}
```

## Component Testing Strategy

### 1. Unit Testing
```tsx
// Testing a button component
it('calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click Me</Button>);
  fireEvent.click(screen.getByText('Click Me'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### 2. Snapshot Testing
```tsx
it('renders correctly', () => {
  const { asFragment } = render(<Button>Click Me</Button>);
  expect(asFragment()).toMatchSnapshot();
});
```

### 3. Interaction Testing
```tsx
it('shows dropdown when clicked', async () => {
  render(<Dropdown options={['Option 1', 'Option 2']} />);
  fireEvent.click(screen.getByRole('button'));
  expect(await screen.findByText('Option 1')).toBeInTheDocument();
});
```

## Implementation Checklist

### Base Requirements
- [ ] Component is typed with TypeScript
- [ ] Component has proper prop validation
- [ ] Component implements proper accessibility attributes
- [ ] Component has unit tests
- [ ] Component is styled consistently with design system

### Performance Requirements
- [ ] Component avoids unnecessary renders
- [ ] Component handles large datasets efficiently
- [ ] Component loads efficiently (code-splitting if needed)
- [ ] Component has optimized event handlers

### UX Requirements
- [ ] Component has proper focus states
- [ ] Component has appropriate loading states
- [ ] Component has appropriate error states
- [ ] Component is accessible via keyboard
