import { useState } from 'react';
import { 
  Root as DialogRoot,
  Portal as DialogPortal,
  Overlay as DialogOverlay,
  Content as DialogContent,
  Title as DialogTitle,
  Description as DialogDescription,
  Close as DialogClose
} from '@radix-ui/react-dialog';
import { Heart, Share2, X } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import ProductImage from '../ProductImage';
import { useOnchainStoreContext } from '../OnchainStoreProvider';
import { useMediaQuery } from '@/hooks/use-media-query';

interface ProductQuickViewProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    description?: string;
    image: string | null;
    price: number;
  };
}

export function ProductQuickView({ isOpen, onClose, product }: ProductQuickViewProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [isWishlist, setIsWishlist] = useState(false);
  const { addToCart } = useOnchainStoreContext();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Available sizes (you might want to get this from your product data)
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  const handleAddToCart = () => {
    if (selectedSize) {
      addToCart(product.id);
      onClose();
    }
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay 
          className="animate-fadeIn bg-black/30 fixed inset-0 z-40" 
        />
        <DialogContent 
          className={cn(
            "fixed flex inset-0 items-center justify-center overflow-y-auto p-4 z-50",
            isMobile && "items-end p-0"
          )}
        >
          <div 
            className={cn(
              "bg-white max-w-3xl mx-auto overflow-hidden relative w-full",
              isMobile ? "p-4 rounded-t-xl" : "p-6 rounded-lg"
            )}
          >
            {/* Close button */}
            <div className="flex items-center justify-between mb-4">
              <DialogTitle className="font-bold text-gray-900 text-xl">
                {product.name}
              </DialogTitle>
              <DialogClose className="hover:bg-gray-100 hover:text-gray-500 p-2 rounded-full text-gray-400">
                <X className="h-5 w-5" />
              </DialogClose>
            </div>

            <div className={cn(
              "gap-8 grid",
              isMobile ? "grid-cols-1" : "grid-cols-2"
            )}>
              {/* Product Image */}
              <div className="aspect-square relative">
                <div className="h-full overflow-hidden relative rounded-lg w-full">
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    width={500}
                    height={500}
                    className="object-contain"
                    priority={true}
                  />
                </div>
              </div>

              {/* Product Details */}
              <div className="flex flex-col">                
                <div className="mt-4">
                  <p className="font-semibold text-gray-900 text-2xl">
                    ${product.price.toFixed(2)}
                  </p>
                  {product.description && (
                    <DialogDescription className="mt-4 text-gray-500">
                      {product.description}
                    </DialogDescription>
                  )}
                </div>

                {/* Size Selector */}
                <div className="mt-6">
                  <h3 className="font-medium text-gray-900 text-sm">Size</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        className={cn(
                          "border flex font-medium h-10 items-center justify-center rounded-md text-sm w-10",
                          selectedSize === size
                            ? "bg-black border-black text-white"
                            : "border-gray-200 hover:bg-gray-50 text-gray-900"
                        )}
                        onClick={() => setSelectedSize(size)}
                        title={`Select size ${size}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stock Status */}
                <div className="mt-4">
                  <p className="flex items-center text-green-600 text-sm">
                    <span className="bg-green-600 h-2 mr-2 rounded-full w-2" />
                    In stock and ready to ship
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-4 mt-6">
                  <Button
                    className="w-full"
                    disabled={!selectedSize}
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </Button>
                  
                  <div className="flex gap-4">
                    <Button
                      className="flex-1"
                      onClick={() => setIsWishlist(!isWishlist)}
                      variant="outline"
                    >
                      <Heart
                        className={cn(
                          "h-4 mr-2 w-4",
                          isWishlist ? "fill-black" : "fill-none"
                        )}
                      />
                      Wishlist
                    </Button>
                    <Button className="flex-1" variant="outline">
                      <Share2 className="h-4 mr-2 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}