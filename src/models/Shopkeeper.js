const mongoose = require('mongoose');
const argon2 = require('argon2');

const shopkeeperSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String, // Store as Base64 string
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
shopkeeperSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  try {
    const hash = await argon2.hash(this.password);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

const Shopkeeper = mongoose.model('Shopkeeper', shopkeeperSchema);

module.exports = Shopkeeper;
