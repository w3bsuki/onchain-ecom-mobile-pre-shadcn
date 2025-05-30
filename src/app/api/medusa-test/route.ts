import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test various Medusa endpoints to see what's working
    const results = {
      healthCheck: null,
      storeInfo: null,
      products: null,
      error: null
    };
    
    const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
    
    // Common headers
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      'x-publishable-api-key': 'pk_8c83b91984f77e065ff8066c422062338290c16734aff13728862b5ba8c25d50'
    };
    
    // 1. Try health check
    try {
      const healthResponse = await fetch(`${baseUrl}/health`, {
        headers,
        cache: 'no-store'
      });
      results.healthCheck = {
        status: healthResponse.status,
        ok: healthResponse.ok,
        body: healthResponse.ok ? await healthResponse.json() : await healthResponse.text()
      };
    } catch (error) {
      results.healthCheck = {
        error: `Failed to fetch: ${error instanceof Error ? error.message : String(error)}`
      };
    }
    
    // 2. Try store info
    try {
      const storeResponse = await fetch(`${baseUrl}/store`, {
        headers,
        cache: 'no-store'
      });
      results.storeInfo = {
        status: storeResponse.status,
        ok: storeResponse.ok,
        body: storeResponse.ok ? await storeResponse.json() : await storeResponse.text()
      };
    } catch (error) {
      results.storeInfo = {
        error: `Failed to fetch: ${error instanceof Error ? error.message : String(error)}`
      };
    }
    
    // 3. Try products with different approach
    try {
      const productsResponse = await fetch(`${baseUrl}/store/products?limit=5`, {
        headers,
        cache: 'no-store'
      });
      results.products = {
        status: productsResponse.status,
        ok: productsResponse.ok,
        body: productsResponse.ok ? await productsResponse.json() : await productsResponse.text()
      };
    } catch (error) {
      results.products = {
        error: `Failed to fetch: ${error instanceof Error ? error.message : String(error)}`
      };
    }
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      baseUrl,
      headers: Object.keys(headers),
      results
    });
  } catch (error) {
    console.error('Diagnostic test failed:', error);
    return NextResponse.json({
      error: `Diagnostic test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 