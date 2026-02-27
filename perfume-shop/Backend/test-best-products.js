const axios = require('axios');

async function testBestProductsAPI() {
  try {
    console.log('🧪 Testing Best Products API...\n');
    
    const response = await axios.get('http://localhost:5000/api/member/reviews/best-products?limit=8&minReviews=1');
    
    console.log('✅ API Response Status:', response.status);
    console.log('📊 Total Products:', response.data.count);
    console.log('\n📋 Products with Reviews:\n');
    
    response.data.data.forEach((item, index) => {
      console.log(`${index + 1}. ${item.product.name}`);
      console.log(`   ⭐ Average Rating: ${item.avgRating}`);
      console.log(`   💬 Review Count: ${item.reviewCount}`);
      console.log(`   💰 Price: ₹${item.product.finalPrice}`);
      console.log(`   🖼️  Image: ${item.product.mainImage ? 'Yes' : 'No'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testBestProductsAPI();
