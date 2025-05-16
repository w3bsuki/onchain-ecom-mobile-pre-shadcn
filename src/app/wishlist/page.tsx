'use client';

import { useWishlist } from 'src/context/WishlistContext';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="container flex min-h-[70vh] flex-col items-center justify-center mx-auto px-4">
        <Heart className="h-12 mb-4 text-gray-300 w-12" />
        <h1 className="font-bold mb-2 text-2xl text-gray-900">Your wishlist is empty</h1>
        <p className="mb-6 text-center text-gray-600">
          Start adding items to your wishlist by browsing our collection
        </p>
        <Link
          href="/products"
          className="bg-black font-medium hover:bg-gray-900 inline-flex items-center px-6 py-3 rounded-full text-sm text-white transition-colors"
        >
          Browse Products
          <ShoppingBag className="h-4 ml-2 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-bold text-2xl text-gray-900">My Wishlist</h1>
        <button
          onClick={clearWishlist}
          className="bg-red-50 font-medium hover:bg-red-100 inline-flex items-center px-4 py-2 rounded-full text-red-600 text-sm transition-colors"
          type="button"
        >
          Clear All
          <Trash2 className="h-4 ml-2 w-4" />
        </button>
      </div>

      <div className="gap-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout={true}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white border border-gray-200 group overflow-hidden relative rounded-lg"
            >
              <Link href={`/products/${item.id}`} className="aspect-square block">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill={true}
                  className="group-hover:scale-105 object-cover transition-transform"
                />
              </Link>

              <div className="p-4">
                <Link href={`/products/${item.id}`} className="block">
                  <h2 className="font-medium line-clamp-1 mb-2 text-gray-900 text-lg">
                    {item.title}
                  </h2>
                  <p className="font-semibold text-gray-900 text-lg">
                    ${item.price.toFixed(2)}
                  </p>
                </Link>

                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="bg-red-50 font-medium hover:bg-red-100 inline-flex items-center px-4 py-2 rounded-full text-red-600 text-sm transition-colors"
                    type="button"
                  >
                    Remove
                    <Trash2 className="h-4 ml-2 w-4" />
                  </button>

                  <Link
                    href={`/products/${item.id}`}
                    className="bg-black font-medium hover:bg-gray-900 inline-flex items-center px-4 py-2 rounded-full text-sm text-white transition-colors"
                  >
                    View Product
                    <ShoppingBag className="h-4 ml-2 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
} 