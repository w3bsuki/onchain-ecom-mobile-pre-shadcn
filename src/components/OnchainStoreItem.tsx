'use client';

import { useState } from 'react';
import type { Product } from 'src/types';
import ProductImage from './ProductImage';
import ProductModal from './ProductModal';
import { Eye } from 'lucide-react';

export default function OnchainStoreItem({ id, name, price, image }: Product) {
  const [hovered, setHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const product = { id, name, price, image };
  
  const handleItemClick = () => {
    setShowModal(true);
  };
  
  return (
    <>
      <button 
        type="button"
        className="cursor-pointer flex flex-col group hover:shadow-md lg:p-6 mx-auto p-4 relative rounded-lg sm:mx-0 store-item text-left transition-all w-full"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleItemClick}
      >
        <div className="mb-1 w-full">
          <h2 className="font-regular text-xl text-center">{name}</h2>
          <p className="font-regular text-xs text-center mt-1">{price.toFixed(2)} USDC</p>
        </div>
        <div className="flex grow h-[200px] justify-center md:relative">
          <ProductImage 
            src={typeof image === 'string' ? image : null}
            alt={name}
            className="max-sm:max-w-[300px] md:absolute md:h-full md:w-auto mx-auto object-contain"
            width={300}
            height={300}
          />
          
          {/* Overlay on hover */}
          <div 
            className={`absolute bg-black/5 flex inset-0 items-center justify-center transition-opacity duration-200 ${
              hovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="bg-white flex h-10 items-center justify-center rounded-full shadow-md text-gray-700 w-10">
              <Eye size={20} />
            </div>
          </div>
        </div>
        <div className="mt-4 w-full flex justify-center">
          <button 
            type="button"
            onClick={(e) => { 
              e.stopPropagation(); 
              // Add to cart logic will go here - e.g., console.log('Add to cart:', id);
            }}
            className="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded text-sm"
          >
            Add to Cart
          </button>
        </div>
      </button>
      
      {/* Product modal */}
      {showModal && (
        <ProductModal 
          product={product}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
