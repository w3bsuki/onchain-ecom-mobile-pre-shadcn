import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlist } from 'src/context/WishlistContext';

interface WishlistButtonProps {
  productId: string;
  productTitle: string;
  productPrice: number;
  productImage: string;
  variantId?: string;
  className?: string;
}

export default function WishlistButton({
  productId,
  productTitle,
  productPrice,
  productImage,
  variantId,
  className = '',
}: WishlistButtonProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(productId);

  const handleClick = () => {
    if (isWishlisted) {
      removeFromWishlist(productId);
    } else {
      addToWishlist({
        id: productId,
        title: productTitle,
        price: productPrice,
        image: productImage,
        variant_id: variantId,
      });
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      className={`group p-2 relative rounded-full hover:bg-gray-100 ${
        isWishlisted ? 'text-red-500' : 'text-gray-500'
      } ${className}`}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      type="button"
    >
      <motion.div
        initial={false}
        animate={isWishlisted ? { scale: [1, 1.2, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={`h-5 transition-colors w-5 ${
            isWishlisted ? 'fill-current' : 'group-hover:text-gray-700'
          }`}
        />
      </motion.div>
    </motion.button>
  );
} 