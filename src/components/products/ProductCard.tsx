"use client";

import { useState, useCallback } from 'react';
import { Heart, Eye, ShoppingBag, Star, Plus, Check } from 'lucide-react';
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
    isFeatured?: boolean;
    isSoldOut?: boolean;
  };
  aspectRatio?: "portrait" | "square";
  variant?: "default" | "minimal";
  className?: string;
}

export function ProductCard({ 
  product, 
  aspectRatio = "portrait", 
  variant = "default",
  className
}: ProductCardProps) {
  const [showQuickView, setShowQuickView] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useOnchainStoreContext();
  
  // Price calculations
  const getPrice = useCallback(() => {
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
  }, [product.price, product.variants]);

  const basePrice = getPrice();
  const discountedPrice = product.discount ? basePrice * (1 - product.discount) : null;
  const formatPrice = (price: number) => (price / 100).toFixed(2);
  const productLink = product.href || `/products/${product.id}`;
  const variantId = product.variants?.[0]?.id;

  // Colors
  const hasColors = product.colors && product.colors.length > 0;
  
  // Rating display
  const hasRating = typeof product.rating === 'number';
  const ratingValue = hasRating ? product.rating : 0;
  const showReviewCount = hasRating && product.reviewCount && product.reviewCount > 0;
  
  // Event handlers
  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (variantId) {
      addToCart(variantId);
    }
  }, [addToCart, variantId]);

  const handleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlist(prev => !prev);
  }, []);

  const handleQuickView = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  }, []);

  const handleColorSelect = useCallback((index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedColorIndex(index);
  }, []);

  // If product is sold out, disable add to cart functionality
  const isDisabled = product.isSoldOut;

  return (
    <div 
      className={cn(
        "group relative touch-manipulation bg-white transition-all duration-300",
        isHovered && "z-10 md:shadow-sm md:shadow-black/5",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product image with hover effect */}
      <Link href={productLink} className="block overflow-hidden">
        <div 
          className={cn(
            "relative overflow-hidden bg-zinc-50 border border-zinc-100",
            aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
          )}
        >
          <ProductImage
            alt={product.title || product.name || 'Product'}
            className={cn(
              "h-full w-full object-cover transition-transform duration-700",
              isHovered ? "scale-105" : "scale-100"
            )}
            height={400}
            width={400}
            src={product.thumbnail || product.image || DEFAULT_PRODUCT_IMAGE}
            priority={false}
          />
          
          {/* Premium Badge Stack */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
            {product.discount && (
              <Badge 
                className="rounded-sm bg-black px-1.5 py-0.5 text-[10px] tracking-wide uppercase font-medium text-white shadow-sm"
              >
                {Math.round(product.discount * 100)}% OFF
              </Badge>
            )}
            {product.isNew && (
              <Badge 
                className="rounded-sm bg-emerald-600 px-1.5 py-0.5 text-[10px] tracking-wide uppercase font-medium text-white shadow-sm"
              >
                NEW
              </Badge>
            )}
            {product.isFeatured && (
              <Badge 
                className="rounded-sm bg-amber-600 px-1.5 py-0.5 text-[10px] tracking-wide uppercase font-medium text-white shadow-sm"
              >
                FEATURED
              </Badge>
            )}
            {product.isSoldOut && (
              <Badge 
                className="rounded-sm bg-zinc-800 px-1.5 py-0.5 text-[10px] tracking-wide uppercase font-medium text-white shadow-sm"
              >
                SOLD OUT
              </Badge>
            )}
          </div>
          
          {/* Quick View Button - Left Side */}
          <div className={cn(
            "absolute bottom-2 left-2 z-10",
            "opacity-100 md:opacity-0 transition-opacity duration-200",
            isHovered && "opacity-100"
          )}>
            <Button
              type="button"
              size="icon"
              className="h-10 w-10 rounded-full bg-white shadow-md hover:bg-gray-50 active:scale-95 transition-transform"
              onClick={handleQuickView}
              title="Quick view"
              aria-label="Quick view"
            >
              <Eye className="h-4 w-4 text-zinc-700" />
            </Button>
          </div>
          
          {/* Floating Quick Actions - Top Right */}
          <div className={cn(
            "absolute right-2 top-2 z-10 flex flex-col gap-2",
            "opacity-0 md:opacity-0 transition-opacity duration-200",
            isHovered && "opacity-100"
          )}>
            {/* Wishlist Button */}
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="h-8 w-8 rounded-full border border-zinc-200 bg-white/90 backdrop-blur-sm p-0 shadow-sm hover:bg-white active:scale-95 transition-transform"
              onClick={handleWishlist}
              title="Add to wishlist"
              aria-label="Add to wishlist"
            >
              <Heart className={cn("h-3.5 w-3.5", isWishlist && "fill-red-500 text-red-500")} />
            </Button>
          </div>
          
          {/* Floating Add To Cart Button - Premium Mobile Experience */}
          <div className={cn(
            "absolute bottom-2 right-2 z-10",
            "opacity-100 md:opacity-0 transition-opacity duration-200",
            isHovered && "opacity-100"
          )}>
            <Button
              type="button"
              size="icon"
              className={cn(
                "h-10 w-10 rounded-full shadow-md active:scale-95 transition-transform",
                isDisabled 
                  ? "bg-zinc-300 cursor-not-allowed" 
                  : "bg-black hover:bg-zinc-800"
              )}
              onClick={handleAddToCart}
              title={isDisabled ? "Sold out" : "Add to cart"}
              aria-label={isDisabled ? "Sold out" : "Add to cart"}
              disabled={isDisabled}
            >
              {product.variants?.[0]?.id && isWishlist ? (
                <Check className="h-4 w-4 text-white" />
              ) : (
                <Plus className="h-4 w-4 text-white" />
              )}
            </Button>
          </div>
        </div>
      </Link>
      
      {/* Product Info - Modern Layout */}
      <div className="px-1 py-3 space-y-1.5">
        {/* Brand & Category (Optional) */}
        {product.category && (
          <div className="text-[10px] uppercase tracking-wide text-zinc-500 font-medium">
            {product.category}
          </div>
        )}
        
        {/* Product Title */}
        <Link href={productLink} className="block group-hover:underline transition-all duration-200 underline-offset-2 decoration-zinc-300">
          <h3 className="text-sm font-medium leading-tight text-black line-clamp-2">
            {product.title || product.name || 'Product'}
          </h3>
        </Link>
        
        {/* Rating Stars */}
        {hasRating && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={`star-${product.id}-${i}`}
                  size={12}
                  className={cn(
                    "text-zinc-300",
                    i < Math.floor(ratingValue) && "fill-amber-400 text-amber-400",
                    i === Math.floor(ratingValue) && ratingValue % 1 > 0 && "fill-amber-400 text-amber-400 opacity-50"
                  )}
                />
              ))}
            </div>
            {showReviewCount && (
              <span className="text-[10px] text-zinc-500">
                ({product.reviewCount})
              </span>
            )}
          </div>
        )}
        
        {/* Modern Price Display */}
        <div className="flex items-baseline gap-2">
          <span className={cn(
            "font-medium text-black",
            discountedPrice !== null && "text-red-600",
            isDisabled && "text-zinc-500"
          )}>
            ${discountedPrice !== null ? formatPrice(discountedPrice) : formatPrice(basePrice)}
          </span>
          {discountedPrice !== null && (
            <span className="text-xs text-zinc-500 line-through">
              ${formatPrice(basePrice)}
            </span>
          )}
        </div>
        
        {/* Color Variants - Premium Design */}
        {hasColors && (
          <div className="mt-2 flex flex-wrap gap-1.5 -mx-0.5 px-0.5">
            {product.colors.map((color, index) => (
              <button
                type="button"
                key={`color-${product.id}-${color.name}`}
                onClick={(e) => handleColorSelect(index, e)}
                className={cn(
                  "h-5 w-5 rounded-full transition-all duration-200 flex items-center justify-center",
                  selectedColorIndex === index 
                    ? "ring-1 ring-offset-2 ring-black scale-110" 
                    : "ring-1 ring-zinc-200 hover:ring-zinc-300"
                )}
                style={{ backgroundColor: color.hex }}
                aria-label={color.name}
                title={color.name}
              >
                {selectedColorIndex === index && (
                  <Check className={cn(
                    "h-3 w-3", 
                    color.hex === "#FFFFFF" || color.hex === "#FFFFFFF" ? "text-black" : "text-white"
                  )} />
                )}
              </button>
            ))}
          </div>
        )}
        
        {/* Desktop-only Add To Cart - Hidden on mobile */}
        {variant === "default" && (
          <div className="mt-3 hidden md:block">
            <Button
              type="button"
              variant="default"
              size="sm"
              className={cn(
                "h-9 w-full rounded-md text-xs font-medium text-white transition-all",
                isDisabled 
                  ? "bg-zinc-300 cursor-not-allowed" 
                  : "bg-black hover:bg-zinc-800 active:scale-[0.98] active:bg-zinc-900"
              )}
              onClick={handleAddToCart}
              disabled={isDisabled}
            >
              <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
              {isDisabled ? "Sold Out" : "Add to Cart"}
            </Button>
          </div>
        )}
      </div>

      {/* Quick view modal */}
      <ProductQuickView
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </div>
  );
} 