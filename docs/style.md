# Style Guide - Onchain Commerce Template

This document describes the styling approach and guidelines for the Onchain Commerce Template project. The project uses a minimalist design with consistent spacing, typography, and color schemes.

## Technology Stack

- **CSS Framework:** Tailwind CSS
- **Code Formatting:** Biome (previously Rome)
- **Build Tools:** Next.js with PostCSS and Autoprefixer
- **Responsive Design:** Mobile-first approach with custom breakpoints

## Tailwind Configuration

The project uses a customized Tailwind configuration:

```typescript
// tailwind.config.ts
{
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    screens: {
      xs: '510px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    container: {
      center: true,
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        mono: ['IBM Plex Mono', 'monospace'],
        sansMono: ['Noto Sans Mono', 'monospace'],
      },
    },
  }
}
```

## Typography

The project uses a combination of fonts:

- **Primary Font:** Inter (sans-serif)
- **Monospace Fonts:** 
  - IBM Plex Mono
  - Noto Sans Mono
  
Example usage:
```jsx
<div className="font-mono">Code text</div>
<div className="font-sansMono">Alternative monospace text</div>
```

## Color Scheme

The project utilizes CSS variables for theming, with default light mode colors:

```css
:root {
  /* Base colors */
  --background: #ffffff;
  --foreground: #000000;
  
  /* System colors can be accessed through Tailwind classes */
  /* For example: bg-background, text-foreground */
}
```

## Layout and Spacing

The project follows a consistent spacing system using Tailwind's default spacing scale:

- **Containers:** `container mx-auto` for centered content with max-widths
- **Grid System:** Tailwind's grid system with responsive columns
  ```jsx
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  ```
- **Padding and Margins:** Following Tailwind's scale (p-4, m-2, etc.)

## Components

### Product Cards

Product cards follow a consistent pattern:
```jsx
<div className="store-item mx-auto flex w-full flex-col p-4 sm:mx-0 lg:p-6">
  <div className="mb-1 flex items-start justify-between">
    <h2 className="font-regular text-xs">{name}</h2>
  </div>
  <div className="flex grow justify-center md:relative">
    {/* Product image */}
  </div>
  <div className="flex items-center justify-between">
    <p className="font-regular text-xs">{price.toFixed(2)} USDC</p>
    {/* Quantity input */}
  </div>
</div>
```

### Buttons

Button styles are consistent with a minimal design approach:
```jsx
<button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
  Button Text
</button>
```

### Loading States

Loading states use a consistent spinner:
```jsx
<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
```

## Responsive Design

The project follows a mobile-first approach with breakpoints defined in the Tailwind config:

- **xs:** 510px
- **sm:** 640px
- **md:** 768px
- **lg:** 1024px
- **xl:** 1280px

Example of responsive implementation:
```jsx
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Content adapts to different screen sizes */}
</div>
```

## Code Formatting

The project uses Biome for consistent code formatting and linting:

```json
// Partial biome.json configuration
{
  "formatter": {
    "enabled": true,
    "indentWidth": 2,
    "indentStyle": "space"
  },
  "javascript": {
    "formatter": {
      "lineWidth": 80,
      "quoteStyle": "single",
      "jsxQuoteStyle": "double",
      "trailingCommas": "all"
    }
  }
}
```

## Images and Media

Images are handled primarily using Next.js Image component:
```jsx
<Image
  src={image}
  alt={name}
  className="object-contain max-w-[300px]"
/>
```

Remote images include fallback handling:
```jsx
<img
  src={imageError ? 'https://placehold.co/300x300?text=No+Image' : image}
  alt={name}
  onError={() => setImageError(true)}
  className="object-contain"
/>
```

## Integration Guidelines

When adding new components or integrating third-party UI libraries:

1. Maintain the current minimalist aesthetic
2. Use the existing color scheme and typography
3. Follow the established spacing patterns
4. Ensure responsive behavior matches current implementation
5. Keep components simple and functional 