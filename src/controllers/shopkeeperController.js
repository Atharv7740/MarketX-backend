const Shopkeeper = require('../models/Shopkeeper');
const Shop = require('../models/Shop');  // Assuming there's a Shop model for the shops

// Get shopkeeper profile
const getShopkeeperProfile = async (req, res) => {
  try {
    const shopkeeper = await Shopkeeper.findById(req.user._id);
    if (!shopkeeper) {
      return res.status(404).json({ message: 'Shopkeeper not found' });
    }
    res.status(200).json(shopkeeper);
  } catch (error) {
    console.error('Error fetching shopkeeper profile:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get shopkeeper shops
const getShopkeeperShops = async (req, res) => {
  try {
    const shops = await Shop.find({ shopkeeper: req.user._id });
    if (!shops) {
      return res.status(404).json({ message: 'No shops found' });
    }
    res.status(200).json(shops);
  } catch (error) {
    console.error('Error fetching shops:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Create a shop
const createShop = async (req, res) => {
  try {
    const { shopName, shopCategory, shopLocation } = req.body;
    const newShop = new Shop({
      shopkeeper: req.user._id,
      shopName,
      shopCategory,
      shopLocation,
    });
    const shop = await newShop.save();
    res.status(201).json(shop);
  } catch (error) {
    console.error('Error creating shop:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getShopkeeperProfile, getShopkeeperShops, createShop };
