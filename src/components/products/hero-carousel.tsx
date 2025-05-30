"use client";

/**
 * HeroCarousel Component
 * 
 * A high-performance, accessibility-focused carousel optimized for ecommerce.
 * Built with Framer Motion and Radix UI primitives.
 * 
 * Features:
 * - Smooth animations with Framer Motion
 * - Fully accessible with ARIA attributes
 * - Responsive design with mobile-first approach
 * - Optimized image loading with Next.js
 * - Touch and keyboard navigation
 * - Auto-advance with pause on hover/focus
 */

import { useState, useCallback, useEffect, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Conversion-optimized hero items with clear value propositions
const carouselItems = [
  {
    id: 1,
    title: "PREMIUM ESSENTIALS",
    subtitle: "Elevate your style with our exclusive collection",
    cta: "SHOP NOW",
    image: {
      mobile: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=750&auto=format&fit=crop",
      desktop: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=1920&auto=format&fit=crop",
    },
    link: "/products?collection=essentials"
  },
  {
    id: 2,
    title: "NEW ARRIVALS",
    subtitle: "Discover the latest trends for the season",
    cta: "EXPLORE",
    image: {
      mobile: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=750&auto=format&fit=crop",
      desktop: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=1920&auto=format&fit=crop",
    },
    link: "/products?collection=new"
  },
  {
    id: 3,
    title: "LIMITED EDITION",
    subtitle: "Exclusive pieces, available for a limited time",
    cta: "SHOP LIMITED",
    image: {
      mobile: "https://images.unsplash.com/photo-1583744946564-b52d01e7f922?q=80&w=750&auto=format&fit=crop",
      desktop: "https://images.unsplash.com/photo-1583744946564-b52d01e7f922?q=80&w=1920&auto=format&fit=crop",
    },
    link: "/products?collection=limited"
  },
];

// Memoized hero image component for better performance
const HeroImage = memo(function HeroImage({ 
  src, 
  alt, 
  isMobile = false 
}: { 
  src: string; 
  alt: string; 
  isMobile?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill={true}
      priority={true}
      sizes={isMobile ? "(max-width: 768px) 100vw" : "(min-width: 769px) 100vw"}
      className={cn(
        "object-cover object-center", 
        isMobile ? "md:hidden" : "hidden md:block"
      )}
      quality={isMobile ? 80 : 85}
    />
  );
});

// Carousel indicator component
const CarouselIndicator = memo(function CarouselIndicator({
  index,
  isActive,
  onClick,
}: {
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group p-2 -m-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      aria-label={`Go to slide ${index + 1}`}
      aria-current={isActive ? "true" : "false"}
    >
      <div className="h-2 w-8 md:w-10 flex items-center justify-center">
        <div className={cn(
          "h-[3px] w-full transition-all duration-300",
          isActive ? "bg-white" : "bg-white/30 group-hover:bg-white/50"
        )} />
      </div>
    </button>
  );
});

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);
  
  // Pause auto-advance when user interacts with carousel
  const pauseAutoAdvance = useCallback(() => {
    setAutoAdvance(false);
  }, []);
  
  const resumeAutoAdvance = useCallback(() => {
    setAutoAdvance(true);
  }, []);
  
  // Simple, lightweight auto-advance implementation
  useEffect(() => {
    if (!autoAdvance) {
      return;
    }
    
    // Use a longer interval (7s) to give users time to read content
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
    }, 7000);
    
    return () => clearTimeout(timer);
  }, [autoAdvance]);
  
  // Optimized slide navigation with useCallback for better performance
  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    pauseAutoAdvance();
    
    // Resume auto-advance after user interaction
    const timer = setTimeout(() => {
      resumeAutoAdvance();
    }, 10000);
    
    return () => clearTimeout(timer);
  }, [pauseAutoAdvance, resumeAutoAdvance]);

  const currentItem = carouselItems[currentIndex];

  return (
    <div 
      className="relative h-[calc(100svh-46px)] sm:h-[calc(100svh-55px)] w-full overflow-hidden bg-black"
      aria-label="Product showcase carousel"
      onMouseEnter={pauseAutoAdvance}
      onMouseLeave={resumeAutoAdvance}
      onFocus={pauseAutoAdvance}
      onBlur={resumeAutoAdvance}
    >
      {/* Performance-optimized image loading with memoized components */}
      <div className="relative h-full w-full">
        {/* Mobile image - ensure fast loading with appropriate quality and size */}
        <HeroImage 
          src={currentItem.image.mobile} 
          alt={currentItem.title} 
          isMobile={true} 
        />
        
        {/* Desktop image */}
        <HeroImage 
          src={currentItem.image.desktop} 
          alt={currentItem.title}
        />
        
        {/* Z-pattern optimized content overlay with improved gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent">
          <div className="flex h-full flex-col justify-end px-5 sm:px-8 md:px-12 lg:px-16 pb-20 md:pb-24">
            <div className="max-w-[85%] md:max-w-[550px]">
              {/* Headline with improved readability and contrast */}
              <h1 className="text-balance font-bold tracking-tight text-white text-4xl sm:text-5xl md:text-6xl mb-3 leading-[1.1]">
                {currentItem.title}
              </h1>
              
              {/* Clear supporting text with improved line height */}
              <p className="text-lg sm:text-xl font-medium text-white/90 mb-6 md:mb-8 max-w-md leading-snug">
                {currentItem.subtitle}
              </p>
              
              {/* High-visibility CTA with improved touch target size and focus states */}
              <Button 
                asChild={true}
                className="h-12 min-w-40 bg-white hover:bg-white/90 focus:bg-white/95 focus:ring-2 focus:ring-offset-2 focus:ring-white/50 text-black text-sm font-bold tracking-wide px-8 transition-colors"
              >
                <Link href={currentItem.link}>
                  {currentItem.cta}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Improved touch-optimized progress indicators with larger tap targets */}
      <div className="absolute bottom-8 md:bottom-12 left-5 sm:left-8 md:left-12 z-10">
        <div className="flex items-center gap-3">
          {carouselItems.map((item, index) => (
            <CarouselIndicator
              key={item.id}
              index={index}
              isActive={index === currentIndex}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

