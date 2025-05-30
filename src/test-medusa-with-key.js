// Test script to verify Medusa product fetching with API key
const productId = 'prod_01JVNHKNPF8T0SVQ0W2WD7SGQ4'; // Medusa Sweatshirt
const baseUrl = 'http://localhost:9000';
const apiKey = 'pk_8c83b91984f77e065ff8066c422062338290c16734aff13728862b5ba8c25d50'; // New API key

async function testProductFetch() {
  try {
    const url = `${baseUrl}/store/products/${productId}`;
    console.log(`Fetching product from Medusa API: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'x-publishable-api-key': apiKey
      }
    });
    
    if (!response.ok) {
      console.error(`Medusa API responded with status ${response.status}`);
      console.error(await response.text());
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
    console.log('Number of Variants:', data.product.variants.length);    // Log variant details
    data.product.variants.forEach((variant, index) => {
      console.log(`Variant ${index + 1}:`, variant.title);
      console.log(`  ID:`, variant.id);
      console.log(`  Full variant data:`, JSON.stringify(variant, null, 2));
    });
  } catch (error) {
    console.error('Error fetching product from Medusa API:', error);
  }
}

// First test a basic products list to check connectivity
async function testProductsList() {
  try {
    const url = `${baseUrl}/store/products`;
    console.log(`Fetching products list from Medusa API: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'x-publishable-api-key': apiKey
      }
    });
    
    if (!response.ok) {
      console.error(`Medusa API responded with status ${response.status}`);
      console.error(await response.text());
      return;
    }
    
    const data = await response.json();
    console.log('Received products list from Medusa API:', data);
    console.log('Number of products:', data.products.length);
    
    if (data.products.length > 0) {
      console.log('First product ID:', data.products[0].id);
      console.log('First product title:', data.products[0].title);
    }
  } catch (error) {
    console.error('Error fetching products list from Medusa API:', error);
  }
}

// Run the tests
console.log('Testing Medusa API connection...');
testProductsList().then(() => {
  console.log('\nTesting single product fetch...');
  testProductFetch();
});
