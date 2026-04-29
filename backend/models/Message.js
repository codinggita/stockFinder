const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  negotiation: { type: mongoose.Schema.Types.ObjectId, ref: 'Negotiation', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['TEXT', 'OFFER', 'COUNTER', 'ACCEPT', 'REJECT'], 
    default: 'TEXT' 
  },
  offerAmount: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
