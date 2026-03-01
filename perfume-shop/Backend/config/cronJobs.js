const cron = require('node-cron');
const Sale = require('../Admin/models/Sale');
const LimitedOffer = require('../Admin/models/LimitedOffer');
const Coupon = require('../Admin/models/Coupon');

// Function to delete expired sales (1 hour after end time)
const deleteExpiredSales = async () => {
  try {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - (60 * 60 * 1000)); // 1 hour ago

    // Find sales that ended more than 1 hour ago
    const expiredSales = await Sale.find({
      endDate: { $lt: oneHourAgo },
      status: { $in: ['active', 'expired'] }
    });

    if (expiredSales.length > 0) {
      // Delete expired sales
      const result = await Sale.deleteMany({
        endDate: { $lt: oneHourAgo },
        status: { $in: ['active', 'expired'] }
      });

      console.log(`✅ Deleted ${result.deletedCount} expired sales`);
      expiredSales.forEach(sale => {
        console.log(`   - ${sale.name} (ended: ${sale.endDate})`);
      });
    }
  } catch (error) {
    console.error('❌ Error deleting expired sales:', error);
  }
};

// Function to update sale statuses based on current time
const updateSaleStatuses = async () => {
  try {
    const now = new Date();

    // Update scheduled sales to active if start time has passed
    const activatedSales = await Sale.updateMany(
      {
        status: 'scheduled',
        startDate: { $lte: now },
        endDate: { $gte: now }
      },
      { $set: { status: 'active' } }
    );

    if (activatedSales.modifiedCount > 0) {
      console.log(`✅ Activated ${activatedSales.modifiedCount} scheduled sales`);
    }

    // Update active sales to expired if end time has passed
    const expiredSales = await Sale.updateMany(
      {
        status: 'active',
        endDate: { $lt: now }
      },
      { $set: { status: 'expired' } }
    );

    if (expiredSales.modifiedCount > 0) {
      console.log(`✅ Expired ${expiredSales.modifiedCount} active sales`);
    }
  } catch (error) {
    console.error('❌ Error updating sale statuses:', error);
  }
};

// Function to update limited offer statuses based on current time
const updateLimitedOfferStatuses = async () => {
  try {
    const now = new Date();

    // First, adjust any scheduled offers that are "today" in local timezone but future in UTC
    const scheduledOffers = await LimitedOffer.find({ status: 'scheduled' });
    
    for (const offer of scheduledOffers) {
      // Check if it's the same calendar day in local timezone
      const offerStartLocal = new Date(offer.startDate);
      const nowLocal = new Date(now);
      
      const isSameDay = 
        offerStartLocal.getFullYear() === nowLocal.getFullYear() &&
        offerStartLocal.getMonth() === nowLocal.getMonth() &&
        offerStartLocal.getDate() === nowLocal.getDate();
      
      if (isSameDay && offer.startDate > now) {
        // Adjust start date to beginning of today (local timezone)
        const newStartDate = new Date(now);
        newStartDate.setHours(0, 0, 0, 0);
        
        offer.startDate = newStartDate;
        await offer.save();
        console.log(`✅ Adjusted "${offer.title}" start date to local timezone`);
      }
    }

    // Update scheduled offers to active if start time has passed
    const activatedOffers = await LimitedOffer.updateMany(
      {
        status: 'scheduled',
        startDate: { $lte: now },
        endDate: { $gte: now }
      },
      { $set: { status: 'active' } }
    );

    if (activatedOffers.modifiedCount > 0) {
      console.log(`✅ Activated ${activatedOffers.modifiedCount} scheduled limited offers`);
    }

    // Update active offers to expired if end time has passed
    const expiredOffers = await LimitedOffer.updateMany(
      {
        status: 'active',
        endDate: { $lt: now }
      },
      { $set: { status: 'expired' } }
    );

    if (expiredOffers.modifiedCount > 0) {
      console.log(`✅ Expired ${expiredOffers.modifiedCount} active limited offers`);
    }
  } catch (error) {
    console.error('❌ Error updating limited offer statuses:', error);
  }
};

// Function to expire coupons at midnight based on their end date
const expireCoupons = async () => {
  try {
    const now = new Date();

    // Expire active coupons whose end date has passed
    const expiredCoupons = await Coupon.updateMany(
      {
        status: 'active',
        endDate: { $lt: now }
      },
      { $set: { status: 'expired' } }
    );

    if (expiredCoupons.modifiedCount > 0) {
      console.log(`✅ Expired ${expiredCoupons.modifiedCount} coupons at ${now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
    }

    // Also activate coupons whose start date has arrived
    const activatedCoupons = await Coupon.updateMany(
      {
        status: 'inactive',
        startDate: { $lte: now },
        endDate: { $gte: now }
      },
      { $set: { status: 'active' } }
    );

    if (activatedCoupons.modifiedCount > 0) {
      console.log(`✅ Activated ${activatedCoupons.modifiedCount} scheduled coupons`);
    }
  } catch (error) {
    console.error('❌ Error expiring coupons:', error);
  }
};

// Initialize cron jobs
const initCronJobs = () => {
  // Run every minute to update sale and limited offer statuses
  // Timezone: Asia/Kolkata (India) - UTC+5:30
  cron.schedule('* * * * *', () => {
    updateSaleStatuses();
    updateLimitedOfferStatuses();
  }, {
    timezone: "Asia/Kolkata"
  });

  // Run every hour to delete expired sales (1 hour after end time)
  // Timezone: Asia/Kolkata (India) - UTC+5:30
  cron.schedule('0 * * * *', () => {
    deleteExpiredSales();
  }, {
    timezone: "Asia/Kolkata"
  });

  // Run at midnight (12:00 AM) every day to expire coupons
  // Timezone: Asia/Kolkata (India) - UTC+5:30
  cron.schedule('0 0 * * *', () => {
    expireCoupons();
  }, {
    timezone: "Asia/Kolkata"
  });

  console.log('⏰ Cron jobs initialized (Timezone: Asia/Kolkata - IST):');
  console.log('   - Sale status updater: Every minute');
  console.log('   - Limited offer status updater: Every minute');
  console.log('   - Expired sale cleanup: Every hour');
  console.log('   - Coupon expiry check: Daily at 12:00 AM IST');
  console.log(`   - Current server time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
  
  // Run immediately on startup
  updateSaleStatuses();
  updateLimitedOfferStatuses();
  expireCoupons();
};

module.exports = { initCronJobs, deleteExpiredSales, updateSaleStatuses, updateLimitedOfferStatuses, expireCoupons };
