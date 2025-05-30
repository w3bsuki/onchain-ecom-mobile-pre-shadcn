import { NextResponse } from 'next/server';

// Hard-coded publishable API key to guarantee it's available
const PUBLISHABLE_API_KEY = 'pk_8c83b91984f77e065ff8066c422062338290c16734aff13728862b5ba8c25d50';
const MEDUSA_BASE_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

/**
 * API endpoint to check Medusa connection status
 * Returns status of the Medusa backend connection
 */
export async function GET() {
  try {
    console.log('Checking Medusa connection status...');
    console.log('Medusa base URL:', MEDUSA_BASE_URL);
    
    // Try to fetch from Medusa store API
    const url = `${MEDUSA_BASE_URL}/store/products?limit=1`;
    console.log('Trying to connect to:', url);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_API_KEY
      },
      // 5 second timeout
      signal: AbortSignal.timeout(5000)
    });
    
    if (!response.ok) {
      console.error(`Medusa connection check failed with status ${response.status}`);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      
      return NextResponse.json({
        connected: false,
        status: response.status,
        error: errorText,
        timestamp: new Date().toISOString()
      });
    }
    
    const data = await response.json();
    const productsCount = data.products?.length || 0;
    
    console.log('Medusa connection successful');
    console.log(`Found ${productsCount} products`);
    
    return NextResponse.json({
      connected: true,
      status: response.status,
      productsCount,
      medusaUrl: MEDUSA_BASE_URL,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error checking Medusa connection:', error);
    
    return NextResponse.json({
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      medusaUrl: MEDUSA_BASE_URL,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 