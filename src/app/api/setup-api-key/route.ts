import { NextResponse } from "next/server";

/**
 * This endpoint will try to check if the API is reachable and help diagnose API key issues
 */
export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
    
    // First try to hit the admin API to see if we can access anything
    const adminUrl = `${baseUrl}/admin/products`;
    let adminAccessible = false;
    
    try {
      const adminResponse = await fetch(adminUrl, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      adminAccessible = adminResponse.status !== 404;
      console.log('Admin API check result:', adminResponse.status, adminAccessible);
    } catch (error) {
      console.error('Admin API check failed:', error);
    }
    
    // Try to access a non-auth route
    const healthCheck = await fetch(`${baseUrl}/health`, {
      cache: 'no-store'
    });
    
    const healthOk = healthCheck.ok;
    const healthData = healthCheck.ok ? await healthCheck.json() : await healthCheck.text();
    
    // Try the store API without API key
    const storeResponse = await fetch(`${baseUrl}/store/products?limit=1`, {
      headers: {
        'Accept': 'application/json'
      },
      cache: 'no-store'
    });
    
    const storeOk = storeResponse.ok;
    const storeData = storeResponse.ok 
      ? await storeResponse.json() 
      : await storeResponse.text();
    
    // Try the store API with our API key
    const apiKey = 'pk_8c83b91984f77e065ff8066c422062338290c16734aff13728862b5ba8c25d50';
    const storeWithKeyResponse = await fetch(`${baseUrl}/store/products?limit=1`, {
      headers: {
        'Accept': 'application/json',
        'x-publishable-api-key': apiKey
      },
      cache: 'no-store'
    });
    
    const storeWithKeyOk = storeWithKeyResponse.ok;
    const storeWithKeyData = storeWithKeyResponse.ok 
      ? await storeWithKeyResponse.json() 
      : await storeWithKeyResponse.text();
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      baseUrl,
      adminAccessible,
      checks: {
        health: {
          ok: healthOk,
          data: healthData
        },
        storeWithoutKey: {
          ok: storeOk,
          data: storeData
        },
        storeWithKey: {
          ok: storeWithKeyOk,
          data: storeWithKeyData
        }
      },
      recommendedAction: !storeWithKeyOk 
        ? "Your API key doesn't seem to be valid. Try logging into the Medusa admin and creating a new one." 
        : (storeOk ? "API is accessible with or without key, no action needed" : "API requires a key and yours is working"),
      apiKeyWorking: storeWithKeyOk
    });
    
  } catch (error) {
    console.error('API key setup diagnostic failed:', error);
    return NextResponse.json({
      error: `API key diagnostic failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 