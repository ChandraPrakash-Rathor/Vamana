const mongoose = require('mongoose');
const SiteSettings = require('./Admin/models/SiteSettings');
require('dotenv').config();

const seedSiteSettings = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    // Check if settings already exist
    const existingSettings = await SiteSettings.findOne();
    
    if (existingSettings) {
      console.log('Site settings already exist. Skipping seed.');
      process.exit(0);
    }

    // Create default site settings
    const settings = new SiteSettings({
      logo: '/uploads/logo.png',
      siteName: 'Vamana Perfumes',
      tagline: 'Premium Fragrances',
      email: 'contact@vamana.com',
      phone: '+91 1234567890',
      address: 'Mumbai, India',
      socialLinks: {
        facebook: 'https://facebook.com/vamana',
        instagram: 'https://instagram.com/vamana',
        twitter: 'https://twitter.com/vamana',
        youtube: 'https://youtube.com/vamana',
        linkedin: 'https://linkedin.com/company/vamana'
      },
      footerAbout: 'Discover the essence of luxury with our premium collection of perfumes.',
      footerCopyright: '© 2024 Vamana Perfumes. All rights reserved.',
      isActive: true
    });

    await settings.save();
    console.log('✅ Site settings seeded successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding site settings:', error);
    process.exit(1);
  }
};

seedSiteSettings();
