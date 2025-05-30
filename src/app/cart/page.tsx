'use client';

import { useState, useEffect } from 'react';
import { useOnchainStoreContext } from '@/components/OnchainStoreProvider';
import { Banner } from '@/components/layout/Banner';
import Navbar from '@/components/layout/Navbar';
import ProductImage from '@/components/products/ProductImage';
import Link from 'next/link';
import { Trash, ArrowLeft, ShoppingBag, CreditCard } from 'lucide-react';
import StripePaymentForm from '@/components/checkout/StripePaymentForm';
import { 
  Root as DialogRoot, 
  Portal as DialogPortal,
  Overlay as DialogOverlay,
  Content as DialogContent,
  Title as DialogTitle,
  Close as DialogClose 
} from '@radix-ui/react-dialog';

export default function CartPage() {
  const { products, quantities, setQuantity, removeFromCart } = useOnchainStoreContext();
  const [showStripeModal, setShowStripeModal] = useState(false);
  
  // Filter to only products in the cart
  const cartItems = products?.filter(product => quantities[product.id] > 0) || [];
  
  // Calculate cart subtotal
  const subtotal = cartItems.reduce(
    (sum, product) => sum + product.price * quantities[product.id],
    0
  );
  
  // Shipping calculation (free over $50, otherwise $5)
  const shipping = subtotal > 50 ? 0 : 5;
  
  // Total
  const total = subtotal + shipping;
  
  // Handle quantity change
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity >= 0) {
      if (newQuantity === 0) {
        removeFromCart(productId);
      } else {
        setQuantity(productId, newQuantity);
      }
    }
  };
  
  // Handle item removal
  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
  };
  
  // Handle Stripe payment completion
  const handleStripeSuccess = () => {
    // This would normally redirect to an order confirmation page
    setShowStripeModal(false);
  };

  return (
    <div className="flex min-h-screen flex-col font-sansMono">
      <Banner />
      <Navbar />
      
      <main className="container mx-auto flex-grow px-4 pt-24">
        <h1 className="mb-8 text-3xl font-bold">Your Cart</h1>
        
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Cart Items (2 columns on large screens) */}
            <div className="lg:col-span-2">
              {/* Item headers - visible on larger screens */}
              <div className="mb-4 hidden border-b border-gray-200 pb-4 text-sm font-medium text-gray-500 md:grid md:grid-cols-12">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              
              {/* Cart Items */}
              {cartItems.map((product) => (
                <div 
                  key={product.id} 
                  className="mb-6 grid grid-cols-1 gap-4 border-b border-gray-200 pb-6 md:grid-cols-12 md:items-center"
                >
                  {/* Product Info */}
                  <div className="md:col-span-6">
                    <div className="flex items-center">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <ProductImage
                          src={typeof product.image === 'string' ? product.image : null}
                          alt={product.name}
                          className="h-full w-full object-contain"
                          width={80}
                          height={80}
                        />
                      </div>
                      <div className="ml-4 flex flex-col">
                        <Link 
                          href={`/products/${product.id}`}
                          className="font-medium hover:underline"
                        >
                          {product.name}
                        </Link>
                        <p className="mt-1 text-sm text-gray-500 md:hidden">
                          {product.price.toFixed(2)} USDC
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Price - Hidden on mobile */}
                  <div className="hidden text-center md:col-span-2 md:block">
                    {product.price.toFixed(2)} USDC
                  </div>
                  
                  {/* Quantity */}
                  <div className="md:col-span-2 md:text-center">
                    <div className="flex justify-start md:justify-center">
                      <div className="flex items-center">
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-l border border-gray-300 bg-gray-50"
                          onClick={() => handleQuantityChange(product.id, quantities[product.id] - 1)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={quantities[product.id]}
                          onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value, 10))}
                          className="h-8 w-12 border-y border-gray-300 px-2 text-center text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          min="1"
                        />
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-r border border-gray-300 bg-gray-50"
                          onClick={() => handleQuantityChange(product.id, quantities[product.id] + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Total */}
                  <div className="flex items-center justify-between md:col-span-2 md:block md:text-right">
                    <span className="md:inline-block">
                      {(product.price * quantities[product.id]).toFixed(2)} USDC
                    </span>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700 md:mt-2"
                      onClick={() => handleRemoveItem(product.id)}
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Continue Shopping Link */}
              <div className="mt-6">
                <Link 
                  href="/"
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Continue Shopping
                </Link>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                <h2 className="mb-4 text-lg font-medium">Order Summary</h2>
                
                <div className="space-y-4">
                  {/* Subtotal */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{subtotal.toFixed(2)} USDC</span>
                  </div>
                  
                  {/* Shipping */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `${shipping.toFixed(2)} USDC`}</span>
                  </div>
                  
                  {/* Shipping Notice */}
                  {subtotal < 50 && (
                    <div className="text-sm text-gray-500">
                      Add <span className="font-medium">{(50 - subtotal).toFixed(2)} USDC</span> more for free shipping
                    </div>
                  )}
                  
                  <div className="my-4 border-t border-gray-200"></div>
                  
                  {/* Total */}
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{total.toFixed(2)} USDC</span>
                  </div>
                  
                  {/* Checkout Button */}
                  <button
                    type="button"
                    className="mt-6 flex w-full items-center justify-center rounded bg-black py-3 text-white hover:bg-gray-800"
                    onClick={() => setShowStripeModal(true)}
                  >
                    <CreditCard size={18} className="mr-2" />
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShoppingBag size={64} className="mb-4 text-gray-300" />
            <h2 className="mb-2 text-xl font-medium">Your cart is empty</h2>
            <p className="mb-8 text-gray-500">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              href="/"
              className="rounded bg-black px-6 py-2 text-white hover:bg-gray-800"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </main>
      
      {/* Stripe Payment Modal */}
      <DialogRoot open={showStripeModal} onOpenChange={setShowStripeModal}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <DialogContent className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-md bg-white p-6 shadow-lg">
            <DialogTitle className="mb-4 text-xl font-bold">Payment</DialogTitle>
            <StripePaymentForm 
              amount={total} 
              description={`Order from Onchain Commerce - ${cartItems.length} items`}
              onSuccess={handleStripeSuccess}
            />
            <DialogClose asChild>
              <button 
                type="button"
                className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close"
              >
                &times;
              </button>
            </DialogClose>
          </DialogContent>
        </DialogPortal>
      </DialogRoot>
    </div>
  );
} 