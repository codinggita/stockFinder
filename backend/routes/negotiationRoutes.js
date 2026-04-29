const express = require('express');
const router = express.Router();
const { 
  startNegotiation, 
  getNegotiationDetails, 
  sendMessage, 
  acceptDeal,
  getAcceptedNegotiations
} = require('../controllers/negotiationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, startNegotiation);
router.get('/accepted', protect, getAcceptedNegotiations);
router.get('/:id', protect, getNegotiationDetails);
router.post('/:id/messages', protect, sendMessage);
router.patch('/:id/accept', protect, acceptDeal);

module.exports = router;
