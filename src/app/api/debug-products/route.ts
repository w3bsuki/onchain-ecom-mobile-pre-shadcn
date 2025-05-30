import { NextResponse } from "next/server";
import { getMedusaClient } from "@/services/medusa/client";

// Hard-coded publishable API key to guarantee it's available
const PUBLISHABLE_API_KEY = 'pk_8c83b91984f77e065ff8066c422062338290c16734aff13728862b5ba8c25d50';

export async function GET() {
  try {
    console.log('Debug API: Attempting to fetch products via Medusa client');
    
    try {
      // First try using the Medusa client
      const client = getMedusaClient();
      const { products } = await client.products.list({
        limit: 20
      });
      
      if (products && products.length > 0) {
        console.log(`Successfully fetched ${products.length} products via Medusa client`);
        
        // Process products to ensure proper UTF-8 handling
        const processedProducts = products.map((product) => {
          return {
            id: product.id,
            title: product.title,
            description: product.description?.substring(0, 150) || "No description",
            thumbnail: product.thumbnail,
            variants: product.variants?.map((v) => ({
              id: v.id,
              title: v.title,
              prices: v.prices?.map((p) => ({
                amount: p.amount,
                currency_code: p.currency_code
              }))
            })),
            rawHex: {
              titleHex: Buffer.from(product.title || "").toString('hex'),
              descriptionHex: Buffer.from(product.description || "").toString('hex').substring(0, 100)
            }
          };
        }) || [];
        
        return NextResponse.json({
          success: true,
          method: "client",
          productCount: processedProducts.length,
          products: processedProducts
        });
      }
    } catch (clientError) {
      console.error('Medusa client fetch failed, trying direct API call:', clientError);
    }
    
    // If client approach fails, try direct fetch
    console.log('Debug API: Falling back to direct fetch');
    const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
    const url = `${baseUrl}/store/products`;
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('limit', '20');
    
    console.log('Making direct fetch request with API key');
    const response = await fetch(`${url}?${queryParams.toString()}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        'x-publishable-api-key': PUBLISHABLE_API_KEY
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error(`Medusa API responded with status ${response.status}`);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      
      return NextResponse.json({ 
        error: `Medusa API error: ${response.status}`,
        errorDetails: errorText,
        url: url,
        params: queryParams.toString()
      }, { status: response.status });
    }
    
    const data = await response.json();
    console.log(`Received ${data.products?.length || 0} products via direct fetch`);
    
    // Process products to ensure proper UTF-8 handling
    const directProducts = data.products?.map((product) => {
      return {
        id: product.id,
        title: product.title,
        description: product.description?.substring(0, 150) || "No description",
        thumbnail: product.thumbnail,
        variants: product.variants?.map((v) => ({
          id: v.id,
          title: v.title,
          prices: v.prices?.map((p) => ({
            amount: p.amount,
            currency_code: p.currency_code
          }))
        })),
        rawHex: {
          titleHex: Buffer.from(product.title || "").toString('hex'),
          descriptionHex: Buffer.from(product.description || "").toString('hex').substring(0, 100)
        }
      };
    }) || [];
    
    return NextResponse.json({
      success: true,
      method: "direct",
      productCount: directProducts.length,
      products: directProducts
    });
  } catch (error) {
    console.error('Error in debug products API:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error', 
      stack: error instanceof Error ? error.stack : null
    }, { status: 500 });
  }
} 