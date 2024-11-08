const mongoose = require('mongoose');
const argon2 = require('argon2');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['buyer', 'shopkeeper', 'admin'],
        default: 'buyer'
    }
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await argon2.hash(this.password);
    next();
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await argon2.verify(this.password, enteredPassword);
};

module.exports = mongoose.model('User', UserSchema);
