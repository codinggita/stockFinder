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

    const { name, category, price, description, status, image, images, technicalSpecs, sizeType, sizes } = req.body;

    const product = await Product.create({
      name,
      category,
      price,
      description,
      status: status || 'IN_STOCK',
      image,
      images: images && images.length > 0 ? images : (image ? [image] : []),
      store: store._id,
      rating: 5.0,
      reviewsCount: 0,
      technicalSpecs: technicalSpecs || [],
      sizeType: sizeType || null,
      sizes: sizes || []
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update a product in my store
// @route   PUT /api/stores/my-store/products/:id
// @access  Private
exports.updateProduct = async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user._id });
    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }

    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Make sure the product belongs to this store
    if (product.store.toString() !== store._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this product' });
    }

    const { name, category, price, description, status, image, images, technicalSpecs, sizeType, sizes } = req.body;

    product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        price,
        description,
        status: status || product.status,
        image,
        images: images && images.length > 0 ? images : (image ? [image] : product.images),
        technicalSpecs: technicalSpecs || product.technicalSpecs,
        sizeType: sizeType !== undefined ? sizeType : product.sizeType,
        sizes: sizes !== undefined ? sizes : product.sizes
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
