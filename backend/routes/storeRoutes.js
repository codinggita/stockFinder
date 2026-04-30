const express = require('express');
const { getMyStore, createMyStore, addProduct } = require('../controllers/storeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/my-store', protect, getMyStore);
router.post('/my-store', protect, createMyStore);
router.post('/my-store/products', protect, addProduct);

module.exports = router;
