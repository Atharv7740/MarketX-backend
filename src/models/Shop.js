const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
  shopName: {
    type: String,
    required: true,
  },
  shopImage: {
    type: String, // Store as Base64 string
    required: true,
  },
  bannerImage: {
    type: String, // Store as Base64 string
  },
  shopLocation: {
    type: String,
    required: true,
  },
  shopTiming: {
    type: String,
    required: true,
  },
  shopCategory: {
    type: String,
    required: true,
  },
  shopkeeperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Shop', ShopSchema);
