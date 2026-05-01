const mongoose = require('mongoose');
const User = require('./models/User');
const Store = require('./models/Store');
const Product = require('./models/Product');

async function fixProducts() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/retailbridge');
    console.log('Connected to DB');

    const user = await User.findOne({ email: 'dhruvatajapara29@gmail.com' });
    if (!user) {
      console.log('User not found.');
      process.exit(1);
    }

    const store = await Store.findOne({ owner: user._id });
    if (!store) {
      console.log('Store not found.');
      process.exit(1);
    }

    // Delete the previously added incorrect products
    await Product.deleteMany({ store: store._id, name: { $in: ['Sony WH-1000XM5 Headphones', 'Rolex Submariner Replica'] } });

    // Add clothes
    const clothesToAdd = [
      {
        name: 'Classic White Oxford Shirt',
        category: 'Clothe',
        price: 2499,
        description: 'A timeless classic white oxford button-down shirt. Made with 100% premium cotton for ultimate comfort and breathability. Perfect for both formal and casual occasions.',
        status: 'IN_STOCK',
        image: 'https://images.unsplash.com/photo-1596755094514-f87e32f6b717?auto=format&fit=crop&q=80&w=800',
        images: ['https://images.unsplash.com/photo-1596755094514-f87e32f6b717?auto=format&fit=crop&q=80&w=800'],
        store: store._id,
        rating: 4.7,
        reviewsCount: 42,
        technicalSpecs: []
      },
      {
        name: 'Slim Fit Denim Jeans',
        category: 'Clothe',
        price: 3299,
        description: 'Premium raw denim jeans with a modern slim fit cut. Features subtle distressing and reinforced stitching for durability.',
        status: 'IN_STOCK',
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800',
        images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800'],
        store: store._id,
        rating: 4.8,
        reviewsCount: 115,
        technicalSpecs: []
      }
    ];

    const inserted = await Product.insertMany(clothesToAdd);
    console.log(`Successfully added ${inserted.length} clothing items! Deleted the headphones and watch.`);

    process.exit(0);
  } catch (error) {
    console.error('Error fixing products:', error);
    process.exit(1);
  }
}

fixProducts();
