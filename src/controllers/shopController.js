const Shop = require('../models/Shop');
const mongoose = require('mongoose');

// Function to remove old image data
const removeImage = (imageBase64) => {
  // Since we're using Base64 images, we don't need to delete files from the filesystem.
  // Simply remove the old Base64 string.
  return null;
};

const createShop = async (req, res) => {
  try {
    const { shopName, shopLocation, shopTiming, shopCategory, shopImage } = req.body;
    const shopkeeperId = req.user.id;

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
    const shopkeeperId = req.user.id;
    const shops = await Shop.find({ shopkeeperId });
    res.status(200).json(shops);
  } catch (error) {
    console.error('Error fetching shops:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
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

    // Remove old banner image
    shop.bannerImage = removeImage(shop.bannerImage);

    // Save new banner image
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

    // Remove old shop image
    shop.shopImage = removeImage(shop.shopImage);

    // Save new shop image
    shop.shopImage = req.body.shopImage;
    await shop.save();

    res.status(200).json(shop);
  } catch (error) {
    console.error('Error uploading shop image:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { createShop, getShops, getShopById, uploadBannerImage, uploadShopImage };
