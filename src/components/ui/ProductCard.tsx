import { useState, useCallback } from 'react';
import { Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ProductQuickView } from './ProductQuickView';
import ProductImage from '../ProductImage';
import { useOnchainStoreContext } from '../OnchainStoreProvider';
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { useMediaQuery } from '@/hooks/use-media-query';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description?: string;
    image: string | null;
    price: number;
    rating?: number;
    reviewCount?: number;
    discount?: number;
    colors?: Array<{ name: string; hex: string }>;
    href?: string;
  };
}

// Simple gray placeholder with a product icon
const DEFAULT_PRODUCT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDUwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiIGZpbGw9IiNmM2Y0ZjYiLz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNTAsMjAwKSI+PHBhdGggZD0ibTEwMCAwYy0yNy42MTQgMC01MCAyMi4zODYtNTAgNTBzMjIuMzg2IDUwIDUwIDUwIDUwLTIyLjM4NiA1MC01MC0yMi4zODYtNTAtNTAtNTB6bTAgMjBjMTYuNTY5IDAgMzAgMTMuNDMxIDMwIDMwcy0xMy40MzEgMzAtMzAgMzAtMzAtMTMuNDMxLTMwLTMwIDEzLjQzMS0zMCAzMC0zMHoiIGZpbGw9IiM5Y2EzYWYiLz48cGF0aCBkPSJtLTUwIDYwIDIwMC0wLjAwMTZjMjcuNjE0IDAgNTAgMjIuMzg2IDUwIDUwdjIwYzAgNS41MjI4LTQuNDc3MiAxMC0xMCAxMGgtMjgwYy01LjUyMjggMC0xMC00LjQ3NzItMTAtMTB2LTIwYzAtMjcuNjE0IDIyLjM4Ni01MCA1MC01MHoiIGZpbGw9IiM5Y2EzYWYiLz48L2c+PC9zdmc+';

export function ProductCard({ product }: ProductCardProps) {
  const [showQuickView, setShowQuickView] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);
  const { addToCart } = useOnchainStoreContext();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const discountedPrice = product.discount 
    ? product.price * (1 - product.discount) 
    : null;
    
  const productLink = product.href || `/products/${product.id}`;

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    // Don't trigger quick view if clicking on buttons or links
    if ((e.target as HTMLElement).closest('button, a')) {
      return;
    }
    if (isMobile) {
      setShowQuickView(true);
    }
  }, [isMobile]);

  return (
    <>
      <Card 
        className="border cursor-pointer overflow-hidden relative rounded-lg shadow-sm"
        onClick={handleCardClick}
      >
        <CardContent className="p-0">
          {/* Product Image with Link */}
          <Link href={productLink} className="block" onClick={e => isMobile && e.preventDefault()}>
            <div className="aspect-square bg-gray-50 overflow-hidden relative">
              <ProductImage
                alt={product.name}
                className="h-full object-cover w-full"
                height={500}
                src={product.image}
                width={500}
              />
              
              {/* Discount Badge */}
              {product.discount && (
                <Badge 
                  className="absolute bg-red-500 font-medium left-3 text-white top-3" 
                  variant="secondary"
                >
                  {Math.round(product.discount * 100)}% OFF
                </Badge>
              )}
            </div>
          </Link>

          {/* Action buttons - Always visible for easy mobile access */}
          <div className="absolute flex right-2 top-2 z-10">
            <Button
              className="active:bg-gray-200 bg-white h-9 hover:bg-gray-100 mr-2 p-0 rounded-full shadow-sm text-gray-700 w-9"
              onClick={() => setIsWishlist(!isWishlist)}
              size="icon"
              variant="outline"
              title="Add to wishlist"
            >
              <Heart 
                className={cn(
                  "h-5 w-5",
                  isWishlist ? "fill-red-500 text-red-500" : ""
                )}
              />
            </Button>
            <Button
              className="active:bg-gray-200 bg-white h-9 hover:bg-gray-100 p-0 rounded-full shadow-sm text-gray-700 w-9"
              onClick={() => setShowQuickView(true)}
              size="icon"
              variant="outline"
              title="Quick view"
            >
              <Eye className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-start p-3 space-y-2">
          <Link href={productLink} className="block w-full" onClick={e => isMobile && e.preventDefault()}>
            <h3 className="font-medium hover:text-teal-700 line-clamp-1 text-gray-900 text-sm">
              {product.name}
            </h3>
          </Link>
          
          <div className="flex gap-2 items-center">
            <p className="font-semibold text-gray-900 text-sm">
              ${discountedPrice?.toFixed(2) || product.price.toFixed(2)}
            </p>
            {discountedPrice && (
              <p className="line-through text-gray-400 text-xs">
                ${product.price.toFixed(2)}
              </p>
            )}
          </div>
          
          {/* Color options */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-1 mt-1">
              {product.colors.slice(0, 4).map((color, index) => (
                <div 
                  key={`${product.id}-color-${index}`}
                  className="border border-gray-200 h-4 rounded-full w-4"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 4 && (
                <div className="border border-gray-200 flex h-4 items-center justify-center rounded-full text-[10px] w-4">
                  +{product.colors.length - 4}
                </div>
              )}
            </div>
          )}
          
          {/* Add to Cart Button - Easily accessible for mobile */}
          <Button
            className="active:bg-teal-800 bg-teal-700 font-medium hover:bg-teal-600 mt-2 text-white w-full"
            onClick={() => addToCart(product.id)}
          >
            Add to Cart
          </Button>
        </CardFooter>
      </Card>

      {/* Quick View Dialog */}
      <ProductQuickView
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
        product={product}
      />
    </>
  );
} 