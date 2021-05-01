const mongoose = require('mongoose');

// User Schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  images: []
});

module.exports = mongoose.model('User', UserSchema, 'development');
