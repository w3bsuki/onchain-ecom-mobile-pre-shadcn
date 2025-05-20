'use client';

import { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
  id: string;
  name: string;
  icon?: React.ReactNode;
  count?: number;
}

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export default function CategoryTabs({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const checkScrollability = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  }, []);

  // Center active category on first render and when it changes
  useEffect(() => {
    if (scrollRef.current && activeCategory) {
      const activeElement = scrollRef.current.querySelector(`[data-category-id="${activeCategory}"]`) as HTMLElement;
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
  }, [activeCategory, checkScrollability]);

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, [checkScrollability]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      
      // Update scroll indicators after animation
      setTimeout(checkScrollability, 300);
    }
  };

  return (
    <div className="mb-8 relative w-full">
      {/* Scroll buttons with gradient overlays */}
      <AnimatePresence>
        {canScrollLeft && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 flex items-center left-0 top-0 z-10"
          >
            <div className="absolute bg-gradient-to-r from-white h-full to-transparent w-16" />
            <Button 
              variant="outline" 
              size="icon"
              className="absolute bg-white border-zinc-200 h-8 hover:bg-zinc-50 hover:border-zinc-300 hover:shadow-md items-center justify-center left-1 rounded-full shadow-sm text-zinc-800 top-1/2 transform -translate-y-1/2 w-8 z-20"
              onClick={() => handleScroll('left')}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Scroll left</span>
            </Button>
          </motion.div>
        )}

        {canScrollRight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 flex items-center right-0 top-0 z-10"
          >
            <div className="absolute bg-gradient-to-l from-white h-full to-transparent w-16" />
            <Button 
              variant="outline" 
              size="icon"
              className="absolute bg-white border-zinc-200 h-8 hover:bg-zinc-50 hover:border-zinc-300 hover:shadow-md items-center justify-center right-1 rounded-full shadow-sm text-zinc-800 top-1/2 transform -translate-y-1/2 w-8 z-20"
              onClick={() => handleScroll('right')}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Scroll right</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main categories container */}
      <div className="overflow-hidden w-full">
        <div 
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-hide"
          style={{ 
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none'
          }}
          onScroll={checkScrollability}
        >
          {categories.map((category, index) => {
            const isActive = activeCategory === category.id;
            const isHovered = hoveredCategory === category.id;
            
            return (
              <motion.div
                key={category.id}
                data-category-id={category.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.3,
                  delay: index * 0.05
                }}
                className="flex-shrink-0"
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="button"
                    variant={isActive ? "default" : "outline"}
                    className={cn(
                      "border-zinc-200 flex flex-col gap-2 h-auto min-w-28 p-4 rounded-xl shadow-sm",
                      isActive 
                        ? "bg-black hover:bg-zinc-900 text-white shadow-md border-black" 
                        : "bg-white hover:bg-zinc-50 hover:border-zinc-300 hover:shadow-md text-zinc-800",
                    )}
                    onClick={() => onCategoryChange(category.id)}
                  >
                    {category.icon && (
                      <div className={cn(
                        "flex h-12 w-12 items-center justify-center mb-1 rounded-full mx-auto transition-all",
                        isActive 
                          ? "bg-zinc-800 text-white" 
                          : "bg-zinc-100 text-zinc-700"
                      )}>
                        {category.icon}
                      </div>
                    )}
                    
                    <span className="font-medium text-sm">
                      {category.name}
                    </span>
                    
                    {category.count !== undefined && (
                      <span className={cn(
                        "font-normal px-2 py-0.5 rounded-full text-xs mx-auto",
                        isActive 
                          ? "bg-white/20 text-white" 
                          : "bg-zinc-100 text-zinc-600"
                      )}>
                        {category.count}
                      </span>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 