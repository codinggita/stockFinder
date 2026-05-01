const mongoose = require('mongoose');
const User = require('./models/User');
const Store = require('./models/Store');
const Product = require('./models/Product');

async function checkProducts() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/retailbridge');
    
    const user = await User.findOne({ email: 'dhruvatajapara29@gmail.com' });
    const store = await Store.findOne({ owner: user._id });
    
    const products = await Product.find({ store: store._id });
    console.log(`Found ${products.length} products for store ${store.name}`);
    
    products.forEach(p => {
      console.log(`- ${p.name} (Status: ${p.status}, Price: ${p.price}, Store: ${p.store})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
checkProducts();
