const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User'); // Import the User model

const placeOrder = async (req, res) => {
  try {
    const { cart, address, paymentMethod } = req.body;
    const buyerId = req.user ? req.user._id : 'dummyBuyerId'; // Use a dummy buyer ID if authentication is removed

    console.log("Request data received:", req.body); // Log request data
    console.log("Request user:", req.user); // Log user data

    // Validate request body
    if (!cart || !address || !paymentMethod) {
      console.log("Validation error: All fields are required");
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if cart is empty
    if (cart.length === 0) {
      console.log("Validation error: Cart is empty");
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Deduct stock for each product in the cart
    for (const item of cart) {
      const product = await Product.findById(item._id);
      if (!product) {
        console.log(`Validation error: Product not found (${item._id})`);
        return res.status(400).json({ message: `Product not found: ${item._id}` });
      }
      if (product.quantity < item.quantity) {
        console.log(`Validation error: Insufficient stock for product: ${product.name}`);
        return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
      }
      product.quantity -= item.quantity;
      await product.save();
    }

    // Calculate total amount
    const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    // Create a new order
    const order = new Order({
      buyerId,
      shopId: cart[0].shopId,
      address,
      paymentMethod,
      products: cart.map(item => ({
        productId: item._id,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
    });
    await order.save();

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('buyerId', 'name').populate('shopId', 'shopName').populate('shopkeeperId', 'name');
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate order ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findById(id)
      .populate('buyerId', 'name')
      .populate('shopId', 'shopName')
      .populate({
        path: 'products.productId',
        select: 'name price image', // Include product name, price, and image
      });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate order ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getOrdersByBuyer = async (req, res) => {
  try {
    const buyerId = req.user ? req.user._id : 'dummyBuyerId'; // Use a dummy buyer ID if authentication is removed

    // Validate buyer ID
    if (!mongoose.Types.ObjectId.isValid(buyerId)) {
      return res.status(400).json({ message: 'Invalid buyer ID' });
    }

    const orders = await Order.find({ buyerId: mongoose.Types.ObjectId(buyerId) }).populate('buyerId', 'name').populate('shopId', 'shopName').populate('shopkeeperId', 'name');
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { placeOrder, getOrders, getOrderById, updateOrderStatus, getOrdersByBuyer };
