'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Category {
  id: string;
  name: string;
  icon?: React.ReactNode;
  count?: number;
}

interface CategoryTabsScrollerProps {
  categories: Category[];
  activeId?: string;
  onSelect: (id: string) => void;
  className?: string;
}

export function CategoryTabsScroller({
  categories,
  activeId,
  onSelect,
  className
}: CategoryTabsScrollerProps) {
  const scrollRef = useRef&lt;HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hoveredId, setHoveredId] = useState&lt;string | null>(null);

  const checkScrollability = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth &lt; scrollWidth - 10);
    }
  }, []);

  // Center active category on first render and when it changes
  useEffect(() => {
    if (scrollRef.current && activeId) {
      const activeElement = scrollRef.current.querySelector(`[data-category-id="${activeId}"]`) as HTMLElement;
      if (activeElement) {
        const scrollContainer = scrollRef.current;
        const scrollContainerWidth = scrollContainer.clientWidth;
        const activeElementWidth = activeElement.offsetWidth;
        const activeElementLeft = activeElement.offsetLeft;

        // Calculate center position
        const targetScrollPosition = activeElementLeft - (scrollContainerWidth / 2) + (activeElementWidth / 2);
        
        scrollContainer.scrollTo({
          left: targetScrollPosition,
          behavior: 'smooth'
        });

        setTimeout(checkScrollability, 300);
      }
    }
  }, [activeId, checkScrollability]);

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, [checkScrollability]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScrollability, 300);
    }
  };

  return (
    &lt;div className={cn('relative w-full mb-6', className)}>
      {/* Scroll indicators and buttons */}
      &lt;AnimatePresence>
        {canScrollLeft && (
          &lt;motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-0 top-0 bottom-0 z-10 flex items-center"
          >
            &lt;div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent pointer-events-none" />
            &lt;button
              onClick={() => handleScroll('left')}
              className="relative z-10 ml-1 flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white/80 shadow-sm backdrop-blur-sm hover:bg-zinc-50"
              aria-label="Scroll left"
            >
              &lt;ChevronLeft className="h-4 w-4 text-zinc-700" />
            &lt;/button>
          &lt;/motion.div>
        )}

        {canScrollRight && (
          &lt;motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute right-0 top-0 bottom-0 z-10 flex items-center"
          >
            &lt;div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none" />
            &lt;button
              onClick={() => handleScroll('right')}
              className="relative z-10 mr-1 flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white/80 shadow-sm backdrop-blur-sm hover:bg-zinc-50"
              aria-label="Scroll right"
            >
              &lt;ChevronRight className="h-4 w-4 text-zinc-700" />
            &lt;/button>
          &lt;/motion.div>
        )}
      &lt;/AnimatePresence>

      {/* Category tabs */}
      &lt;div
        ref={scrollRef}
        className="hide-scrollbar flex gap-2 overflow-x-auto pb-2 pt-1"
        onScroll={checkScrollability}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {categories.map((category, index) => (
          &lt;motion.button
            key={category.id}
            type="button"
            data-category-id={category.id}
            onClick={() => onSelect(category.id)}
            onMouseEnter={() => setHoveredId(category.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={cn(
              "relative flex-shrink-0 rounded-full border px-4 py-2.5 transition-all",
              activeId === category.id
                ? "bg-zinc-900 border-zinc-900 text-white shadow-md"
                : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900"
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.05,
            }}
          >
            &lt;div className="flex items-center gap-2">
              {category.icon && (
                &lt;span className={cn(
                  "transition-colors",
                  activeId === category.id ? "text-white/70" : "text-zinc-400"
                )}>
                  {category.icon}
                &lt;/span>
              )}
              &lt;span className="whitespace-nowrap text-sm font-medium">{category.name}&lt;/span>
              {category.count !== undefined && (
                &lt;span className={cn(
                  "rounded-full px-1.5 py-0.5 text-xs font-medium",
                  activeId === category.id
                    ? "bg-white/20 text-white"
                    : "bg-zinc-100 text-zinc-600"
                )}>
                  {category.count}
                &lt;/span>
              )}
            &lt;/div>

            {/* Hover/Active indicator dot */}
            &lt;motion.div
              className={cn(
                "absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 translate-y-1/2 rounded-full",
                activeId === category.id ? "bg-white" : "bg-zinc-900"
              )}
              initial={false}
              animate={{
                scale: hoveredId === category.id || activeId === category.id ? 1 : 0,
              }}
              transition={{ duration: 0.2 }}
            />
          &lt;/motion.button>
        ))}
      &lt;/div>
    &lt;/div>
  );
}
