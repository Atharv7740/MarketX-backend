const fs = require('fs');
const path = require('path');
const Shop = require('../models/Shop');
const User = require('../models/User');

const createShop = async (req, res) => {
  try {
    const { shopName, shopLocation, shopTiming, shopCategory, shopImage } = req.body;
    const shopkeeperId = req.user.id;

    if (!shopName || !shopLocation || !shopCategory || !shopImage) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newShop = new Shop({
      shopName,
      shopImage,
      shopLocation,
      shopTiming,
      shopCategory,
      shopkeeperId,
    });

    await newShop.save();
    res.status(201).json(newShop);
  } catch (error) {
    console.error('Error creating shop:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getShops = async (req, res) => {
  try {
    const shopkeeperId = req.user.id; // Get shopkeeper ID from the authenticated user
    const shops = await Shop.find({ shopkeeperId }).populate('shopkeeperId', 'name'); // Populate shopkeeper's name
    res.status(200).json(shops);
  } catch (error) {
    console.error('Error fetching shops:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).populate('shopkeeperId', 'name'); // Populate shopkeeper's name
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    res.status(200).json(shop);
  } catch (error) {
    console.error('Error fetching shop:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const uploadBannerImage = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    // Remove the previous banner image file if it exists
    if (shop.bannerImage) {
      const previousImagePath = path.join(__dirname, '..', 'uploads', shop.bannerImage);
      if (fs.existsSync(previousImagePath)) {
        fs.unlinkSync(previousImagePath);
      }
    }

    shop.bannerImage = req.body.bannerImage;
    await shop.save();

    res.status(200).json(shop);
  } catch (error) {
    console.error('Error uploading banner image:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const uploadShopImage = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    // Remove the previous shop image file if it exists
    if (shop.shopImage) {
      const previousImagePath = path.join(__dirname, '..', 'uploads', shop.shopImage);
      if (fs.existsSync(previousImagePath)) {
        fs.unlinkSync(previousImagePath);
      }
    }

    shop.shopImage = req.body.shopImage;
    await shop.save();

    res.status(200).json(shop);
  } catch (error) {
    console.error('Error uploading shop image:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getNearbyShops = async (req, res) => {
  try {
    const shops = await Shop.find().populate('shopkeeperId', 'name'); // Populate shopkeeper's name
    res.status(200).json(shops);
  } catch (error) {
    console.error('Error fetching nearby shops:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { createShop, getShops, getShopById, uploadBannerImage, uploadShopImage, getNearbyShops };
