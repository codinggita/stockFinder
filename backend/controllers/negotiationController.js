const Negotiation = require('../models/Negotiation');
const Message = require('../models/Message');
const Product = require('../models/Product');

exports.startNegotiation = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId).populate('store');
    
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Check if negotiation already exists
    let negotiation = await Negotiation.findOne({
      product: productId,
      user: req.user.id,
      status: 'PENDING'
    });

    if (!negotiation) {
      negotiation = await Negotiation.create({
        product: productId,
        user: req.user.id,
        store: product.store._id,
        initialPrice: product.price,
        currentOffer: product.price
      });
      
      // Add initial system message or greeting
      await Message.create({
        negotiation: negotiation._id,
        sender: product.store.owner || req.user.id, // Mocking owner or using current user
        content: `I'm interested in ${product.name}. The current price is ₹${product.price}. Can we settle at a better price?`,
        type: 'TEXT'
      });
    }

    res.status(200).json(negotiation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getNegotiationDetails = async (req, res) => {
  try {
    const negotiation = await Negotiation.findById(req.params.id)
      .populate('product')
      .populate('store');
    
    if (!negotiation) return res.status(404).json({ message: 'Negotiation not found' });

    const messages = await Message.find({ negotiation: req.params.id }).sort('createdAt');
    
    res.status(200).json({ negotiation, messages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { content, type, offerAmount } = req.body;
    const message = await Message.create({
      negotiation: req.params.id,
      sender: req.user.id,
      content,
      type,
      offerAmount
    });

    if (offerAmount) {
      await Negotiation.findByIdAndUpdate(req.params.id, { currentOffer: offerAmount });
    }

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.acceptDeal = async (req, res) => {
  try {
    const negotiation = await Negotiation.findById(req.params.id);
    if (!negotiation) return res.status(404).json({ message: 'Negotiation not found' });

    negotiation.status = 'ACCEPTED';
    negotiation.negotiatedPrice = negotiation.currentOffer;
    await negotiation.save();

    await Message.create({
      negotiation: negotiation._id,
      sender: req.user.id,
      content: 'The deal has been accepted!',
      type: 'ACCEPT',
      offerAmount: negotiation.negotiatedPrice
    });

    res.status(200).json(negotiation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAcceptedNegotiations = async (req, res) => {
  try {
    const negotiations = await Negotiation.find({
      user: req.user.id,
      status: 'ACCEPTED'
    });
    res.status(200).json(negotiations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
