// Test script to check product variant pricing in Medusa
const productId = 'prod_01JVNHKNPF8T0SVQ0W2WD7SGQ4'; // Medusa Sweatshirt
const baseUrl = 'http://localhost:9000';
const apiKey = 'pk_8c83b91984f77e065ff8066c422062338290c16734aff13728862b5ba8c25d50';

async function testProductWithPrices() {
  try {
    // Try to fetch product with standard endpoint first
    const url = `${baseUrl}/store/products/${productId}`;
    console.log(`Fetching product: ${url}`);
    
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
    console.log('Received product data from Medusa API');
    
    if (!data.product) {
      console.error('No product data received');
      return;
    }
    
    console.log('Product ID:', data.product.id);
    console.log('Product Title:', data.product.title);
    console.log('Number of Variants:', data.product.variants.length);
    
    // Log variant details with focus on prices
    data.product.variants.forEach((variant, index) => {
      console.log(`Variant ${index + 1}:`, variant.title);
      console.log(`  ID:`, variant.id);
      
      const prices = variant.prices || [];
      if (prices.length > 0) {
        console.log(`  Number of prices: ${prices.length}`);
        prices.forEach((price, i) => {
          console.log(`  Price ${i + 1}:`, {
            amount: price.amount / 100, // Convert from cents to dollars
            currency: price.currency_code
          });
        });
      } else {
        console.log(`  No prices available`);
      }
    });
  } catch (error) {
    console.error('Error fetching product from Medusa API:', error);
  }
}

// Run the test
console.log('Testing Medusa API product pricing...');
testProductWithPrices().then(() => {
  console.log('Test completed');
}).catch(err => {
  console.error('Test failed with error:', err);
});
