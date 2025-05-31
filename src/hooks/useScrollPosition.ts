import { useState, useEffect } from 'react';
import type { RefObject } from 'react';

interface UseScrollPositionOptions {
  threshold?: number;
  elementRef?: RefObject<HTMLElement>;
}

interface UseScrollPositionReturn {
  isScrolled: boolean;
  scrollY: number;
  scrollDirection: 'up' | 'down' | null;
}

export function useScrollPosition({ 
  threshold = 0, 
  elementRef 
}: UseScrollPositionOptions = {}): UseScrollPositionReturn {
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Set scroll direction
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up');
      }
      
      // Set general scroll state
      setScrollY(currentScrollY);
      setLastScrollY(currentScrollY);
      
      // Check if we've scrolled past a specific element (if provided)
      if (elementRef?.current) {
        const elementBottom = elementRef.current.getBoundingClientRect().bottom;
        setIsScrolled(elementBottom <= threshold);
      } else {
        // Otherwise just check if we've scrolled past the threshold
        setIsScrolled(currentScrollY > threshold);
      }
    };

    // Set initial value
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold, elementRef, lastScrollY]);

  return { isScrolled, scrollY, scrollDirection };
} 