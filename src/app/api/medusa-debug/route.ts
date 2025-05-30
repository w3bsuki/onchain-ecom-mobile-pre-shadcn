import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
    const url = `${baseUrl}/store/products`;
    
    console.log('Fetching raw Medusa products for debugging');
    
    // Add proper UTF-8 encoding headers
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8'
      }
    });
    
    if (!response.ok) {
      console.error(`Medusa API responded with status ${response.status}`);
      return NextResponse.json({ 
        error: `Medusa API error: ${response.status} ${response.statusText}` 
      }, { status: response.status });
    }
    
    const data = await response.json();
    
    // Return the raw data for debugging
    return NextResponse.json({
      status: "success",
      medusaUrl: baseUrl,
      productCount: data.products?.length || 0,
      products: data.products?.map((product: any) => ({
        id: product.id,
        title: product.title,
        description: product.description?.substring(0, 100) + (product.description?.length > 100 ? '...' : '')
      }))
    });
  } catch (error) {
    console.error('Error in medusa-debug API route:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 