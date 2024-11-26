const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getShopkeeperProfile, getShopkeeperShops, createShop } = require('../controllers/shopkeeperController');

router.get('/profile', protect, getShopkeeperProfile);  // Endpoint for shopkeeper profile
router.get('/shops', protect, getShopkeeperShops);      // Endpoint for getting shops
router.post('/shops', protect, createShop);             // Endpoint for creating a shop

module.exports = router;
