import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Try to connect to Medusa health endpoint
    const healthResponse = await fetch('http://localhost:9000/health', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!healthResponse.ok) {
      return NextResponse.json({
        status: 'error',
        message: `Medusa server health check failed with status: ${healthResponse.status}`,
      }, { status: 500 });
    }
    
    // Try to fetch store products
    const productsResponse = await fetch('http://localhost:9000/store/products', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!productsResponse.ok) {
      return NextResponse.json({
        status: 'error',
        message: `Failed to fetch products with status: ${productsResponse.status}`,
      }, { status: 500 });
    }
    
    const products = await productsResponse.json();
    
    return NextResponse.json({
      status: 'success',
      message: 'Medusa server is running correctly',
      health: 'OK',
      productsCount: products.products?.length || 0,
    });
  } catch (error: any) {
    console.error('Error checking Medusa status:', error);
    return NextResponse.json({
      status: 'error',
      message: `Connection error: ${error.message}`,
    }, { status: 500 });
  }
} 