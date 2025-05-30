// Create a publishable API key using Medusa's REST API
const baseUrl = 'http://localhost:9000';

async function createPublishableApiKey() {
  try {
    // First, we need to authenticate as an admin
    console.log('Attempting to log in to Medusa admin...');
    
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
    
    // Now create a publishable API key
    console.log('Creating a new publishable API key...');
    
    const createKeyResponse = await fetch(`${baseUrl}/admin/publishable-api-keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify({
        title: 'Storefront API Key'
      })
    });
    
    if (!createKeyResponse.ok) {
      console.error(`Failed to create API key with status ${createKeyResponse.status}`);
      console.error(await createKeyResponse.text());
      return;
    }
    
    const keyData = await createKeyResponse.json();
    console.log('Successfully created new publishable API key:');
    console.log(keyData);
    
    return keyData.publishable_api_key;
  } catch (error) {
    console.error('Error creating publishable API key:', error);
  }
}

createPublishableApiKey();
