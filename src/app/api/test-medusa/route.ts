import { NextResponse } from 'next/server';
import { checkMedusaServer } from '@/utils/check-medusa-server';
import { medusaClient } from '@/lib/medusa-client';

export async function GET() {
  try {
    // First test direct connection
    const connectionTest = await checkMedusaServer();
    
    // Then test through the client
    let clientTest: any = { success: false, error: 'Not attempted' };
    
    try {
      const { products } = await medusaClient.products.list({ limit: 5 });
      clientTest = { 
        success: true, 
        productsCount: products.length,
        productSample: products.length > 0 ? products[0].id : null
      };
    } catch (error) {
      clientTest = { success: false, error: error.message };
    }
    
    return NextResponse.json({
      medusaUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000',
      directConnection: connectionTest,
      clientConnection: clientTest
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
