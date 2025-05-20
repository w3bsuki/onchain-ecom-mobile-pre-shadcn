import { useCallback, useMemo, useState } from 'react';
import { useOnchainStoreContext } from './OnchainStoreProvider';
import type { OnchainStoreCartReact } from 'src/types';
import OnchainStoreModal from './OnchainStoreModal';
import StripePaymentForm from './StripePaymentForm';
import * as Dialog from '@radix-ui/react-dialog';
import { ShoppingCart, CreditCard, Lock, AlertCircle, ChevronRight, Trash2, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import ProductImage from './ProductImage';

export default function OnchainStoreCart({
  setShowModal,
  showModal,
}: OnchainStoreCartReact) {
  const { quantities, products, addToCart, removeFromCart } = useOnchainStoreContext();
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'payment'>('cart');

  const cartItems = useMemo(() => {
    return products?.filter(product => quantities[product.id] > 0) || [];
  }, [products, quantities]);

  const totalSum = useMemo(() => {
    return (
      products?.reduce(
        (sum, product) => sum + (quantities[product.id] || 0) * product.price,
        0,
      ) || 0
    );
  }, [products, quantities]);

  const itemCount = useMemo(() => {
    return Object.values(quantities).reduce((sum, qty) => sum + (qty || 0), 0);
  }, [quantities]);

  const closeModal = useCallback(() => {
    setShowModal?.(false);
    // Reset checkout step when closing modal
    setCheckoutStep('cart');
  }, [setShowModal]);

  const openStripeModal = useCallback(() => {
    setShowStripeModal(true);
  }, []);

  const closeStripeModal = useCallback(() => {
    setShowStripeModal(false);
  }, []);

  const handleStripeSuccess = useCallback(() => {
    // This will be called when Stripe payment is successful
    closeStripeModal();
    closeModal();
  }, [closeStripeModal, closeModal]);

  const proceedToShipping = useCallback(() => {
    setCheckoutStep('shipping');
  }, []);

  const proceedToPayment = useCallback(() => {
    setCheckoutStep('payment');
  }, []);

  const backToCart = useCallback(() => {
    setCheckoutStep('cart');
  }, []);

  const backToShipping = useCallback(() => {
    setCheckoutStep('shipping');
  }, []);

  const renderStepIndicator = () => {
    return (
      <div className="mb-6 border-b border-gray-200 px-1 pb-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium",
              checkoutStep === 'cart' 
                ? "bg-primary-base text-white" 
                : checkoutStep === 'shipping' || checkoutStep === 'payment'
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700"
            )}>
              {checkoutStep === 'shipping' || checkoutStep === 'payment' ? "✓" : "1"}
            </div>
            <span className={cn(
              "text-sm",
              checkoutStep === 'cart' 
                ? "font-medium text-gray-900" 
                : checkoutStep === 'shipping' || checkoutStep === 'payment'
                  ? "font-medium text-green-500"
                  : "text-gray-500"
            )}>
              Cart
            </span>
          </div>
          
          <div className="h-[1px] flex-grow mx-2 bg-gray-200"></div>
          
          <div className="flex items-center space-x-2">
            <div className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium",
              checkoutStep === 'shipping' 
                ? "bg-primary-base text-white" 
                : checkoutStep === 'payment'
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700"
            )}>
              {checkoutStep === 'payment' ? "✓" : "2"}
            </div>
            <span className={cn(
              "text-sm",
              checkoutStep === 'shipping' 
                ? "font-medium text-gray-900" 
                : checkoutStep === 'payment'
                  ? "font-medium text-green-500"
                  : "text-gray-500"
            )}>
              Shipping
            </span>
          </div>
          
          <div className="h-[1px] flex-grow mx-2 bg-gray-200"></div>
          
          <div className="flex items-center space-x-2">
            <div className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium",
              checkoutStep === 'payment' 
                ? "bg-primary-base text-white" 
                : "bg-gray-200 text-gray-700"
            )}>
              3
            </div>
            <span className={cn(
              "text-sm",
              checkoutStep === 'payment' 
                ? "font-medium text-gray-900" 
                : "text-gray-500"
            )}>
              Payment
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderCartItems = () => {
    if (!cartItems.length) {
      return renderEmptyCart();
    }

    return (
      <div className="overflow-y-auto max-h-[50vh] md:max-h-[60vh] pb-4">
        {renderStepIndicator()}
        
        <div className="space-y-4">
          {cartItems.map((product) => (
            <div 
              key={product.id}
              className="flex border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Product Image */}
              <div className="w-24 h-24 flex-shrink-0 bg-gray-50">
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              </div>
              
              {/* Product Info */}
              <div className="flex flex-col justify-between flex-grow p-3">
                <div>
                  <h3 className="font-medium text-sm text-gray-900 line-clamp-1">{product.name}</h3>
                  <p className="text-gray-500 text-xs mt-1">
                    {product.description ? product.description.substring(0, 60) : ''}
                    {product.description && product.description.length > 60 ? '...' : ''}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <p className="font-semibold text-sm">${product.price.toFixed(2)}</p>
                  
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => removeFromCart(product.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-l border border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100"
                      aria-label="Decrease quantity"
                    >
                      {quantities[product.id] === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                    </button>
                    <div className="flex h-8 min-w-[2rem] items-center justify-center border-y border-gray-300 px-1 text-sm">
                      {quantities[product.id] || 0}
                    </div>
                    <button
                      type="button"
                      onClick={() => addToCart(product.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-r border border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Cart Summary */}
        <div className="mt-6 space-y-4 border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">${totalSum.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">Free</span>
          </div>
          <div className="flex items-center justify-between text-base pt-2 border-t border-gray-100">
            <span className="font-medium text-gray-900">Total</span>
            <span className="font-bold text-gray-900">${totalSum.toFixed(2)}</span>
          </div>
        </div>
        
        {renderCartActions()}
      </div>
    );
  };

  const renderEmptyCart = () => {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
          <ShoppingCart size={36} className="text-gray-400" />
        </div>
        <h3 className="mb-2 text-lg font-medium">Your cart is empty</h3>
        <p className="mb-6 max-w-md text-center text-sm text-gray-500">
          Looks like you haven't added any products to your cart yet. 
          Explore our catalog to find products you'll love.
        </p>
        <Button
          variant="default"
          size="lg"
          onClick={closeModal}
        >
          Continue Shopping
        </Button>
      </div>
    );
  };

  const renderShippingForm = () => {
    return (
      <div className="overflow-y-auto max-h-[50vh] md:max-h-[60vh] pb-4">
        {renderStepIndicator()}
        
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="mb-1 block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                className="block w-full rounded-md border border-gray-300 px-3 py-3 text-sm shadow-sm focus:border-primary-base focus:outline-none focus:ring-1 focus:ring-primary-base"
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="mb-1 block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                className="block w-full rounded-md border border-gray-300 px-3 py-3 text-sm shadow-sm focus:border-primary-base focus:outline-none focus:ring-1 focus:ring-primary-base"
                placeholder="Enter your last name"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="block w-full rounded-md border border-gray-300 px-3 py-3 text-sm shadow-sm focus:border-primary-base focus:outline-none focus:ring-1 focus:ring-primary-base"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="address" className="mb-1 block text-sm font-medium text-gray-700">
              Street Address
            </label>
            <input
              type="text"
              id="address"
              className="block w-full rounded-md border border-gray-300 px-3 py-3 text-sm shadow-sm focus:border-primary-base focus:outline-none focus:ring-1 focus:ring-primary-base"
              placeholder="123 Main St"
            />
          </div>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="city" className="mb-1 block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                id="city"
                className="block w-full rounded-md border border-gray-300 px-3 py-3 text-sm shadow-sm focus:border-primary-base focus:outline-none focus:ring-1 focus:ring-primary-base"
                placeholder="City"
              />
            </div>
            <div>
              <label htmlFor="postalCode" className="mb-1 block text-sm font-medium text-gray-700">
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                className="block w-full rounded-md border border-gray-300 px-3 py-3 text-sm shadow-sm focus:border-primary-base focus:outline-none focus:ring-1 focus:ring-primary-base"
                placeholder="Postal code"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="country" className="mb-1 block text-sm font-medium text-gray-700">
              Country
            </label>
            <select
              id="country"
              className="block w-full rounded-md border border-gray-300 px-3 py-3 text-sm shadow-sm focus:border-primary-base focus:outline-none focus:ring-1 focus:ring-primary-base"
              defaultValue=""
            >
              <option value="" disabled>Select country</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="UK">United Kingdom</option>
              <option value="AU">Australia</option>
            </select>
          </div>
        </div>
        
        {renderShippingActions()}
      </div>
    );
  };

  const renderPaymentMethod = () => {
    return (
      <div className="overflow-y-auto max-h-[50vh] md:max-h-[60vh] pb-4">
        {renderStepIndicator()}
        
        <div className="mb-6 rounded-lg border border-gray-200 p-4">
          <h3 className="mb-4 font-medium text-gray-900">Order Summary</h3>
          <div className="space-y-2">
            {cartItems.map((product) => (
              <div key={product.id} className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary-base text-xs text-white">
                    {quantities[product.id]}
                  </span>
                  <span className="ml-2 text-gray-700">{product.name}</span>
                </span>
                <span className="font-medium">${(product.price * quantities[product.id]).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between font-medium">
              <span>Total</span>
              <span>${totalSum.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="mb-6 rounded-lg border border-gray-200 p-4">
          <h3 className="mb-4 font-medium text-gray-900">Payment Method</h3>
          <div className="space-y-2">
            <div className="flex items-center rounded-md border border-primary-light bg-primary-light/5 p-3">
              <input
                id="card-payment"
                name="payment-method"
                type="radio"
                className="h-4 w-4 border-primary-base text-primary-base focus:ring-primary-base"
                checked
                readOnly
              />
              <label htmlFor="card-payment" className="ml-3 flex items-center text-sm font-medium text-gray-900">
                <CreditCard size={18} className="mr-2 text-primary-base" />
                Credit/Debit Card
              </label>
              <div className="ml-auto flex items-center">
                <img src="/images/payment/visa.svg" alt="Visa" className="h-6 w-auto" />
                <img src="/images/payment/mastercard.svg" alt="Mastercard" className="h-6 w-auto ml-1" />
                <img src="/images/payment/amex.svg" alt="American Express" className="h-6 w-auto ml-1" />
              </div>
            </div>
          </div>
          
          <p className="mt-4 text-xs text-gray-500">
            By proceeding with your purchase, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
        
        {renderPaymentActions()}
      </div>
    );
  };

  const renderCartActions = () => {
    return (
      <div className="mt-6 flex justify-between border-t border-gray-200 pt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={closeModal}
          className="px-6"
        >
          Continue Shopping
        </Button>
        
        <Button
          variant="default"
          size="lg"
          onClick={proceedToShipping}
          disabled={!itemCount}
          className="px-6 flex items-center"
        >
          Proceed to Checkout <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    );
  };

  const renderShippingActions = () => {
    return (
      <div className="mt-6 flex justify-between border-t border-gray-200 pt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={backToCart}
          className="px-6"
        >
          Back to Cart
        </Button>
        
        <Button
          variant="default"
          size="lg"
          onClick={proceedToPayment}
          className="px-6 flex items-center"
        >
          Continue to Payment <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    );
  };

  const renderPaymentActions = () => {
    return (
      <div className="mt-6 flex justify-between border-t border-gray-200 pt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={backToShipping}
          className="px-6"
        >
          Back to Shipping
        </Button>
        
        <Button
          variant="default"
          size="lg"
          onClick={openStripeModal}
          className="px-6 flex items-center"
        >
          <CreditCard size={16} className="mr-2" />
          Pay ${totalSum.toFixed(2)}
        </Button>
      </div>
    );
  };

  const renderCartContents = () => {
    switch (checkoutStep) {
      case 'shipping':
        return renderShippingForm();
      case 'payment':
        return renderPaymentMethod();
      case 'cart':
      default:
        return renderCartItems();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 -mx-[50vw] left-1/2 right-1/2 w-screen border-t border-gray-200 bg-white shadow-md md:z-50">
      {showModal && (
        <Dialog.Root open={showModal} onOpenChange={setShowModal}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
            <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[95vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg bg-white p-5 shadow-xl md:max-w-lg">
              <Dialog.Title className="mb-4 text-lg font-medium">
                Your Shopping Cart
              </Dialog.Title>
              
              {renderCartContents()}
              
              <Dialog.Close asChild>
                <button 
                  type="button"
                  className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  aria-label="Close"
                >
                  &times;
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
      
      {/* Stripe Payment Modal */}
      <Dialog.Root open={showStripeModal} onOpenChange={setShowStripeModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[85vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-lg bg-white p-6 shadow-lg md:max-w-md">
            <Dialog.Title className="mb-4 flex items-center text-xl font-medium">
              <Lock size={18} className="mr-2 text-green-600" /> 
              Secure Payment
            </Dialog.Title>
            
            <div className="mb-4 flex items-start rounded-md border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800">
              <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
              <p>This is a test checkout. No real payment will be processed.</p>
            </div>
            
            <StripePaymentForm 
              amount={totalSum} 
              description={`Order from Onchain Commerce - ${itemCount} items`}
              onSuccess={handleStripeSuccess}
            />
            
            <Dialog.Close asChild>
              <button 
                type="button"
                className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close"
              >
                &times;
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Persistent Cart Bar */}
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between px-4 py-4 lg:px-6">
          <div className="hidden md:flex items-center space-x-2">
            <div className="flex items-center text-sm">
              <img src="/images/payment/stripe-logo.svg" alt="Stripe" className="mr-2 h-6" />
              <span className="text-gray-500">Secure checkout powered by <span className="font-medium text-gray-700">Stripe</span></span>
            </div>
          </div>
          
          <div className="flex w-full items-center justify-between md:w-auto">
            <div className="flex flex-col">
              <h2 className="font-bold text-lg">
                ${totalSum.toFixed(2)} <span className="ml-1 text-sm font-normal text-gray-500">USD</span>
              </h2>
              {itemCount > 0 && (
                <span className="text-xs text-gray-500">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
              )}
            </div>
            <div className="ml-4">
              <Button
                variant={totalSum > 0 ? "default" : "outline"}
                size="lg"
                onClick={totalSum > 0 ? () => setShowModal?.(true) : undefined}
                disabled={!totalSum}
                className="flex items-center justify-center px-4"
              >
                <ShoppingCart size={16} className="mr-2" />
                <span>{totalSum > 0 ? "View Cart" : "Cart Empty"}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
