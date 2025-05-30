'use client';

import { useRef, useState, useEffect, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CategoryButton } from "@/components/ui/CategoryButton";

interface Category {
  id: string;
  name: string;
  icon?: React.ReactNode;
  count?: number;
}

interface CategoryGridProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  className?: string;
}

// Scroll control buttons component
const ScrollControls = memo(({ 
  onScroll, 
  canScrollLeft, 
  canScrollRight 
}: { 
  onScroll: (direction: 'left' | 'right') => void,
  canScrollLeft: boolean,
  canScrollRight: boolean
}) => {
  return (
    <>
      {/* Left scroll control */}
      {canScrollLeft && (
        <Button
          size="icon"
          variant="outline"
          className="absolute -left-4 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-white shadow-md sm:left-0"
          onClick={() => onScroll('left')}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Scroll left</span>
        </Button>
      )}
      
      {/* Right scroll control */}
      {canScrollRight && (
        <Button
          size="icon"
          variant="outline"
          className="absolute -right-4 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-white shadow-md sm:right-0"
          onClick={() => onScroll('right')}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Scroll right</span>
        </Button>
      )}
    </>
  );
});

ScrollControls.displayName = 'ScrollControls';

// Enhanced individual category item component using the new shadcn-style CategoryButton
const CategoryGridItem = memo(({ 
  category, 
  isActive, 
  onSelect 
}: { 
  category: Category; 
  isActive: boolean;
  onSelect: () => void;
}) => {
  return (
    <CategoryButton
      icon={category.icon}
      name={category.name}
      count={category.count}
      isActive={isActive}
      onClick={onSelect}
      aria-pressed={isActive}
      size="md"
      className="h-full w-full"
    />
  );
});

CategoryGridItem.displayName = 'CategoryGridItem';

const CategoryGrid = ({
  categories,
  activeCategory,
  onCategoryChange,
  className
}: CategoryGridProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Optimized scroll check with debounce
  const checkScrollability = useCallback(() => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  }, []);

  // Detect mobile/desktop for layout with reduced updates
  useEffect(() => {
    const checkIsMobile = () => {
      const isMobileView = window.innerWidth < 768;
      if (isMobileView !== isMobile) {
        setIsMobile(isMobileView);
      }
    };
    
    checkIsMobile();
    
    // Use resize observer for better performance
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(checkIsMobile);
    });
    
    resizeObserver.observe(document.body);
    return () => resizeObserver.disconnect();
  }, [isMobile]);

  // Scroll to active category when it changes
  useEffect(() => {
    if (!scrollRef.current || !activeCategory) return;
    
    const activeElement = scrollRef.current.querySelector(`[data-category-id="${activeCategory}"]`) as HTMLElement;
    if (!activeElement) return;
    
    const scrollContainer = scrollRef.current;
    const scrollContainerWidth = scrollContainer.clientWidth;
    const activeElementWidth = activeElement.offsetWidth;
    const activeElementLeft = activeElement.offsetLeft;
    
    // Calculate center position
    const targetScrollPosition = activeElementLeft - (scrollContainerWidth / 2) + (activeElementWidth / 2);
    
    // Apply smooth scrolling only when visible
    if (document.visibilityState === 'visible') {
      scrollContainer.scrollTo({
        left: targetScrollPosition,
        behavior: 'smooth'
      });
    } else {
      scrollContainer.scrollLeft = targetScrollPosition;
    }
    
    // Update scroll indicators
    checkScrollability();
  }, [activeCategory, checkScrollability]);

  // Setup scroll listeners with optimized event handling
  useEffect(() => {
    if (!scrollRef.current) return;
    
    const scrollElement = scrollRef.current;
    
    // Initial check
    checkScrollability();
    
    // Use a more efficient scroll handler with passive option
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(checkScrollability, 100);
    };
    
    // Use ResizeObserver instead of window resize
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(checkScrollability);
    });
    
    scrollElement.addEventListener('scroll', handleScroll, { passive: true });
    resizeObserver.observe(scrollElement);
    
    return () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollElement.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
    };
  }, [checkScrollability]);

  // Handle scroll button clicks
  const handleScroll = useCallback((direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const scrollAmount = direction === 'left' ? -250 : 250;
    scrollRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
    
    // Update indicators
    setTimeout(checkScrollability, 300);
  }, [checkScrollability]);
  
  return (
    <div className={cn("mb-4 mt-2 relative w-full", className)}>
      {/* Scroll Controls */}
      <ScrollControls 
        onScroll={handleScroll}
        canScrollLeft={canScrollLeft}
        canScrollRight={canScrollRight}
      />
      
      {/* Horizontal Scrollable Category List */}
      <div 
        ref={scrollRef}
        className="flex gap-3 no-scrollbar overflow-x-auto pb-2 scroll-smooth touch-pan-x"
        onScroll={() => requestAnimationFrame(checkScrollability)}
      >
        {categories.map((category) => (
          <div 
            key={category.id}
            data-category-id={category.id}
            className={cn(
              "flex-shrink-0",
              isMobile
                ? "min-w-[90px] w-[90px]" 
                : "min-w-[130px] w-[130px]"
            )}
          >
            <CategoryGridItem
              category={category}
              isActive={activeCategory === category.id}
              onSelect={() => onCategoryChange(category.id)}
            />
          </div>
        ))}
      </div>
      
      {/* Indicator dots */}
      {categories.length > 4 && (
        <div className="flex gap-1.5 justify-center mt-3">
          {categories.map((category) => (
            <button
              key={`indicator-${category.id}`}
              type="button"
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "h-1.5 rounded-full transition-colors",
                activeCategory === category.id 
                  ? "bg-black w-6" 
                  : "bg-zinc-200 hover:bg-zinc-300 w-1.5"
              )}
              aria-label={`Go to ${category.name} category`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

CategoryGrid.displayName = 'CategoryGrid';

export default memo(CategoryGrid);
