const Store = require('../models/Store');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Simple search implementation to isolate 500 error
exports.search = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ success: false, message: 'Query is required' });
    }

    // Check DB connection
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected');
    }

    // Escape regex characters and use word boundary at the start 
    // to prevent "Featuring" matching "ring"
    const escapedQuery = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp(`\\b${escapedQuery}`, 'i');

    // Run queries separately to see which one fails if any
    const products = await Product.find({
      $or: [
        { name: searchRegex },
        { category: searchRegex },
        { description: searchRegex }
      ]
    }).populate('store').limit(10).lean();

    const stores = await Store.find({
      $or: [
        { name: searchRegex },
        { location: searchRegex }
      ]
    }).limit(5).lean();

    return res.status(200).json({
      success: true,
      data: { products, stores }
    });

  } catch (error) {
    console.error('CRITICAL SEARCH ERROR:', error);
    return res.status(500).json({ 
      success: false, 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// ... keep other functions as they were (simplified for brevity here but I will write them fully)

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
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
    const stores = await Store.find();
    const storesWithDistance = stores.map(store => {
      const storeCoords = store.coordinates?.coordinates;
      let distance = '0.0';
      if (storeCoords && storeCoords.length === 2) {
        distance = getDistance(parseFloat(lat), parseFloat(lng), storeCoords[1], storeCoords[0]);
      }
      return { ...store._doc, distance };
    }).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    res.status(200).json({ success: true, stores: storesWithDistance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    if (category) query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    const products = await Product.find(query).populate('store');
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('store');
    if (!product) return res.status(404).json({ success: false, message: 'Not found' });
    const other = await Product.find({ name: product.name, _id: { $ne: product._id } }).populate('store');
    res.status(200).json({ success: true, product, inventory: [{ store: product.store, price: product.price, status: product.status }, ...other.map(p => ({ store: p.store, price: p.price, status: p.status }))] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, store });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStoreProducts = async (req, res) => {
  try {
    const products = await Product.find({ store: req.params.id });
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
