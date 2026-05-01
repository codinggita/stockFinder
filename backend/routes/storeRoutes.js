const express = require('express');
const { getMyStore, createMyStore, addProduct, updateProduct } = require('../controllers/storeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/my-store', protect, getMyStore);
router.post('/my-store', protect, createMyStore);
router.post('/my-store/products', protect, addProduct);
router.put('/my-store/products/:id', protect, updateProduct);

module.exports = router;
