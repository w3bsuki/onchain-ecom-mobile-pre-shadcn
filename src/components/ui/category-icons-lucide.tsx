'use client';

import { 
  ShoppingBag,
  Shirt,
  Footprints, 
  Watch, 
  Glasses,
  Grid,
  Package,
  Tag,
  Heart,
  PercentCircle,
  GripHorizontal,
  Sparkles,
  Layers,
  Coffee,
  Gift,
  Music
} from 'lucide-react';

interface IconProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
}

// Professional Lucide icons for e-commerce categories
// Each component has appropriate semantic meaning for the product category

export function ShoesIcon({ className, size = 24, strokeWidth = 1.75 }: IconProps) {
  return (
    <Footprints 
      className={className} 
      size={size} 
      strokeWidth={strokeWidth} 
      aria-hidden="true" 
    />
  );
}

export function ShirtIcon({ className, size = 24, strokeWidth = 1.75 }: IconProps) {
  return (
    <Shirt 
      className={className} 
      size={size} 
      strokeWidth={strokeWidth} 
      aria-hidden="true" 
    />
  );
}

export function HoodieIcon({ className, size = 24, strokeWidth = 1.75 }: IconProps) {
  // Using Layers as a representation of layered clothing like hoodies
  return (
    <Layers 
      className={className} 
      size={size} 
      strokeWidth={strokeWidth} 
      aria-hidden="true" 
    />
  );
}

export function JacketIcon({ className, size = 24, strokeWidth = 1.75 }: IconProps) {
  // Using ShoppingBag as an alternate for outerwear/jackets
  return (
    <ShoppingBag 
      className={className} 
      size={size} 
      strokeWidth={strokeWidth} 
      aria-hidden="true" 
    />
  );
}

export function HatIcon({ className, size = 24, strokeWidth = 1.75 }: IconProps) {
  // Custom hat icon since lucide-react doesn't have a Hat icon
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      aria-hidden="true"
    >
      <path d="M12 4c-1.5 0-3 .5-4 2-1 1.5-2 1-2 3v3c0 1.5 1 2 2 2 0 1.5.5 2 2 2h4c1.5 0 2-.5 2-2 1 0 2-.5 2-2v-3c0-2-1-1.5-2-3-1-1.5-2.5-2-4-2z" />
      <path d="M6 16v2" />
      <path d="M18 16v2" />
    </svg>
  );
}

export function WatchIcon({ className, size = 24, strokeWidth = 1.75 }: IconProps) {
  return (
    <Watch 
      className={className} 
      size={size} 
      strokeWidth={strokeWidth} 
      aria-hidden="true" 
    />
  );
}

export function GlassesIcon({ className, size = 24, strokeWidth = 1.75 }: IconProps) {
  return (
    <Glasses 
      className={className} 
      size={size} 
      strokeWidth={strokeWidth} 
      aria-hidden="true" 
    />
  );
}

export function AllIcon({ className, size = 24, strokeWidth = 1.75 }: IconProps) {
  return (
    <Grid 
      className={className} 
      size={size} 
      strokeWidth={strokeWidth} 
      aria-hidden="true" 
    />
  );
}

// Additional e-commerce category icons

export function NewIcon({ className, size = 24, strokeWidth = 1.75 }: IconProps) {
  return (
    <Sparkles 
      className={className} 
      size={size} 
      strokeWidth={strokeWidth} 
      aria-hidden="true" 
    />
  );
}

export function SaleIcon({ className, size = 24, strokeWidth = 1.75 }: IconProps) {
  return (
    <PercentCircle 
      className={className} 
      size={size} 
      strokeWidth={strokeWidth} 
      aria-hidden="true" 
    />
  );
}

export function FavoriteIcon({ className, size = 24, strokeWidth = 1.75 }: IconProps) {
  return (
    <Heart 
      className={className} 
      size={size} 
      strokeWidth={strokeWidth} 
      aria-hidden="true" 
    />
  );
}

export function ProductsIcon({ className, size = 24, strokeWidth = 1.75 }: IconProps) {
  return (
    <Package 
      className={className} 
      size={size} 
      strokeWidth={strokeWidth} 
      aria-hidden="true" 
    />
  );
}

export function CategoriesIcon({ className, size = 24, strokeWidth = 1.75 }: IconProps) {
  return (
    <GripHorizontal 
      className={className} 
      size={size} 
      strokeWidth={strokeWidth} 
      aria-hidden="true" 
    />
  );
}

export function TagIcon({ className, size = 24, strokeWidth = 1.75 }: IconProps) {
  return (
    <Tag 
      className={className} 
      size={size} 
      strokeWidth={strokeWidth} 
      aria-hidden="true" 
    />
  );
}

export function CoffeeIcon({ className, size = 24, strokeWidth = 1.75 }: IconProps) {
  return (
    <Coffee 
      className={className} 
      size={size} 
      strokeWidth={strokeWidth} 
      aria-hidden="true" 
    />
  );
}

export function GiftIcon({ className, size = 24, strokeWidth = 1.75 }: IconProps) {
  return (
    <Gift 
      className={className} 
      size={size} 
      strokeWidth={strokeWidth} 
      aria-hidden="true" 
    />
  );
}

export function MusicIcon({ className, size = 24, strokeWidth = 1.75 }: IconProps) {
  return (
    <Music 
      className={className} 
      size={size} 
      strokeWidth={strokeWidth} 
      aria-hidden="true" 
    />
  );
}
