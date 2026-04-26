const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const Store = require('./models/Store');
const Product = require('./models/Product');

// Initialize the app
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/retailbridge')
  .then(async () => {
    console.log('MongoDB Connected');
    await seedData();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/marketplace', marketplaceRoutes);

const seedData = async () => {
  try {
    // FORCE CLEAR to fix the "messy" inconsistent state
    await Store.deleteMany({});
    await Product.deleteMany({});
    console.log('Database cleared for PERFECT IMAGE SYNC.');

    const storesData = [
      {
        _id: new mongoose.Types.ObjectId('662a00000000000000000001'),
        name: 'Nexus Premium Store',
        location: 'Bandra, Mumbai',
        coordinates: { coordinates: [72.8258, 19.0596] },
        status: 'Open Now',
        isOpen: true,
        image: '/images/luxe_storefront.png'
      },
      {
        _id: new mongoose.Types.ObjectId('662a00000000000000000002'),
        name: 'Luxe Boutique BKC',
        location: 'BKC, Mumbai',
        coordinates: { coordinates: [72.8633, 19.0622] },
        status: 'Open Now',
        isOpen: true,
        image: null
      },
      {
        _id: new mongoose.Types.ObjectId('662a00000000000000000003'),
        name: 'South Bombay Footwear',
        location: 'Colaba, Mumbai',
        coordinates: { coordinates: [72.8333, 18.9218] },
        status: 'Closing Soon',
        isOpen: true,
        image: null
      }
    ];

    const stores = await Store.insertMany(storesData);

    // THE TITANIUM WATCH SET (Ensuring 100% consistency between Marketplace and Detail)
    const titaniumWatchMain = 'https://res.cloudinary.com/dojjfvya3/image/upload/v1777090892/Screenshot_2026-04-25_090754_ytz7e6.png';
    const titaniumWatchGallery = [
      'https://res.cloudinary.com/dojjfvya3/image/upload/v1777090892/Screenshot_2026-04-25_090754_ytz7e6.png', // Front
      'https://res.cloudinary.com/dojjfvya3/image/upload/v1777090892/Screenshot_2026-04-25_090739_wn3azf.png', // Side/Angle
      'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091821/Screenshot_2026-04-25_090846_qbjdhp.png', // Detail Side
      'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091885/Screenshot_2026-04-25_090907_xdgftk.png'  // Detail Face
    ];

    await Product.insertMany([
      {
        _id: new mongoose.Types.ObjectId('662b00000000000000000001'),
        name: 'Velocity Elite Pro X-1',
        category: 'TECH & WEARABLES',
        price: 42999,
        description: 'Precision engineered for elite retail environments. This performance-driven silhouette features our proprietary carbon-fiber weave and ultra-responsive cushioning for maximum comfort during long operational shifts.',
        rating: 5,
        reviewsCount: 128,
        status: 'IN_STOCK',
        store: stores[0]._id,
        image: titaniumWatchMain,
        images: titaniumWatchGallery,
        technicalSpecs: [
          { label: 'Dynamic Stability', value: 'Active torque management for precision cornering on polished floors.', icon: 'Zap' },
          { label: 'Aero-Mesh', value: 'Max breathability.', icon: 'Wind' },
          { label: '240g Ultra', value: 'Zero fatigue design.', icon: 'ShoppingBag' }
        ]
      },
      {
        _id: new mongoose.Types.ObjectId('662b00000000000000000002'),
        name: 'Vortex Runner Pro',
        category: 'SPORT & LIFESTYLE',
        price: 14500,
        description: 'Revolutionary gravity-defying sole technology for the urban explorer.',
        rating: 4.8,
        reviewsCount: 84,
        status: 'LOW_STOCK',
        store: stores[1]._id,
        image: 'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091857/Screenshot_2026-04-25_091233_hhrlql.png',
        images: [
          'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091857/Screenshot_2026-04-25_091233_hhrlql.png',
          'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091860/Screenshot_2026-04-25_091210_jtatwt.png',
          'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091879/Screenshot_2026-04-25_091346_yxrpdn.png',
          'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091892/Screenshot_2026-04-25_091407_evhbzp.png'
        ],
        technicalSpecs: [
          { label: 'Impact Absorption', value: '90% energy return.', icon: 'Zap' }
        ]
      },
      {
        _id: new mongoose.Types.ObjectId('662b00000000000000000003'),
        name: 'SonicMaster H1 Wireless',
        category: 'AUDIO',
        price: 28990,
        description: 'Immersive soundscapes with hybrid active noise cancellation.',
        rating: 4.9,
        reviewsCount: 210,
        status: 'IN_STOCK',
        store: stores[2]._id,
        image: 'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091839/Screenshot_2026-04-25_091037_ur1mwy.png',
        images: [
          'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091839/Screenshot_2026-04-25_091037_ur1mwy.png',
          'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091815/Screenshot_2026-04-25_091053_gldnvl.png',
          'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091876/Screenshot_2026-04-25_091044_jrhjca.png',
          'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091834/Screenshot_2026-04-25_091101_mgq9bt.png'
        ],
        technicalSpecs: [
          { label: 'Hi-Res Audio', value: 'Certified studio quality.', icon: 'Music' }
        ]
      },
      {
        _id: new mongoose.Types.ObjectId('662b00000000000000000004'),
        name: 'Classic Aviator Gold',
        category: 'ACCESSORIES',
        price: 18200,
        description: 'Handcrafted 24k gold plated frame with polarized Carl Zeiss lenses.',
        rating: 4.7,
        reviewsCount: 45,
        status: 'OUT_OF_STOCK',
        store: stores[0]._id,
        image: 'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091840/Screenshot_2026-04-25_091616_qx1ywr.png',
        images: [
          'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091840/Screenshot_2026-04-25_091616_qx1ywr.png',
          'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091876/Screenshot_2026-04-25_091626_o9ewfr.png',
          'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091891/Screenshot_2026-04-25_091634_nuxmxk.png',
          'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091886/Screenshot_2026-04-25_091647_wzza6r.png'
        ],
        technicalSpecs: [
          { label: 'UV400 Protection', value: 'Total eye safety.', icon: 'Sun' }
        ]
      }
    ]);
    console.log('Perfectly synced multi-view product data seeded successfully with stable IDs.');
  } catch (err) {
    console.error('Seeding error:', err);
  }
};

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
