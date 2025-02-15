const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Set a fallback for random byte generation using Node's crypto module
bcrypt.setRandomFallback((len) => {
  try {
    return crypto.randomBytes(len);
  } catch (error) {
    // Fallback using Math.random if crypto.randomBytes fails for some reason
    const buffer = Buffer.alloc(len);
    for (let i = 0; i < len; i++) {
      buffer[i] = Math.floor(Math.random() * 256);
    }
    return buffer;
  }
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    // Generate a salt and hash the password using the fallback-enabled bcrypt
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
