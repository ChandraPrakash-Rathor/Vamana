const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['circle', 'arch'],
    required: true
  },
  topBadge: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  websiteUrl: {
    type: String,
    required: true
  },
  bottomBadge: {
    type: String,
    default: ''
  },
  bottomText: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Banner', bannerSchema);
