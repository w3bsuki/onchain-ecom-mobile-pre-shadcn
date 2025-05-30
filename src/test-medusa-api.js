const http = require('http');

// Make a GET request to the Medusa API
const options = {
  hostname: 'localhost',
  port: 9000,
  path: '/store/products/prod_01HY2V0AY66JSTBV9BQK0QB02Z?expand=variants,images,collection,tags,options',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log('Sending request to Medusa API...');

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      const product = JSON.parse(data);
      console.log('Product data received:');
      console.log('Product ID:', product.product.id);
      console.log('Product Title:', product.product.title);
      console.log('Number of variants:', product.product.variants.length);
    } else {
      console.error('Failed to fetch product:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Error making request:', error);
});

req.end();
