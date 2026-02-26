const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: 'https://i.pravatar.cc/150?img=10'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 5
  },
  review: {
    type: String,
    required: true
  },
  product: {
    type: String,
    default: ''
  },
  verified: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);
