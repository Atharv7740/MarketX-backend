const mongoose = require('mongoose');

const shopSchema = mongoose.Schema({
  shopName: {
    type: String,
    required: true,
  },
  shopImage: {
    type: String,
  },
  bannerImage: { // Add bannerImage field
    type: String,
  },
  shopLocation: {
    type: String,
    required: true,
  },
  shopTiming: {
    type: String,
  },
  shopCategory: {
    type: String,
  },
  shopkeeperId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Create an index on shopkeeperId to improve query performance
shopSchema.index({ shopkeeperId: 1 });

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;
