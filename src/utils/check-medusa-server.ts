/**
 * Utility to test connection to the Medusa server
 */

export async function checkMedusaServer(url = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000') {
  console.log('Testing connection to Medusa server at:', url);
  try {
    // Add a timestamp to prevent caching
    const response = await fetch(`${url}/store/products?timestamp=${Date.now()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Medusa server connection test failed:', response.statusText);
      return { success: false, status: response.status, message: response.statusText };
    }
    
    const data = await response.json();
    console.log('Medusa server connection test succeeded, products found:', data.products?.length || 0);
    
    // Log the first product for debugging
    if (data.products && data.products.length > 0) {
      console.log('First product from direct test:', JSON.stringify({
        id: data.products[0].id,
        title: data.products[0].title
      }));
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Medusa server connection error:', error);
    return { success: false, error };
  }
}
