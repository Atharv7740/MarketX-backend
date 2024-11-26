const express = require('express');
const router = express.Router();
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct, getFeaturedProducts } = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, createProduct);
router.get('/', protect, getProducts);
router.get('/featured', protect, getFeaturedProducts);
router.get('/:id', protect, getProductById);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
