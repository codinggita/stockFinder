const Store = require('../models/Store');
const Product = require('../models/Product');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

// Helper to calculate distance using Haversine formula (simplified for local use if not using MongoDB $geoNear)
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
};

exports.getNearbyStores = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
    }

    const stores = await Store.find();
    const storesWithDistance = stores.map(store => {
      const storeCoords = store.coordinates?.coordinates;
      let distance = '0.0';
      
      if (storeCoords && storeCoords.length === 2) {
        distance = getDistance(parseFloat(lat), parseFloat(lng), storeCoords[1], storeCoords[0]);
      }
      
      return {
        ...store._doc,
        distance
      };
    }).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    res.status(200).json({ success: true, stores: storesWithDistance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    let query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (search) query.name = { $regex: search, $options: 'i' };

    const products = await Product.find(query).populate('store');
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.search = async (req, res) => {
  try {
    const { q, location } = req.query;
    if (!q) return res.status(400).json({ success: false, message: 'Search query is required' });

    const cacheKey = `search_${q}_${location}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log('Cache Hit');
      return res.status(200).json({ success: true, data: cachedData });
    }

    console.log('Cache Miss');
    const [products, stores] = await Promise.all([
      Product.find({ name: { $regex: q, $options: 'i' } }).limit(10),
      Store.find({ name: { $regex: q, $options: 'i' } }).limit(5)
    ]);

    const results = { products, stores };
    cache.set(cacheKey, results);

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate('store');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    // Also find other stores that have this same product (matching by name/category for now)
    const otherStores = await Product.find({ 
      name: product.name, 
      _id: { $ne: product._id } 
    }).populate('store');

    res.status(200).json({ 
      success: true, 
      product,
      inventory: [
        { store: product.store, price: product.price, status: product.status },
        ...otherStores.map(p => ({ store: p.store, price: p.price, status: p.status }))
      ]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
