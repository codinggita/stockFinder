const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  fullAddress: { type: String },
  coordinates: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number] }  // [lng, lat]
  },
  isOpen: { type: Boolean, default: true },
  status: { type: String, enum: ['Open Now', 'Closing Soon', 'Closed'], default: 'Open Now' },
  image: { type: String },
  category: { type: String },
  rating: { type: Number, default: 4.5 },
  reviewsCount: { type: Number, default: 0 },
  ownerName: { type: String },
  ownerPhone: { type: String },
  description: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

// 2dsphere index must be on the GeoJSON parent field, not the coordinates array
storeSchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('Store', storeSchema);
