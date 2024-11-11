const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  createShop,
  getShops,
  getShopById,
  uploadBannerImage,
  uploadShopImage,
} = require('../controllers/shopController');

// Existing routes
router.post('/shops', protect, createShop);
router.get('/shops', protect, getShops);
router.get('/shops/:id', protect, getShopById);

// New routes for image uploads
router.post('/shops/:id/upload-banner', protect, uploadBannerImage);
router.post('/shops/:id/upload-shop-image', protect, uploadShopImage);

module.exports = router;

