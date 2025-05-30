'use client';

import { motion } from 'framer-motion';

export default function BrandTextCarousel() {
  // Create array with unique ids for each item
  const items = Array.from({ length: 10 }, (_, i) => ({
    id: `strike-${i}`,
    text: "STRIKE"
  }));
  
  return (
    <div className="w-full h-16 sm:h-16 bg-black border-t border-white/10 flex items-center overflow-hidden fixed bottom-0 left-0 right-0 z-50">
      <motion.div 
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: {
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            duration: 30,
            ease: "linear"
          }
        }}
      >
        {items.map((item) => (
          <span 
            key={item.id} 
            className="text-white text-4xl sm:text-4xl font-black tracking-[0.25em] uppercase mx-6"
          >
            {item.text}
          </span>
        ))}
        {/* Duplicate set for seamless loop */}
        {items.map((item) => (
          <span 
            key={`duplicate-${item.id}`} 
            className="text-white text-4xl sm:text-4xl font-black tracking-[0.25em] uppercase mx-6"
          >
            {item.text}
          </span>
        ))}
      </motion.div>
    </div>
  );
} 