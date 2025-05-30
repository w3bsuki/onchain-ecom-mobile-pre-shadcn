'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';

// Custom event name for banner visibility changes
export const PROMO_BANNER_VISIBILITY_CHANGE = 'promoBannerVisibilityChange';

// Urban-oriented promo messages with links
const PROMO_ITEMS = [
  {
    message: "FREE SHIPPING ON ALL ORDERS OVER $50",
    link: "/shipping-policy"
  },
  {
    message: "UP TO 50% OFF STREETWEAR COLLECTION",
    link: "/products?collection=streetwear"
  },
  {
    message: "NEW URBAN STYLES JUST DROPPED",
    link: "/products?collection=new"
  }
];

// Memoized close button component
const CloseButton = memo(function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button 
      type="button"
      onClick={onClick}
      className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center text-white/80 hover:text-white transition-colors"
      aria-label="Close promo banner"
    >
      <X size={8} className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
    </button>
  );
});

// Memoized promo item component for better performance
const PromoItem = memo(function PromoItem({ message, link }: { message: string; link: string }) {
  return (
    <div className="flex items-center space-x-1.5 sm:space-x-2">
      <div className="text-center text-[8px] font-medium uppercase tracking-wider text-white sm:text-[10px]">
        {message}
      </div>
      
      <Link 
        href={link}
        className="rounded-sm bg-white px-1.5 py-0.5 text-[8px] font-medium text-black hover:bg-white/90 transition-colors sm:px-2 sm:text-[10px]"
      >
        SHOP
      </Link>
    </div>
  );
});

export function PromoBanner() {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [currentPromo, setCurrentPromo] = useState<number>(0);

  // Optimize close handler with useCallback
  const handleClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Rotate through promo messages
  useEffect(() => {
    if (!isVisible) {
      return;
    }
    
    const interval = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % PROMO_ITEMS.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isVisible]);

  // Dispatch custom event when banner visibility changes
  useEffect(() => {
    const event = new CustomEvent(PROMO_BANNER_VISIBILITY_CHANGE, { 
      detail: { isVisible } 
    });
    window.dispatchEvent(event);
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative z-[90] w-full border-b border-zinc-800 bg-zinc-900">
      <div className="mx-auto flex h-6 sm:h-7 max-w-7xl items-center justify-center px-2 sm:px-3">
        <div className="flex-1 md:flex-none" />
        
        <PromoItem 
          message={PROMO_ITEMS[currentPromo].message} 
          link={PROMO_ITEMS[currentPromo].link} 
        />
        
        <div className="flex flex-1 justify-end">
          <CloseButton onClick={handleClose} />
        </div>
      </div>
    </div>
  );
} 