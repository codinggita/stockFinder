const mongoose = require('mongoose');
require('./models/Product');
require('./models/User');
const Negotiation = require('./models/Negotiation');
const Message = require('./models/Message');

const cleanup = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/retailbridge');
    console.log('Connected to MongoDB');

    const duplicates = await Negotiation.aggregate([
      {
        $match: { status: 'PENDING' }
      },
      {
        $group: {
          _id: { product: '$product', user: '$user' },
          count: { $sum: 1 },
          ids: { $push: '$_id' }
        }
      },
      {
        $match: { count: { $gt: 1 } }
      }
    ]);

    console.log(`Found ${duplicates.length} duplicate sets`);

    for (const set of duplicates) {
      const [keep, ...remove] = set.ids;
      console.log(`Keeping ${keep}, removing ${remove.length} duplicates for product ${set._id.product}`);
      
      for (const id of remove) {
        await Message.deleteMany({ negotiation: id });
        await Negotiation.findByIdAndDelete(id);
      }
    }

    console.log('Cleanup complete');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

cleanup();
