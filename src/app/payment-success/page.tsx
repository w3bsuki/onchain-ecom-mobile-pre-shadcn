'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'success' | 'processing' | 'error'>('processing');
  const [paymentId, setPaymentId] = useState<string | null>(null);

  useEffect(() => {
    // Get the payment_intent and payment_intent_client_secret from the URL
    const paymentIntent = searchParams.get('payment_intent');
    const clientSecret = searchParams.get('payment_intent_client_secret');

    async function checkPaymentStatus() {
      try {
        if (!paymentIntent || !clientSecret) {
          setStatus('error');
          return;
        }

        setPaymentId(paymentIntent);

        // Here you could verify the payment with your backend if needed
        // For simplicity, we'll just assume it's successful if we have the parameters
        setStatus('success');
      } catch (error) {
        console.error('Error verifying payment:', error);
        setStatus('error');
      }
    }

    checkPaymentStatus();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="max-w-md w-full text-center">
        {status === 'processing' && (
          <>
            <h1 className="text-2xl font-bold mb-4">Processing your payment...</h1>
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded mx-auto w-3/4" />
              <div className="h-4 bg-gray-200 rounded mx-auto w-1/2" />
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mb-6 text-green-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your payment has been successfully processed.
            </p>
            {paymentId && (
              <p className="text-sm text-gray-500 mb-6">
                Payment ID: {paymentId}
              </p>
            )}
            <Link
              href="/"
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors inline-block"
            >
              Return to store
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mb-6 text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Payment Verification Failed</h1>
            <p className="text-gray-600 mb-6">
              We couldn't verify your payment. Please contact customer support if you believe this is an error.
            </p>
            <Link
              href="/"
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors inline-block"
            >
              Return to store
            </Link>
          </>
        )}
      </div>
    </div>
  );
} 