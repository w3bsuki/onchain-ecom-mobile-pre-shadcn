import { useCallback, useMemo, useState } from 'react';
import { useOnchainStoreContext } from './OnchainStoreProvider';
import type { OnchainStoreCartReact } from 'src/types';
import OnchainStoreModal from './OnchainStoreModal';
import StripePaymentForm from './StripePaymentForm';
import * as Dialog from '@radix-ui/react-dialog';
import { ShoppingCart, CreditCard, Lock, AlertCircle, ChevronRight } from 'lucide-react';

export default function OnchainStoreCart({
  setShowModal,
  showModal,
}: OnchainStoreCartReact) {
  const { quantities, products } = useOnchainStoreContext();
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'payment'>('cart');

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
      <div className="border-b border-gray-200 flex items-center justify-between mb-6 pb-4 pt-2 px-1">
        <div className="flex items-center space-x-2">
          <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${checkoutStep === 'cart' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}>
            1
          </div>
          <span className={`text-sm ${checkoutStep === 'cart' ? 'font-medium text-black' : 'text-gray-500'}`}>Cart</span>
        </div>
        
        <div className="bg-gray-200 h-[1px] flex-grow mx-2"></div>
        
        <div className="flex items-center space-x-2">
          <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${checkoutStep === 'shipping' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}>
            2
          </div>
          <span className={`text-sm ${checkoutStep === 'shipping' ? 'font-medium text-black' : 'text-gray-500'}`}>Shipping</span>
        </div>
        
        <div className="bg-gray-200 h-[1px] flex-grow mx-2"></div>
        
        <div className="flex items-center space-x-2">
          <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${checkoutStep === 'payment' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}>
            3
          </div>
          <span className={`text-sm ${checkoutStep === 'payment' ? 'font-medium text-black' : 'text-gray-500'}`}>Payment</span>
        </div>
      </div>
    );
  };

  const renderEmptyCart = () => {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="mb-6 bg-gray-100 flex h-24 items-center justify-center rounded-full w-24">
          <ShoppingCart size={36} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
        <p className="text-gray-500 text-sm text-center max-w-md mb-6">
          Looks like you haven't added any products to your cart yet. 
          Explore our catalog to find products you'll love.
        </p>
        <button 
          type="button"
          className="bg-black text-white rounded-md py-2 px-6 hover:bg-gray-800 transition-colors"
          onClick={closeModal}
        >
          Continue Shopping
        </button>
      </div>
    );
  };

  const renderShippingForm = () => {
    return (
      <div className="space-y-4 py-2">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              className="block w-full rounded-md border-gray-300 border py-2 px-3 text-sm"
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              className="block w-full rounded-md border-gray-300 border py-2 px-3 text-sm"
              placeholder="Enter your last name"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="block w-full rounded-md border-gray-300 border py-2 px-3 text-sm"
            placeholder="you@example.com"
          />
        </div>
        
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Street Address
          </label>
          <input
            type="text"
            id="address"
            className="block w-full rounded-md border-gray-300 border py-2 px-3 text-sm"
            placeholder="123 Main St"
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              id="city"
              className="block w-full rounded-md border-gray-300 border py-2 px-3 text-sm"
              placeholder="City"
            />
          </div>
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code
            </label>
            <input
              type="text"
              id="postalCode"
              className="block w-full rounded-md border-gray-300 border py-2 px-3 text-sm"
              placeholder="Postal code"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <select
            id="country"
            className="block w-full rounded-md border-gray-300 border py-2 px-3 text-sm"
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
    );
  };

  const renderCartActions = () => {
    return (
      <div className="border-t border-gray-200 flex justify-between mt-6 pt-4">
        <button
          type="button"
          className="bg-white border border-gray-300 font-medium px-6 py-2 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          onClick={closeModal}
        >
          Continue Shopping
        </button>
        
        <button
          type="button"
          className="bg-black flex font-medium items-center px-6 py-2 rounded-md text-white transition-colors hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={proceedToShipping}
          disabled={!itemCount}
        >
          Proceed to Checkout <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    );
  };

  const renderShippingActions = () => {
    return (
      <div className="border-t border-gray-200 flex justify-between mt-6 pt-4">
        <button
          type="button"
          className="bg-white border border-gray-300 font-medium px-6 py-2 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          onClick={backToCart}
        >
          Back to Cart
        </button>
        
        <button
          type="button"
          className="bg-black flex font-medium items-center px-6 py-2 rounded-md text-white transition-colors hover:bg-gray-800"
          onClick={proceedToPayment}
        >
          Continue to Payment <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    );
  };

  const renderPaymentActions = () => {
    return (
      <div className="border-t border-gray-200 flex justify-between mt-6 pt-4">
        <button
          type="button"
          className="bg-white border border-gray-300 font-medium px-6 py-2 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          onClick={backToShipping}
        >
          Back to Shipping
        </button>
        
        <button
          type="button"
          className="bg-[#635bff] flex font-medium items-center px-6 py-2 rounded-md text-white transition-colors hover:bg-[#4b45c0]"
          onClick={openStripeModal}
        >
          <CreditCard size={16} className="mr-2" />
          Pay ${totalSum.toFixed(2)}
        </button>
      </div>
    );
  };

  return (
    <div className="-mx-[50vw] fixed right-1/2 bottom-0 left-1/2 w-screen border-gray-200 border-t bg-white shadow-md">
      {showModal && <OnchainStoreModal closeModal={closeModal} />}
      
      {/* Stripe Payment Modal */}
      <Dialog.Root open={showStripeModal} onOpenChange={setShowStripeModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-md bg-white p-6 shadow-lg z-50">
            <Dialog.Title className="mb-4 text-xl font-medium flex items-center">
              <Lock size={18} className="mr-2 text-green-600" /> 
              Secure Payment
            </Dialog.Title>
            
            <div className="bg-blue-50 border border-blue-100 flex items-start mb-4 p-3 rounded-md text-blue-800 text-sm">
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
                className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close"
              >
                &times;
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between py-4 px-4 lg:px-6">
          <div className="hidden md:flex items-center space-x-2">
            <div className="flex items-center text-sm">
              <img src="https://www.stripe.com/img/v3/home/twitter-social-image.png" alt="Stripe" className="h-6 mr-2" />
              <span className="text-gray-500">Secure checkout powered by <span className="font-medium text-gray-700">Stripe</span></span>
            </div>
          </div>
          
          <div className="flex w-full items-center justify-between md:w-auto">
            <h2 className="font-bold text-lg">
              ${totalSum.toFixed(2)} <span className="text-gray-500 text-sm font-normal ml-1">USD</span>
            </h2>
            <div className="ml-4">
              {/* Payment Button */}
              <button
                type="button"
                className="bg-black text-white rounded-md py-2 px-4 flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={openStripeModal}
                disabled={!totalSum}
              >
                <CreditCard size={16} className="mr-2" />
                <span>Checkout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
