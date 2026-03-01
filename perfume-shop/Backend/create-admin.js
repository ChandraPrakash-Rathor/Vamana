require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AuthModal = require('./Admin/models/AuthModal');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await AuthModal.findOne({ email: 'admin@vamana.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin already exists!');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Name:', existingAdmin.name);
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create admin
    const admin = await AuthModal.create({
      name: 'Admin',
      email: 'admin@vamana.com',
      password: hashedPassword,
      role: 'admin',
      status: true
    });

    console.log('✅ Admin created successfully!');
    console.log('\n📋 Admin Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    admin@vamana.com');
    console.log('🔑 Password: admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
