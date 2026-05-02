const mongoose = require('mongoose');
require('./models/Product');
require('./models/User');
const Negotiation = require('./models/Negotiation');

const check = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/retailbridge');
    const negs = await Negotiation.find().populate('product').populate('user');
    console.log(JSON.stringify(negs.map(n => ({
      id: n._id,
      product: n.product?.name,
      productId: n.product?._id,
      user: n.user?.name,
      userId: n.user?._id,
      status: n.status
    })), null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

check();
