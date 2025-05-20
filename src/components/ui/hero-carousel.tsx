"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingBag, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Brand colors using modern color palette
const brandColors = {
  primary: "#18181b", // Zinc-900 - primary brand color
  secondary: "#3f3f46", // Zinc-700
  accent: "#f43f5e", // Rose-500 - vibrant accent
  light: "#f4f4f5", // Zinc-100
  white: "#ffffff" // White
};

// Enhanced carousel items with better images, more engaging content
const carouselItems = [
  {
    id: 1,
    title: "New Arrivals",
    subtitle: "Summer 2025 Collection",
    description: "Discover our latest drops with sustainable materials and innovative designs",
    cta: "Shop New Arrivals",
    secondaryCta: "Watch Lookbook",
    image: {
      mobile: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1080&auto=format&fit=crop",
      desktop: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1920&auto=format&fit=crop",
    },
    link: "/products?collection=new-arrivals",
    accent: brandColors.accent,
    tags: ["New", "Trending"]
  },
  {
    id: 2,
    title: "Summer Essentials",
    subtitle: "Limited Edition Series",
    description: "Elevate your summer wardrobe with our curated collection of seasonal must-haves",
    cta: "Explore Collection",
    secondaryCta: "View Lookbook",
    image: {
      mobile: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1080&auto=format&fit=crop",
      desktop: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1920&auto=format&fit=crop",
    },
    link: "/products?collection=summer-essentials",
    accent: brandColors.accent,
    tags: ["Limited", "Bestseller"]
  },
  {
    id: 3,
    title: "Sustainable Edit",
    subtitle: "Eco-Conscious Collection",
    description: "Fashion that looks good and does good, with 100% recycled materials",
    cta: "Shop Sustainable",
    secondaryCta: "Learn More",
    image: {
      mobile: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=1080&auto=format&fit=crop",
      desktop: "https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?q=80&w=1920&auto=format&fit=crop",
    },
    link: "/products?collection=sustainable",
    accent: brandColors.accent,
    tags: ["Eco-Friendly", "Conscious"]
  },
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const currentItem = carouselItems[currentIndex];

  // Auto-advance slides with optimized interval
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((current) =>
        current === carouselItems.length - 1 ? 0 : current + 1
      );
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Handle touch events for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 150) {
      // Swipe left
      nextSlide();
    }

    if (touchEnd - touchStart > 150) {
      // Swipe right
      prevSlide();
    }
  };

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((current) =>
      current === carouselItems.length - 1 ? 0 : current + 1
    );
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((current) =>
      current === 0 ? carouselItems.length - 1 : current - 1
    );
  };

  return (
    <section 
      className="relative w-full overflow-hidden" 
      aria-label="Featured Collections"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Mobile Hero (Optimized for mobile-first approach) */}
      <div className="relative block md:hidden" aria-label={`Mobile hero: ${currentItem.title}`}>
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="relative h-[80vh] w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
            <Image
              src={currentItem.image.mobile}
              alt={`${currentItem.title} - ${currentItem.subtitle}`}
              fill
              sizes="100vw"
              className="object-cover object-center brightness-95"
              priority
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEtAJJOeqDJgAAAABJRU5ErkJggg=="
            />
            <div className="absolute bottom-0 left-0 right-0 z-10 p-8 pb-12">
              <div className="mx-auto max-w-xl">
                <div className="mb-6 flex flex-wrap gap-2">
                  {currentItem.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-white/20 text-white backdrop-blur-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h1 className="font-extrabold text-4xl leading-tight tracking-tight text-white mb-2">
                    {currentItem.title}
                    <span className="block text-xl font-medium mt-1 text-white/80">
                      {currentItem.subtitle}
                    </span>
                  </h1>

                  <p className="text-base text-white/80 mb-6 max-w-lg">
                    {currentItem.description}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-3">
                    <Button
                      asChild
                      size="lg"
                      className="bg-white hover:bg-white/90 text-black rounded-full"
                    >
                      <Link href={currentItem.link}>
                        {currentItem.cta}
                        <ShoppingBag className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="text-white border-white/20 bg-transparent backdrop-blur-sm hover:bg-white/10 rounded-full"
                    >
                      <Link href={currentItem.link.replace('?collection=', '/lookbook?collection=')}>
                        {currentItem.secondaryCta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Desktop Hero */}
      <div className="hidden md:block" aria-label={`Desktop hero: ${currentItem.title}`}>
        <div className="grid h-[650px] grid-cols-12">
          <motion.div
            key={`text-${currentIndex}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="col-span-5 flex items-center relative bg-gradient-to-br from-zinc-50 to-white px-12 lg:px-16"
          >
            <div 
              className="absolute bottom-0 left-0 w-full h-1" 
              style={{ background: currentItem.accent }}
            />
            
            <div className="max-w-xl">
              <div className="mb-6 flex flex-wrap gap-2">
                {currentItem.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-white border-zinc-200 text-zinc-800">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-zinc-900 mb-4">
                {currentItem.title}
                <span className="block text-2xl lg:text-3xl font-normal mt-2 text-zinc-500">
                  {currentItem.subtitle}
                </span>
              </h1>
              
              <p className="text-lg text-zinc-600 mb-8 max-w-md">
                {currentItem.description}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-white"
                >
                  <Link href={currentItem.link}>
                    {currentItem.cta}
                    <ShoppingBag className="ml-3 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-zinc-300 text-zinc-900 hover:bg-zinc-100"
                >
                  <Link href={currentItem.link.replace('?collection=', '/lookbook?collection=')}>
                    {currentItem.secondaryCta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div
            key={`image-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="relative col-span-7 h-full"
          >
            <Image
              src={currentItem.image.desktop}
              alt={`${currentItem.title} - ${currentItem.subtitle}`}
              fill
              sizes="(min-width: 768px) 58vw"
              className="object-cover object-center"
              priority
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAEtAJJOeqDJgAAAABJRU5ErkJggg=="
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/20 to-transparent w-[10%]" />
          </motion.div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2 z-20">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsAutoPlaying(false);
              setCurrentIndex(index);
            }}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              index === currentIndex 
                ? "w-8 bg-white" 
                : "w-2 bg-white/50 hover:bg-white/70"
            )}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentIndex ? "true" : "false"}
          />
        ))}
      </div>

      {/* Arrow Navigation */}
      <div className="hidden sm:block">
        <Button
          onClick={prevSlide}
          size="icon"
          variant="secondary"
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 shadow-md hover:bg-white hover:shadow-lg z-20"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          onClick={nextSlide}
          size="icon"
          variant="secondary"
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 shadow-md hover:bg-white hover:shadow-lg z-20"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </section>
  );
} 