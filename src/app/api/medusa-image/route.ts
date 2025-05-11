import { NextRequest, NextResponse } from 'next/server';
import { MEDUSA_BACKEND_URL } from '../../../lib/medusa-client';

/**
 * Special image proxy for Medusa images
 * This is optimized to avoid CORS issues and handle image loading
 */
export async function GET(request: NextRequest) {
  try {
    // Get the image path from the URL
    const url = new URL(request.url);
    const path = url.searchParams.get('path');
    
    if (!path) {
      return NextResponse.json({ error: 'No image path specified' }, { status: 400 });
    }
    
    // Create the full image URL
    const fullPath = path.startsWith('/')
      ? `${MEDUSA_BACKEND_URL}${path}`
      : `${MEDUSA_BACKEND_URL}/${path}`;
    
    console.log(`Proxying Medusa image: ${fullPath}`);
    
    // Fetch the image
    const imageResponse = await fetch(fullPath, {
      headers: {
        // Add headers to avoid CORS issues
        'Origin': MEDUSA_BACKEND_URL,
        'Referer': MEDUSA_BACKEND_URL,
      },
      cache: 'no-store' // Don't cache the response
    });
    
    if (!imageResponse.ok) {
      console.error(`Failed to fetch image: ${imageResponse.status}`);
      
      // Return a placeholder image
      const placeholderUrl = 'https://via.placeholder.com/300x300?text=No+Image';
      const placeholderResponse = await fetch(placeholderUrl);
      const placeholderData = await placeholderResponse.arrayBuffer();
      
      return new NextResponse(placeholderData, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'no-cache',
        },
      });
    }
    
    // Get the image data
    const imageData = await imageResponse.arrayBuffer();
    
    // Get the content type
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
    
    // Return the image
    return new NextResponse(imageData, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });
  } catch (error: any) {
    console.error('Error proxying Medusa image:', error);
    
    // Return a fallback image on error
    try {
      const fallbackUrl = 'https://via.placeholder.com/300x300?text=Error';
      const fallbackResponse = await fetch(fallbackUrl);
      const fallbackData = await fallbackResponse.arrayBuffer();
      
      return new NextResponse(fallbackData, {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'no-cache',
        },
      });
    } catch (fallbackError) {
      return NextResponse.json({ 
        error: `Image proxy error: ${error.message}` 
      }, { status: 500 });
    }
  }
} 