const Store = require('../models/Store');
const Product = require('../models/Product');

// @desc    Get the logged-in retailer's store
// @route   GET /api/stores/my-store
// @access  Private
exports.getMyStore = async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user._id });
    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }
    res.status(200).json({ success: true, store });
  } catch (error) {
    console.error('Error fetching my store:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Create a store for the logged-in retailer
// @route   POST /api/stores/my-store
// @access  Private
exports.createMyStore = async (req, res) => {
  try {
    // Check if retailer already has a store
    const existingStore = await Store.findOne({ owner: req.user._id });
    if (existingStore) {
      return res.status(400).json({ success: false, message: 'You already have a store created.' });
    }

    const { name, location, fullAddress, image, category, ownerName, ownerPhone, description } = req.body;

    const store = await Store.create({
      name,
      location,
      fullAddress,
      image,
      category,
      ownerName,
      ownerPhone,
      description,
      owner: req.user._id,
      status: 'Open Now',
      isOpen: true,
      rating: 5.0,
      reviewsCount: 0
    });

    res.status(201).json({ success: true, store });
  } catch (error) {
    console.error('Error creating store:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Add a product to my store
// @route   POST /api/stores/my-store/products
// @access  Private
exports.addProduct = async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user._id });
    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }

    const { name, category, price, description, status, image, technicalSpecs } = req.body;

    const product = await Product.create({
      name,
      category,
      price,
      description,
      status: status || 'IN_STOCK',
      image,
      images: [image], // Use the single image as the gallery initially
      store: store._id,
      rating: 5.0,
      reviewsCount: 0,
      technicalSpecs: technicalSpecs || []
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
