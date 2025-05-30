"use client";

import { useState } from 'react';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useOnchainStoreContext } from '../OnchainStoreProvider';
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { ProductQuickView } from '@/components/ui/ProductQuickView';
import ProductImage from '@/components/products/ProductImage';

// Default product image
const DEFAULT_PRODUCT_IMAGE = 'https://placehold.co/500x500/f5f5f5/999999?text=Product';

interface ProductCardProps {
  product: {
    id: string;
    title?: string;
    name?: string;
    description?: string;
    thumbnail?: string | null;
    image?: string | null;
    handle?: string;
    price?: number;
    variants?: Array<{
      id: string;
      title?: string;
      prices?: Array<{
        amount: number;
        currency_code: string;
      }>;
    }>;
    discount?: number;
    colors?: Array<{ name: string; hex: string }>;
    href?: string;
    rating?: number;
    reviewCount?: number;
    category?: string;
    isNew?: boolean;
    isHot?: boolean;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const [showQuickView, setShowQuickView] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const { addToCart } = useOnchainStoreContext();
  
  // Price calculations
  const getPrice = () => {
    if (typeof product.price === 'number') {
      return product.price * 100;
    }
    if (!product.variants || product.variants.length === 0) {
      return 0;
    }
    
    const defaultVariant = product.variants[0];
    const usdPrice = defaultVariant.prices?.find(p => {
      return p.currency_code.toLowerCase() === 'usd';
    })?.amount || 0;
    return usdPrice;
  };

  const basePrice = getPrice();
  const discountedPrice = product.discount ? basePrice * (1 - product.discount) : null;
  const formatPrice = (price: number) => (price / 100).toFixed(2);
  const productLink = product.href || `/products/${product.id}`;
  const variantId = product.variants?.[0]?.id;

  // Colors
  const hasColors = product.colors && product.colors.length > 0;
  const selectedColor = hasColors ? product.colors[selectedColorIndex] : null;
  
  // Event handlers
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (variantId) {
      addToCart(variantId);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlist(!isWishlist);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  const handleColorSelect = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedColorIndex(index);
  };

  return (
    <div className="group relative border-b pb-4 sm:border sm:rounded sm:pb-0">
      {/* Product image */}
      <Link href={productLink} className="block">
        <div className="relative overflow-hidden bg-gray-50">
          <ProductImage
            alt={product.title || product.name || 'Product'}
            className="h-full w-full object-cover"
            height={400}
            width={400}
            src={product.thumbnail || product.image || DEFAULT_PRODUCT_IMAGE}
            priority={false}
          />
          
          {/* Badges */}
          <div className="absolute left-1 top-1">
            {product.discount && (
              <Badge className="text-[10px] bg-red-500">
                {Math.round(product.discount * 100)}% OFF
              </Badge>
            )}
          </div>
          
          {/* Wishlist button - top right */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1 h-8 w-8 rounded-full bg-white/80 p-0"
            onClick={handleWishlist}
          >
            <Heart className={cn("h-4 w-4", isWishlist ? "fill-red-500 text-red-500" : "")} />
          </Button>
        </div>
      </Link>
      
      {/* Product info */}
      <div className="px-2 pt-2">
        {/* Single line title */}
        <Link href={productLink}>
          <h3 className="truncate text-sm font-medium leading-tight">
            {product.title || product.name || 'Product'}
          </h3>
        </Link>
        
        {/* Tiny category */}
        {product.category && (
          <p className="text-[10px] text-muted-foreground">
            {product.category}
          </p>
        )}
        
        {/* Color chips - tiny with selected indicator */}
        {hasColors && (
          <div className="mt-1.5 flex gap-1">
            {product.colors.map((color, index) => (
              <button
                type="button"
                key={`color-${product.id}-${color.name}`}
                onClick={(e) => handleColorSelect(index, e)}
                className={cn(
                  "h-4 w-4 rounded-full",
                  selectedColorIndex === index 
                    ? "ring-1 ring-black" 
                    : "ring-1 ring-gray-200"
                )}
                style={{ backgroundColor: color.hex }}
                aria-label={selectedColorIndex === index ? 'Selected color: ' + color.name : 'Color: ' + color.name}
                title={color.name}
              />
            ))}
          </div>
        )}
        
        {/* Price row */}
        <div className="mt-1.5 flex items-center justify-between">
          {/* Price */}
          <div className="flex items-baseline gap-1">
            <span className="font-medium">
              ${discountedPrice !== null ? formatPrice(discountedPrice) : formatPrice(basePrice)}
            </span>
            {discountedPrice !== null && (
              <span className="text-xs text-muted-foreground line-through">
                ${formatPrice(basePrice)}
              </span>
            )}
          </div>
          
          {/* Mobile action buttons */}
          <div className="flex items-center gap-1 sm:hidden">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 rounded-full p-0"
              onClick={handleQuickView}
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>
            
            <Button
              size="icon"
              variant="default"
              className="h-7 w-7 rounded-full p-0"
              onClick={handleAddToCart}
              disabled={!variantId}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        
        {/* Desktop add to cart - hidden on mobile */}
        <div className="mt-2 hidden sm:block">
          <Button 
            className="w-full"
            size="sm"
            onClick={handleAddToCart}
            disabled={!variantId}
          >
            Add to cart
          </Button>
        </div>
      </div>
      
      {/* Quick view modal */}
      {showQuickView && (
        <ProductQuickView
          isOpen={showQuickView}
          onClose={() => setShowQuickView(false)}
          product={product}
        />
      )}
    </div>
  );
} 