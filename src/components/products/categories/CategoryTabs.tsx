'use client';

import { useRef, useState, useEffect, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

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

// Memoized individual category button to prevent unnecessary re-renders
const CategoryButton = memo(({ 
  category, 
  isActive, 
  isVisible,
  onSelect 
}: { 
  category: Category; 
  isActive: boolean;
  isVisible: boolean;
  onSelect: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Skip rendering if not near the viewport to improve performance
  if (!isVisible) return <div className="flex-shrink-0 min-w-32 h-[150px]" />;

  return (
    <div
      className="flex-shrink-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <Button
          type="button"
          variant={isActive ? "default" : "outline"}
          className={cn(
            "relative border-zinc-200/80 flex flex-col gap-3 h-auto min-w-32 p-5 rounded-xl",
            isActive 
              ? "bg-black hover:bg-zinc-900 text-white border-black shadow-lg" 
              : "bg-white/90 backdrop-blur-sm hover:bg-white hover:border-zinc-300 hover:shadow-md text-zinc-800",
            "transition-all duration-300"
          )}
          onClick={onSelect}
        >
          {/* Subtle glow effect for active state - less resource intensive */}
          {isActive && (
            <div className="absolute inset-0 bg-black rounded-xl opacity-25 -z-10" />
          )}

          {category.icon && (
            <motion.div 
              className={cn(
                "flex h-14 w-14 items-center justify-center mb-2 rounded-full mx-auto transform transition-all",
                isActive 
                  ? "bg-zinc-800 text-white" 
                  : "bg-zinc-100 text-zinc-700"
              )}
              animate={{ 
                scale: isHovered ? 1.1 : 1,
                y: isHovered ? -2 : 0
              }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {category.icon}
            </motion.div>
          )}
          
          <motion.span 
            className="font-medium text-sm"
            animate={{ 
              scale: isHovered ? 1.05 : 1 
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {category.name}
          </motion.span>
          
          {category.count !== undefined && (
            <motion.span 
              className={cn(
                "font-normal px-2 py-1 rounded-full text-xs mx-auto",
                isActive 
                  ? "bg-white/20 text-white" 
                  : "bg-zinc-100 text-zinc-600"
              )}
              animate={{ 
                scale: isHovered ? 1.1 : 1 
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {category.count}
            </motion.span>
          )}
        </Button>
      </motion.div>
    </div>
  );
});

CategoryButton.displayName = 'CategoryButton';

// Main component with performance optimizations
const CategoryTabs = ({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}: CategoryTabsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visibleCategories, setVisibleCategories] = useState<Set<string>>(new Set([activeCategory]));
  
  // Viewport detection for virtualization
  const { ref: viewportRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });
  
  // Calculate scroll progress more efficiently with useCallback
  const updateScrollProgress = useCallback(() => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    const progress = maxScroll > 0 ? (scrollLeft / maxScroll) : 0;
    
    // Only update state if there's a meaningful change to avoid re-renders
    if (Math.abs(progress - scrollProgress) > 0.01) {
      setScrollProgress(progress);
    }
  }, [scrollProgress]);
  
  // Check scrollability with debouncing to avoid excessive calculations
  const checkScrollability = useCallback(() => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const newCanScrollLeft = scrollLeft > 5;
    const newCanScrollRight = scrollLeft + clientWidth < scrollWidth - 5;
    
    // Only update states if there's a change to avoid re-renders
    if (newCanScrollLeft !== canScrollLeft) {
      setCanScrollLeft(newCanScrollLeft);
    }
    
    if (newCanScrollRight !== canScrollRight) {
      setCanScrollRight(newCanScrollRight);
    }
    
    updateScrollProgress();
    updateVisibleCategories();
  }, [canScrollLeft, canScrollRight, updateScrollProgress]);

  // Update which categories are visible in the viewport
  const updateVisibleCategories = useCallback(() => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const containerRect = container.getBoundingClientRect();
    const visibleIds = new Set<string>();

    // Check which categories are in the viewport
    categories.forEach(category => {
      const element = container.querySelector(`[data-category-id="${category.id}"]`);
      if (element) {
        const elementRect = element.getBoundingClientRect();
        // Check if element is visible or near the viewport
        if (
          elementRect.right >= containerRect.left - 200 && 
          elementRect.left <= containerRect.right + 200
        ) {
          visibleIds.add(category.id);
        }
      }
    });

    // Always include active category
    visibleIds.add(activeCategory);
    
    setVisibleCategories(visibleIds);
  }, [categories, activeCategory]);

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
    
    // Apply smoother scrolling with longer duration
    requestAnimationFrame(() => {
      scrollContainer.scrollTo({
        left: targetScrollPosition,
        behavior: 'smooth'
      });
      
      // Update scroll indicators after animation
      setTimeout(() => {
        checkScrollability();
        updateVisibleCategories();
      }, 600); // Longer timeout for slower animations
    });
  }, [activeCategory, checkScrollability, updateVisibleCategories]);

  // Setup scroll listeners and resize observer for responsive behavior
  useEffect(() => {
    if (!scrollRef.current) return;
    
    const scrollElement = scrollRef.current;
    
    // Initial check
    checkScrollability();
    
    // Optimize scroll event listener with passive option
    const handleScroll = () => {
      // Use requestAnimationFrame to throttle scroll events
      requestAnimationFrame(checkScrollability);
    };
    
    // Create resize observer instead of window resize event
    const resizeObserver = new ResizeObserver(() => {
      checkScrollability();
    });
    
    scrollElement.addEventListener('scroll', handleScroll, { passive: true });
    resizeObserver.observe(scrollElement);
    
    // Cleanup function
    return () => {
      scrollElement.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
    };
  }, [checkScrollability]);

  // Optimized scroll handler with reduced recalculation and slower scrolling
  const handleScroll = useCallback((direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    // Reduced scroll amount for smoother, slower scrolling
    const scrollAmount = direction === 'left' ? -250 : 250;
    scrollRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
    
    // Update indicators after animation (longer delay for smoother animation)
    setTimeout(checkScrollability, 600);
  }, [checkScrollability]);

  // If categories are not visible (e.g., scrolled out of view) render nothing
  if (!inView) return <div ref={viewportRef} className="h-2 w-full" />;

  return (
    <div ref={viewportRef} className="relative w-full mb-10">
      {/* Optimized scroll progress indicator with reduced motion */}
      <div className="absolute -bottom-4 left-0 right-0 h-1 bg-zinc-100 rounded-full overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-black origin-left"
          style={{ width: "100%" }}
          animate={{ 
            scaleX: scrollProgress
          }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Scroll buttons with optimized animations */}
      <AnimatePresence>
        {canScrollLeft && (
          <motion.div 
            className="absolute bottom-0 left-0 top-0 flex items-center z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute bg-gradient-to-r from-white h-full to-transparent w-20 pointer-events-none" />
            <Button 
              variant="outline" 
              size="icon"
              className="absolute bg-white/90 backdrop-blur-sm border-zinc-200/80 h-10 hover:bg-white hover:border-zinc-300 hover:shadow-md items-center justify-center left-2 rounded-full shadow-sm text-zinc-800 top-1/2 transform -translate-y-1/2 w-10 z-20"
              onClick={() => handleScroll('left')}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Scroll left</span>
            </Button>
          </motion.div>
        )}

        {canScrollRight && (
          <motion.div
            className="absolute bottom-0 right-0 top-0 flex items-center z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute bg-gradient-to-l from-white h-full to-transparent w-20 pointer-events-none" />
            <Button 
              variant="outline" 
              size="icon"
              className="absolute bg-white/90 backdrop-blur-sm border-zinc-200/80 h-10 hover:bg-white hover:border-zinc-300 hover:shadow-md items-center justify-center right-2 rounded-full shadow-sm text-zinc-800 top-1/2 transform -translate-y-1/2 w-10 z-20"
              onClick={() => handleScroll('right')}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Scroll right</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main categories container with optimized scrolling */}
      <div className="overflow-hidden w-full">
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-hide scrolling-touch"
          onScroll={() => requestAnimationFrame(checkScrollability)}
          role="tablist"
          aria-label="Product categories"
        >
          {categories.map((category) => {
            const isActive = activeCategory === category.id;
            const isVisible = visibleCategories.has(category.id);
            
            return (
              <div
                key={category.id}
                data-category-id={category.id}
                role="tab"
                aria-selected={isActive ? "true" : "false"}
                aria-controls={`panel-${category.id}`}
                tabIndex={isActive ? 0 : -1}
              >
                <CategoryButton 
                  category={category}
                  isActive={isActive}
                  isVisible={isVisible}
                  onSelect={() => onCategoryChange(category.id)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

CategoryTabs.displayName = 'CategoryTabs';

export default memo(CategoryTabs);