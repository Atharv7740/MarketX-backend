const mongoose = require('mongoose');
const argon2 = require('argon2');

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['buyer', 'shopkeeper', 'admin'], default: 'buyer' },
  address: { type: String }, // Ensure address field is present
  image: { type: String } // Ensure image field is present
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const hashedPassword = await argon2.hash(this.password);
    this.password = hashedPassword;
    next();
  } catch (err) {
    next(err);
  }
});

// Method to verify password
userSchema.methods.verifyPassword = async function (password) {
  try {
    return await argon2.verify(this.password, password);
  } catch (err) {
    throw new Error('Password verification failed');
  }
};

const User = mongoose.model('User', userSchema);
module.exports = User;
