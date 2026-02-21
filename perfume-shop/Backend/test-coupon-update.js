const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/admin';

// Test coupon update
async function testCouponUpdate() {
  try {
    console.log('🧪 Testing Coupon Update...\n');

    // First, get all coupons to find one to update
    console.log('1️⃣ Fetching existing coupons...');
    const getCouponsResponse = await axios.get(`${BASE_URL}/GetCoupons`);
    
    if (!getCouponsResponse.data.data || getCouponsResponse.data.data.length === 0) {
      console.log('❌ No coupons found. Please create a coupon first.');
      return;
    }

    const existingCoupon = getCouponsResponse.data.data[0];
    console.log('✅ Found coupon:', existingCoupon.code);
    console.log('   Current status:', existingCoupon.status);
    console.log('   Current discount:', existingCoupon.discountValue);
    console.log('   Start date:', existingCoupon.startDate);
    console.log('   End date:', existingCoupon.endDate);
    console.log('');

    // Test 1: Update with valid dates
    console.log('2️⃣ Testing update with valid dates...');
    const updateData1 = {
      code: existingCoupon.code,
      description: 'Updated description - Test',
      discountType: existingCoupon.discountType,
      discountValue: 25,
      minPurchase: existingCoupon.minPurchase,
      maxDiscount: existingCoupon.maxDiscount,
      usageLimit: existingCoupon.usageLimit,
      startDate: '2024-02-01',
      endDate: '2024-12-31',
      status: 'active',
      applicableCategories: ['all']
    };

    const updateResponse1 = await axios.put(
      `${BASE_URL}/coupons/${existingCoupon._id}`,
      updateData1
    );

    if (updateResponse1.data.status === 'success') {
      console.log('✅ Update successful!');
      console.log('   New discount value:', updateResponse1.data.data.discountValue);
      console.log('   New description:', updateResponse1.data.data.description);
    } else {
      console.log('❌ Update failed:', updateResponse1.data.message);
    }
    console.log('');

    // Test 2: Update with invalid dates (should fail)
    console.log('3️⃣ Testing update with invalid dates (end before start)...');
    const updateData2 = {
      code: existingCoupon.code,
      description: existingCoupon.description,
      discountType: existingCoupon.discountType,
      discountValue: existingCoupon.discountValue,
      minPurchase: existingCoupon.minPurchase,
      startDate: '2024-12-31',
      endDate: '2024-02-01', // End date before start date
      status: existingCoupon.status,
      applicableCategories: ['all']
    };

    try {
      await axios.put(
        `${BASE_URL}/coupons/${existingCoupon._id}`,
        updateData2
      );
      console.log('❌ Should have failed but succeeded!');
    } catch (error) {
      if (error.response && error.response.data.message === 'End date must be after start date') {
        console.log('✅ Correctly rejected invalid dates');
        console.log('   Error message:', error.response.data.message);
      } else {
        console.log('❌ Failed with unexpected error:', error.message);
      }
    }
    console.log('');

    // Test 3: Update only status
    console.log('4️⃣ Testing partial update (status only)...');
    const updateData3 = {
      status: 'inactive'
    };

    const updateResponse3 = await axios.put(
      `${BASE_URL}/coupons/${existingCoupon._id}`,
      updateData3
    );

    if (updateResponse3.data.status === 'success') {
      console.log('✅ Partial update successful!');
      console.log('   New status:', updateResponse3.data.data.status);
    } else {
      console.log('❌ Partial update failed:', updateResponse3.data.message);
    }
    console.log('');

    console.log('🎉 All update tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Response:', error.response.data);
    }
  }
}

// Run the test
testCouponUpdate();
