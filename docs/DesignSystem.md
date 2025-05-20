# Design System

This document outlines the design system for our mobile-first e-commerce platform, providing a comprehensive guide to visual elements, components, and patterns.

## Core Design Principles

### 1. Mobile-First
- Design for smallest screens first, then progressively enhance
- Touch-friendly interactive elements (min 44x44px touch targets)
- Bottom-oriented primary actions for thumb accessibility

### 2. Performance-Focused
- Minimal animations that don't block interaction
- Optimized asset loading
- Strategic use of skeleton loaders
- Responsive images at appropriate sizes

### 3. Conversion-Optimized
- Clear call-to-action prominence
- Unobstructed product information
- Streamlined user flows
- Reduced cognitive load

### 4. Accessibility First
- WCAG AA compliance minimum
- Sufficient color contrast (min 4.5:1 for normal text)
- Keyboard navigable interactions
- Screen reader friendly markup
- Focus management for modals

## Color System

### Primary Colors
- **Primary**: #0F766E (teal-700) - Brand identity, primary CTA
- **Primary-Light**: #14B8A6 (teal-500) - Secondary elements, highlights
- **Primary-Dark**: #0D9488 (teal-600) - Hover states, active elements

### Secondary Colors
- **Secondary**: #EC4899 (pink-500) - Accents, attention-grabbing elements
- **Secondary-Light**: #F472B6 (pink-400) - Highlights, secondary accents
- **Secondary-Dark**: #DB2777 (pink-600) - Hover states for secondary elements

### Neutral Colors
- **Background**: #FFFFFF - Main background
- **Surface**: #F9FAFB (gray-50) - Card backgrounds, elevated surfaces
- **Border**: #E5E7EB (gray-200) - Dividers, borders
- **Text-Primary**: #111827 (gray-900) - Primary text
- **Text-Secondary**: #4B5563 (gray-600) - Secondary text, labels
- **Text-Tertiary**: #9CA3AF (gray-400) - Placeholder text, disabled state

### Semantic Colors
- **Success**: #10B981 (emerald-500) - Success states, confirmations
- **Warning**: #F59E0B (amber-500) - Warning states, alerts
- **Error**: #EF4444 (red-500) - Error states, critical alerts
- **Info**: #3B82F6 (blue-500) - Informational states

## Typography

### Font Family
- **Primary**: Inter, system-ui, sans-serif
- **Headings**: Inter, system-ui, sans-serif
- **Monospace**: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace

### Font Sizes
- **xs**: 0.75rem (12px)
- **sm**: 0.875rem (14px)
- **base**: 1rem (16px)
- **lg**: 1.125rem (18px)
- **xl**: 1.25rem (20px)
- **2xl**: 1.5rem (24px)
- **3xl**: 1.875rem (30px)
- **4xl**: 2.25rem (36px)

### Font Weights
- **normal**: 400
- **medium**: 500
- **semibold**: 600
- **bold**: 700

### Line Heights
- **none**: 1
- **tight**: 1.25
- **normal**: 1.5
- **relaxed**: 1.75

## Spacing System

Using a 4px baseline grid, with common spacing values:

- **0**: 0px
- **1**: 0.25rem (4px)
- **2**: 0.5rem (8px)
- **3**: 0.75rem (12px)
- **4**: 1rem (16px)
- **5**: 1.25rem (20px)
- **6**: 1.5rem (24px)
- **8**: 2rem (32px)
- **10**: 2.5rem (40px)
- **12**: 3rem (48px)
- **16**: 4rem (64px)
- **20**: 5rem (80px)
- **24**: 6rem (96px)

## Border Radius

- **none**: 0px
- **sm**: 0.125rem (2px)
- **default**: 0.25rem (4px)
- **md**: 0.375rem (6px)
- **lg**: 0.5rem (8px)
- **xl**: 0.75rem (12px)
- **2xl**: 1rem (16px)
- **full**: 9999px

## Shadows

- **sm**: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
- **default**: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)
- **md**: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)
- **lg**: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)
- **xl**: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)

## Component Library

### Buttons

#### Primary Button
- Background: Primary color
- Text: White
- Hover: Primary-Dark
- Active: Darken Primary by 10%
- Disabled: Opacity 50%
- Height: 44px (mobile), 40px (desktop)
- Padding: 0.75rem 1.5rem
- Border Radius: lg (8px)
- Font: base (16px), medium weight

#### Secondary Button
- Background: White
- Border: 1px solid Primary
- Text: Primary
- Hover: Light gray background
- Active: Light gray background
- Disabled: Opacity 50%
- Height: 44px (mobile), 40px (desktop)
- Padding: 0.75rem 1.5rem
- Border Radius: lg (8px)
- Font: base (16px), medium weight

#### Text Button
- Background: Transparent
- Text: Primary
- Hover: Light gray background
- Active: Light gray background
- Disabled: Opacity 50%
- Height: 44px (mobile), 40px (desktop)
- Padding: 0.75rem 1rem
- Font: base (16px), medium weight

#### Icon Button
- Size: 44px x 44px (mobile), 40px x 40px (desktop)
- Background: Transparent
- Icon: Primary or Text-Secondary
- Hover: Light gray background
- Active: Light gray background
- Disabled: Opacity 50%

### Forms

#### Text Input
- Height: 44px (mobile), 40px (desktop)
- Border: 1px solid Border
- Border Radius: md (6px)
- Padding: 0.5rem 0.75rem
- Font: base (16px)
- Focus: 2px outline Primary
- Error: 1px border Error
- Disabled: Opacity 70%, background light gray

#### Select
- Height: 44px (mobile), 40px (desktop)
- Border: 1px solid Border
- Border Radius: md (6px)
- Padding: 0.5rem 0.75rem
- Font: base (16px)
- Focus: 2px outline Primary
- Error: 1px border Error
- Disabled: Opacity 70%, background light gray

#### Checkbox / Radio
- Size: 18px x 18px
- Border: 1px solid Border
- Border Radius: default (4px) for checkbox, full for radio
- Checked: Primary background with white checkmark
- Focus: 2px outline Primary
- Disabled: Opacity 70%, background light gray

### Cards

#### Product Card
- Background: White
- Border: None
- Border Radius: lg (8px)
- Shadow: sm
- Padding: 1rem
- Image aspect ratio: 1:1 or 4:3
- Title: base (16px), semibold
- Price: base (16px), bold
- Description: sm (14px), normal weight, Text-Secondary

#### Info Card
- Background: Surface
- Border: 1px solid Border
- Border Radius: lg (8px)
- Padding: 1rem
- Title: base (16px), semibold
- Content: sm (14px), normal weight

### Navigation

#### Mobile Bottom Navigation
- Background: White
- Border Top: 1px solid Border
- Height: 56px
- Icon Size: 24px
- Label: xs (12px)
- Active: Primary color
- Inactive: Text-Secondary

#### Top Navigation
- Background: White
- Border Bottom: 1px solid Border
- Height: 56px (mobile), 64px (desktop)
- Title: lg (18px), semibold
- Back Button: 44px x 44px

### Modals and Sheets

#### Bottom Sheet
- Background: White
- Border Top Left Radius: xl (12px)
- Border Top Right Radius: xl (12px)
- Initial height: 50% of screen
- Header height: 56px
- Drag indicator: 32px x 4px, Border color
- Shadow: xl

#### Modal
- Background: White
- Border Radius: xl (12px)
- Width: 90% of screen (mobile), max 500px (desktop)
- Padding: 1.5rem
- Header font: xl (20px), semibold

## Animation Guidelines

### Principles
- Use animations sparingly and with purpose
- Animations should not delay user interaction
- Prioritize performance over visual flair
- Use GPU-accelerated properties (transform, opacity)

### Durations
- **Extra Fast**: 100ms - Micro interactions (button press)
- **Fast**: 150ms - Small transitions (hover states)
- **Normal**: 200ms - Standard transitions (modals, sheets)
- **Slow**: 300ms - Large transitions (page transitions)

### Easing
- **Default**: cubic-bezier(0.4, 0, 0.2, 1) - Most transitions
- **In**: cubic-bezier(0.4, 0, 1, 1) - Elements entering the screen
- **Out**: cubic-bezier(0, 0, 0.2, 1) - Elements leaving the screen
- **In-Out**: cubic-bezier(0.4, 0, 0.2, 1) - Complex transitions

## Responsive Breakpoints

- **sm**: 640px (Mobile landscape+)
- **md**: 768px (Tablets)
- **lg**: 1024px (Desktop)
- **xl**: 1280px (Large desktop)
- **2xl**: 1536px (Extra large screens)

---

[Back to Master Plan](./MASTER_PLAN.md) 