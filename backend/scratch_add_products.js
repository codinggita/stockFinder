const mongoose = require('mongoose');
const User = require('./models/User');
const Store = require('./models/Store');
const Product = require('./models/Product');

async function addProducts() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/retailbridge');
    console.log('Connected to DB');

    // Find user
    const user = await User.findOne({ email: 'dhruvatajapara29@gmail.com' });
    if (!user) {
      console.log('User not found. Cannot add products.');
      process.exit(1);
    }

    // Find store
    const store = await Store.findOne({ owner: user._id });
    if (!store) {
      console.log('Store not found for this user. Cannot add products.');
      process.exit(1);
    }

    // Insert 3 products
    const productsToAdd = [
      {
        name: 'Premium Leather Jacket',
        category: 'Clothe',
        price: 8999,
        description: 'Handcrafted premium leather jacket with detailed stitching and soft inner lining. Perfect for the winter season.',
        status: 'IN_STOCK',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800',
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800'],
        store: store._id,
        rating: 4.8,
        reviewsCount: 15,
        technicalSpecs: []
      },
      {
        name: 'Sony WH-1000XM5 Headphones',
        category: 'Electronic',
        price: 29990,
        description: 'Industry-leading noise cancellation headphones with Auto NC Optimizer, crystal clear hands-free calling, and up to 30 hours of battery life.',
        status: 'IN_STOCK',
        image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800',
        images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800'],
        store: store._id,
        rating: 4.9,
        reviewsCount: 342,
        technicalSpecs: []
      },
      {
        name: 'Rolex Submariner Replica',
        category: 'Watches',
        price: 15500,
        description: 'High-quality automatic timepiece featuring a sweeping second hand, scratch-resistant sapphire crystal, and waterproof casing.',
        status: 'LOW_STOCK',
        image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800',
        images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800'],
        store: store._id,
        rating: 4.5,
        reviewsCount: 28,
        technicalSpecs: []
      }
    ];

    const inserted = await Product.insertMany(productsToAdd);
    console.log(`Successfully added ${inserted.length} products to store ${store.name}!`);

    process.exit(0);
  } catch (error) {
    console.error('Error adding products:', error);
    process.exit(1);
  }
}

addProducts();
