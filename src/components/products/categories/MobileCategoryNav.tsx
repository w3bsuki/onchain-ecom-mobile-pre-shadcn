'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  href: string;
  icon: React.ReactNode;
  count?: number;
}

interface MobileCategoryNavProps {
  categories: Category[];
  activeCategory?: string;
  className?: string;
  onSelectCategory?: (id: string) => void;
  showCounts?: boolean;
}

/**
 * Optimized horizontally scrollable category navigation for mobile
 * - Improved performance with simplified styles and fewer animations
 * - Larger touch targets and better spacing
 * - Reduced motion for smoother scrolling
 */
export function MobileCategoryNav({
  categories,
  activeCategory,
  className,
  onSelectCategory,
  showCounts = true
}: MobileCategoryNavProps) {
  const [showShadows, setShowShadows] = useState(false);
  const [leftShadowVisible, setLeftShadowVisible] = useState(false);
  const [rightShadowVisible, setRightShadowVisible] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Optimized scroll handling with debounce
  const updateScrollState = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const hasHorizontalScroll = scrollWidth > clientWidth;
    
    setShowShadows(hasHorizontalScroll);
    setLeftShadowVisible(scrollLeft > 5);
    setRightShadowVisible(scrollLeft + clientWidth < scrollWidth - 5);
  };

  // Setup scroll handling with optimized listener
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;
    
    // Initial check
    updateScrollState();
    
    // Throttled scroll handler for better performance
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateScrollState, 100);
    };

    // Use ResizeObserver instead of window resize event
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updateScrollState);
    });
    
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    resizeObserver.observe(scrollContainer);
    
    return () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollContainer.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
    };
  }, []);

  // Scroll to active category
  useEffect(() => {
    if (!activeCategory || !scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const activeItem = container.querySelector(`[data-category="${activeCategory}"]`);
    
    if (activeItem) {
      const itemLeft = (activeItem as HTMLElement).offsetLeft;
      const itemWidth = (activeItem as HTMLElement).offsetWidth;
      const containerWidth = container.offsetWidth;
      
      // Center the active item - only use smooth scrolling when visible
      const scrollOptions = {
        left: itemLeft - (containerWidth / 2) + (itemWidth / 2),
        behavior: document.visibilityState === 'visible' ? 'smooth' as ScrollBehavior : 'auto' as ScrollBehavior
      };
      
      container.scrollTo(scrollOptions);
    }
  }, [activeCategory]);

  return (
    <div className={cn("relative mt-1", className)}>
      {/* Left shadow - simplified with fewer calculations */}
      {showShadows && leftShadowVisible && (
        <div 
          className="absolute bg-gradient-to-r bottom-0 from-white left-0 pointer-events-none to-transparent top-0 w-6 z-10"
          aria-hidden="true"
        />
      )}
      
      {/* Right shadow - simplified with fewer calculations */}
      {showShadows && rightShadowVisible && (
        <div 
          className="absolute bg-gradient-to-l bottom-0 from-white pointer-events-none right-0 to-transparent top-0 w-6 z-10"
          aria-hidden="true"
        />
      )}

      {/* Scrollable container with optimized touch handling */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-3 hide-scrollbar items-center overflow-x-auto px-1 pb-2 pt-1 scroll-smooth touch-pan-x"
      >
        {categories.map((category) => {
          const isActive = category.id === activeCategory;
          
          // Simplified category item
          const categoryContent = (
            <>
              <div className={cn(
                "bg-zinc-100 flex h-10 items-center justify-center rounded-full text-zinc-700 w-10",
                isActive && "bg-black text-white"
              )}>
                {category.icon}
              </div>
              
              <span className={cn(
                "font-medium text-center text-xs truncate w-full",
                isActive ? "text-black" : "text-zinc-700"
              )}>
                {category.name}
              </span>
              
              {showCounts && category.count !== undefined && (
                <span className={cn(
                  "px-1.5 py-0.5 rounded-full text-[10px]",
                  isActive ? "bg-zinc-800 text-white" : "bg-zinc-100 text-zinc-500"
                )}>
                  {category.count}
                </span>
              )}
            </>
          );
          
          return (
            <div 
              key={category.id}
              data-category={category.id}
              className="flex-shrink-0"
            >
              {onSelectCategory ? (
                <button
                  type="button"
                  onClick={() => onSelectCategory(category.id)}
                  className={cn(
                    "flex flex-col gap-1 items-center min-w-[65px] px-1.5 py-1",
                    isActive ? "opacity-100" : "opacity-80 hover:opacity-100"
                  )}
                >
                  {categoryContent}
                </button>
              ) : (
                <Link
                  href={category.href}
                  className={cn(
                    "flex flex-col gap-1 items-center min-w-[65px] px-1.5 py-1",
                    isActive ? "opacity-100" : "opacity-80 hover:opacity-100"
                  )}
                >
                  {categoryContent}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
