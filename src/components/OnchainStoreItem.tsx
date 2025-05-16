'use client';

import { useEffect, useState } from 'react';
import type { Product } from 'src/types';
import ProductImage from './ProductImage';
import ProductModal from './ProductModal';
import { Eye, ShoppingCart, Heart } from 'lucide-react';
import { cn } from '@coinbase/onchainkit/theme';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ProductUrgencyIndicator from './ProductUrgencyIndicator';
import WishlistButton from './ui/wishlist-button';

export default function OnchainStoreItem({ id, name, price, image }: Product) {
  const [hovered, setHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  const product = { id, name, price, image };
  
  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Generate sample product data - would come from actual product database
  const isOnSale = id % 3 === 0;
  const originalPrice = isOnSale ? price * 1.2 : null;
  
  // Sample color variants - these would come from the product data
  const colorOptions = [
    { name: 'Black', code: '#000000' },
    { name: 'Gray', code: '#808080' },
    { name: 'Navy', code: '#000080' }
  ];
  
  const handleItemClick = () => {
    setShowModal(true);
  };
  
  const toggleSaved = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };
  
  const handleColorSelect = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setSelectedColor(index);
  };
  
  return (
    <div 
      className={cn(
        "bg-white border border-gray-200 cursor-pointer duration-300 h-full overflow-hidden relative rounded-xl transition-all",
        !isMobile && "hover:shadow-md hover:border-gray-300"
      )}
      onClick={handleItemClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleItemClick();
        }
      }}
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => !isMobile && setHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${name}`}
    >
      {/* Wishlist button - Minimal styling */}
      <button 
        type="button"
        onClick={toggleSaved}
        className={cn(
          "absolute bg-white flex-shrink-0 flex items-center justify-center right-3 rounded-full top-3 transition-all z-20",
          isMobile ? "h-9 w-9" : "h-8 w-8"
        )}
        aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={`${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} size={isMobile ? 18 : 16} />
      </button>

      {/* Product image - Cleaner layout */}
      <div className="aspect-square bg-gray-50 overflow-hidden relative w-full">
        <div className="absolute flex inset-0 items-center justify-center p-4">
          <ProductImage 
            src={typeof image === 'string' ? image : null}
            alt={name}
            className="h-auto max-h-full max-w-full object-contain transition-transform w-auto duration-500 hover:scale-105"
            width={300}
            height={300}
          />
        </div>
        
        {/* Quick view button - More subtle */}
        <div 
          className={cn(
            "absolute bottom-0 duration-300 flex inset-x-0 justify-center pb-4 transition-all",
            isMobile 
              ? "opacity-100 translate-y-0" 
              : hovered 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-4"
          )}
        >
          <button
            type="button"
            className="bg-white/90 border border-gray-100 flex font-medium hover:bg-gray-50 items-center justify-center px-4 py-2 rounded-full text-gray-700 text-sm transition-all"
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
            aria-label="Quick view"
          >
            <Eye size={16} className="mr-1.5" />
            Quick View
          </button>
        </div>
      </div>
      
      {/* Product details - Simplified */}
      <div className="p-4">
        {/* Product name */}
        <h2 className="font-medium line-clamp-1 mb-2 text-base text-gray-800">{name}</h2>
        
        {/* Price - Cleaner presentation */}
        <div className="flex gap-2 items-baseline mb-3">
          <p className="font-medium text-sm text-gray-900">${price.toFixed(2)}</p>
          {isOnSale && originalPrice && (
            <p className="line-through text-gray-400 text-xs">${originalPrice.toFixed(2)}</p>
          )}
        </div>
        
        {/* Color options - Simplified */}
        <div className="flex gap-1.5 items-center mb-3">
          {colorOptions.map((color, index) => (
            <button
              key={index}
              type="button"
              onClick={(e) => handleColorSelect(e, index)}
              className={cn(
                "rounded-full transition-all",
                selectedColor === index 
                  ? "ring-1 ring-black ring-offset-1" 
                  : "opacity-80 hover:opacity-100"
              )}
              style={{ backgroundColor: color.code }}
              aria-label={`Select ${color.name} color`}
            >
              <span className="block h-5 w-5 rounded-full" />
            </button>
          ))}
        </div>
        
        {/* Add to cart button - Modern styling */}
        <button 
          type="button"
          className="bg-black flex font-medium hover:bg-gray-800 items-center justify-center px-4 py-2.5 rounded-md text-sm text-white transition-colors w-full"
          onClick={(e) => { 
            e.stopPropagation(); 
            // Add to cart logic
          }}
        >
          <ShoppingCart size={16} className="mr-1.5" />
          Add to Cart
        </button>
      </div>
      
      {/* Product modal */}
      {showModal && (
        <ProductModal 
          product={product}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
