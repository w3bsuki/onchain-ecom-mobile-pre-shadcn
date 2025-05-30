import { NextRequest, NextResponse } from 'next/server';

// Get API key from environment or use hardcoded fallback
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_API_KEY || 'pk_8c83b91984f77e065ff8066c422062338290c16734aff13728862b5ba8c25d50';
const MEDUSA_BASE_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

/**
 * Proxy API to handle Medusa requests without CORS issues
 * This avoids the browser's CORS restrictions by having the server make the request
 */
export async function GET(request: NextRequest) {
  try {
    // Log environment for debugging
    console.log('🔄 Medusa Proxy Request');
    console.log('📌 MEDUSA_BASE_URL:', MEDUSA_BASE_URL);
    console.log('🔑 Using API key:', PUBLISHABLE_API_KEY ? `${PUBLISHABLE_API_KEY.substring(0, 10)}...` : 'Not set');

    // Get the path and query parameters from the request
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') || 'store/products';
    
    // Build the Medusa URL
    const medusaUrl = `${MEDUSA_BASE_URL}/${path}`;
    
    // Forward all original query parameters except 'path'
    const forwardParams = new URLSearchParams();
    searchParams.forEach((value, key) => {
      if (key !== 'path') {
        forwardParams.append(key, value);
      }
    });

    // Make the request to Medusa with the API key
    const queryString = forwardParams.toString();
    const url = queryString ? `${medusaUrl}?${queryString}` : medusaUrl;
    
    console.log(`🚀 Proxying request to Medusa: ${url}`);
    
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_API_KEY
      },
      signal: controller.signal
    });
    
    // Clear the timeout
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Medusa API error (${response.status}):`, errorText);
      return NextResponse.json(
        { error: `Medusa API error: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }
    
    // Get the response data
    const data = await response.json();
    console.log(`✅ Medusa response received (${path}):`, data.products ? `${data.products.length} products` : 'No products');
    
    // Return the response data
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error proxying request to Medusa:', error);
    
    // Check for timeout errors
    if (error instanceof DOMException && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request to Medusa backend timed out. Is the Medusa server running?' },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * Handle POST requests
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Medusa Proxy POST Request');
    
    // Get the path from the query parameters
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') || 'store/products';
    
    // Build the Medusa URL
    const medusaUrl = `${MEDUSA_BASE_URL}/${path}`;
    
    // Get the request body
    const body = await request.json();
    
    // Forward all original query parameters except 'path'
    const forwardParams = new URLSearchParams();
    searchParams.forEach((value, key) => {
      if (key !== 'path') {
        forwardParams.append(key, value);
      }
    });
    
    // Make the request to Medusa with the API key
    const queryString = forwardParams.toString();
    const url = queryString ? `${medusaUrl}?${queryString}` : medusaUrl;
    
    console.log(`🚀 Proxying POST request to Medusa: ${url}`);
    
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_API_KEY
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    
    // Clear the timeout
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Medusa API POST error (${response.status}):`, errorText);
      return NextResponse.json(
        { error: `Medusa API error: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }
    
    // Get the response data
    const data = await response.json();
    console.log(`✅ Medusa POST response received (${path})`);
    
    // Return the response data
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error proxying POST request to Medusa:', error);
    
    // Check for timeout errors
    if (error instanceof DOMException && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'POST request to Medusa backend timed out. Is the Medusa server running?' },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 