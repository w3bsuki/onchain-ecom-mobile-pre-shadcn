import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16', // Use the latest API version
});

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { amount, currency = 'usd', description, metadata = {} } = body;

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses cents
      currency,
      description,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Return the client secret to the client
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error.message);
    return NextResponse.json(
      { error: error.message || 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

// GET endpoint to check Stripe connection status
export async function GET() {
  try {
    // Simple check to see if we can connect to Stripe
    const isConnected = !!process.env.STRIPE_SECRET_KEY;
    
    // Get Stripe account info if connected
    let accountInfo = null;
    if (isConnected) {
      try {
        accountInfo = await stripe.accounts.retrieve();
      } catch (e) {
        // If we can't retrieve the account, we're not properly connected
        console.error('Error retrieving Stripe account:', e);
      }
    }
    
    return NextResponse.json({
      connected: !!accountInfo,
      mode: process.env.NODE_ENV,
      stripeVersion: stripe.getApiField('version'),
    });
  } catch (error: any) {
    console.error('Error checking Stripe connection:', error.message);
    return NextResponse.json(
      { error: error.message || 'An unknown error occurred' },
      { status: 500 }
    );
  }
} 