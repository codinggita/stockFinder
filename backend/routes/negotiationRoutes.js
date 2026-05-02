const express = require('express');
const router = express.Router();
const {
  startNegotiation,
  getNegotiationDetails,
  sendMessage,
  acceptDeal,
  getAcceptedNegotiations,
  getStoreNegotiations,
  deleteNegotiation,
  rejectDeal
} = require('../controllers/negotiationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, startNegotiation);
router.get('/store', protect, getStoreNegotiations);
router.get('/accepted', protect, getAcceptedNegotiations);
router.get('/:id', protect, getNegotiationDetails);
router.post('/:id/messages', protect, sendMessage);
router.patch('/:id/accept', protect, acceptDeal);
router.patch('/:id/reject', protect, rejectDeal);
router.delete('/:id', protect, deleteNegotiation);

module.exports = router;
