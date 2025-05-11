import { NextRequest, NextResponse } from 'next/server';
import { MEDUSA_API_URL } from '../../../config';

export async function GET(request: NextRequest) {
  try {
    // Get the path from the query string
    const url = new URL(request.url);
    const path = url.searchParams.get('path') || '/uploads/test.jpg';
    const fullUrl = `${MEDUSA_API_URL}${path.startsWith('/') ? '' : '/'}${path}`;

    console.log(`Testing direct Medusa URL: ${fullUrl}`);

    try {
      // Fetch the image directly from Medusa
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Origin': MEDUSA_API_URL,
          'Referer': MEDUSA_API_URL,
        },
      });

      if (!response.ok) {
        return NextResponse.json({
          error: `Direct fetch failed with status: ${response.status}`,
          url: fullUrl,
        }, { status: response.status });
      }

      // Get content type from response
      const contentType = response.headers.get('content-type');
      console.log(`Content type: ${contentType}`);

      // Get the data
      const buffer = await response.arrayBuffer();
      console.log(`Received ${buffer.byteLength} bytes`);

      // If it's an image, return it directly
      if (contentType?.startsWith('image/')) {
        return new NextResponse(buffer, {
          status: 200,
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000',
          },
        });
      }

      // For other content types, just return the details
      return NextResponse.json({
        success: true,
        details: {
          url: fullUrl,
          contentType,
          size: buffer.byteLength,
          isImage: contentType?.startsWith('image/') || false,
        }
      });
    } catch (error: any) {
      console.error('Direct test error:', error);
      return NextResponse.json({
        error: `Direct fetch error: ${error.message}`,
        url: fullUrl,
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Test route error:', error);
    return NextResponse.json({
      error: `Test route error: ${error.message}`
    }, { status: 500 });
  }
} 