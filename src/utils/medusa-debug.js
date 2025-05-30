/**
 * Medusa debug utility
 * This file provides functions to help debug Medusa connectivity issues
 */

// Only run on client side
if (typeof window !== 'undefined') {
  // Run on page load to check connection status
  window.addEventListener('load', () => {
    console.log('🔍 MEDUSA DEBUG: Checking connection status...');
    checkMedusaStatus();
  });
}

/**
 * Check Medusa connection status using the API endpoint
 */
async function checkMedusaStatus() {
  try {
    console.log('🔍 MEDUSA DEBUG: Fetching status from API...');
    const response = await fetch('/api/medusa-status');
    const data = await response.json();
    
    if (data.connected) {
      console.log('✅ MEDUSA CONNECTED:', data);
      console.log(`✅ Found ${data.productsCount} products from Medusa backend`);
    } else {
      console.error('❌ MEDUSA CONNECTION FAILED:', data);
      console.error('🔧 Make sure your Medusa backend is running at:', data.medusaUrl);
      tryDirectMedusaCheck(data.medusaUrl);
    }
    
    return data;
  } catch (error) {
    console.error('❌ MEDUSA DEBUG ERROR:', error);
    return { connected: false, error: error.message };
  }
}

/**
 * Try to check Medusa directly (might fail due to CORS)
 */
async function tryDirectMedusaCheck(url) {
  try {
    console.log('🔍 MEDUSA DEBUG: Trying direct check (might fail due to CORS)...');
    const testUrl = url + '/store/products?limit=1';
    console.log('🔍 Testing URL:', testUrl);
    
    const response = await fetch(testUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'no-cors', // This will make the request succeed but response will be opaque
    });
    
    console.log('🔍 Direct request status:', response.status, response.statusText);
    console.log('🔍 CORS mode used. Response may be opaque and not accessible');
    
    if (response.ok) {
      console.log('✅ Direct request succeeded but data might not be accessible due to CORS');
    } else {
      console.log('❌ Direct request failed');
    }
  } catch (error) {
    console.error('❌ Direct check error:', error);
  }
  
  // Print debugging steps for the user
  console.log('\n🔧 DEBUGGING STEPS:');
  console.log('1. Make sure your Medusa backend is running on port 9000');
  console.log('2. Check if CORS is properly configured in your Medusa settings');
  console.log('3. Try accessing the Medusa Admin at http://localhost:9000/admin');
  console.log('4. Check if there are any errors in your Medusa server logs');
  console.log('5. Make sure your .env.local file contains NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000');
}

export { checkMedusaStatus, tryDirectMedusaCheck }; 