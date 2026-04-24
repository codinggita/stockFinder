const express = require('express');
const router = express.Router();
const { getNearbyStores, getProducts, search } = require('../controllers/marketplaceController');

router.get('/stores/nearby', getNearbyStores);
router.get('/products', getProducts);
router.get('/search', search);

module.exports = router;
