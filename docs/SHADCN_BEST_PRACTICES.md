# shadcn/ui Best Practices

## Component Usage

### Installation & Setup
1. Initialize shadcn/ui:
```bash
npx shadcn-ui@latest init
```

2. Add components:
```bash
npx shadcn-ui@latest add [component-name]
```

### Component Organization
```
components/
├── ui/                 # shadcn base components
└── features/           # Custom components using shadcn
```

## Styling Principles

### 1. Base Styles
- Use Tailwind classes for layout
- Maintain shadcn's built-in styles
- Override only when necessary

### 2. Custom Variants
```tsx
// button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### 3. Theme Customization
```ts
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... other colors
      },
    },
  },
};
```

## Performance Optimization

### 1. Lazy Loading
```tsx
import dynamic from 'next/dynamic';

const Dialog = dynamic(() => import('@/components/ui/dialog'), {
  loading: () => <div>Loading...</div>,
  ssr: false, // If component uses browser APIs
});
```

### 2. Conditional Rendering
```tsx
function ProductCard() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div>
      <Button onClick={() => setShowDetails(true)}>View Details</Button>
      {showDetails && (
        <Sheet>
          <ProductDetails />
        </Sheet>
      )}
    </div>
  );
}
```

### 3. State Management
```tsx
function ProductForm() {
  const form = useForm({
    defaultValues: {
      name: "",
      price: 0,
    },
  });

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </Form>
  );
}
```

## Accessibility

### 1. ARIA Labels
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button aria-label="Open product details">View Details</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Product Details</DialogTitle>
      <DialogDescription>View detailed information about this product.</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

### 2. Keyboard Navigation
```tsx
<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink>Link</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

## Common Patterns

### 1. Data Display
```tsx
<Card>
  <CardHeader>
    <CardTitle>Product Name</CardTitle>
    <CardDescription>Product description here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Price: $99.99</p>
  </CardContent>
  <CardFooter>
    <Button>Add to Cart</Button>
  </CardFooter>
</Card>
```

### 2. Forms
```tsx
<Form>
  <FormField>
    <FormLabel>Email</FormLabel>
    <FormControl>
      <Input type="email" placeholder="Enter your email" />
    </FormControl>
    <FormDescription>We'll never share your email.</FormDescription>
    <FormMessage />
  </FormField>
</Form>
```

### 3. Notifications
```tsx
<Toast>
  <ToastTitle>Success!</ToastTitle>
  <ToastDescription>Item added to cart.</ToastDescription>
  <ToastClose />
</Toast>
```
