async function testApi() {
  try {
    const params = new URLSearchParams({
      maxPrice: '150000',
      status: 'Pre-order',
      lat: '23.0225',
      lng: '72.5714',
      radius: 'Anywhere'
    });
    
    const url = 'http://localhost:5000/api/marketplace/products?' + params.toString();
    console.log('Fetching:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log(`Received ${data.products?.length || 0} products`);
    if (data.products) {
      data.products.forEach(p => {
        console.log(`- ${p.name} (Status: ${p.status})`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testApi();
