'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface Category {
  id: string;
  name: string;
  href: string;
  icon?: React.ReactNode;
  count?: number;
}

interface MobileCategoryNavProps {
  categories: Category[];
  activeId?: string;
  className?: string;
  onClick?: (id: string) => void;
}

export function MobileCategoryNav({ categories, activeId, className, onClick }: MobileCategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
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
        
        // Apply smooth scrolling
        scrollContainer.scrollTo({
          left: targetScrollPosition,
          behavior: 'smooth'
        });
      }
      
      // Update scroll indicators after animation
      setTimeout(checkScrollability, 300);
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
      
      // Update scroll indicators after animation
      setTimeout(checkScrollability, 300);
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      {/* Scroll indicators and buttons */}
      <AnimatePresence>
        {canScrollLeft && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bg-white/80 backdrop-blur-sm border border-zinc-200 flex h-8 items-center justify-center left-0 rounded-full shadow-sm top-1/2 transform -translate-y-1/2 w-8 z-10"
            onClick={() => handleScroll('left')}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4 text-zinc-700" />
          </motion.button>
        )}

        {canScrollRight && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bg-white/80 backdrop-blur-sm border border-zinc-200 flex h-8 items-center justify-center right-0 rounded-full shadow-sm top-1/2 transform -translate-y-1/2 w-8 z-10"
            onClick={() => handleScroll('right')}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4 text-zinc-700" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Scrollable categories row */}
      <div 
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-2 pt-1 scrollbar-hide"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        }}
        onScroll={checkScrollability}
      >
        {categories.map((category) => {
          const isActive = activeId === category.id;
          
          return (
            <button
              key={category.id}
              type="button"
              data-category-id={category.id}
              onClick={() => onClick?.(category.id)}
              className={cn(
                "border flex-shrink-0 px-4 py-2 rounded-full text-sm transition-all whitespace-nowrap",
                isActive 
                  ? "bg-teal-700 border-teal-700 font-medium text-white" 
                  : "active:bg-zinc-100 bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 text-zinc-700"
              )}
            >
              <div className="flex items-center space-x-1.5">
                {category.icon && (
                  <span className={cn(
                    "flex items-center justify-center",
                    isActive ? "text-white" : "text-zinc-500"
                  )}>
                    {category.icon}
                  </span>
                )}
                <span>{category.name}</span>
                {category.count !== undefined && (
                  <span className={cn(
                    "rounded-full px-1.5 text-xs",
                    isActive ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-600"
                  )}>
                    {category.count}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
} 