'use client';

import { motion } from 'framer-motion';

export default function CustomLogo() {
  return (
    <motion.div 
      className="flex items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo icon - modernized lightning strike */}
      <div className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-md">
        <div className="absolute inset-0 bg-black" />
        <motion.div 
          className="absolute left-1/2 h-6 w-1.5 origin-top bg-white" 
          initial={{ rotate: 20, y: -10 }}
          animate={{ rotate: 20, y: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            delay: 0.1,
            duration: 0.6 
          }}
        />
        <motion.div 
          className="absolute bottom-0.5 left-1.5 h-3 w-1.5 origin-bottom bg-white" 
          initial={{ rotate: -30, y: 10 }}
          animate={{ rotate: -30, y: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            delay: 0.2,
            duration: 0.6 
          }}
        />
      </div>
      
      {/* Brand name */}
      <motion.div 
        className="font-bold tracking-wider text-xl"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        STRIKE
      </motion.div>
    </motion.div>
  );
} 