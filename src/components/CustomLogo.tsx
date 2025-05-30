'use client';

import { motion } from 'framer-motion';

export default function CustomLogo() {
  return (
    <motion.div 
      className="flex items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Brand name with strikethrough effect */}
      <motion.div 
        className="font-bold relative text-white text-xl tracking-wider"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        STRIKE
        {/* Strikethrough line */}
        <motion.div
          className="absolute bg-white h-0.5 left-0 right-0 top-1/2"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ 
            duration: 0.3, 
            delay: 0.2,
            ease: "easeOut"
          }}
        />
      </motion.div>
    </motion.div>
  );
} 