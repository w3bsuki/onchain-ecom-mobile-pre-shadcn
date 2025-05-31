import type { CategoryCard } from '@/types';
import Link from 'next/link';

interface CategoryGridProps {
  categories: CategoryCard[];
  activeCategory: string | null;
  onCategoryClick: (categoryId: string) => void;
}

export const CategoryGrid = ({ 
  categories, 
  activeCategory, 
  onCategoryClick 
}: CategoryGridProps) => {
  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm uppercase font-medium tracking-widest">Shop by Category</h3>
          <Link href="/categories" className="text-xs font-medium hover:underline flex items-center gap-1 group">
            View All <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
          </Link>
        </div>
        
        <div className="scrollbar-hide grid grid-flow-col auto-cols-max gap-4 md:gap-6 overflow-x-auto pb-4 -mx-4 px-4">
          {categories.map((category) => (
            <button
              type="button"
              key={category.id}
              onClick={() => onCategoryClick(category.id)}
              className={`relative flex-shrink-0 flex flex-col items-center justify-center p-3 md:p-4 rounded-lg min-w-[80px] md:min-w-[100px] ${
                activeCategory === category.id
                  ? 'bg-black text-white'
                  : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-900'
              } transition-all duration-200`}
            >
              <div className="h-10 w-10 flex items-center justify-center">
                {category.icon}
              </div>
              <span className="mt-2 text-xs md:text-sm font-medium">{category.name}</span>
              <span className="text-[10px] md:text-xs opacity-70 mt-0.5">{category.count} Items</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}; 