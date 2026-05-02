const mongoose = require('mongoose');
const Negotiation = require('./models/Negotiation');

const check = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/stockFinder');
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
