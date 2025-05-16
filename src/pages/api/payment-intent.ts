import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, description } = req.body;

    if (!amount || amount < 50) {
      return res.status(400).json({
        error: 'Invalid amount. Amount must be at least 50 cents.',
      });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      description,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        integration: 'onchain-commerce',
      },
    });

    // Send the client secret to the client
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      error: 'An error occurred while creating the payment intent.',
    });
  }
} 