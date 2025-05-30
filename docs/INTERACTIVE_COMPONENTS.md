# Interactive Component Optimization

## Component Interaction Principles

### 1. Minimal Interaction Cost
- Maximum 3 clicks to complete a purchase
- Single-click add to cart from product cards
- Quick view functionality from product listings
- Persistent shopping cart access

### 2. Visual Feedback Optimization
```tsx
// Optimized animation with minimal overhead
function AddToCartButton({ onClick }) {
  const [isAdded, setIsAdded] = useState(false);
  
  const handleClick = () => {
    setIsAdded(true);
    onClick();
    // Reset animation after completion
    setTimeout(() => setIsAdded(false), 1000);
  };
  
  return (
    <Button 
      onClick={handleClick}
      className={cn(
        "transition-all duration-200",
        isAdded && "bg-green-600"
      )}
    >
      {isAdded ? 'Added!' : 'Add to Cart'}
    </Button>
  );
}
```

### 3. Gesture Optimization
```tsx
// Touch-optimized carousel with minimal animations
function ProductGallery({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };
  
  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    // Threshold for swipe detection
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left - next image
        setCurrentIndex(i => Math.min(i + 1, images.length - 1));
      } else {
        // Swipe right - previous image
        setCurrentIndex(i => Math.max(i - 1, 0));
      }
    }
  };
  
  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative overflow-hidden"
    >
      <div 
        className="flex transition-transform duration-300"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map(image => (
          <Image key={image.id} src={image.url} alt={image.alt} className="w-full shrink-0" />
        ))}
      </div>
      
      {/* Optional: Minimal dots indicator */}
      <div className="flex justify-center mt-4 gap-2">
        {images.map((_, i) => (
          <button 
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === currentIndex ? "bg-black w-6" : "bg-gray-300 w-2"
            }`}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
```

## Quick Purchase Flow

### 1. Quick View Modal
```tsx
function ProductCard({ product }) {
  const [showQuickView, setShowQuickView] = useState(false);
  
  return (
    <>
      <div className="group relative">
        <Image src={product.image} alt={product.name} />
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5">
          <Button 
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              setShowQuickView(true);
            }}
          >
            Quick View
          </Button>
        </div>
      </div>
      
      {/* Conditionally render modal only when needed */}
      {showQuickView && (
        <QuickViewModal 
          product={product} 
          open={showQuickView}
          onClose={() => setShowQuickView(false)}
        />
      )}
    </>
  );
}
```

### 2. One-Click Purchase
```tsx
function ProductActions({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const handleQuickCheckout = async () => {
    // Add to cart first
    addToCart(product);
    
    // Create checkout session
    const { checkoutUrl } = await createExpressCheckout({
      items: [{ productId: product.id, quantity: 1 }],
      userId: user?.id
    });
    
    // Redirect to checkout
    window.location.href = checkoutUrl;
  };
  
  return (
    <div className="space-y-4">
      <Button onClick={() => addToCart(product)}>
        Add to Cart
      </Button>
      
      <Button variant="secondary" onClick={handleQuickCheckout}>
        Buy Now
      </Button>
    </div>
  );
}
```

### 3. Mini Cart
```tsx
function MiniCart() {
  const { cart, removeItem, updateQuantity } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  
  // Calculate total price
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return (
    <div className="relative">
      <Button 
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Cart with ${cart.length} items`}
      >
        <ShoppingCart className="h-5 w-5" />
        {cart.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-black text-[10px] text-white">
            {cart.length}
          </span>
        )}
      </Button>
      
      {/* Conditionally rendered dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-md bg-white p-4 shadow-lg">
          <h3 className="font-medium">Your Cart ({cart.length})</h3>
          
          {cart.length > 0 ? (
            <>
              <ul className="max-h-60 overflow-auto py-2">
                {cart.map(item => (
                  <li key={item.id} className="flex items-center py-2">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      width={40} 
                      height={40} 
                      className="rounded"
                    />
                    
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        ${item.price.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
              
              <div className="border-t border-gray-200 mt-2 pt-2">
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                
                <div className="mt-4 space-y-2">
                  <Button className="w-full" asChild>
                    <Link href="/checkout">Checkout</Link>
                  </Button>
                  
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/cart">View Cart</Link>
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <p className="py-4 text-center text-gray-500">
              Your cart is empty
            </p>
          )}
        </div>
      )}
    </div>
  );
}
```

## Interactive Filtering

### 1. Instant Filtering
```tsx
function ProductFilters({ products, onChange }) {
  const [filters, setFilters] = useState({
    category: [],
    price: { min: 0, max: 1000 },
    size: [],
    color: []
  });
  
  // Get all available values for each filter
  const categories = [...new Set(products.map(p => p.category))];
  const sizes = [...new Set(products.flatMap(p => p.sizes || []))];
  const colors = [...new Set(products.flatMap(p => p.colors || []))];
  
  // Handle filter changes
  const handleFilterChange = (type, value) => {
    let newFilters;
    
    if (Array.isArray(filters[type])) {
      newFilters = {
        ...filters,
        [type]: filters[type].includes(value)
          ? filters[type].filter(v => v !== value) // Remove if exists
          : [...filters[type], value] // Add if doesn't exist
      };
    } else {
      newFilters = { ...filters, [type]: value };
    }
    
    setFilters(newFilters);
    onChange(newFilters);
  };
  
  return (
    <div className="space-y-6">
      {/* Category filter */}
      <div>
        <h3 className="font-medium mb-2">Categories</h3>
        <div className="space-y-1">
          {categories.map(category => (
            <div key={category} className="flex items-center">
              <Checkbox
                id={`category-${category}`}
                checked={filters.category.includes(category)}
                onCheckedChange={() => handleFilterChange('category', category)}
              />
              <label 
                htmlFor={`category-${category}`}
                className="ml-2 text-sm"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Price range filter */}
      <div>
        <h3 className="font-medium mb-2">Price Range</h3>
        <div className="px-2">
          <Slider
            value={[filters.price.min, filters.price.max]}
            min={0}
            max={1000}
            step={10}
            onValueChange={(value) => handleFilterChange('price', {
              min: value[0],
              max: value[1]
            })}
          />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>${filters.price.min}</span>
            <span>${filters.price.max}</span>
          </div>
        </div>
      </div>
      
      {/* More filters: sizes, colors, etc. */}
    </div>
  );
}
```

### 2. Filter URL Sync
```tsx
function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  // Parse filters from URL
  const filters = {
    category: searchParams.getAll('category'),
    price: {
      min: parseInt(searchParams.get('minPrice') || '0'),
      max: parseInt(searchParams.get('maxPrice') || '1000')
    },
    size: searchParams.getAll('size'),
    color: searchParams.getAll('color')
  };
  
  // Update URL when filters change
  const handleFiltersChange = (newFilters) => {
    const params = new URLSearchParams();
    
    // Add category filters
    newFilters.category.forEach(cat => {
      params.append('category', cat);
    });
    
    // Add price range
    params.set('minPrice', newFilters.price.min.toString());
    params.set('maxPrice', newFilters.price.max.toString());
    
    // Add other filters
    newFilters.size.forEach(size => {
      params.append('size', size);
    });
    
    newFilters.color.forEach(color => {
      params.append('color', color);
    });
    
    // Update URL without reload
    router.replace(`${pathname}?${params.toString()}`);
  };
  
  return (
    <div className="grid grid-cols-4 gap-6">
      <div className="col-span-1">
        <ProductFilters
          initialFilters={filters}
          onChange={handleFiltersChange}
        />
      </div>
      
      <div className="col-span-3">
        <FilteredProductGrid filters={filters} />
      </div>
    </div>
  );
}
```

## Responsive Optimization

### 1. Mobile Navigation
```tsx
function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Close navigation when clicking outside
  const ref = useRef(null);
  useClickOutside(ref, () => setIsOpen(false));
  
  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(true)}
        className="md:hidden"
        aria-label="Menu"
      >
        <Menu className="h-6 w-6" />
      </Button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div 
            ref={ref}
            className="absolute bg-white h-full right-0 top-0 w-3/4 max-w-sm"
          >
            <div className="flex justify-end p-4">
              <Button
                variant="ghost"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            <nav className="px-6 py-4">
              {/* Navigation items */}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
```

### 2. Optimized Touch Controls
```tsx
function QuantitySelector({ value, onChange, min = 1, max = 10 }) {
  // Make buttons larger on touch devices
  return (
    <div className="flex items-center">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="h-10 w-10 rounded-l-md text-lg touch-manipulation"
        aria-label="Decrease quantity"
      >
        -
      </Button>
      
      <div className="flex h-10 w-12 items-center justify-center border-y border-gray-200 text-sm font-medium">
        {value}
      </div>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="h-10 w-10 rounded-r-md text-lg touch-manipulation"
        aria-label="Increase quantity"
      >
        +
      </Button>
    </div>
  );
}
```

### 3. Tap Targets
```tsx
function FiltersMobile({ filters, onChange }) {
  const [openFilter, setOpenFilter] = useState(null);
  
  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {Object.entries(filters).map(([key, value]) => (
          <Button
            key={key}
            variant="outline"
            className="min-h-[44px] min-w-[44px] flex-shrink-0 px-4 py-2"
            onClick={() => setOpenFilter(key)}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
            
            {Array.isArray(value) && value.length > 0 && (
              <span className="ml-1 rounded-full bg-black px-1.5 text-[10px] text-white">
                {value.length}
              </span>
            )}
          </Button>
        ))}
      </div>

      {openFilter && (
        <Sheet open={!!openFilter} onOpenChange={() => setOpenFilter(null)}>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>
                {openFilter.charAt(0).toUpperCase() + openFilter.slice(1)} Filter
              </SheetTitle>
            </SheetHeader>
            
            <div className="mt-4">
              <FilterOptions 
                type={openFilter} 
                value={filters[openFilter]} 
                onChange={(value) => {
                  onChange(openFilter, value);
                  setOpenFilter(null);
                }} 
              />
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
```
