// Quick test script to verify Product API
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Product = require('./Admin/models/Product');

async function testAPI() {
  try {
    // Connect to MongoDB
    const MONGO_URI = 'mongodb://127.0.0.1:27017/vamana';
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Test 1: Create a product
    console.log('\n📝 Test 1: Creating a product...');
    const product = await Product.create({
      name: 'Eternal Rose',
      description: 'A luxurious rose fragrance that captures the essence of blooming roses in a French garden',
      category: 'perfume',
      actualPrice: 2499,
      discount: 10,
      stock: 50,
      mainImage: '/uploads/rose-main.jpg',
      subImages: ['/uploads/rose-1.jpg', '/uploads/rose-2.jpg'],
      featured: true,
      bestseller: false
    });
    console.log('✅ Product created:', product.name);
    console.log('   Final Price:', product.finalPrice);
    console.log('   Status:', product.status);

    // Test 2: Get all products
    console.log('\n📋 Test 2: Getting all products...');
    const products = await Product.find();
    console.log(`✅ Found ${products.length} product(s)`);

    // Test 3: Get product by ID
    console.log('\n🔍 Test 3: Getting product by ID...');
    const foundProduct = await Product.findById(product._id);
    console.log('✅ Product found:', foundProduct.name);

    // Test 4: Update product
    console.log('\n✏️  Test 4: Updating product...');
    foundProduct.stock = 75;
    foundProduct.discount = 15;
    await foundProduct.save();
    console.log('✅ Product updated');
    console.log('   New Stock:', foundProduct.stock);
    console.log('   New Final Price:', foundProduct.finalPrice);

    // Test 5: Get statistics
    console.log('\n📊 Test 5: Getting statistics...');
    const stats = {
      total: await Product.countDocuments(),
      active: await Product.countDocuments({ status: 'active' }),
      featured: await Product.countDocuments({ featured: true })
    };
    console.log('✅ Statistics:', stats);

    // Test 6: Delete product
    console.log('\n🗑️  Test 6: Deleting product...');
    await Product.findByIdAndDelete(product._id);
    console.log('✅ Product deleted');

    console.log('\n✅ All tests passed!');
    console.log('\n🚀 Your Product API is ready to use!');
    console.log('   Start server: npm run dev');
    console.log('   API Base URL: http://localhost:5000/api/admin/products');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 MongoDB connection closed');
  }
}

testAPI();
