const express = require('express');
const { placeOrder, getOrders, getOrderById, updateOrderStatus, getOrdersByBuyer } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware'); // Import the authentication middleware

const router = express.Router();

router.post('/orders', protect, placeOrder); // Apply authentication middleware
router.get('/orders', protect, getOrders); // Apply authentication middleware
router.get('/orders/:id', protect, getOrderById); // Apply authentication middleware
router.patch('/orders/:id', protect, updateOrderStatus); // Apply authentication middleware
router.get('/orders/buyer', protect, getOrdersByBuyer); // Apply authentication middleware

module.exports = router;
