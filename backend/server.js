const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const cartRoutes = require('./routes/cartRoutes');
const negotiationRoutes = require('./routes/negotiationRoutes');
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
app.use('/api/cart', cartRoutes);
app.use('/api/negotiations', negotiationRoutes);

const seedData = async () => {
  try {
    // FORCE CLEAR to fix the "messy" inconsistent state
    await Store.deleteMany({});
    await Product.deleteMany({});
    console.log('Database cleared for PERFECT IMAGE SYNC.');

    const storesData = [
      {
        _id: new mongoose.Types.ObjectId('662a00000000000000000001'),
        name: 'Reliance Digital Hub',
        location: 'Vastrapur, Ahmedabad',
        fullAddress: 'Alpha One Mall, Ahmedabad, Gujarat 380054',
        coordinates: { coordinates: [72.5244, 23.0396] },
        status: 'Open Now',
        isOpen: true,
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800',
        category: 'Electronic',
        rating: 4.8,
        reviewsCount: 2100,
        ownerName: 'Vikram Mehta',
        ownerPhone: '+91 98765 00001',
        description: 'Gujarat\'s largest electronics destination for the latest smartphones, laptops, and home appliances.'
      },
      {
        _id: new mongoose.Types.ObjectId('662a00000000000000000002'),
        name: 'Westside Urban Fashion',
        location: 'Dumas Road, Surat',
        fullAddress: 'VR Surat, Dumas Road, Surat, Gujarat 395007',
        coordinates: { coordinates: [72.7483, 21.1396] },
        status: 'Open Now',
        isOpen: true,
        image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=800',
        category: 'Clothe',
        rating: 4.7,
        reviewsCount: 1540,
        ownerName: 'Anjali Shah',
        ownerPhone: '+91 91234 00002',
        description: 'Premium contemporary clothing and lifestyle brand offering the latest trends in Surat.'
      },
      {
        _id: new mongoose.Types.ObjectId('662a00000000000000000003'),
        name: 'Tanishq Royal Jewels',
        location: 'Kalavad Road, Rajkot',
        fullAddress: 'Crystal Mall, Kalavad Road, Rajkot, Gujarat 360005',
        coordinates: { coordinates: [70.7748, 22.2856] },
        status: 'Open Now',
        isOpen: true,
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800',
        category: 'Jewels',
        rating: 4.9,
        reviewsCount: 980,
        ownerName: 'Haresh Bhai',
        ownerPhone: '+91 99887 00003',
        description: 'Exquisite diamond and gold jewelry that celebrates the heritage of Rajkot.'
      },
      {
        _id: new mongoose.Types.ObjectId('662a00000000000000000004'),
        name: 'FreshMart Grocery',
        location: 'Prahlad Nagar, Ahmedabad',
        fullAddress: 'Titanium City Center, Ahmedabad, Gujarat 380015',
        coordinates: { coordinates: [72.5064, 23.0120] },
        status: 'Open Now',
        isOpen: true,
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
        category: 'Grocery',
        rating: 4.6,
        reviewsCount: 3200,
        ownerName: 'Sanjay Patel',
        ownerPhone: '+91 98250 00004',
        description: 'Premium organic produce and daily essentials delivered fresh to Ahmedabad homes.'
      },
      {
        _id: new mongoose.Types.ObjectId('662a00000000000000000005'),
        name: 'Ethos Watch Studio',
        location: 'CG Road, Ahmedabad',
        fullAddress: 'Supermall, CG Road, Ahmedabad, Gujarat 380009',
        coordinates: { coordinates: [72.5621, 23.0248] },
        status: 'Open Now',
        isOpen: true,
        image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800',
        category: 'Watches',
        rating: 4.8,
        reviewsCount: 450,
        ownerName: 'Rajiv Sharma',
        ownerPhone: '+91 97230 00005',
        description: 'Authorized retailer for world-class luxury watch brands in Ahmedabad.'
      },
      {
        _id: new mongoose.Types.ObjectId('662a00000000000000000006'),
        name: 'Hamleys Toy World',
        location: 'Adajan, Surat',
        fullAddress: 'LP Savani Road, Adajan, Surat, Gujarat 395009',
        coordinates: { coordinates: [72.7933, 21.1959] },
        status: 'Open Now',
        isOpen: true,
        image: 'https://images.unsplash.com/photo-1640715787186-d456de067b22?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dG95JTIwc2hvcHxlbnwwfHwwfHx8MA%3D%3D',
        category: 'Toys',
        rating: 4.7,
        reviewsCount: 1200,
        ownerName: 'Deepak Chawla',
        ownerPhone: '+91 99980 00006',
        description: 'The finest toy shop in the world, bringing joy and magic to the children of Surat.'
      },
      {
        _id: new mongoose.Types.ObjectId('662a00000000000000000007'),
        name: 'Apple iStore',
        location: 'Race Course, Rajkot',
        fullAddress: 'Race Course Road, Rajkot, Gujarat 360001',
        coordinates: { coordinates: [70.7961, 22.3052] },
        status: 'Open Now',
        isOpen: true,
        image: 'https://images.unsplash.com/photo-1668984862920-1957a901a173?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'Phone',
        rating: 4.9,
        reviewsCount: 880,
        ownerName: 'Amit Trivedi',
        ownerPhone: '+91 98980 00007',
        description: 'Your local destination for all things Apple, from the latest iPhone to expert Mac support.'
      },
      {
        _id: new mongoose.Types.ObjectId('662a00000000000000000008'),
        name: 'Spaces Home Decor',
        location: 'Akota, Vadodara',
        fullAddress: 'Productivity Road, Akota, Vadodara, Gujarat 390020',
        coordinates: { coordinates: [73.1651, 22.2961] },
        status: 'Open Now',
        isOpen: true,
        image: 'https://images.unsplash.com/photo-1739134472894-16f657cb1aff?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'Spaces',
        rating: 4.5,
        reviewsCount: 620,
        ownerName: 'Preeti Vyas',
        ownerPhone: '+91 96010 00008',
        description: 'Curated furniture and interior spaces that define modern living in Vadodara.'
      },
      {
        _id: new mongoose.Types.ObjectId('662a00000000000000000009'),
        name: 'Nature\'s Basket',
        location: 'Piplod, Surat',
        fullAddress: 'Iscon Mall, Piplod, Surat, Gujarat 395007',
        coordinates: { coordinates: [72.7681, 21.1518] },
        status: 'Open Now',
        isOpen: true,
        image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=800',
        category: 'Grocery',
        rating: 4.7,
        reviewsCount: 1100,
        ownerName: 'Kunal Kapoor',
        ownerPhone: '+91 91234 00009',
        description: 'World food store offering premium global ingredients and organic delicacies in Surat.'
      },
      {
        _id: new mongoose.Types.ObjectId('662a00000000000000000010'),
        name: 'Kalyan Jewellers',
        location: 'Navrangpura, Ahmedabad',
        fullAddress: 'CG Road, Navrangpura, Ahmedabad, Gujarat 380009',
        coordinates: { coordinates: [72.5621, 23.0338] },
        status: 'Open Now',
        isOpen: true,
        image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=800',
        category: 'Jewels',
        rating: 4.6,
        reviewsCount: 2400,
        ownerName: 'Tushar Bhai',
        ownerPhone: '+91 98250 00010',
        description: 'India\'s most trusted jewelry brand now bringing traditional Gujarati designs to Ahmedabad.'
      },
      {
        _id: new mongoose.Types.ObjectId('662a00000000000000000011'),
        name: 'World of Titan',
        location: 'Yagnik Road, Rajkot',
        fullAddress: 'Yagnik Road, Rajkot, Gujarat 360001',
        coordinates: { coordinates: [70.7972, 22.2989] },
        status: 'Open Now',
        isOpen: true,
        image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800', // Premium Watch Boutique
        category: 'Watches',
        rating: 4.5,
        reviewsCount: 780,
        ownerName: 'Pankaj Advani',
        ownerPhone: '+91 99980 00011',
        description: 'Discover the widest range of Titan, Fastrack, and Sonata watches in the heart of Rajkot.'
      },
      {
        _id: new mongoose.Types.ObjectId('662a00000000000000000012'),
        name: 'Croma Electronics',
        location: 'Fatehgunj, Vadodara',
        fullAddress: 'Nizampura Main Road, Vadodara, Gujarat 390002',
        coordinates: { coordinates: [73.1852, 22.3272] },
        status: 'Open Now',
        isOpen: true,
        image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=800',
        category: 'Electronic',
        rating: 4.7,
        reviewsCount: 1850,
        ownerName: 'Nitin Gadkari',
        ownerPhone: '+91 97230 00012',
        description: 'A Tata product offering the best deals on gadgets and electronics in Vadodara.'
      },
      {
        _id: new mongoose.Types.ObjectId('662a00000000000000000013'),
        name: 'FirstCry Baby Care',
        location: 'Infocity, Gandhinagar',
        fullAddress: 'Infocity Circle, Gandhinagar, Gujarat 382007',
        coordinates: { coordinates: [72.6842, 23.2156] },
        status: 'Open Now',
        isOpen: true,
        image: 'https://images.unsplash.com/photo-1609713292783-5e45ec29b62d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        category: 'Toys',
        rating: 4.8,
        reviewsCount: 940,
        ownerName: 'Kavita Krishnamurthy',
        ownerPhone: '+91 96010 00013',
        description: 'Asia\'s largest online store for baby and kids products, now available at Gandhinagar Infocity.'
      },
      {
        _id: new mongoose.Types.ObjectId('662a00000000000000000014'),
        name: 'Pantaloons Lifestyle',
        location: 'Satellite, Ahmedabad',
        fullAddress: 'Satellite Road, Ahmedabad, Gujarat 380015',
        coordinates: { coordinates: [72.5244, 23.0225] },
        status: 'Open Now',
        isOpen: true,
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800',
        category: 'Clothe',
        rating: 4.5,
        reviewsCount: 1120,
        ownerName: 'Mansi Parekh',
        ownerPhone: '+91 95000 00014',
        description: 'Trendy apparel and accessories for the style-conscious youth of Ahmedabad.'
      },
      {
        _id: new mongoose.Types.ObjectId('662a00000000000000000015'),
        name: 'Samsung SmartCafe',
        location: 'Varachha, Surat',
        fullAddress: 'Varachha Main Road, Surat, Gujarat 395006',
        coordinates: { coordinates: [72.8617, 21.2120] },
        status: 'Open Now',
        isOpen: true,
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=800', // Premium Samsung Store Experience
        category: 'Phone',
        rating: 4.6,
        reviewsCount: 730,
        ownerName: 'Piyush Goyal',
        ownerPhone: '+91 94000 00015',
        description: 'Experience the latest Samsung Galaxy devices and innovative technology in Surat.'
      },
      {
        _id: new mongoose.Types.ObjectId('662a00000000000000000016'),
        name: 'Star Bazaar',
        location: 'Satellite, Ahmedabad',
        fullAddress: 'Iscon Emporio, Satellite Road, Ahmedabad, Gujarat 380015',
        coordinates: { coordinates: [72.5124, 23.0225] },
        status: 'Open Now',
        isOpen: true,
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
        category: 'Grocery',
        rating: 4.4,
        reviewsCount: 1560,
        ownerName: 'Bhavesh Shah',
        ownerPhone: '+91 98250 11116',
        description: 'The ultimate hypermarket experience for all your grocery and household needs in Ahmedabad.'
      }
    ];

    const stores = await Store.insertMany(storesData);

    // THE TITANIUM WATCH SET (Ensuring 100% consistency between Marketplace and Detail)
    const titaniumWatchMain = 'https://res.cloudinary.com/dojjfvya3/image/upload/v1777090892/Screenshot_2026-04-25_090754_ytz7e6.png';
    const titaniumWatchGallery = [
      'https://res.cloudinary.com/dojjfvya3/image/upload/v1777090892/Screenshot_2026-04-25_090754_ytz7e6.png',
      'https://res.cloudinary.com/dojjfvya3/image/upload/v1777090892/Screenshot_2026-04-25_090739_wn3azf.png',
      'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091821/Screenshot_2026-04-25_090846_qbjdhp.png',
      'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091885/Screenshot_2026-04-25_090907_xdgftk.png'
    ];

    await Product.insertMany([
      {
        _id: new mongoose.Types.ObjectId('662b00000000000000000001'),
        name: 'Benyar Skeleton Watch',
        category: 'Watches',
        price: 6499,
        description: 'Intricate skeleton dial revealing the precision mechanical movement. Genuine black leather strap and stainless steel case for the modern gentleman. This masterpiece combines traditional watchmaking with a bold, contemporary aesthetic, making it the perfect statement piece for any occasion.',
        rating: 4.8,
        reviewsCount: 1240,
        status: 'IN_STOCK',
        store: stores[10]._id, // World of Titan
        image: 'https://res.cloudinary.com/dojjfvya3/image/upload/v1777090892/Screenshot_2026-04-25_090754_ytz7e6.png',
        images: [
          'https://res.cloudinary.com/dojjfvya3/image/upload/v1777090892/Screenshot_2026-04-25_090754_ytz7e6.png',
          'https://res.cloudinary.com/dojjfvya3/image/upload/v1777090892/Screenshot_2026-04-25_090739_wn3azf.png',
          'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091821/Screenshot_2026-04-25_090846_qbjdhp.png',
          'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091885/Screenshot_2026-04-25_090907_xdgftk.png'
        ],
        technicalSpecs: [
          { label: 'Movement', value: 'Mechanical Skeleton', icon: 'Wind' },
          { label: 'Water Resist', value: '30M / 3 Bar', icon: 'Shield' }
        ]
      },
      {
        _id: new mongoose.Types.ObjectId('662b00000000000000000002'),
        name: 'Nike Air Force 1 \'07',
        category: 'Clothe',
        price: 7499,
        description: 'The radiance lives on in the Nike Air Force 1 \'07 shoes, the b-ball icon that puts a fresh spin on what you know best: crisp leather, bold colors and the perfect amount of flash to make you shine. Originally designed for performance hoops, these shoes deliver lasting comfort while the padded ankle and tongue add to the soft ride.',
        rating: 4.9,
        reviewsCount: 4500,
        status: 'IN_STOCK',
        store: stores[1]._id, // Westside
        image: 'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091857/Screenshot_2026-04-25_091233_hhrlql.png',
        images: [
          'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091860/Screenshot_2026-04-25_091210_jtatwt.png',
          'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091879/Screenshot_2026-04-25_091346_yxrpdn.png',
          'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091860/Screenshot_2026-04-25_091210_jtatwt.png',
          'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091892/Screenshot_2026-04-25_091407_evhbzp.png'
        ],
        sizes: ['8', '9', '10', '11', '12'],
        sizeType: 'UK',
        technicalSpecs: [
          { label: 'Material', value: 'Genuine Leather', icon: 'Shield' },
          { label: 'Sole', value: 'Nike Air Cushioning', icon: 'Zap' }
        ]
      },
      {
        _id: new mongoose.Types.ObjectId('662b00000000000000000003'),
        name: 'Classic Square Sunglasses',
        category: 'Clothe',
        price: 2499,
        description: 'Iconic square frames with polarized lenses for ultimate clarity and 100% UV protection. Crafted from premium acetate with reinforced metal hinges, these sunglasses combine durability with a timeless aesthetic that complements any face shape and style.',
        rating: 4.7,
        reviewsCount: 890,
        status: 'IN_STOCK',
        store: stores[13]._id, // Pantaloons
        image: 'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091876/Screenshot_2026-04-25_091626_o9ewfr.png',
        images: [
          'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091876/Screenshot_2026-04-25_091626_o9ewfr.png',
          'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091891/Screenshot_2026-04-25_091634_nuxmxk.png',
          'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091886/Screenshot_2026-04-25_091647_wzza6r.png',
          'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091840/Screenshot_2026-04-25_091616_qx1ywr.png'
        ],
        technicalSpecs: [
          { label: 'Lenses', value: 'Polarized UV400', icon: 'Sun' },
          { label: 'Frame', value: 'Premium Acetate', icon: 'Shield' }
        ]
      },
      {
        _id: new mongoose.Types.ObjectId('662b00000000000000000004'),
        name: 'Apple AirPods Max',
        category: 'Electronic',
        price: 42999,
        description: 'AirPods Max reimagine over-ear headphones. An Apple-designed dynamic driver provides immersive high-fidelity audio. Every detail, from canopy to cushions, has been designed for an exceptional fit. Industry-leading Active Noise Cancellation blocks outside noise, while Transparency mode lets it in.',
        rating: 4.8,
        reviewsCount: 1540,
        status: 'IN_STOCK',
        store: stores[6]._id, // Apple iStore
        image: 'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091876/Screenshot_2026-04-25_091044_jrhjca.png',
        images: [
          'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091876/Screenshot_2026-04-25_091044_jrhjca.png  ',
          'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091839/Screenshot_2026-04-25_091037_ur1mwy.png',
          'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091815/Screenshot_2026-04-25_091053_gldnvl.png',
          'https://res.cloudinary.com/dojjfvya3/image/upload/v1777091834/Screenshot_2026-04-25_091101_mgq9bt.png'
        ],
        technicalSpecs: [
          { label: 'Audio', value: 'High-Fidelity Sound', icon: 'Wind' },
          { label: 'ANC', value: 'Pro-grade Noise Cancel', icon: 'Shield' }
        ]
      },
      {
        _id: new mongoose.Types.ObjectId('662b00000000000000000005'),
        name: 'Diamond Solitaire Ring',
        category: 'Jewels',
        price: 84999,
        description: 'A classic 1-carat round brilliant cut diamond set in a signature 18k white gold four-prong setting. This exquisite solitaire ring captures the light from every angle, symbolizing eternal love and unmatched elegance. Certified for its clarity, color, and cut.',
        rating: 5,
        reviewsCount: 85,
        status: 'IN_STOCK',
        store: stores[2]._id, // Tanishq
        image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcS_X5ZwzrkFQPUU7yDBsA-MSEX6YOBhgmKVinIfFwE_m4znpuQ8ElR1Ks_XR1ytnUBu8_m1NXZKDyu2mu38VDTG1fQ8TrCFaQ',
        images: [
          'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcS_X5ZwzrkFQPUU7yDBsA-MSEX6YOBhgmKVinIfFwE_m4znpuQ8ElR1Ks_XR1ytnUBu8_m1NXZKDyu2mu38VDTG1fQ8TrCFaQ',
          'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTr8ji0koMFBi3z8RulSXPsu8PHSpNrnUqxxeZqWJxIcxSqR1IUcw6IBGusLYscwyunvkGrl_CWDFa2pwaO4sBqNIcltO_L',
          'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRNbOUbrGlgPpljk1YsdHCmRsYAOonPZDmc-5X7G_pvwfm7EvFvYqrNIZLIP2yF6gpJoZU6ZEBwjVxV73MO6LR9H7bHqw3ATA',
          'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRNbOUbrGlgPpljk1YsdHCmRsYAOonPZDmc-5X7G_pvwfm7EvFvYqrNIZLIP2yF6gpJoZU6ZEBwjVxV73MO6LR9H7bHqw3ATA',
        ],
        sizes: ['6', '7', '8', '9'],
        sizeType: 'US',
        technicalSpecs: [
          { label: 'Carat', value: '1.0 ct', icon: 'Star' }
        ]
      },
      {
        _id: new mongoose.Types.ObjectId('662b00000000000000000006'),
        name: 'LEGO Millennium Falcon',
        category: 'Toys',
        price: 54999,
        description: 'Welcome to the largest, most detailed LEGO Star Wars Millennium Falcon model ever created. With 7,500 pieces, it\'s one of the biggest LEGO models, period! This amazing LEGO interpretation of Han Solo’s unforgettable Corellian freighter has all the details that Star Wars fans of any age could wish for.',
        rating: 4.9,
        reviewsCount: 450,
        status: 'LOW_STOCK',
        store: stores[5]._id, // Hamleys
        image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTP5AEe__pZVWXjfXlm0e2uVChbTXU5rFD34QDwecmmmWH404uWiWWsC9nVgB7wZ2lG3NLy_Erq13-D6hMge0pabG6__3Uj',
        images: [
          'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTP5AEe__pZVWXjfXlm0e2uVChbTXU5rFD34QDwecmmmWH404uWiWWsC9nVgB7wZ2lG3NLy_Erq13-D6hMge0pabG6__3Uj',
          'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcT_iq3QmloFkQBwqYDJLjNlniSogb8piOy7wAxidoOCDZKhpjKQ5cvGkumzKiE6ikcmZrntMdDtlroS9B4DToKteLikxs42S_C-znKMNHPnGdwPLMhrQlvE',
          'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSR_9D6GBMRnIYTtOEm8ni4bA9zX7jjeGEjSyazleOE7oa1ypTfDFywWRE2wDx3DRkwsBuY-Khs2-ZwV4NrRhntJ35rujjs-OMuRo3LJ5L5X8hkkanFxX8yZQ',
          'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQzbgwAnqWUO5C7TBHfkQGjxV0BgpwQd01uAcC_AEHJORurZ6_0_z9AfQTHhnbZoEQXTvPvF56ybluoiPCMm3QChdvXPfOrwg'
        ],
        technicalSpecs: [
          { label: 'Pieces', value: '7,541', icon: 'Zap' }
        ]
      },
      {
        _id: new mongoose.Types.ObjectId('662b00000000000000000007'),
        name: 'Herman Miller Aeron',
        category: 'Spaces',
        price: 114999,
        description: 'The Herman Miller Aeron revolutionized office seating with its ergonomic design and breathable Pellicle suspension. Designed to support the human body in all its postures, it remains the gold standard for office comfort, health, and peak performance. Fully adjustable for a personalized fit.',
        rating: 4.8,
        reviewsCount: 890,
        status: 'IN_STOCK',
        store: stores[7]._id, // Spaces
        image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSwlevAbkj5g-2IhENu16286L6JRdqdBrD1zYBzxyjQYIkWkU5gGBoKX4lPXLs8j8uOIeuevHEQXFFp7j9qWrGtmfz8W-TAIV711TJcoVWidEpeG5-AtMH-Vg',
        images: [
          'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSwlevAbkj5g-2IhENu16286L6JRdqdBrD1zYBzxyjQYIkWkU5gGBoKX4lPXLs8j8uOIeuevHEQXFFp7j9qWrGtmfz8W-TAIV711TJcoVWidEpeG5-AtMH-Vg',
          'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQlPMuq8tAEiO8_a1lIzuXDq-rdQwIK_8sZwTVbbh7xGQfc4O0vOe3XsLW2zqRJFvVnoXEy6zcQ4xPyYQYGZ1i66u9XLDVp3Q1MhI0LVk1KDmR0A-1-QKruiQk',
          'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcS_qg8Be_AkNFwVI-djtLFj2Pr9CpmfZlgWCgpE_xsHbgkcLAfKsU05bDl_T4xNEf91dkgPqiNV-Cu0SBakNls10Vb-bdDCfkj-Frg4nWn-WZZSo91KQUh-Ag',
          'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSYZjeiqJB2GlA7O3rBZNWH9YzEBLwOoC-UGqhz240YlD79R0XdMVkVa9HQihXWpWLmD5Be9bgcy-nIIcnHjQzknUGmcBvb'
        ],
        sizes: ['Size A', 'Size B', 'Size C'],
        sizeType: 'Standard',
        technicalSpecs: [
          { label: 'Ergonomic', value: 'PostureFit SL', icon: 'Shield' }
        ]
      },
      {
        _id: new mongoose.Types.ObjectId('662b00000000000000000008'),
        name: 'Silk Banarasi Saree',
        category: 'Clothe',
        price: 12499,
        description: 'Exquisite hand-woven silk saree with intricate zari work, straight from the heritage looms of Varanasi. Featuring traditional motifs and a rich border, this Banarasi saree is a testament to India\'s textile artistry, perfect for weddings and special celebrations.',
        rating: 4.9,
        reviewsCount: 120,
        status: 'IN_STOCK',
        store: stores[13]._id, // Pantaloons
        image: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTI7odjJXudJ6csImkqtBhxwdjvU1Nyq_9Qru2fVollI5ZV-tdqD0UfgqGHLW5BNrsNZUjYpKahPnvBoPS1IJRyv2rXFg0q1wYxyw_5qyU',
        images: [
          'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTI7odjJXudJ6csImkqtBhxwdjvU1Nyq_9Qru2fVollI5ZV-tdqD0UfgqGHLW5BNrsNZUjYpKahPnvBoPS1IJRyv2rXFg0q1wYxyw_5qyU',
          'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRcIfk8ZlrrOY6sfsLkjyaXp-QUeI92HJtjjEIJFda4dNWqBXA2x7pp6ZkPfB1WlJ4dBPlREpxR0ITevTtPK6JwiXNsLlOiw2iFgkD62_KT',
          'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTPQIschkKrZdZWSihiKK881W1HRJxcdOvIqvJbITrZQ9mxg5l6s1YiIh37XpDTkTkDsNLBSVIif-EiCvn6Fj3_oRdaAKXM3uMyLyCmqTkl',
          'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRynJLUJrG5pE-vgnj_MmJq8fuY0di6u1kBCU9quwOQoRpKGcJ2vJJ38r40JUb0YMhDmkQGhg5kJc5_BtXVs39yCVznYdhpKy-Jkg619YI'
        ],
        technicalSpecs: [
          { label: 'Material', value: 'Pure Silk', icon: 'Star' }
        ]
      },
      {
        _id: new mongoose.Types.ObjectId('662b00000000000000000009'),
        name: 'Bose QC Ultra',
        category: 'Electronic',
        price: 31999,
        description: 'Bose QuietComfort Ultra Headphones offer world-class noise cancellation, breakthrough spatialized audio for more immersive listening, and ultimate comfort. CustomTune technology personalizes the sound to your ears, so everything you listen to is at its best.',
        rating: 4.7,
        reviewsCount: 1540,
        status: 'IN_STOCK',
        store: stores[11]._id, // Croma
        image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRgvcBEjdnLTOveQNRyA_I4h2q_kvGthbj3RfZpoXp6vpI2xPuMxkB5wv9u9vujSy4sLB96LFHluQRS20VdJVFcHZ6VT-oRvyQIiTU5pIN4nqQhTqetGa0j',
        images: [
          'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRjCTK7c-J9qO6aXK4xv8InIqyRW9OmGSni5NdvKEdAUACYWvK6yT0M6dHT_PjqWsQWKPBBQG7IpuUzQUMkPs2GsOjhj1lcUBd5y69kZhRQZPrBS_t2zHoKq1k',
          'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTx84bvsRS7uK4deKgRfo-PyBjGPYUeSsJ-RcUDDHvJsF2VhEdu9MGV5G4ahTHlBM52APhFwBShj6ob8hRob3iSz9qneneX09g6GAwl0WMpSlPgSv0bYPcIdKA',
          'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRYQPSUhe9Z0dERPsMjX7nsV70lCcgiBYp4xTu1rtTAfenKyaHiSAd6rxcupFsvoR3ydNhH8XWWQqew6cKZWvlZJ3RPR7EskncjXDlNXpFILYvzuHfoVpzX'
        ],
        technicalSpecs: [
          { label: 'ANC', value: 'CustomTune Technology', icon: 'Wind' }
        ]
      },
      {
        _id: new mongoose.Types.ObjectId('662b00000000000000000010'),
        name: 'Blueberry Gift Box',
        category: 'Grocery',
        price: 499,
        description: 'Experience the bursting flavor of plump, juicy, and antioxidant-rich blueberries. Hand-picked and imported for premium quality, this gift box contains the freshest Grade A berries, perfect for healthy snacking, baking, or as a thoughtful gourmet gift.',
        rating: 4.6,
        reviewsCount: 320,
        status: 'IN_STOCK',
        store: stores[8]._id, // Nature\'s Basket
        image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSd9K0b-RMJWjalb2B_x9itBQWakfS9EX9O90dY_U0l-If-XSw1Hzh6p2nW1fd4TEwIupmbrybBOg3ANwBujnXBbEs1VGQy5eP-EG3nRiwStcZIDWys5BeiBg',
        images: [
          'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSd9K0b-RMJWjalb2B_x9itBQWakfS9EX9O90dY_U0l-If-XSw1Hzh6p2nW1fd4TEwIupmbrybBOg3ANwBujnXBbEs1VGQy5eP-EG3nRiwStcZIDWys5BeiBg',
          'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQLUJsel61x3upS8OiOvEWl2z8RC5WxtlIT5zlAmHzJMRVYVXnmEUIAjJYwE-_jZ0X48t9_J2sRwP6dhhA-AP1C9iAXmtdUNGd6a_nKfY_0VVVU-81X4cW2xg',
          'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQDGxMJMnwljsOSU0eoQ9ftPb9bZIlOEBwuON78r8Zxlq8chJa5xywKGlujU4VAyiQLbnm06OgDBZxFXR7H7JpmfKvu4bxxaeFJxny8B5vkVwUDccnzHA5BVA',
          'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSO0O4cnj1LWvlGxindmO0t6ewYt_e6sU0lLoAdvidR5OqFu0b-b0aHkDO6m3VcnipNTJJdr2ITr6yOXBYaw83_3RQHe7P0bQ'
        ],
        sizes: ['250g', '500g', '1kg'],
        sizeType: 'Weight',
        technicalSpecs: [
          { label: 'Type', value: 'Imported Grade A', icon: 'ShoppingBag' }
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
