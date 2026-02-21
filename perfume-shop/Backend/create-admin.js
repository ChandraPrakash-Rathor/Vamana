const mongoose = require('mongoose');
const AuthModal = require('./Admin/models/AuthModal');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err.message));

// Create admin user
async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await AuthModal.findOne({ email: 'admin@vamana.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Password: admin123');
      process.exit(0);
    }

    // Create new admin
    const admin = await AuthModal.create({
      name: 'Admin User',
      email: 'admin@vamana.com',
      password: 'admin123',
      role: 'admin',
      status: true
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email:', admin.email);
    console.log('Password: admin123');
    console.log('\nYou can now login with these credentials.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
}

createAdmin();
