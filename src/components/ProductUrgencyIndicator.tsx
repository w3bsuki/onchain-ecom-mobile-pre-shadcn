'use client';

import { useState, useEffect } from 'react';
import { cn } from '@coinbase/onchainkit/theme';
import { AlertCircle, Clock, Users } from 'lucide-react';

interface ProductUrgencyIndicatorProps {
  type: 'limited-stock' | 'limited-time' | 'trending' | 'popular';
  value?: number; // For stock count, hours remaining, etc.
  className?: string;
}

/**
 * Displays urgency indicators to create FOMO and drive conversions
 * - Limited stock: "Only X left!"
 * - Limited time: "Offer ends in X hours"
 * - Trending: "X people viewing this now"
 * - Popular: "X sold in the last day"
 */
export default function ProductUrgencyIndicator({ 
  type, 
  value = 0,
  className 
}: ProductUrgencyIndicatorProps) {
  const [timeLeft, setTimeLeft] = useState(value);
  
  // For countdown timers, update every minute
  useEffect(() => {
    if (type === 'limited-time' && value > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 60000); // Update every minute
      
      return () => clearInterval(timer);
    }
  }, [type, value]);
  
  // Helper to create a pseudo-random value for demo purposes
  // In a real app, these would come from actual inventory/analytics
  const getRandomValue = (min: number, max: number, seed: number) => {
    // Use the provided value as a seed for pseudo-randomness
    const seedValue = seed || Math.floor(Date.now() / 1000);
    return Math.floor((seedValue % 100) / 100 * (max - min) + min);
  };
  
  // If no value provided, generate a realistic one based on type
  const displayValue = value || (() => {
    switch (type) {
      case 'limited-stock':
        return getRandomValue(2, 8, Date.now());
      case 'limited-time':
        return getRandomValue(1, 24, Date.now());
      case 'trending':
        return getRandomValue(4, 20, Date.now());
      case 'popular':
        return getRandomValue(5, 30, Date.now());
      default:
        return 0;
    }
  })();
  
  // Only show if we have a positive display value
  if (!displayValue) return null;

  // TESTING VERSION - EXTRA BRIGHT COLORS AND LARGER SIZE
  return (
    <div 
      className={cn(
        "flex items-center text-xs sm:text-sm md:text-base font-bold rounded-full py-3 px-4",
        "shadow-md shadow-black/10 animate-pulse border-2 border-black",
        type === 'limited-stock' && "bg-red-500 text-white",
        type === 'limited-time' && "bg-yellow-400 text-black",
        type === 'trending' && "bg-blue-500 text-white",
        type === 'popular' && "bg-green-500 text-white",
        className
      )}
    >
      {/* Icon based on type */}
      {type === 'limited-stock' && (
        <AlertCircle className="mr-2 h-5 w-5" />
      )}
      {type === 'limited-time' && (
        <Clock className="mr-2 h-5 w-5" />
      )}
      {(type === 'trending' || type === 'popular') && (
        <Users className="mr-2 h-5 w-5" />
      )}
      
      {/* Text based on type */}
      {type === 'limited-stock' && (
        <span>Only {displayValue} left in stock!</span>
      )}
      {type === 'limited-time' && (
        <span>Offer ends in {timeLeft} hours!</span>
      )}
      {type === 'trending' && (
        <span>{displayValue} people viewing now!</span>
      )}
      {type === 'popular' && (
        <span>{displayValue} sold in the last day!</span>
      )}
    </div>
  );
} 