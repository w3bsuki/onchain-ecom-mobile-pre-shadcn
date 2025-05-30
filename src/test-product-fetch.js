// Test script to verify Medusa product fetching
const productId = 'prod_01HY2V0AY66JSTBV9BQK0QB02Z'; // Use a product ID from your Medusa store
const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const url = `${baseUrl}/store/products/${productId}?expand=variants,images,collection,tags,options`;

async function testProductFetch() {
  try {
    console.log(`Fetching product from Medusa API: ${url}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Medusa API responded with status ${response.status}`);
      return;
    }
    
    const data = await response.json();
    console.log('Received product data from Medusa API:', data);
    
    if (!data.product) {
      console.error('No product data received');
      return;
    }
    
    console.log('Product ID:', data.product.id);
    console.log('Product Title:', data.product.title);
    console.log('Product Variants:', data.product.variants);
  } catch (error) {
    console.error('Error fetching product from Medusa API:', error);
  }
}

testProductFetch();
