import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
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
          />
          
          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white bottom-0 fixed left-0 max-h-[85vh] overflow-y-auto pb-8 right-0 rounded-t-2xl touch-pan-y z-50"
          >
            {/* Header */}
            <div className="bg-white border-b border-gray-200 flex items-center justify-between p-4 sticky top-0">
              <h2 className="font-semibold text-lg">{title}</h2>
              <button
                onClick={onClose}
                className="bg-transparent hover:bg-gray-100 p-2 rounded-full text-gray-500"
                aria-label="Close sheet"
                type="button"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-4">{children}</div>
            
            {/* Safe area spacing for mobile */}
            <div className="h-safe-area-inset-bottom" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 