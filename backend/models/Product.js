const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  rating: { type: Number, default: 5 },
  reviewsCount: { type: Number, default: 0 },
  status: { type: String, enum: ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'PRE_ORDER', 'EXCLUSIVE'], default: 'IN_STOCK' },
  image: { type: String },
  images: [{ type: String }],
  sizes: [{ type: String }], // e.g., ["8", "9", "10"] or ["S", "M", "L"]
  sizeType: { type: String }, // e.g., "UK", "US", "Standard"
  technicalSpecs: [
    {
      label: { type: String },
      value: { type: String },
      icon: { type: String }
    }
  ],
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
