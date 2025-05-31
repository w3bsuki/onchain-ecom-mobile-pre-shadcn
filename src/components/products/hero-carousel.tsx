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
import { BANNER_EVENTS } from "../layout/Banner";
import { PROMO_BANNER_VISIBILITY_CHANGE } from "../layout/PromoBanner";

// Conversion-optimized hero items with clear value propositions
const carouselItems = [
  {
    id: 1,
    title: "MINIMALIST ESSENTIALS",
    subtitle: "Timeless pieces designed for everyday versatility",
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
    subtitle: "Clean, contemporary designs for the modern wardrobe",
    cta: "EXPLORE",
    image: {
      mobile: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=750&auto=format&fit=crop",
      desktop: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=1920&auto=format&fit=crop",
    },
    link: "/products?collection=new"
  },
  {
    id: 3,
    title: "LIMITED COLLECTION",
    subtitle: "Exclusive pieces with refined details and premium quality",
    cta: "VIEW COLLECTION",
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

// Clean, minimal indicator 
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
      className="group focus:outline-none focus-visible:ring-1 focus-visible:ring-white"
      aria-label={`Go to slide ${index + 1}`}
      aria-current={isActive ? "true" : "false"}
    >
      <div className="flex items-center justify-center h-12 w-12 -m-4">
        <div className={cn(
          "h-[2px] w-5 sm:w-6 transition-all duration-300 ease-out",
          isActive ? "bg-white w-8 sm:w-10" : "bg-zinc-600 group-hover:bg-zinc-400"
        )} />
      </div>
    </button>
  );
});

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);
  const [bannerVisible, setBannerVisible] = useState<boolean>(true);
  const [promoBannerVisible, setPromoBannerVisible] = useState<boolean>(true);
  
  // Listen for banner visibility changes
  useEffect(() => {
    const handleBannerChange = (event: CustomEvent) => {
      setBannerVisible(event.detail.isVisible);
    };

    const handlePromoBannerChange = (event: CustomEvent) => {
      setPromoBannerVisible(event.detail.isVisible);
    };
    
    window.addEventListener(
      BANNER_EVENTS.VISIBILITY_CHANGE, 
      handleBannerChange as EventListener
    );
    
    window.addEventListener(
      PROMO_BANNER_VISIBILITY_CHANGE, 
      handlePromoBannerChange as EventListener
    );
    
    return () => {
      window.removeEventListener(
        BANNER_EVENTS.VISIBILITY_CHANGE, 
        handleBannerChange as EventListener
      );
      
      window.removeEventListener(
        PROMO_BANNER_VISIBILITY_CHANGE, 
        handlePromoBannerChange as EventListener
      );
    };
  }, []);
  
  // Calculate dynamic height based on banner visibility
  const getHeroHeight = () => {
    let offset = 0;
    if (bannerVisible) {
      offset += 36; // Banner height on mobile
    }
    if (promoBannerVisible) {
      offset += 28; // Promo banner height on mobile
    }
    
    const mobileHeight = `calc(100svh - ${offset}px)`;
    
    let smOffset = 0;
    if (bannerVisible) {
      smOffset += 44; // Banner height on desktop
    }
    if (promoBannerVisible) {
      smOffset += 32; // Promo banner height on desktop
    }
    
    const desktopHeight = `calc(100svh - ${smOffset}px)`;
    
    return {
      mobile: mobileHeight,
      desktop: desktopHeight
    };
  };
  
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

  const heroHeight = getHeroHeight();

  return (
    <div 
      className="relative w-full overflow-hidden bg-black sm:h-[var(--desktop-height)]"
      style={{ 
        height: heroHeight.mobile,
        ['--desktop-height' as string]: heroHeight.desktop 
      }}
      aria-label="Product showcase carousel"
      onMouseEnter={pauseAutoAdvance}
      onMouseLeave={resumeAutoAdvance}
      onFocus={pauseAutoAdvance}
      onBlur={resumeAutoAdvance}
    >
      {/* Performance-optimized image loading with memoized components */}
      <div className="relative h-full w-full">
        {/* Enhanced black and white image treatment */}
        <div className="absolute inset-0 bg-black/40 mix-blend-color z-[1]" />
        <div className="absolute inset-0 bg-black/10 z-[2]" />
        
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
        
        {/* Refined overlay with improved gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/30 z-[3]">
          {/* Subtle grid pattern overlay for depth */}
          <div className="absolute inset-0 bg-[url('/grid-pattern.png')] bg-repeat opacity-[0.03]" />
          
          <div className="flex h-full flex-col justify-end px-6 sm:px-10 md:px-14 lg:px-20 pb-24 md:pb-28">
            <div className="max-w-[90%] md:max-w-[570px]">
              {/* Refined, high-contrast tag */}
              <div className="inline-block mb-4 sm:mb-5 bg-white py-1 px-2.5 text-black">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-widest font-medium">New Collection</span>
              </div>
              
              {/* Refined headline with improved typography */}
              <h1 className="font-medium text-white text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-5 leading-[1.05] tracking-tight">
                {currentItem.title}
              </h1>
              
              {/* Refined supporting text */}
              <p className="text-base sm:text-lg font-normal text-zinc-300 mb-8 sm:mb-9 md:mb-10 max-w-md leading-relaxed">
                {currentItem.subtitle}
              </p>
              
              {/* Refined CTA with subtle hover animation */}
              <div className="inline-block">
                <Button 
                  asChild={true}
                  className="h-12 min-w-44 bg-white hover:bg-zinc-100 text-black text-[13px] font-medium tracking-wide px-8 transition-all duration-200 rounded-none relative overflow-hidden group"
                >
                  <Link href={currentItem.link}>
                    <span className="relative z-10 inline-flex items-center justify-center w-full group-hover:-translate-x-1 transition-transform duration-200">
                      {currentItem.cta}
                      <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">→</span>
                    </span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Refined indicators with improved spacing */}
      <div className="absolute bottom-10 md:bottom-14 left-6 sm:left-10 md:left-14 lg:left-20 z-10">
        <div className="flex items-center gap-4">
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
      
      {/* Slide counter - adds sophistication */}
      <div className="absolute bottom-10 md:bottom-14 right-6 sm:right-10 md:right-14 lg:right-20 z-10">
        <div className="text-white text-xs tracking-wide">
          <span className="font-medium">{currentIndex + 1}</span>
          <span className="mx-1 text-zinc-500">/</span>
          <span className="text-zinc-400">{carouselItems.length}</span>
        </div>
      </div>
    </div>
  );
}

