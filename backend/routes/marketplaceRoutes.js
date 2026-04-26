const express = require('express');
const router = express.Router();
const { getNearbyStores, getProducts, search, getProductById } = require('../controllers/marketplaceController');

router.get('/stores/nearby', getNearbyStores);
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.get('/search', search);

module.exports = router;
