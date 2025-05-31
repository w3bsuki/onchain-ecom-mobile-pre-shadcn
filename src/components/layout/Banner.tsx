'use client';

import { memo, useState, useEffect } from 'react';
import { X } from 'lucide-react';

// Create a custom event for banner visibility changes
const BANNER_VISIBILITY_CHANGE = 'bannerVisibilityChange';

// Export the event name as a constant
export const BANNER_EVENTS = {
  VISIBILITY_CHANGE: BANNER_VISIBILITY_CHANGE,
};

// Extracted for better performance - no re-renders when component is static
const BannerContent = memo(function BannerContent({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-9 sm:h-11 items-center justify-between px-4 sm:px-8 lg:px-12 relative bg-black border-b border-zinc-800">
      {/* Empty div for perfect three-column layout */}
      <div className="w-6 sm:w-8" />
      
      {/* Refined, perfectly centered announcement text */}
      <div className="flex items-center justify-center">
        <span className="text-zinc-100 text-[11px] sm:text-xs tracking-wide">
          <span className="font-semibold uppercase tracking-widest">Free worldwide shipping</span>
          <span className="mx-2 text-zinc-500">•</span>
          <span className="font-normal">On all orders over $150</span>
        </span>
      </div>
      
      {/* Refined close button */}
      <div className="flex justify-end w-6 sm:w-8">
        <button
          type="button"
          onClick={onClose}
          className="flex h-5 w-5 items-center justify-center text-zinc-500 hover:text-white transition-colors"
          aria-label="Close announcement"
        >
          <X size={13} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
});

export function Banner() {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  
  // Dispatch custom event when banner visibility changes
  useEffect(() => {
    const event = new CustomEvent(BANNER_VISIBILITY_CHANGE, { 
      detail: { isVisible } 
    });
    window.dispatchEvent(event);
  }, [isVisible]);
  
  if (!isVisible) {
    return null;
  }
  
  // Using a fixed position container with proper z-index
  return (
    <div className="fixed left-0 top-0 w-full z-[100]">
      <BannerContent onClose={() => setIsVisible(false)} />
    </div>
  );
}
