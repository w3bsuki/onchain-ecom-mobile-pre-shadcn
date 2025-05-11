import { NextResponse } from 'next/server';
import { MEDUSA_API_URL } from '../../../config';

export async function GET() {
  try {
    console.log(`Connecting to Medusa at: ${MEDUSA_API_URL}`);
    
    // Test health endpoint directly without requiring a publishable API key
    const healthResponse = await fetch(`${MEDUSA_API_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!healthResponse.ok) {
      return NextResponse.json({
        success: false,
        error: `Health endpoint failed with status: ${healthResponse.status}`,
        medusaUrl: MEDUSA_API_URL
      }, { status: 500 });
    }
    
    // Check content type to see if it's JSON
    const contentType = healthResponse.headers.get('content-type');
    let healthData;
    
    if (contentType && contentType.includes('application/json')) {
      healthData = await healthResponse.json();
    } else {
      // Handle non-JSON response (e.g., plain text "OK")
      const textResponse = await healthResponse.text();
      healthData = { status: textResponse };
    }
    
    console.log('Health check successful:', healthData);
    
    // Test products endpoint without API key
    const productsEndpoint = `${MEDUSA_API_URL}/store/products`;
    console.log(`Trying products endpoint: ${productsEndpoint}`);
    
    try {
      const productsResponse = await fetch(productsEndpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      console.log(`Products response status: ${productsResponse.status}`);
      
      if (!productsResponse.ok) {
        // Try to get more information from the error
        let errorDetail = '';
        try {
          const errorData = await productsResponse.json();
          errorDetail = JSON.stringify(errorData);
        } catch {
          try {
            errorDetail = await productsResponse.text();
          } catch {
            errorDetail = 'No detailed error available';
          }
        }
        
        return NextResponse.json({
          success: false,
          error: `Products endpoint failed with status: ${productsResponse.status}`,
          errorDetail,
          health: healthData,
          medusaUrl: MEDUSA_API_URL
        }, { status: 500 });
      }
      
      const productsData = await productsResponse.json();
      
      return NextResponse.json({
        success: true,
        health: healthData,
        products: productsData,
        medusaUrl: MEDUSA_API_URL
      });
    } catch (productError: any) {
      console.error('Error fetching products:', productError);
      
      return NextResponse.json({
        success: false,
        error: `Error fetching products: ${productError.message}`,
        health: healthData,
        medusaUrl: MEDUSA_API_URL
      }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error('Error testing Medusa connection:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      medusaUrl: MEDUSA_API_URL
    }, { status: 500 });
  }
} 