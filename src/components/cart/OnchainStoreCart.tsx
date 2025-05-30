import { useCallback, useMemo, useState } from 'react';
import { useOnchainStoreContext } from '../OnchainStoreProvider';
import type { OnchainStoreCartReact } from 'src/types';
import OnchainStoreModal from '../OnchainStoreModal';
import StripePaymentForm from '../checkout/StripePaymentForm';
import { 
  Dialog as DialogRoot, 
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogClose 
} from 'components/ui/dialog';
import { ShoppingCart, CreditCard, Lock, AlertCircle, ChevronRight, Trash2, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from 'components/ui/button';
import ProductImage from '../products/ProductImage';

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
      <div className="mb-6 border-b border-gray-200 pb-4 pt-2 px-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={cn(
              "flex font-medium h-7 items-center justify-center rounded-full text-xs w-7",
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
          
          <div className="bg-gray-200 flex-grow h-[1px] mx-2" />
          
          <div className="flex items-center space-x-2">
            <div className={cn(
              "flex font-medium h-7 items-center justify-center rounded-full text-xs w-7",
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
          
          <div className="bg-gray-200 flex-grow h-[1px] mx-2" />
          
          <div className="flex items-center space-x-2">
            <div className={cn(
              "flex font-medium h-7 items-center justify-center rounded-full text-xs w-7",
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
      <div className="max-h-[50vh] md:max-h-[60vh] overflow-y-auto pb-4">
        {renderStepIndicator()}
        
        <div className="space-y-4">
          {cartItems.map((product) => (
            <div 
              key={product.id}
              className="border border-gray-200 flex overflow-hidden rounded-lg"
            >
              {/* Product Image */}
              <div className="bg-gray-50 flex-shrink-0 h-24 w-24">
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  width={96}
                  height={96}
                  className="h-full object-cover w-full"
                />
              </div>
              
              {/* Product Info */}
              <div className="flex flex-col flex-grow justify-between p-3">
                <div>
                  <h3 className="font-medium line-clamp-1 text-gray-900 text-sm">{product.name}</h3>
                  <p className="mt-1 text-gray-500 text-xs">
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
                      className="bg-gray-50 border border-gray-300 flex h-8 hover:bg-gray-100 items-center justify-center rounded-l text-gray-600 w-8"
                      aria-label="Decrease quantity"
                    >
                      {quantities[product.id] === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                    </button>
                    <div className="border-gray-300 border-y flex h-8 items-center justify-center min-w-[2rem] px-1 text-sm">
                      {quantities[product.id] || 0}
                    </div>
                    <button
                      type="button"
                      onClick={() => addToCart(product.id)}
                      className="bg-gray-50 border border-gray-300 flex h-8 hover:bg-gray-100 items-center justify-center rounded-r text-gray-600 w-8"
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
        <div className="border-gray-200 border-t mt-6 pt-4 space-y-4">          {totalSum > 0 && (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${totalSum.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="border-gray-100 border-t flex items-center justify-between pt-2 text-base">
                <span className="font-medium text-gray-900">Total</span>
                <span className="font-bold text-gray-900">${totalSum.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>
        
        {renderCartActions()}
      </div>
    );
  };

  const renderEmptyCart = () => {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="bg-gray-100 flex h-24 items-center justify-center mb-6 rounded-full w-24">
          <ShoppingCart size={36} className="text-gray-400" />
        </div>
        <h3 className="font-medium mb-2 text-lg">Your cart is empty</h3>
        <p className="max-w-md mb-6 text-center text-gray-500 text-sm">
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
      <div className="max-h-[50vh] md:max-h-[60vh] overflow-y-auto pb-4">
        {renderStepIndicator()}
        
        <div className="py-2 space-y-4">
          <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block font-medium mb-1 text-gray-700 text-sm">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                className="block border border-gray-300 focus:border-primary-base focus:outline-none focus:ring-1 focus:ring-primary-base px-3 py-3 rounded-md shadow-sm text-sm w-full"
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block font-medium mb-1 text-gray-700 text-sm">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                className="block border border-gray-300 focus:border-primary-base focus:outline-none focus:ring-1 focus:ring-primary-base px-3 py-3 rounded-md shadow-sm text-sm w-full"
                placeholder="Enter your last name"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block font-medium mb-1 text-gray-700 text-sm">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="block border border-gray-300 focus:border-primary-base focus:outline-none focus:ring-1 focus:ring-primary-base px-3 py-3 rounded-md shadow-sm text-sm w-full"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="address" className="block font-medium mb-1 text-gray-700 text-sm">
              Street Address
            </label>
            <input
              type="text"
              id="address"
              className="block border border-gray-300 focus:border-primary-base focus:outline-none focus:ring-1 focus:ring-primary-base px-3 py-3 rounded-md shadow-sm text-sm w-full"
              placeholder="123 Main St"
            />
          </div>
          
          <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
            <div>
              <label htmlFor="city" className="block font-medium mb-1 text-gray-700 text-sm">
                City
              </label>
              <input
                type="text"
                id="city"
                className="block border border-gray-300 focus:border-primary-base focus:outline-none focus:ring-1 focus:ring-primary-base px-3 py-3 rounded-md shadow-sm text-sm w-full"
                placeholder="City"
              />
            </div>
            <div>
              <label htmlFor="postalCode" className="block font-medium mb-1 text-gray-700 text-sm">
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                className="block border border-gray-300 focus:border-primary-base focus:outline-none focus:ring-1 focus:ring-primary-base px-3 py-3 rounded-md shadow-sm text-sm w-full"
                placeholder="Postal code"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="country" className="block font-medium mb-1 text-gray-700 text-sm">
              Country
            </label>
            <select
              id="country"
              className="block border border-gray-300 focus:border-primary-base focus:outline-none focus:ring-1 focus:ring-primary-base px-3 py-3 rounded-md shadow-sm text-sm w-full"
              defaultValue=""
            >
              <option value="" disabled={true}>Select country</option>
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
      <div className="max-h-[50vh] md:max-h-[60vh] overflow-y-auto pb-4">
        {renderStepIndicator()}
        
        <div className="border border-gray-200 mb-6 p-4 rounded-lg">
          <h3 className="font-medium mb-4 text-gray-900">Order Summary</h3>
          <div className="space-y-2">
            {cartItems.map((product) => (
              <div key={product.id} className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <span className="bg-primary-base flex h-5 items-center justify-center min-w-[1.25rem] rounded-full text-white text-xs">
                    {quantities[product.id]}
                  </span>
                  <span className="ml-2 text-gray-700">{product.name}</span>
                </span>
                <span className="font-medium">${(product.price * quantities[product.id]).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="border-gray-100 border-t mt-4 pt-4">
            <div className="flex font-medium items-center justify-between">
              <span>Total</span>
              <span>${totalSum.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="border border-gray-200 mb-6 p-4 rounded-lg">
          <h3 className="font-medium mb-4 text-gray-900">Payment Method</h3>
          <div className="space-y-2">
            <div className="bg-primary-light/5 border border-primary-light flex items-center p-3 rounded-md">
              <input
                id="card-payment"
                name="payment-method"
                type="radio"
                className="border-primary-base focus:ring-primary-base h-4 text-primary-base w-4"
                checked={true}
                readOnly={true}
              />
              <label htmlFor="card-payment" className="flex font-medium items-center ml-3 text-gray-900 text-sm">
                <CreditCard size={18} className="mr-2 text-primary-base" />
                Credit/Debit Card
              </label>
              <div className="flex items-center ml-auto">
                <img src="/images/payment/visa.svg" alt="Visa" className="h-6 w-auto" />
                <img src="/images/payment/mastercard.svg" alt="Mastercard" className="h-6 ml-1 w-auto" />
                <img src="/images/payment/amex.svg" alt="American Express" className="h-6 ml-1 w-auto" />
              </div>
            </div>
          </div>
          
          <p className="mt-4 text-gray-500 text-xs">
            By proceeding with your purchase, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
        
        {renderPaymentActions()}
      </div>
    );
  };

  const renderCartActions = () => {
    return (
      <div className="border-gray-200 border-t flex justify-between mt-6 pt-4">
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
          className="flex items-center px-6"
        >
          Proceed to Checkout <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    );
  };

  const renderShippingActions = () => {
    return (
      <div className="border-gray-200 border-t flex justify-between mt-6 pt-4">
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
          className="flex items-center px-6"
        >
          Continue to Payment <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>
    );
  };

  const renderPaymentActions = () => {
    return (
      <div className="border-gray-200 border-t flex justify-between mt-6 pt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={backToShipping}
          className="px-6"
        >
          Back to Shipping
        </Button>          <Button
          variant="default"
          size="lg"
          onClick={openStripeModal}
          className="flex items-center px-6"
        >
          <CreditCard size={16} className="mr-2" />
          {totalSum > 0 ? `Pay $${totalSum.toFixed(2)}` : 'Pay'}
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
      default:
        return renderCartItems();
    }
  };

  return (
    <div className="-mx-[50vw] bg-white border-gray-200 border-t bottom-0 fixed left-1/2 md:z-50 right-1/2 right-0 shadow-md w-screen z-40">
      {showModal && (
        <DialogRoot open={showModal} onOpenChange={setShowModal}>
          <DialogPortal>
            <DialogOverlay className="backdrop-blur-sm bg-black/40 fixed inset-0 z-50" />
            <DialogContent className="-translate-x-1/2 -translate-y-1/2 bg-white fixed left-1/2 max-h-[90vh] md:max-w-lg overflow-hidden p-5 rounded-lg shadow-xl top-1/2 w-[95vw] z-50">
              <DialogTitle className="font-medium mb-4 text-lg">
                Your Shopping Cart
              </DialogTitle>
              
              {renderCartContents()}
              
              <DialogClose asChild={true}>
                <button 
                  type="button"
                  className="absolute hover:bg-gray-100 hover:text-gray-600 p-1.5 right-4 rounded-full text-gray-400 top-4"
                  aria-label="Close"
                >
                  &times;
                </button>
              </DialogClose>
            </DialogContent>
          </DialogPortal>
        </DialogRoot>
      )}
      
      {/* Stripe Payment Modal */}
      <DialogRoot open={showStripeModal} onOpenChange={setShowStripeModal}>
        <DialogPortal>
          <DialogOverlay className="backdrop-blur-sm bg-black/50 fixed inset-0 z-50" />
          <DialogContent className="-translate-x-1/2 -translate-y-1/2 bg-white fixed left-1/2 max-h-[85vh] md:max-w-md overflow-auto p-6 rounded-lg shadow-lg top-1/2 w-[90vw] z-50">
            <DialogTitle className="flex font-medium items-center mb-4 text-xl">
              <Lock size={18} className="mr-2 text-green-600" /> 
              Secure Payment
            </DialogTitle>
            
            <div className="bg-blue-50 border border-blue-100 flex items-start mb-4 p-3 rounded-md text-blue-800 text-sm">
              <AlertCircle size={18} className="flex-shrink-0 mr-2 mt-0.5" />
              <p>This is a test checkout. No real payment will be processed.</p>
            </div>
            
            <StripePaymentForm 
              amount={totalSum} 
              description={`Order from Onchain Commerce - ${itemCount} items`}
              onSuccess={handleStripeSuccess}
            />
            
            <DialogClose asChild={true}>
              <button 
                type="button"
                className="absolute hover:bg-gray-100 hover:text-gray-600 p-1.5 right-4 rounded-full text-gray-400 top-4"
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
