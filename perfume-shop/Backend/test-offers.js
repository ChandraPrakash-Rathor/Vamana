const mongoose = require('mongoose');
const LimitedOffer = require('./Admin/models/LimitedOffer');
require('dotenv').config();

async function testOffers() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get all offers
    const allOffers = await LimitedOffer.find({}).populate('product');
    console.log('\n📊 Total Limited Offers:', allOffers.length);
    
    if (allOffers.length === 0) {
      console.log('❌ No limited offers found in database!');
      process.exit(0);
    }

    const now = new Date();
    console.log('\n🕐 Current Date:', now.toISOString());
    console.log('\n📋 Offer Details:\n');

    allOffers.forEach((offer, index) => {
      console.log(`${index + 1}. ${offer.title}`);
      console.log(`   Status: ${offer.status}`);
      console.log(`   Start Date: ${offer.startDate.toISOString()}`);
      console.log(`   End Date: ${offer.endDate.toISOString()}`);
      console.log(`   Product: ${offer.product ? offer.product.name : 'NOT FOUND'}`);
      console.log(`   Product Status: ${offer.product ? offer.product.status : 'N/A'}`);
      
      // Check if should be active
      const shouldBeActive = offer.startDate <= now && offer.endDate >= now;
      console.log(`   Should be active? ${shouldBeActive ? '✅ YES' : '❌ NO'}`);
      
      if (shouldBeActive && offer.status !== 'active') {
        console.log(`   ⚠️  STATUS MISMATCH! Should be 'active' but is '${offer.status}'`);
      }
      console.log('');
    });

    // Try to update statuses
    console.log('\n🔄 Attempting to update statuses...\n');
    
    let updatedCount = 0;
    for (const offer of allOffers) {
      const oldStatus = offer.status;
      offer.updateStatus();
      
      if (oldStatus !== offer.status) {
        await offer.save();
        console.log(`✅ Updated "${offer.title}" from ${oldStatus} to ${offer.status}`);
        updatedCount++;
      }
    }

    if (updatedCount === 0) {
      console.log('ℹ️  No status updates needed');
    } else {
      console.log(`\n✅ Updated ${updatedCount} offer(s)`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testOffers();
