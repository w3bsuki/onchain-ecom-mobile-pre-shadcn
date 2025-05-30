// Test script to verify integration between Next.js frontend and Medusa backend
const baseUrl = 'http://localhost:9000';
const apiKey = 'pk_8c83b91984f77e065ff8066c422062338290c16734aff13728862b5ba8c25d50';

// Test the entire product flow
async function testProductIntegration() {
  try {
    console.log('Step 1: Fetching products list from Medusa API');
    const productsResponse = await fetch(`${baseUrl}/store/products`, {
      headers: {
        'x-publishable-api-key': apiKey
      }
    });
    
    if (!productsResponse.ok) {
      throw new Error(`API responded with status ${productsResponse.status}`);
    }
    
    const productsData = await productsResponse.json();
    console.log(`Found ${productsData.products.length} products`);
    
    if (productsData.products.length === 0) {
      throw new Error('No products found in Medusa store');
    }
    
    // Get first product ID
    const product = productsData.products[0];
    console.log(`Selected product: ${product.title} (${product.id})`);
    
    // Get variant information
    console.log(`\nStep 2: Examining product variants`);
    const variants = product.variants || [];
    console.log(`Product has ${variants.length} variants`);
    
    if (variants.length === 0) {
      console.log('⚠️ No variants found for this product');
    } else {
      // Display variant details
      variants.forEach((variant, i) => {
        console.log(`Variant ${i + 1}: ${variant.title}`);
        
        // Check for prices
        const prices = variant.prices || [];
        if (prices.length > 0) {
          prices.forEach((price, j) => {
            console.log(`  Price ${j + 1}: ${price.amount / 100} ${price.currency_code}`);
          });
        } else {
          console.log(`  ⚠️ No prices defined for this variant`);
        }
      });
    }
    
    // Test cart functionality
    console.log(`\nStep 3: Testing cart functionality`);
    
    // Create a cart
    console.log('Creating a new cart');
    const cartResponse = await fetch(`${baseUrl}/store/carts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': apiKey
      }
    });
    
    if (!cartResponse.ok) {
      throw new Error(`Failed to create cart: ${cartResponse.status}`);
    }
    
    const cartData = await cartResponse.json();
    const cartId = cartData.cart.id;
    console.log(`Cart created with ID: ${cartId}`);
    
    // Add item to cart
    if (variants.length > 0) {
      const variantId = variants[0].id;
      console.log(`Adding variant ${variantId} to cart`);
      
      const addItemResponse = await fetch(`${baseUrl}/store/carts/${cartId}/line-items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-publishable-api-key': apiKey
        },
        body: JSON.stringify({
          variant_id: variantId,
          quantity: 1
        })
      });
      
      if (!addItemResponse.ok) {
        throw new Error(`Failed to add item to cart: ${addItemResponse.status}`);
      }
      
      const updatedCartData = await addItemResponse.json();
      console.log('Item successfully added to cart');
      console.log(`Cart now contains ${updatedCartData.cart.items.length} items`);
    } else {
      console.log('⚠️ Cannot test cart functionality - no variants available');
    }
    
    // Test completed successfully
    console.log('\n✅ Integration test completed successfully');
    console.log('The Next.js frontend should be able to fetch products and their variants from Medusa');
    console.log('Any missing prices need to be configured in the Medusa admin panel');
    
  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
  }
}

// Run the test
console.log('==============================');
console.log('NEXT.JS + MEDUSA INTEGRATION TEST');
console.log('==============================\n');
testProductIntegration();
