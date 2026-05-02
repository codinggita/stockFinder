const Negotiation = require('../models/Negotiation');
const Message = require('../models/Message');
const Product = require('../models/Product');
const Store = require('../models/Store');

exports.startNegotiation = async (req, res) => {
  try {
    const { productId } = req.body;
    console.log(`[startNegotiation] Customer ${req.user._id} initiating negotiation for product ${productId}`);
    
    const product = await Product.findById(productId).populate('store');
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Atomic check and create to prevent duplicates
    let negotiation = await Negotiation.findOneAndUpdate(
      { product: productId, user: req.user._id, status: 'PENDING' },
      {
        $setOnInsert: {
          product: productId,
          user: req.user._id,
          store: product.store._id,
          initialPrice: product.price,
          currentOffer: product.price
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(negotiation);
  } catch (err) {
    console.error('[startNegotiation Error]', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getNegotiationDetails = async (req, res) => {
  try {
    console.log(`[getNegotiationDetails] Fetching negotiation ${req.params.id}`);
    const negotiation = await Negotiation.findById(req.params.id)
      .populate('product')
      .populate('store');
    
    if (!negotiation) return res.status(404).json({ message: 'Negotiation not found' });

    const messages = await Message.find({ negotiation: req.params.id }).sort('createdAt');
    console.log(`[getNegotiationDetails] Found ${messages.length} messages`);
    
    res.status(200).json({ negotiation, messages });
  } catch (err) {
    console.error('[getNegotiationDetails Error]', err);
    res.status(500).json({ message: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { content, type, offerAmount } = req.body;
    console.log(`[sendMessage] Sender ${req.user._id} sending message in negotiation ${req.params.id}. Content: ${content}`);
    
    const message = await Message.create({
      negotiation: req.params.id,
      sender: req.user._id,
      content,
      type,
      offerAmount
    });

    if (offerAmount) {
      await Negotiation.findByIdAndUpdate(req.params.id, { currentOffer: offerAmount });
    }

    const negotiation = await Negotiation.findById(req.params.id).populate('store');
    
    if (req.io) {
      console.log(`[sendMessage] Emitting receive_message to room: negotiation_${req.params.id}`);
      req.io.to(`negotiation_${req.params.id}`).emit('receive_message', message);
    } else {
      console.log(`[sendMessage WARNING] req.io is UNDEFINED! Socket events will not be sent.`);
    }

    res.status(201).json(message);
  } catch (err) {
    console.error('[sendMessage Error]', err);
    res.status(500).json({ message: err.message });
  }
};

exports.acceptDeal = async (req, res) => {
  try {
    const negotiation = await Negotiation.findById(req.params.id).populate('store');
    if (!negotiation) return res.status(404).json({ message: 'Negotiation not found' });

    negotiation.status = 'ACCEPTED';
    negotiation.negotiatedPrice = negotiation.currentOffer;
    await negotiation.save();

    const message = await Message.create({
      negotiation: negotiation._id,
      sender: req.user.id,
      content: 'The deal has been accepted!',
      type: 'ACCEPT',
      offerAmount: negotiation.negotiatedPrice
    });

    if (req.io) {
      req.io.to(`negotiation_${req.params.id}`).emit('receive_message', message);
    }

    res.status(200).json(negotiation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.rejectDeal = async (req, res) => {
  try {
    const negotiation = await Negotiation.findById(req.params.id);
    if (!negotiation) return res.status(404).json({ message: 'Negotiation not found' });

    negotiation.status = 'REJECTED';
    await negotiation.save();

    const message = await Message.create({
      negotiation: negotiation._id,
      sender: req.user.id,
      content: 'The negotiation has been closed without a deal.',
      type: 'REJECT'
    });

    if (req.io) {
      req.io.to(`negotiation_${req.params.id}`).emit('receive_message', message);
    }

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

exports.getStoreNegotiations = async (req, res) => {
  try {
    const store = await Store.findOne({ owner: req.user.id });
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const negotiations = await Negotiation.find({ store: store._id })
      .populate('product')
      .populate('user', 'name email')
      .sort('-updatedAt');
      
    res.status(200).json(negotiations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteNegotiation = async (req, res) => {
  try {
    const negotiation = await Negotiation.findById(req.params.id);
    if (!negotiation) return res.status(404).json({ message: 'Negotiation not found' });

    // Ensure the user deleting it is either the customer or the store owner
    const isCustomer = (negotiation.user._id || negotiation.user).toString() === req.user.id;
    const store = await Store.findById(negotiation.store);
    const isStoreOwner = store && store.owner && store.owner.toString() === req.user.id;

    if (!isCustomer && !isStoreOwner) {
      return res.status(403).json({ message: 'Not authorized to delete this negotiation' });
    }

    // Delete associated messages
    await Message.deleteMany({ negotiation: negotiation._id });
    // Delete negotiation
    await Negotiation.findByIdAndDelete(negotiation._id);

    res.status(200).json({ message: 'Negotiation deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
