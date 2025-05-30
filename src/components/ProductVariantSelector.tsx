'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useOnchainStoreContext } from '@/components/OnchainStoreProvider';

interface ProductVariant {
  id: string;
  title: string;
  prices?: Array<{
    amount: number;
    currency_code: string;
  }>;
}

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  onVariantChange?: (variantId: string) => void;
  defaultVariantId?: string;
  productId: string;
  className?: string;
}

export function ProductVariantSelector({
  variants,
  onVariantChange,
  defaultVariantId,
  productId,
  className,
}: ProductVariantSelectorProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(defaultVariantId || null);
  const [quantity, setQuantity] = useState<number>(1);
  const { addToCart } = useOnchainStoreContext();

  // Extract sizes from variant titles (assuming format "Size / Color")
  const sizes = [...new Set(variants
    .map(v => v.title?.split(' / ')?.[0])
    .filter(Boolean))];

  // Extract colors from variant titles
  const colors = [...new Set(variants
    .map(v => v.title?.split(' / ')?.[1])
    .filter(Boolean))];

  // Set default variant when component mounts
  useEffect(() => {
    if (!selectedVariantId && variants.length > 0) {
      setSelectedVariantId(variants[0].id);
      onVariantChange?.(variants[0].id);
    }
  }, [variants, selectedVariantId, onVariantChange]);

  // Handle size selection
  const handleSizeSelect = (size: string) => {
    // Find first variant with this size
    const variant = variants.find(v => v.title?.startsWith(size));
    if (variant) {
      setSelectedVariantId(variant.id);
      onVariantChange?.(variant.id);
    }
  };

  // Handle color selection
  const handleColorSelect = (color: string) => {
    // If a size is already selected (from the current variant)
    const currentVariant = variants.find(v => v.id === selectedVariantId);
    const currentSize = currentVariant?.title?.split(' / ')?.[0];

    // Find a variant with the current size and new color
    const variant = variants.find(v => {
      const parts = v.title?.split(' / ');
      return parts?.[0] === currentSize && parts?.[1] === color;
    });

    if (variant) {
      setSelectedVariantId(variant.id);
      onVariantChange?.(variant.id);
    }
  };

  // Get current variant price
  const getVariantPrice = () => {
    if (!selectedVariantId) return 0;
    
    const variant = variants.find(v => v.id === selectedVariantId);
    if (!variant?.prices?.length) return 0;
    
    // Find USD price or take first price
    const usdPrice = variant.prices.find(p => p.currency_code === 'usd');
    const price = usdPrice || variant.prices[0];
    
    return price.amount / 100; // Convert from cents to dollars
  };

  // Get the selected size
  const getSelectedSize = () => {
    if (!selectedVariantId) return null;
    const variant = variants.find(v => v.id === selectedVariantId);
    return variant?.title?.split(' / ')?.[0] || null;
  };
  
  // Get the selected color
  const getSelectedColor = () => {
    if (!selectedVariantId) return null;
    const variant = variants.find(v => v.id === selectedVariantId);
    return variant?.title?.split(' / ')?.[1] || null;
  };
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };
  
  const handleAddToCart = () => {
    if (selectedVariantId) {
      for (let i = 0; i < quantity; i++) {
        addToCart(selectedVariantId);
      }
    } else {
      // Fallback to product ID if no variant selected
      for (let i = 0; i < quantity; i++) {
        addToCart(productId);
      }
    }
  };

  if (!variants || variants.length === 0) {
    // Simple add to cart if no variants
    return (
      <div className={className}>
        <div className="mb-6">
          <label htmlFor="quantity" className="mb-2 block font-medium text-sm text-gray-900">Quantity</label>
          <div className="flex items-center">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-l-lg border border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-900"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              -
            </button>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
              className="h-10 w-16 border-y border-gray-300 px-2 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              min="1"
            />
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-r-lg border border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-900"
              onClick={() => handleQuantityChange(quantity + 1)}
            >
              +
            </button>
          </div>
        </div>
        
        <Button className="w-full" onClick={handleAddToCart} size="lg">
          Add to Cart
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Size Selector */}
      {sizes.length > 1 && (
        <div className="mb-6">
          <label className="mb-2 block font-medium text-sm text-gray-900">Size</label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                className={cn(
                  "border font-medium h-10 px-3 rounded-md text-sm transition-colors",
                  getSelectedSize() === size
                    ? "bg-black border-black text-white hover:bg-zinc-800 hover:border-zinc-800"
                    : "border-gray-300 bg-white text-gray-900 hover:border-gray-400 hover:bg-gray-50"
                )}
                onClick={() => handleSizeSelect(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Color Selector */}
      {colors.length > 1 && (
        <div className="mb-6">
          <label className="mb-2 block font-medium text-sm text-gray-900">Color</label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                className={cn(
                  "border font-medium h-10 px-3 rounded-md text-sm transition-colors",
                  getSelectedColor() === color
                    ? "bg-black border-black text-white hover:bg-zinc-800 hover:border-zinc-800"
                    : "border-gray-300 bg-white text-gray-900 hover:border-gray-400 hover:bg-gray-50"
                )}
                onClick={() => handleColorSelect(color)}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Price Display */}
      <div className="mb-6">
        <p className="text-xl font-semibold text-gray-900">${getVariantPrice().toFixed(2)}</p>
      </div>
      
      {/* Quantity Selector */}
      <div className="mb-6">
        <label htmlFor="quantity" className="mb-2 block font-medium text-sm text-gray-900">Quantity</label>
        <div className="flex items-center">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-l-lg border border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-900"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
          >
            -
          </button>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
            className="h-10 w-16 border-y border-gray-300 px-2 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            min="1"
          />
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-r-lg border border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-900"
            onClick={() => handleQuantityChange(quantity + 1)}
          >
            +
          </button>
        </div>
      </div>
      
      <Button className="w-full" onClick={handleAddToCart} size="lg">
        Add to Cart
      </Button>
    </div>
  );
}
