const Product = require('../models/Product');
const Shop = require('../models/Shop');

const search = async (req, res) => {
  try {
    const query = req.query.q;
    const products = await Product.find({ name: { $regex: query, $options: 'i' } });
    const shops = await Shop.find({ shopName: { $regex: query, $options: 'i' } });
    
    res.json({ products, shops });
  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { search };
