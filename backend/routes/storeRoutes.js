const express = require('express');
const { getMyStore, createMyStore, addProduct, updateProduct, deleteProduct } = require('../controllers/storeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/my-store', protect, getMyStore);
router.post('/my-store', protect, createMyStore);
router.post('/my-store/products', protect, addProduct);
router.put('/my-store/products/:id', protect, updateProduct);
router.delete('/my-store/products/:id', protect, deleteProduct);

module.exports = router;
