'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';

interface CategoryMarqueeProps {
  className?: string;
}

export function CategoryMarquee({ className }: CategoryMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Text items to repeat in the marquee
  const items = Array(10).fill("ALL CATEGORIES");

  return (
    <div
      ref={containerRef}
      className={`bg-black flex items-center overflow-hidden py-1.5 relative text-white ${className || ''}`}
    >
      <div className="flex whitespace-nowrap">
        {/* First set of items */}
        <motion.div
          className="flex items-center gap-4"
          animate={{
            x: [0, -1920],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          {items.map((item, i) => (
            <div key={`marquee-1-${item}-${i}`} className="flex items-center">
              <span className="font-medium text-xs tracking-widest uppercase">{item}</span>
              <span className="mx-4 text-zinc-600">•</span>
            </div>
          ))}
        </motion.div>

        {/* Second set for continuous effect */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ x: 0 }}
          animate={{
            x: [-1920, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          {items.map((item, i) => (
            <div key={`marquee-2-${item}-${i}`} className="flex items-center">
              <span className="font-medium text-xs tracking-widest uppercase">{item}</span>
              <span className="mx-4 text-zinc-600">•</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
} 