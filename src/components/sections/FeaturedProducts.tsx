import type { Product } from '@/types';
import Link from 'next/link';
import { ProductCard } from '@/components/products/ProductCard';

interface FeaturedProductsProps {
  products: Product[];
  title?: string;
  viewAllLink?: string;
  loading?: boolean;
}

export const FeaturedProducts = ({
  products,
  title = "Featured Products",
  viewAllLink = "/products",
  loading = false
}: FeaturedProductsProps) => {
  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm uppercase font-medium tracking-widest">{title}</h3>
          <Link href={viewAllLink} className="text-xs font-medium hover:underline flex items-center gap-1 group">
            View All <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={`skeleton-${i}`} className="animate-pulse">
                <div className="bg-zinc-100 rounded-lg h-48 mb-2" />
                <div className="bg-zinc-100 h-4 rounded w-3/4 mb-2" />
                <div className="bg-zinc-100 h-4 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}; 