const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Banner = require('./Admin/models/Banner');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

const banners = [
  {
    type: 'circle',
    topBadge: 'Fragrance & Elegance Co',
    title: 'Vamana Signature Collection',
    subtitle: 'Innovating the Perfume Industry with Sustainable & Sensory-Driven Solutions',
    bottomBadge: 'Crafted by: Vamana',
    websiteUrl: 'www.vamana.com',
    order: 1,
    isActive: true
  },
  {
    type: 'arch',
    topBadge: 'Vamana Fragrances',
    title: 'Exquisite Fragrances',
    subtitle: 'Awaken Your Senses, Embrace Timeless Elegance',
    bottomText: 'Crafted with Excellence • Since 2024',
    websiteUrl: 'www.vamana.com',
    order: 2,
    isActive: true
  },
  {
    type: 'modern',
    topBadge: 'Refined Essentials',
    title: 'Luxury Perfume\nPresentation',
    subtitle: 'Elegance Crafted for Modern Connoisseurs',
    bottomBadge: 'Master Perfumer',
    websiteUrl: 'www.vamana.com',
    order: 3,
    isActive: true
  }
];

const seedBanners = async () => {
  try {
    // Clear existing banners
    await Banner.deleteMany({});
    console.log('🗑️  Cleared existing banners');

    // Insert new banners
    const insertedBanners = await Banner.insertMany(banners);
    console.log('✅ Banners inserted successfully!');
    console.log(`📊 Total banners: ${insertedBanners.length}`);
    
    insertedBanners.forEach((banner, index) => {
      console.log(`\n🎨 Banner ${index + 1}:`);
      console.log(`   ID: ${banner._id}`);
      console.log(`   Type: ${banner.type}`);
      console.log(`   Title: ${banner.title}`);
      console.log(`   Top Badge: ${banner.topBadge}`);
    });

    console.log('\n✨ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding banners:', error);
    process.exit(1);
  }
};

seedBanners();
