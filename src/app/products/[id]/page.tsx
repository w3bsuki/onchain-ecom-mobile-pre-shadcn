'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useOnchainStoreContext } from 'src/components/OnchainStoreProvider';
import ProductImage from 'src/components/ProductImage';
import Navbar from 'src/components/Navbar';
import { Banner } from 'src/components/Banner';
import { Star, ChevronDown, ChevronUp, Share2, ArrowLeft, Heart } from 'lucide-react';
import Link from 'next/link';
import MobileBottomNav from 'src/components/MobileBottomNav';
import { cn } from '@/lib/utils';
import ProductImageGallery from 'src/components/ProductImageGallery';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const { products, addToCart } = useOnchainStoreContext();
  const [quantity, setQuantity] = useState(1);
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>('description');
  const [scrolled, setScrolled] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);

  // Scroll detection for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 120);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Find the product with matching ID
  const product = products?.find((p) => p.id === productId);
  
  // Related products - just a sampling of other products
  const relatedProducts = products?.filter(p => p.id !== productId).slice(0, 4) || [];

  // Mock reviews data - in a real app this would come from a database
  const reviews = [
    { id: 1, author: 'Jane Smith', rating: 5, date: '2023-10-12', content: 'Absolutely love this product! The quality is exceptional.' },
    { id: 2, author: 'John Doe', rating: 4, date: '2023-09-28', content: 'Great product for the price. Shipping was fast too.' },
    { id: 3, author: 'Mike Johnson', rating: 5, date: '2023-08-15', content: 'Exceeded my expectations. Will definitely buy again.' },
  ];
  
  // Calculate average rating
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product.id);
      }
    }
  };

  const toggleAccordion = (section: string) => {
    setExpandedAccordion(expandedAccordion === section ? null : section);
  };

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Banner />
        <Navbar />
        <main className="container mx-auto flex flex-grow items-center justify-center px-4 pt-20">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold text-gray-900">Product Not Found</h1>
            <p className="mb-8 text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </main>
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Banner />
      <Navbar />
      
      <main className="container mx-auto flex-grow px-4 pt-4 pb-24 md:px-6 md:pt-8 md:pb-16">
        {/* Mobile Back Button */}
        <div className="flex items-center justify-between mb-4 md:hidden">
          <Link href="/" className="flex items-center text-gray-600 py-2">
            <ArrowLeft size={20} className="mr-1" />
            <span>Back</span>
          </Link>
          
          <button
            type="button"
            onClick={() => setIsWishlist(!isWishlist)}
            className="p-2 text-gray-600"
            aria-label={isWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={cn("h-6 w-6", isWishlist ? "fill-red-500 text-red-500" : "")} />
          </button>
        </div>
        
        {/* Breadcrumb - hidden on mobile */}
        <div className="mb-6 text-sm hidden md:block">
          <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href="/" className="text-gray-600 hover:text-gray-900">Products</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>
        
        {/* Product Details */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Product Image with gallery component */}
          <div className="mb-6 md:mb-0 md:sticky md:top-24">
            <ProductImageGallery 
              mainImage={typeof product.image === 'string' ? product.image : null}
              altImages={[]} // In a real app, you would pass alternative product images here
              productName={product.name}
            />
          </div>
          
          {/* Product Info */}
          <div className="relative">
            {/* Share button - desktop only */}
            <div className="absolute right-0 top-0 hidden md:flex space-x-2">
              <button 
                className="rounded-full bg-gray-100 flex items-center justify-center p-2 hover:bg-gray-200"
                aria-label="Share product"
              >
                <Share2 size={18} />
              </button>
              <button
                className="rounded-full bg-gray-100 flex items-center justify-center p-2 hover:bg-gray-200"
                onClick={() => setIsWishlist(!isWishlist)}
                aria-label={isWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={cn("h-5 w-5", isWishlist ? "fill-red-500 text-red-500" : "")} />
              </button>
            </div>
            
            <h1 className="text-xl md:text-2xl font-semibold mb-2 text-gray-900 pr-16 md:pr-0">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex mr-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={`${
                      star <= Math.round(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {averageRating.toFixed(1)} ({reviews.length} reviews)
              </span>
            </div>
            
            <p className="text-xl font-semibold mb-4 text-gray-900">${product.price.toFixed(2)}</p>
            
            <p className="mb-6 text-gray-600 text-sm">
              This premium product offers exceptional quality and value. Perfect for everyday use or special occasions.
            </p>
            
            {/* Stock Status */}
            <div className="mb-6">
              <p className="flex items-center text-green-600 text-sm">
                <span className="bg-green-600 h-2 mr-2 rounded-full w-2" />
                In stock and ready to ship
              </p>
            </div>
            
            {/* Quantity Selector */}
            <div className="mb-6">
              <label htmlFor="quantity" className="mb-2 block font-medium text-sm text-gray-900">Quantity</label>
              <div className="flex items-center">
                <button
                  type="button"
                  className="flex h-11 w-11 md:h-10 md:w-10 items-center justify-center rounded-l-lg border border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-900"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
                  className="h-11 md:h-10 w-16 border-y border-gray-300 px-2 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  min="1"
                />
                <button
                  type="button"
                  className="flex h-11 w-11 md:h-10 md:w-10 items-center justify-center rounded-r-lg border border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-900"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Add to Cart Button - Regular position for desktop */}
            <Button
              className="hidden md:block w-full"
              onClick={handleAddToCart}
              size="lg"
            >
              Add to Cart
            </Button>
            
            {/* Product Information Accordion */}
            <div className="border-t border-gray-200 mt-6">
              {/* Description Section */}
              <div className="border-b border-gray-200 py-4">
                <button
                  type="button"
                  className="flex w-full items-center justify-between text-left font-medium text-gray-900 py-2"
                  onClick={() => toggleAccordion('description')}
                >
                  <span>Description</span>
                  {expandedAccordion === 'description' ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
                {expandedAccordion === 'description' && (
                  <div className="mt-3 text-gray-600 text-sm">
                    <p>
                      Our premium product is crafted with attention to detail and the highest quality materials.
                      Designed to provide long-lasting performance and satisfaction.
                    </p>
                  </div>
                )}
              </div>
              
              {/* Shipping Section */}
              <div className="border-b border-gray-200 py-4">
                <button
                  type="button"
                  className="flex w-full items-center justify-between text-left font-medium text-gray-900 py-2"
                  onClick={() => toggleAccordion('shipping')}
                >
                  <span>Shipping & Returns</span>
                  {expandedAccordion === 'shipping' ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
                {expandedAccordion === 'shipping' && (
                  <div className="mt-3 text-gray-600 text-sm">
                    <p>
                      Free shipping on all orders over $50. Delivery typically takes 3-5 business days.
                      Items can be returned within 30 days of receipt for a full refund.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="mb-6 text-lg md:text-xl font-semibold text-gray-900">Customer Reviews</h2>
          
          {reviews.map((review) => (
            <div key={review.id} className="mb-6 border-b border-gray-200 pb-6">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{review.author}</p>
                  <div className="flex mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={`${
                          star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-500">{review.date}</p>
              </div>
              <p className="text-gray-600 text-sm">{review.content}</p>
            </div>
          ))}
          
          {/* Review Form Placeholder */}
          <div className="mb-12 rounded-lg border border-gray-200 p-6">
            <h3 className="mb-3 text-base md:text-lg font-semibold text-gray-900">Write a Review</h3>
            <p className="mb-4 text-sm text-gray-600">Share your thoughts about this product with other customers.</p>
            <Button variant="secondary" size="sm">
              Write a Review
            </Button>
          </div>
        </div>
        
        {/* Related Products */}
        <div className="mb-10">
          <h2 className="mb-4 text-lg md:text-xl font-semibold text-gray-900">You May Also Like</h2>
          
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                href={`/products/${relatedProduct.id}`}
                key={relatedProduct.id}
                className="group rounded-lg border border-gray-200 p-3 transition hover:shadow-sm"
              >
                <div className="mb-2 aspect-square overflow-hidden">
                  <ProductImage
                    src={typeof relatedProduct.image === 'string' ? relatedProduct.image : null}
                    alt={relatedProduct.name}
                    className="h-full w-full object-cover"
                    width={200}
                    height={200}
                  />
                </div>
                <h3 className="mb-1 text-sm font-medium truncate text-gray-900">{relatedProduct.name}</h3>
                <p className="text-sm font-semibold text-gray-900">${relatedProduct.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      
      {/* Sticky Add to Cart bar for mobile */}
      <div 
        className={cn(
          "fixed bottom-16 inset-x-0 bg-white border-t border-gray-200 p-3 md:hidden z-30 transition-all duration-200",
          !scrolled && "translate-y-full opacity-0"
        )}
      >
        <Button 
          className="w-full"
          onClick={handleAddToCart}
          size="lg"
        >
          Add to Cart - ${product.price.toFixed(2)}
        </Button>
      </div>
      
      <MobileBottomNav />
    </div>
  );
} 