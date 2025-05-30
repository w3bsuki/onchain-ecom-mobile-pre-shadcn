'use client';

import { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Check, AlertCircle, Loader2 } from 'lucide-react';

interface StripePaymentFormProps {
  amount: number;
  description: string;
  onSuccess?: () => void;
}

export default function StripePaymentForm({
  amount,
  description,
  onSuccess,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [billingDetails, setBillingDetails] = useState({
    email: '',
    name: '',
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    if (!cardComplete) {
      setError('Please complete your card details.');
      return;
    }

    if (!billingDetails.name.trim() || !billingDetails.email.trim()) {
      setError('Please provide your name and email.');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Create a payment intent on the server
      const response = await fetch('/api/payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          description: description,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const { clientSecret } = await response.json();

      // Confirm the payment with the card element
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: billingDetails.name,
            email: billingDetails.email,
          },
        },
      });

      setProcessing(false);

      if (result.error) {
        setError(result.error.message || 'An error occurred while processing your payment.');
      } else if (result.paymentIntent.status === 'succeeded') {
        setPaymentSuccess(true);
        if (onSuccess) setTimeout(onSuccess, 2000); // Give time to see success message
      }
    } catch (err) {
      setProcessing(false);
      setError('An error occurred. Please try again later.');
      console.error('Payment error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 flex items-start p-3 rounded-md text-red-800 text-sm">
          <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      
      {paymentSuccess ? (
        <div className="bg-green-50 border border-green-200 flex flex-col items-center p-6 rounded-md text-center">
          <div className="bg-green-100 flex h-12 items-center justify-center mb-3 rounded-full w-12">
            <Check className="text-green-600" size={24} />
          </div>
          <h3 className="font-medium mb-1 text-green-800 text-lg">Payment Successful!</h3>
          <p className="text-green-700 text-sm">Your payment has been processed successfully.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block font-medium mb-1 text-gray-700 text-sm">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={billingDetails.name}
                onChange={(e) => setBillingDetails({ ...billingDetails, name: e.target.value })}
                required
                className="block border border-gray-300 p-2 rounded-md text-sm w-full focus:border-gray-500 focus:outline-none focus:ring-0"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block font-medium mb-1 text-gray-700 text-sm">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={billingDetails.email}
                onChange={(e) => setBillingDetails({ ...billingDetails, email: e.target.value })}
                required
                className="block border border-gray-300 p-2 rounded-md text-sm w-full focus:border-gray-500 focus:outline-none focus:ring-0"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="card" className="block font-medium mb-1 text-gray-700 text-sm">
                Card Information
              </label>
              <div className="border border-gray-300 p-3 rounded-md">
                <CardElement
                  id="card"
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#9e2146',
                      },
                    },
                  }}
                  onChange={(e) => setCardComplete(e.complete)}
                />
              </div>
              <p className="mt-1 text-gray-500 text-xs">
                Test card: 4242 4242 4242 4242 | Any future expiry date | Any CVC
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 flex items-center justify-between mt-4 pt-4">
            <div className="text-gray-700 text-sm">
              <p className="font-medium">Total</p>
              <p className="text-lg font-semibold">${(amount / 100).toFixed(2)}</p>
            </div>
            
            <button
              type="submit"
              disabled={!stripe || processing}
              className="bg-[#635bff] flex font-medium items-center justify-center px-6 py-2.5 rounded-md text-white transition-colors hover:bg-[#4b45c0] disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {processing ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" /> 
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard size={18} className="mr-2" />
                  Pay ${(amount / 100).toFixed(2)}
                </>
              )}
            </button>
          </div>
        </>
      )}
    </form>
  );
} 