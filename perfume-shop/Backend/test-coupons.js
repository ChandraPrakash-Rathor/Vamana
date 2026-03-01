const mongoose = require('mongoose');
const Coupon = require('./Admin/models/Coupon');

mongoose.connect('mongodb://localhost:27017/vamana')
  .then(async () => {
    console.log('✅ Connected to MongoDB\n');
    
    const coupons = await Coupon.find({});
    console.log(`📊 Total Coupons: ${coupons.length}\n`);
    
    if (coupons.length === 0) {
      console.log('❌ No coupons found in database!');
      console.log('Creating a test coupon...\n');
      
      const testCoupon = await Coupon.create({
        code: 'VAMANA10',
        description: 'Get 10% off on all products',
        discountType: 'percentage',
        discountValue: 10,
        minPurchase: 0,
        maxDiscount: 500,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2026-12-31'),
        status: 'active',
        applicableCategories: ['all']
      });
      
      console.log('✅ Test coupon created:', testCoupon.code);
    } else {
      coupons.forEach(c => {
        console.log(`📌 Code: ${c.code}`);
        console.log(`   Status: ${c.status}`);
        console.log(`   Type: ${c.discountType} - ${c.discountValue}${c.discountType === 'percentage' ? '%' : '₹'}`);
        console.log(`   Min Purchase: ₹${c.minPurchase}`);
        console.log(`   Start: ${c.startDate.toISOString()}`);
        console.log(`   End: ${c.endDate.toISOString()}`);
        console.log(`   Categories: ${c.applicableCategories.join(', ')}`);
        console.log(`   Products: ${c.applicableProducts.length} items`);
        console.log('');
      });
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
