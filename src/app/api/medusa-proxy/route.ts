import { NextRequest, NextResponse } from 'next/server';
import { MEDUSA_API_URL } from '../../../config';
import { MEDUSA_PUBLISHABLE_KEY } from '../../../lib/medusa-client';

export async function GET(request: NextRequest) {
  try {
    // Get the endpoint from the query string
    const url = new URL(request.url);
    const endpoint = url.searchParams.get('endpoint');

    if (!endpoint) {
      return NextResponse.json({ error: 'No endpoint specified' }, { status: 400 });
    }

    const targetUrl = `${MEDUSA_API_URL}${endpoint}`;
    console.log(`Proxying request to: ${targetUrl}`);

    // Check if this is an image request
    const isImageRequest = endpoint.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) || 
                          endpoint.includes('/uploads/') || 
                          endpoint.includes('/images/') ||
                          endpoint.includes('/assets/');
    
    if (isImageRequest) {
      try {
        // Directly proxy the image
        const imageResponse = await fetch(targetUrl, {
          headers: {
            // Add headers that might be needed for the Medusa backend
            'Origin': MEDUSA_API_URL,
            'Referer': MEDUSA_API_URL,
          }
        });
        
        if (!imageResponse.ok) {
          console.error(`Image fetch failed: ${imageResponse.status}`);
          return NextResponse.json({ 
            error: `Failed to fetch image: ${imageResponse.status}` 
          }, { status: imageResponse.status });
        }
        
        // Get the image data as an array buffer
        const imageData = await imageResponse.arrayBuffer();
        
        // Get the content type
        const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
        
        // Return the image with proper headers
        return new NextResponse(imageData, {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000',
          },
        });
      } catch (error: any) {
        console.error('Error proxying image:', error);
        return NextResponse.json({ 
          error: `Image proxy error: ${error.message}` 
        }, { status: 500 });
      }
    }

    // For non-image requests, continue with the existing logic
    
    // Get publishable key from request headers, or fall back to the one in config
    const publishableKey = 
      request.headers.get('x-publishable-api-key') || 
      MEDUSA_PUBLISHABLE_KEY || 
      process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 
      '';

    console.log(`Using publishable key: ${publishableKey ? '✅ Found' : '❌ Missing'}`);

    // Forward the request to Medusa
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-publishable-api-key': publishableKey,
      },
    });

    // Special case for health endpoint which returns plain text "OK"
    if (endpoint === '/health') {
      const text = await response.text();
      return NextResponse.json({ 
        status: response.status,
        message: text
      });
    }

    // Check for non-JSON responses for other endpoints
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // If it's not JSON, this might be an error page or unexpected response
      const textResponse = await response.text();
      console.error(`Non-JSON response from Medusa: ${textResponse.substring(0, 200)}...`);
      
      return NextResponse.json({
        error: 'Received non-JSON response from Medusa API',
        details: textResponse.substring(0, 500), // Limit the response size
        status: response.status,
        url: targetUrl
      }, { status: 502 });
    }

    // For JSON responses, forward them directly
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in Medusa proxy:', error);
    return NextResponse.json({
      error: `Proxy error: ${error.message}`,
      url: MEDUSA_API_URL
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the endpoint from the query string
    const url = new URL(request.url);
    const endpoint = url.searchParams.get('endpoint');

    if (!endpoint) {
      return NextResponse.json({ error: 'No endpoint specified' }, { status: 400 });
    }

    const targetUrl = `${MEDUSA_API_URL}${endpoint}`;
    console.log(`Proxying POST request to: ${targetUrl}`);

    // Get publishable key from request headers, or fall back to the one in config
    const publishableKey = 
      request.headers.get('x-publishable-api-key') || 
      MEDUSA_PUBLISHABLE_KEY || 
      process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || 
      '';

    // Get the request body
    const body = await request.json();

    // Forward the request to Medusa
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-publishable-api-key': publishableKey,
      },
      body: JSON.stringify(body),
    });

    // Check for non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      console.error(`Non-JSON response from Medusa: ${textResponse.substring(0, 200)}...`);
      
      return NextResponse.json({
        error: 'Received non-JSON response from Medusa API',
        details: textResponse.substring(0, 500),
        status: response.status,
        url: targetUrl
      }, { status: 502 });
    }

    // For JSON responses, forward them directly
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in Medusa proxy:', error);
    return NextResponse.json({
      error: `Proxy error: ${error.message}`,
      url: MEDUSA_API_URL
    }, { status: 500 });
  }
} 