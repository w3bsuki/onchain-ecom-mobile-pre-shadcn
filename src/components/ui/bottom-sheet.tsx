'use client';

import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  snapPoints?: number[]; // Array of snap points as percentage (0.9 = 90% of screen height)
  initialSnap?: number; // Index of initial snap point
  allowClose?: boolean; // Allow closing by swiping down
}

export default function BottomSheet({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  snapPoints = [0.9], 
  initialSnap = 0,
  allowClose = true,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [activeSnap, setActiveSnap] = useState(initialSnap);
  const [viewportHeight, setViewportHeight] = useState(0);
  
  // Create motion values for tracking y position
  const y = useMotionValue(0);
  const springY = useMotionValue(0);
  
  // Use callback for smoother performance
  const calculateHeight = useCallback(() => {
    setViewportHeight(window.innerHeight);
  }, []);
    // Calculate height based on viewport and store it for animations
  useEffect(() => {
    calculateHeight();
    window.addEventListener('resize', calculateHeight);
    
    return () => window.removeEventListener('resize', calculateHeight);
  }, [calculateHeight]);

  // Preload and recalculate on open for better performance
  useEffect(() => {
    if (isOpen) {
      // Force recalculate to ensure proper dimensions
      requestAnimationFrame(calculateHeight);
      setActiveSnap(initialSnap);
      // Apply initial snap point position
      const initialY = viewportHeight * (1 - snapPoints[initialSnap]);
      y.set(initialY);
      springY.set(initialY);
    }
  }, [isOpen, initialSnap, snapPoints, viewportHeight, y, springY]);

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle snap changes when drag ends
  const handleDragEnd = (_, info) => {
    const endY = info.offset.y;
    const velocity = info.velocity.y;
    
    // Convert drag distance to percentage of screen height
    const dragPercent = endY / viewportHeight;
    
    // If dragged down significantly or with high velocity, close sheet
    if ((dragPercent > 0.2 || velocity > 500) && allowClose) {
      onClose();
      return;
    }
    
    // Find closest snap point based on current position
    const currentSheetY = y.get();
    const currentPercentage = currentSheetY / viewportHeight;
    
    // Calculate distances to all snap points
    let closestSnapIndex = 0;
    let minDistance = 1;
    
    snapPoints.forEach((snap, index) => {
      const snapPosition = 1 - snap; // Convert from height to Y position
      const distance = Math.abs(currentPercentage - snapPosition);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestSnapIndex = index;
      }
    });
    
    // If velocity is high, prefer snapping in that direction
    if (Math.abs(velocity) > 300) {
      if (velocity > 0 && closestSnapIndex < snapPoints.length - 1) {
        // Moving down - snap to next lower point
        closestSnapIndex += 1;
      } else if (velocity < 0 && closestSnapIndex > 0) {
        // Moving up - snap to next higher point
        closestSnapIndex -= 1;
      }
    }
    
    // Apply new snap point
    setActiveSnap(closestSnapIndex);
    const newY = viewportHeight * (1 - snapPoints[closestSnapIndex]);
    springY.set(newY);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="bg-black/40 fixed inset-0 touch-none z-40"
            aria-label="Close dialog"
            role="button"
            tabIndex={-1}
          />
          
          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            style={{ 
              y: springY,
              maxHeight: `${snapPoints[0] * 100}vh`, // Max height based on largest snap point
              minHeight: '50vh',
              touchAction: 'none' // Prevent default touch handling
            }}
            drag="y"
            dragElastic={0.1}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
            onDrag={(_, info) => {
              // Prevent dragging up beyond the max height
              const newY = y.get() + info.delta.y;
              if (newY >= 0) {
                y.set(newY);
              }
            }}
            onDragEnd={handleDragEnd}
            initial={{ y: '100%' }}
            animate={{ y: springY }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}            className={cn(
              "bg-white bottom-0 fixed left-0 overflow-hidden right-0 rounded-t-xl shadow-xl w-full z-50"
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sheet-title"
          >            {/* Visual drag handle */}
            <div className="flex justify-center py-1.5 touch-none">
              <div className="bg-gray-300 h-1 rounded-full w-12" />
            </div>
            
            {/* Header with sticky positioning */}
            <div className="bg-white flex items-center justify-between px-4 py-3 sticky top-0 z-10">
              {title && <h2 id="sheet-title" className="font-semibold text-lg">{title}</h2>}
              <button
                onClick={onClose}
                className="hover:bg-gray-100 hover:text-gray-500 ml-auto p-2 rounded-full text-gray-500"
                aria-label="Close sheet"
                type="button"
              >
                <X size={20} />
              </button>
            </div>
              {/* Content with auto scrolling */}
            <div 
              className="overflow-y-auto overflow-x-hidden overscroll-contain" 
              style={{ 
                maxHeight: `calc(${snapPoints[activeSnap] * 100}vh - 80px)`,
                minHeight: '150px'
              }}
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 