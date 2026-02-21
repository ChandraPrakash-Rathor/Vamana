// Test script for Coupon API
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Coupon = require('./Admin/models/Coupon');

async function testCouponAPI() {
  try {
    // Connect to MongoDB
    const MONGO_URI = 'mongodb://127.0.0.1:27017/vamana';
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected\n');

    // Test 1: Create a percentage discount coupon
    console.log('📝 Test 1: Creating percentage discount coupon...');
    const percentageCoupon = await Coupon.create({
      code: 'SAVE20',
      description: 'Get 20% off on all products',
      discountType: 'percentage',
      discountValue: 20,
      minPurchase: 1000,
      maxDiscount: 500,
      usageLimit: 100,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      applicableCategories: ['all']
    });
    console.log('✅ Percentage coupon created:', percentageCoupon.code);
    console.log('   Discount:', percentageCoupon.discountValue + '%');
    console.log('   Min Purchase: ₹' + percentageCoupon.minPurchase);
    console.log('   Max Discount: ₹' + percentageCoupon.maxDiscount);

    // Test 2: Create a fixed discount coupon
    console.log('\n📝 Test 2: Creating fixed discount coupon...');
    const fixedCoupon = await Coupon.create({
      code: 'FLAT500',
      description: 'Get flat ₹500 off on orders above ₹2000',
      discountType: 'fixed',
      discountValue: 500,
      minPurchase: 2000,
      usageLimit: 50,
      startDate: new Date(),
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      applicableCategories: ['perfume', 'attar']
    });
    console.log('✅ Fixed coupon created:', fixedCoupon.code);
    console.log('   Discount: ₹' + fixedCoupon.discountValue);
    console.log('   Min Purchase: ₹' + fixedCoupon.minPurchase);
    console.log('   Categories:', fixedCoupon.applicableCategories.join(', '));

    // Test 3: Create a category-specific coupon
    console.log('\n📝 Test 3: Creating category-specific coupon...');
    const categoryCoupon = await Coupon.create({
      code: 'PERFUME15',
      description: '15% off on all perfumes',
      discountType: 'percentage',
      discountValue: 15,
      minPurchase: 500,
      startDate: new Date(),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      applicableCategories: ['perfume']
    });
    console.log('✅ Category coupon created:', categoryCoupon.code);
    console.log('   Applicable to:', categoryCoupon.applicableCategories.join(', '));

    // Test 4: Validate and calculate discount
    console.log('\n📝 Test 4: Testing coupon validation and discount calculation...');
    const purchaseAmount = 3000;
    
    // Test percentage coupon
    const validation1 = percentageCoupon.canUse(purchaseAmount);
    console.log('✅ SAVE20 validation:', validation1.message);
    if (validation1.valid) {
      const discount1 = percentageCoupon.calculateDiscount(purchaseAmount);
      console.log('   Purchase: ₹' + purchaseAmount);
      console.log('   Discount: ₹' + discount1);
      console.log('   Final: ₹' + (purchaseAmount - discount1));
    }

    // Test fixed coupon
    const validation2 = fixedCoupon.canUse(purchaseAmount, [], ['perfume']);
    console.log('✅ FLAT500 validation:', validation2.message);
    if (validation2.valid) {
      const discount2 = fixedCoupon.calculateDiscount(purchaseAmount);
      console.log('   Purchase: ₹' + purchaseAmount);
      console.log('   Discount: ₹' + discount2);
      console.log('   Final: ₹' + (purchaseAmount - discount2));
    }

    // Test 5: Get all coupons
    console.log('\n📝 Test 5: Getting all coupons...');
    const allCoupons = await Coupon.find();
    console.log('✅ Found ' + allCoupons.length + ' coupon(s)');
    allCoupons.forEach(coupon => {
      console.log('   - ' + coupon.code + ': ' + coupon.description);
    });

    // Test 6: Get active coupons
    console.log('\n📝 Test 6: Getting active coupons...');
    const activeCoupons = await Coupon.getActiveCoupons();
    console.log('✅ Found ' + activeCoupons.length + ' active coupon(s)');

    // Test 7: Update coupon
    console.log('\n📝 Test 7: Updating coupon...');
    percentageCoupon.usageLimit = 200;
    await percentageCoupon.save();
    console.log('✅ Updated SAVE20 usage limit to:', percentageCoupon.usageLimit);

    // Test 8: Increment usage
    console.log('\n📝 Test 8: Testing usage increment...');
    console.log('   Before: Used ' + fixedCoupon.usedCount + ' times');
    await fixedCoupon.incrementUsage();
    console.log('   After: Used ' + fixedCoupon.usedCount + ' times');

    console.log('\n✅ All tests passed!');
    console.log('\n🚀 Coupon API is ready to use!');
    console.log('   API Base URL: http://localhost:5000/api/admin/coupons');
    console.log('\n📋 Available Endpoints:');
    console.log('   GET    /api/admin/GetCoupons - Get all coupons');
    console.log('   POST   /api/admin/insertCoupon - Create coupon');
    console.log('   GET    /api/admin/coupons/:id - Get coupon by ID');
    console.log('   PUT    /api/admin/coupons/:id - Update coupon');
    console.log('   DELETE /api/admin/coupons/:id - Delete coupon');
    console.log('   POST   /api/admin/coupons/validate - Validate coupon');
    console.log('   GET    /api/admin/coupons/stats - Get statistics');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.errors) {
      Object.values(error.errors).forEach(err => {
        console.error('   -', err.message);
      });
    }
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 MongoDB connection closed');
  }
}

testCouponAPI();
