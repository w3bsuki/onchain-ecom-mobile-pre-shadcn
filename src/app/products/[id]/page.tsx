'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useOnchainStoreContext } from 'src/components/OnchainStoreProvider';
import ProductImage from 'src/components/ProductImage';
import Navbar from 'src/components/Navbar';
import { Banner } from 'src/components/Banner';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const { products, addToCart } = useOnchainStoreContext();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>('description');

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
            <h1 className="mb-4 text-2xl font-bold">Product Not Found</h1>
            <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
            <Link href="/" className="inline-block rounded bg-black px-6 py-2 text-white hover:bg-gray-800">
              Back to Home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col font-sansMono">
      <Banner />
      <Navbar />
      
      <main className="container mx-auto flex-grow px-4 pt-24">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm">
          <Link href="/" className="hover:underline">Home</Link> / 
          <Link href="/products" className="mx-2 hover:underline">Products</Link> / 
          <span className="font-medium">{product.name}</span>
        </div>
        
        {/* Product Details */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Product Image */}
          <div className="flex items-center justify-center rounded-lg border border-gray-200 p-6">
            <ProductImage 
              src={typeof product.image === 'string' ? product.image : null}
              alt={product.name}
              className="max-h-[500px] w-auto object-contain"
              width={500}
              height={500}
            />
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>
            
            {/* Rating */}
            <div className="mb-4 flex items-center">
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
            
            <p className="mb-6 text-2xl font-bold">{product.price.toFixed(2)} USDC</p>
            
            <p className="mb-6 text-gray-700">
              This premium product offers exceptional quality and value. Perfect for everyday use or special occasions.
            </p>
            
            {/* Quantity Selector */}
            <div className="mb-6">
              <label htmlFor="quantity" className="mb-2 block font-medium">Quantity</label>
              <div className="flex items-center">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-l border border-gray-300 bg-gray-100 hover:bg-gray-200"
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
                  className="h-10 w-16 border-y border-gray-300 px-2 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  min="1"
                />
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-r border border-gray-300 bg-gray-100 hover:bg-gray-200"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Add to Cart Button */}
            <button
              type="button"
              className="mb-6 w-full rounded bg-black px-6 py-3 text-white hover:bg-gray-800"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            
            {/* Product Information Accordion */}
            <div className="border-t border-gray-200">
              {/* Description Section */}
              <div className="border-b border-gray-200 py-4">
                <button
                  type="button"
                  className="flex w-full items-center justify-between text-left font-medium"
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
                  <div className="mt-4 text-gray-600">
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
                  className="flex w-full items-center justify-between text-left font-medium"
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
                  <div className="mt-4 text-gray-600">
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
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">Customer Reviews</h2>
          
          {reviews.map((review) => (
            <div key={review.id} className="mb-6 border-b border-gray-200 pb-6">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="font-medium">{review.author}</p>
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
              <p className="text-gray-700">{review.content}</p>
            </div>
          ))}
          
          {/* Review Form Placeholder */}
          <div className="mb-16 rounded-lg border border-gray-200 p-6">
            <h3 className="mb-4 text-xl font-bold">Write a Review</h3>
            <p className="mb-4 text-gray-600">Share your thoughts about this product with other customers.</p>
            <button
              type="button"
              className="rounded bg-black px-6 py-2 text-white hover:bg-gray-800"
            >
              Write a Review
            </button>
          </div>
        </div>
        
        {/* Related Products */}
        <div className="mb-16">
          <h2 className="mb-8 text-2xl font-bold">You May Also Like</h2>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <Link
                href={`/products/${relatedProduct.id}`}
                key={relatedProduct.id}
                className="group rounded-lg border border-gray-200 p-4 transition hover:shadow-md"
              >
                <div className="mb-4 h-48 overflow-hidden">
                  <ProductImage
                    src={typeof relatedProduct.image === 'string' ? relatedProduct.image : null}
                    alt={relatedProduct.name}
                    className="h-full w-full object-contain transition-transform group-hover:scale-105"
                    width={200}
                    height={200}
                  />
                </div>
                <h3 className="mb-1 font-medium">{relatedProduct.name}</h3>
                <p className="font-bold">{relatedProduct.price.toFixed(2)} USDC</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 