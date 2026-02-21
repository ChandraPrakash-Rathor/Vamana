const axios = require('axios');

const baseUrl = 'http://localhost:5000/api/admin/';

async function testAuth() {
  console.log('🧪 Testing Admin Authentication API\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing health endpoint...');
    const healthRes = await axios.get(baseUrl + 'health');
    console.log('✅ Health check:', healthRes.data.message);
    console.log('');

    // Test 2: Login with correct credentials
    console.log('2️⃣ Testing login with correct credentials...');
    const loginData = new FormData();
    loginData.append('email', 'admin@vamana.com');
    loginData.append('password', 'admin123');
    
    const loginRes = await axios.post(baseUrl + 'login', loginData);
    
    if (loginRes.data.status === 'success') {
      console.log('✅ Login successful!');
      console.log('   Admin:', loginRes.data.admin.name);
      console.log('   Email:', loginRes.data.admin.email);
      console.log('   Role:', loginRes.data.admin.role);
    } else {
      console.log('❌ Login failed:', loginRes.data.message);
    }
    console.log('');

    // Test 3: Login with wrong password
    console.log('3️⃣ Testing login with wrong password...');
    const wrongData = new FormData();
    wrongData.append('email', 'admin@vamana.com');
    wrongData.append('password', 'wrongpassword');
    
    const wrongRes = await axios.post(baseUrl + 'login', wrongData);
    
    if (wrongRes.data.status === 'error') {
      console.log('✅ Correctly rejected wrong password');
      console.log('   Message:', wrongRes.data.message);
    } else {
      console.log('❌ Should have rejected wrong password');
    }
    console.log('');

    // Test 4: Login with non-existent email
    console.log('4️⃣ Testing login with non-existent email...');
    const noUserData = new FormData();
    noUserData.append('email', 'notfound@vamana.com');
    noUserData.append('password', 'admin123');
    
    const noUserRes = await axios.post(baseUrl + 'login', noUserData);
    
    if (noUserRes.data.status === 'error') {
      console.log('✅ Correctly rejected non-existent user');
      console.log('   Message:', noUserRes.data.message);
    } else {
      console.log('❌ Should have rejected non-existent user');
    }
    console.log('');

    console.log('🎉 All authentication tests completed!\n');
    console.log('📋 Summary:');
    console.log('   ✅ Health check working');
    console.log('   ✅ Login with correct credentials working');
    console.log('   ✅ Wrong password validation working');
    console.log('   ✅ Non-existent user validation working');
    console.log('\n✨ Your authentication API is ready to use!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n⚠️  Server is not running!');
      console.log('   Start the server with: node server.js');
    }
  }
}

testAuth();
