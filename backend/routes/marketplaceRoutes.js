const express = require('express');
const router = express.Router();
const { getNearbyStores, getProducts, search, getProductById, getStoreById, getStoreProducts } = require('../controllers/marketplaceController');

router.get('/stores/nearby', getNearbyStores);
router.get('/stores/:id', getStoreById);
router.get('/stores/:id/products', getStoreProducts);
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.get('/search', search);

module.exports = router;
