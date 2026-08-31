const Store = require('../models/Store');
const Product = require('../models/Product');
const mongoose = require('mongoose');

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
};

// GET /api/marketplace/products
exports.getProducts = async (req, res) => {
  try {
    console.log('[getProducts] called with query:', req.query);

    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected. readyState=' + mongoose.connection.readyState);
    }

    const { category, search, minPrice, maxPrice, status, lat, lng, radius, storeId } = req.query;
    let query = {};

    if (category && category !== 'undefined') query.category = category;
    if (search && search !== 'undefined') query.name = { $regex: search, $options: 'i' };
    if (storeId && storeId !== 'undefined') query.store = storeId;

    if ((minPrice && minPrice !== 'undefined') || (maxPrice && maxPrice !== 'undefined')) {
      query.price = {};
      if (minPrice && minPrice !== 'undefined') query.price.$gte = Number(minPrice);
      if (maxPrice && maxPrice !== 'undefined') query.price.$lte = Number(maxPrice);
    }

    if (status !== undefined) {
      if (status === '') {
        return res.status(200).json({ success: true, products: [] });
      }
      const statusArray = typeof status === 'string'
        ? status.split(',')
        : Array.isArray(status) ? status : [status];

      const dbStatusMap = {
        'In Stock':        ['IN_STOCK', 'LOW_STOCK'],
        'Pre-order':       ['PRE_ORDER'],
        'Exclusive Access':['EXCLUSIVE'],
        'Out of Stock':    ['OUT_OF_STOCK']
      };

      let targetStatuses = [];
      statusArray.forEach(s => {
        if (dbStatusMap[s]) targetStatuses.push(...dbStatusMap[s]);
        else targetStatuses.push(s);
      });

      if (targetStatuses.length > 0) {
        query.status = { $in: targetStatuses };
      }
    }

    console.log('[getProducts] MongoDB query:', JSON.stringify(query));

    let products = await Product.find(query).populate('store');

    // Distance filtering
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);

      if (isNaN(userLat) || isNaN(userLng)) {
        throw new Error(`Invalid lat/lng values: lat=${lat}, lng=${lng}`);
      }

      products = products.map(product => {
        const p = product.toObject();
        if (p.store && p.store.coordinates && p.store.coordinates.coordinates) {
          p.distance = getDistance(userLat, userLng,
            p.store.coordinates.coordinates[1],
            p.store.coordinates.coordinates[0]);
        } else {
          p.distance = null;
        }
        return p;
      });

      if (radius && radius !== 'Anywhere') {
        const maxRadius = parseInt(radius.replace(/[^0-9]/g, '')) || Infinity;
        products = products.filter(p => p.distance !== null && parseFloat(p.distance) <= maxRadius);
      }

      products.sort((a, b) =>
        (parseFloat(a.distance) || Infinity) - (parseFloat(b.distance) || Infinity));
    }

    console.log(`[getProducts] returning ${products.length} products`);
    return res.status(200).json({ success: true, products });

  } catch (error) {
    console.error('[getProducts] ERROR:', error.message);
    console.error('[getProducts] STACK:', error.stack);
    return res.status(500).json({
      message: error.message,
      error: error.message
    });
  }
};

// GET /api/marketplace/stores/nearby
exports.getNearbyStores = async (req, res) => {
  try {
    console.log('[getNearbyStores] called with query:', req.query);

    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected. readyState=' + mongoose.connection.readyState);
    }

    const { lat, lng, maxDistance } = req.query;
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const maxDist = maxDistance && maxDistance !== 'undefined' ? parseFloat(maxDistance) : 50000;

    if (isNaN(userLat) || isNaN(userLng) || isNaN(maxDist)) {
      throw new Error(`Invalid lat/lng/maxDistance: lat=${lat}, lng=${lng}, maxDistance=${maxDistance}`);
    }

    const stores = await Store.find({
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [userLng, userLat]
          },
          $maxDistance: maxDist
        }
      }
    });
    console.log(`[getNearbyStores] found ${stores.length} stores`);

    const storesWithDistance = stores.map(store => {
      const storeCoords = store.coordinates && store.coordinates.coordinates;
      let distance = '0.0';
      if (storeCoords && storeCoords.length === 2) {
        distance = getDistance(userLat, userLng, storeCoords[1], storeCoords[0]);
      }
      return { ...store._doc, distance };
    }).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    return res.status(200).json({ success: true, stores: storesWithDistance });

  } catch (error) {
    console.error('[getNearbyStores] ERROR:', error.message);
    console.error('[getNearbyStores] STACK:', error.stack);
    return res.status(500).json({
      message: error.message,
      error: error.message
    });
  }
};

// GET /api/marketplace/search
exports.search = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: 'Query is required' });
    }

    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database not connected');
    }

    const escapedQuery = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp(`\\b${escapedQuery}`, 'i');

    const [products, stores] = await Promise.all([
      Product.find({
        $or: [
          { name: searchRegex },
          { category: searchRegex },
          { description: searchRegex }
        ]
      }).populate('store').limit(10).lean(),
      Store.find({
        $or: [
          { name: searchRegex },
          { location: searchRegex }
        ]
      }).limit(5).lean()
    ]);

    return res.status(200).json({ success: true, data: { products, stores } });

  } catch (error) {
    console.error('[search] ERROR:', error.message);
    console.error('[search] STACK:', error.stack);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/marketplace/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('store');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    const other = await Product.find({
      name: product.name,
      _id: { $ne: product._id }
    }).populate('store');

    return res.status(200).json({
      success: true,
      product,
      inventory: [
        { store: product.store, price: product.price, status: product.status },
        ...other.map(p => ({ store: p.store, price: p.price, status: p.status }))
      ]
    });
  } catch (error) {
    console.error('[getProductById] ERROR:', error.message);
    console.error('[getProductById] STACK:', error.stack);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/marketplace/stores/:id
exports.getStoreById = async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }
    return res.status(200).json({ success: true, store });
  } catch (error) {
    console.error('[getStoreById] ERROR:', error.message);
    console.error('[getStoreById] STACK:', error.stack);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/marketplace/stores/:id/products
exports.getStoreProducts = async (req, res) => {
  try {
    const products = await Product.find({ store: req.params.id });
    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.error('[getStoreProducts] ERROR:', error.message);
    console.error('[getStoreProducts] STACK:', error.stack);
    return res.status(500).json({ success: false, message: error.message });
  }
};
