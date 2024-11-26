const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { createShop, getShops, getShopById, uploadBannerImage, uploadShopImage, getNearbyShops } = require('../controllers/shopController'); 

router.post('/', protect, createShop);
router.get('/', protect, getShops);
router.get('/nearby', protect, getNearbyShops); 
router.get('/:id', protect, getShopById);
router.post('/:id/banner-image', protect, uploadBannerImage);
router.post('/:id/shop-image', protect, uploadShopImage);

module.exports = router;
