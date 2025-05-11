'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ProductImage from './ProductImage';
import QuantityInput from './QuantityInput';
import type { Product } from 'src/types';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  // Destructure the product
  const { id, name, price, image } = product;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-3xl overflow-hidden p-0 rounded-lg">
        <div className="flex flex-col md:flex-row">
          {/* Product Image - Left side */}
          <div className="bg-gray-50 flex h-64 items-center justify-center md:h-auto md:w-1/2">
            <ProductImage 
              src={typeof image === 'string' ? image : null}
              alt={name}
              className="h-full object-contain w-full"
              width={400}
              height={400}
            />
          </div>
          
          {/* Product Details - Right side */}
          <div className="flex flex-col md:w-1/2 p-6">
            <DialogHeader>
              <DialogTitle className="font-semibold text-lg">{name}</DialogTitle>
              <DialogDescription className="font-semibold mt-1 text-xl">
                {price.toFixed(2)} USDC
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-6">
              <h3 className="font-medium mb-2 text-sm">Description</h3>
              <p className="mb-6 text-gray-600 text-sm">
                This is a premium product made with the highest quality materials. Perfect for everyday use and special occasions.
              </p>
              
              <div className="mb-4">
                <h3 className="font-medium mb-2 text-sm">Quantity</h3>
                <QuantityInput productId={id} />
              </div>
              
              <button 
                type="button"
                className="bg-black font-medium hover:bg-gray-800 mt-4 px-6 py-2 rounded text-white w-full"
                onClick={onClose}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 