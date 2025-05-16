'use client';

import { useEffect, useState } from 'react';

// Create a custom event for banner visibility changes
const BANNER_VISIBILITY_CHANGE = 'bannerVisibilityChange';

export function Banner() {
  const [isVisible, setIsVisible] = useState(true);
  const messages = [
    "GET 10% OFF WITH CODE \"INDECISIVE\"",
    "FREE SHIPPING ON ORDERS OVER $100",
    "NEW COLLECTION AVAILABLE NOW"
  ];
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className="fixed left-0 top-0 z-50 flex h-6 w-full items-center justify-between bg-black shadow-sm">
      <div className="flex-1" />
      <div className="flex h-full items-center justify-center overflow-hidden">
        <div key={currentMessage} className="animate-fadeIn px-4 text-center text-xs font-medium tracking-wider text-white sm:text-sm">
          {messages[currentMessage]}
        </div>
      </div>
      <div className="flex flex-1 justify-end pr-2">
        <button 
          type="button"
          onClick={() => setIsVisible(false)}
          className="text-xs text-white opacity-80 transition-opacity hover:opacity-100"
          aria-label="Close banner"
        >
          ×
        </button>
      </div>
    </div>
  );
}

// Export the event name as a constant
export const BANNER_EVENTS = {
  VISIBILITY_CHANGE: BANNER_VISIBILITY_CHANGE,
};
