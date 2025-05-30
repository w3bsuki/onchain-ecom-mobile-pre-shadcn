'use client';

import { memo } from 'react';
import Link from 'next/link';

// Extracted for better performance - no re-renders when component is static
const BannerContent = memo(function BannerContent() {
  return (
    <div className="flex h-7 sm:h-9 items-center justify-center px-3 sm:px-4">
      {/* Subtle pulse animation on the icon */}
      <span className="mr-1.5 animate-pulse text-white">⚡</span>
      
      <p className="text-[11px] font-bold uppercase tracking-wider text-white sm:text-sm">
        FLASH SALE 24 HOURS ONLY
      </p>
      
      {/* High-contrast CTA with hover state */}
      <Link 
        href="/products?collection=sale" 
        className="ml-2 rounded-sm bg-white hover:bg-white/90 px-1.5 py-0.5 text-[9px] font-medium text-black transition-colors sm:px-2 sm:text-[10px]"
      >
        SHOP NOW
      </Link>
    </div>
  );
});

export function Banner() {
  // Using a fixed position container with proper z-index
  return (
    <div className="bg-black fixed left-0 top-0 w-full z-[100]">
      <BannerContent />
    </div>
  );
}

// Create a custom event for banner visibility changes
const BANNER_VISIBILITY_CHANGE = 'bannerVisibilityChange';

// Export the event name as a constant
export const BANNER_EVENTS = {
  VISIBILITY_CHANGE: BANNER_VISIBILITY_CHANGE,
};
