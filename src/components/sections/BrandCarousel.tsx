import type { BrandLogo } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

interface BrandCarouselProps {
  brands: BrandLogo[];
}

export const BrandCarousel = ({ brands }: BrandCarouselProps) => {
  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm uppercase font-medium tracking-widest">Shop by Brand</h3>
          <Link href="/brands" className="text-xs font-medium hover:underline flex items-center gap-1 group">
            View All <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
          </Link>
        </div>
        
        <div className="scrollbar-hide grid grid-flow-col auto-cols-max gap-8 md:gap-12 overflow-x-auto pb-4 -mx-4 px-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.id}`}
              className="flex-shrink-0 group flex flex-col items-center"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 bg-zinc-50 rounded-lg flex items-center justify-center group-hover:bg-zinc-100 transition-all duration-200 group-hover:shadow-md">
                <Image 
                  src={brand.logoUrl} 
                  alt={brand.name}
                  width={56}
                  height={56}
                  className="object-contain opacity-80 group-hover:opacity-100 transition-opacity" 
                />
              </div>
              <span className="mt-3 text-xs md:text-sm font-medium text-zinc-700 group-hover:text-black transition-colors">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}; 