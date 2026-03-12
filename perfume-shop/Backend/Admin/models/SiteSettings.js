const mongoose = require('mongoose');

const SiteSettingsSchema = new mongoose.Schema({
  // Logo
  logo: {
    type: String,
    default: '/uploads/logo.png'
  },
  
  // Site Info
  siteName: {
    type: String,
    default: 'Vamana Perfumes'
  },
  tagline: {
    type: String,
    default: 'Premium Fragrances'
  },
  
  // Contact Info
  email: {
    type: String,
    default: 'contact@vamana.com'
  },
  phone: {
    type: String,
    default: '+91 1234567890'
  },
  address: {
    type: String,
    default: 'Mumbai, India'
  },
  
  // Social Links
  socialLinks: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    youtube: { type: String, default: '' },
    linkedin: { type: String, default: '' }
  },
  
  // Footer Content
  footerAbout: {
    type: String,
    default: 'Discover the essence of luxury with our premium collection of perfumes.'
  },
  footerCopyright: {
    type: String,
    default: '© 2024 Vamana Perfumes. All rights reserved.'
  },
  
  // Only one settings document should exist
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SiteSettings', SiteSettingsSchema);
