// Test script to fetch variant prices directly
const variantId = 'variant_01JVNHKNVDGB2TECDRQFBZWQJD'; // S variant of Sweatshirt
const baseUrl = 'http://localhost:9000';
const apiKey = 'pk_8c83b91984f77e065ff8066c422062338290c16734aff13728862b5ba8c25d50';

async function testVariantPricing() {
  try {
    // Try to fetch variant directly
    const url = `${baseUrl}/store/variants/${variantId}`;
    console.log(`Fetching variant: ${url}`);
    
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
    console.log('Received variant data from Medusa API:', data);
  } catch (error) {
    console.error('Error fetching variant from Medusa API:', error);
  }
}

// Let's also check how pricing is represented in the Medusa admin
async function checkAdminProductPricing() {
  try {
    // First, authenticate as admin
    console.log('Logging in to Medusa admin...');
    
    const loginResponse = await fetch(`${baseUrl}/admin/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@medusa-test.com',
        password: 'supersecret'
      })
    });
    
    if (!loginResponse.ok) {
      console.error(`Admin login failed with status ${loginResponse.status}`);
      console.error(await loginResponse.text());
      return;
    }
    
    const loginData = await loginResponse.json();
    const { jwt } = loginData;
    
    if (!jwt) {
      console.error('Failed to get JWT token from login response');
      return;
    }
    
    console.log('Successfully logged in as admin');
    
    // Now fetch the product with admin privileges
    const productId = 'prod_01JVNHKNPF8T0SVQ0W2WD7SGQ4';
    const adminProductUrl = `${baseUrl}/admin/products/${productId}`;
    
    const productResponse = await fetch(adminProductUrl, {
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    });
    
    if (!productResponse.ok) {
      console.error(`Failed to fetch product with status ${productResponse.status}`);
      console.error(await productResponse.text());
      return;
    }
    
    const productData = await productResponse.json();
    console.log('Admin product data:', productData);
    
    // Check variant prices from admin API
    if (productData.product && productData.product.variants) {
      productData.product.variants.forEach((variant, index) => {
        console.log(`Variant ${index + 1}:`, variant.title);
        console.log(`  Prices:`, variant.prices);
      });
    }
  } catch (error) {
    console.error('Error fetching admin product data:', error);
  }
}

// Run the tests
console.log('Testing Medusa API variant pricing...');
Promise.all([
  testVariantPricing(),
  checkAdminProductPricing()
]).then(() => {
  console.log('Tests completed');
}).catch(err => {
  console.error('Tests failed with error:', err);
});
