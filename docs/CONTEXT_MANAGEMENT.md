# Application Context Management

## Global Store Context
```tsx
// Primary store context for e-commerce data
interface StoreContext {
  products: Product[];
  cart: CartItem[];
  user: User | null;
  categories: Category[];
  wishlist: WishlistItem[];
  filters: FilterState;
}

// Performance optimized context splitting
interface UIContext {
  theme: Theme;
  layout: LayoutPreferences;
  notifications: Notification[];
}

interface SearchContext {
  recentSearches: string[];
  searchHistory: SearchResult[];
  suggestions: string[];
}
```

## Context Organization

### 1. Store Context
- Product management
- Cart operations
- User session
- Categories and filters
- Wishlist management

### 2. UI Context
- Theme preferences
- Layout settings
- Notifications
- Modal states
- Loading states

### 3. Search Context
- Search history
- Recent searches
- Search suggestions
- Filter preferences

## Context Optimization Strategies

### 1. Context Splitting
```tsx
// Split contexts by update frequency
const CartProvider = ({ children }) => {
  // High-frequency updates
  return <CartContext.Provider>{children}</CartContext.Provider>;
};

const UIProvider = ({ children }) => {
  // Medium-frequency updates
  return <UIContext.Provider>{children}</UIContext.Provider>;
};

const StoreProvider = ({ children }) => {
  // Low-frequency updates
  return <StoreContext.Provider>{children}</StoreContext.Provider>;
};
```

### 2. Selective Updates
```tsx
// Use selectors to prevent unnecessary rerenders
export function useCartItem(id: string) {
  return useStore(
    (state) => state.cart.find((item) => item.id === id)
  );
}
```

### 3. Memoization
```tsx
// Memoize expensive computations
const memoizedValue = useMemo(() => {
  return expensiveComputation(deps);
}, [deps]);
```

## Data Flow

### 1. Write Operations
```tsx
// Optimistic updates
const addToCart = async (product: Product) => {
  // Update local state immediately
  setCart([...cart, product]);
  
  try {
    // Update backend
    await api.cart.add(product);
  } catch (error) {
    // Rollback on failure
    setCart(cart);
    showError(error);
  }
};
```

### 2. Read Operations
```tsx
// Cached reads with SWR
const { data, error } = useSWR(
  '/api/products',
  fetcher,
  {
    revalidateOnFocus: false,
    dedupingInterval: 60000
  }
);
```

## Performance Considerations

### 1. Context Boundaries
- Keep context providers as low in the tree as possible
- Split contexts by update frequency
- Use selective subscriptions

### 2. State Updates
- Batch updates when possible
- Use optimistic updates for better UX
- Implement proper error handling and rollbacks

### 3. Memory Management
- Clean up subscriptions
- Clear large objects when not needed
- Implement pagination for large lists
