import Link from 'next/link';
import { cn } from '@/lib/utils';
import ProductImage from './ProductImage';
import type { Product } from '@/lib/supabase-client';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  if (!product) return null;
  
  const { id, name, price, image_url, description } = product;
  
  // Format price
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);

  return (
    <div className={cn(
      'group relative flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white transition-all hover:shadow-md',
      className
    )}>
      <Link 
        href={`/products/${id}`}
        className="aspect-square w-full overflow-hidden bg-neutral-100"
      >
        <div className="relative h-full w-full object-cover transition-transform group-hover:scale-105">
          <ProductImage
            src={image_url}
            alt={name}
            width={300}
            height={300}
            className="h-full w-full object-cover"
          />
        </div>
      </Link>
      
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-medium text-neutral-700">
          <Link href={`/products/${id}`}>
            {name}
          </Link>
        </h3>
        
        {description && (
          <div className="mt-1 text-sm text-neutral-500 line-clamp-2">
            {description}
          </div>
        )}
        
        <div className="mt-auto pt-3 flex items-center justify-between">
          <p className="text-base font-medium text-neutral-900">
            {formattedPrice}
          </p>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              // Add to cart functionality will be implemented later
              console.log('Added to cart:', id);
            }}
            className="rounded-md bg-black px-3 py-1.5 text-xs font-medium text-white hover:bg-neutral-800"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
} 