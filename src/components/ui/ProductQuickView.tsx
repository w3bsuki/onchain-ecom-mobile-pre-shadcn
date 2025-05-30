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
import { Heart, X, ShoppingBag, Plus, Minus } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import ProductImage from '@/components/products/ProductImage';
import { useOnchainStoreContext } from '../OnchainStoreProvider';
import { useMediaQuery } from '@/hooks/use-media-query';

// @ts-ignore Medusa.js has some type definition differences
interface ProductQuickViewProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    title: string;
    description?: string;
    thumbnail?: string | null;
    price?: number;
    variants?: Array<{
      id: string;
      title: string;
      prices?: Array<{
        amount: number;
        currency_code: string;
      }>;
    }>;
  };
}

export function ProductQuickView({ isOpen, onClose, product }: ProductQuickViewProps) {
  const [selectedSize, setSelectedSize] = useState('');
  const [isWishlist, setIsWishlist] = useState(false);
  const { addToCart } = useOnchainStoreContext();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Available sizes
  const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL'];

  const handleAddToCart = () => {
    const variantId = product.variants?.[0]?.id;
    if (selectedSize && variantId) {
      addToCart(variantId);
      onClose();
    }
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  // Get the default variant's price
  const getPrice = () => {
    if (!product.price) {
      return 0;
    }
    return product.price;
  };

  const formatPrice = (price: number) => {
    return (price / 100).toFixed(2);
  };

  return (
    <DialogRoot open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay 
          className="animate-fadeIn backdrop-blur-sm bg-black/50 fixed inset-0 z-40" 
        />
        <DialogContent 
          className={cn(
            "fixed inset-0 z-50",
            isMobile ? "flex flex-col items-end justify-end" : "flex items-center justify-center overflow-y-auto p-4"
          )}
        >
          <div 
            className={cn(
              "bg-white mx-auto overflow-hidden relative w-full",
              isMobile 
                ? "rounded-t-xl max-h-[85vh]" 
                : "max-w-3xl p-6 rounded-lg shadow-xl"
            )}
          >
            {/* Mobile UI - Compact and efficient */}
            {isMobile ? (
              <>
                {/* Drag handle */}
                <div className="flex items-center justify-center py-2">
                  <div className="bg-gray-300 h-1 rounded-full w-10" />
                </div>
                
                {/* Compact product view */}
                <div className="px-4 pb-4">
                  {/* Header with close */}
                  <div className="flex items-center justify-between">
                    <DialogTitle className="font-medium text-black text-lg truncate pr-4">
                      {product.title}
                    </DialogTitle>
                    <button 
                      onClick={onClose}
                      className="rounded-full text-gray-400 hover:text-gray-600" 
                      type="button"
                      aria-label="Close dialog"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {/* Price */}
                  <p className="font-bold text-lg text-black mt-1">
                    ${formatPrice(getPrice())}
                  </p>
                  
                  {/* Product display */}
                  <div className="flex gap-4 mt-3">
                    {/* Image - Small */}
                    <div className="bg-gray-50 border border-gray-100 flex-shrink-0 h-24 overflow-hidden relative rounded-md w-24">
                      <ProductImage
                        src={product.thumbnail || ''}
                        alt={product.title}
                        width={96}
                        height={96}
                        className="object-contain"
                        priority={true}
                      />
                    </div>
                    
                    {/* Right side - Size selector */}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm">Size</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {AVAILABLE_SIZES.map((sizeOption) => (
                          <div
                            key={sizeOption}
                            onClick={() => setSelectedSize(sizeOption)}
                            className={cn(
                              "flex h-9 w-9 cursor-pointer select-none items-center justify-center rounded-md border text-xs transition-colors",
                              selectedSize === sizeOption
                                ? "border-black bg-black text-white hover:bg-zinc-800 hover:border-zinc-800"
                                : "border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:bg-gray-50"
                            )}
                            role="button"
                            aria-label={`Select size ${sizeOption}`}
                          >
                            {sizeOption}
                          </div>
                        ))}
                      </div>
                      <p className="flex items-center mt-2 text-green-600 text-xs">
                        <span className="bg-green-600 h-1.5 mr-1.5 rounded-full w-1.5" />
                        In stock
                      </p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-3 mt-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 rounded-full shrink-0 w-12"
                      onClick={() => setIsWishlist(!isWishlist)}
                      aria-label="Add to wishlist"
                    >
                      <Heart 
                        className={cn(
                          "h-5 w-5", 
                          isWishlist ? "fill-black" : "fill-none"
                        )} 
                      />
                    </Button>
                    <Button
                      className="h-12 flex-1 text-base"
                      disabled={!selectedSize}
                      onClick={handleAddToCart}
                    >
                      <ShoppingBag className="h-5 mr-2 w-5" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              /* Desktop view - Unchanged */
              <>
                <div className="flex items-center justify-between mb-4">
                  <DialogTitle className="font-bold text-gray-900 text-xl">
                    {product.title}
                  </DialogTitle>
                  <DialogClose className="hover:bg-gray-100 hover:text-gray-500 p-2 rounded-full text-gray-400">
                    <X className="h-5 w-5" />
                  </DialogClose>
                </div>

                <div className="gap-8 grid grid-cols-2">
                  {/* Product Image */}
                  <div className="aspect-square relative">
                    <div className="h-full overflow-hidden relative rounded-lg w-full">
                      <ProductImage
                        src={product.thumbnail || ''}
                        alt={product.title}
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
                        ${formatPrice(getPrice())}
                      </p>
                      {product.description && (
                        <DialogDescription asChild>
                          <p className="mt-4 text-gray-500 text-sm">
                            {product.description}
                          </p>
                        </DialogDescription>
                      )}
                    </div>

                    {/* Size Selector */}
                    <div className="mt-6">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 text-sm">Size</h3>
                        <button type="button" className="text-sm text-gray-500 underline">Size Guide</button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {AVAILABLE_SIZES.map((sizeOption) => (
                          <div
                            key={sizeOption}
                            onClick={() => setSelectedSize(sizeOption)}
                            className={cn(
                              "flex h-10 w-10 cursor-pointer select-none items-center justify-center rounded-md border font-medium text-sm transition-colors",
                              selectedSize === sizeOption
                                ? "border-black bg-black text-white hover:bg-zinc-800 hover:border-zinc-800"
                                : "border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:bg-gray-50"
                            )}
                            role="button"
                            aria-label={`Select size ${sizeOption}`}
                          >
                            {sizeOption}
                          </div>
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
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
}