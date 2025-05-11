import { useCallback, useMemo, useState } from 'react';
import { useOnchainStoreContext } from './OnchainStoreProvider';
import type { OnchainStoreCartReact } from 'src/types';
import OnchainStoreModal from './OnchainStoreModal';
import StripePaymentForm from './StripePaymentForm';
import * as Dialog from '@radix-ui/react-dialog';

export default function OnchainStoreCart({
  setShowModal,
  showModal,
}: OnchainStoreCartReact) {
  const { quantities, products } = useOnchainStoreContext();
  const [showStripeModal, setShowStripeModal] = useState(false);

  const totalSum = useMemo(() => {
    return (
      products?.reduce(
        (sum, product) => sum + (quantities[product.id] || 0) * product.price,
        0,
      ) || 0
    );
  }, [products, quantities]);

  const closeModal = useCallback(() => {
    setShowModal?.(false);
  }, [setShowModal]);

  const openStripeModal = useCallback(() => {
    setShowStripeModal(true);
  }, []);

  const closeStripeModal = useCallback(() => {
    setShowStripeModal(false);
  }, []);

  const handleStripeSuccess = useCallback(() => {
    // This will be called when Stripe payment is successful but is not used
    // since we use redirect mode in our Stripe integration
    closeStripeModal();
  }, [closeStripeModal]);

  return (
    <div className="-mx-[50vw] fixed right-1/2 bottom-0 left-1/2 w-screen border-gray-200 border-t bg-[white]">
      {showModal && <OnchainStoreModal closeModal={closeModal} />}
      
      {/* Stripe Payment Modal */}
      <Dialog.Root open={showStripeModal} onOpenChange={setShowStripeModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-md bg-white p-6 shadow-lg">
            <Dialog.Title className="mb-4 text-xl font-bold">Payment</Dialog.Title>
            <StripePaymentForm 
              amount={totalSum} 
              description={`Order from Onchain Commerce - ${Object.keys(quantities).length} items`}
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
        <div className="flex flex-col items-start justify-between py-4 md:flex-row md:items-center">
          <div className="mb-2 hidden flex-col px-4 text-xs sm:flex md:mb-0 md:w-1/3 lg:px-6">
            <span>Built with Stripe</span>
            <a
              href="https://stripe.com/legal/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="pt-1 text-[8px] text-gray-600 hover:text-gray-900"
            >
              Privacy Policy
            </a>
          </div>
          <div className="flex w-full grow flex-col items-center justify-between gap-2 px-4 sm:flex-row sm:gap-0 md:w-auto lg:px-6">
            <h2 className="font-bold text-lg md:w-11/12">
              TOTAL {totalSum.toFixed(2)} USD
            </h2>
            <div className="w-64">
              {/* Stripe Payment Button */}
              <button
                type="button"
                className="bg-[#635bff] text-white rounded-md py-2 px-4 flex items-center justify-center hover:bg-[#4b45c0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
                onClick={openStripeModal}
                disabled={!totalSum}
              >
                <span className="mr-2">Pay with Card</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <rect width="24" height="24" rx="4" fill="#635bff" />
                  <path d="M12.5 8V16M8.5 12H16.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
