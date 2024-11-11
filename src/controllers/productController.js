
const Product = require('../models/Product');

const createProduct = async (req, res) => {
  try {
    const { shopId, name, category, quantity, price, image } = req.body;

    const newProduct = new Product({
      shopId,
      name,
      category,
      quantity,
      price,
      image,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};



const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, category, quantity, price, image } = req.body;

    // Delete old product image if a new image is uploaded
    if (image && product.image !== image) {
      product.image = null;
    }

    product.name = name;
    product.category = category;
    product.quantity = quantity;
    product.price = price;
    if (image) product.image = image;

    await product.save();

    res.status(200).json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};




const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.remove();
    res.status(200).json({ message: 'Product removed' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


const getProducts = async (req, res) => {
  try {
    const shopId = req.query.shopId; // Get the shopId from query parameters
    const products = await Product.find({ shopId });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};



module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct };

