const cron = require('node-cron');
const Sale = require('../Admin/models/Sale');

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

// Initialize cron jobs
const initCronJobs = () => {
  // Run every minute to update sale statuses
  cron.schedule('* * * * *', () => {
    updateSaleStatuses();
  });

  // Run every hour to delete expired sales (1 hour after end time)
  cron.schedule('0 * * * *', () => {
    deleteExpiredSales();
  });

  console.log('⏰ Cron jobs initialized:');
  console.log('   - Sale status updater: Every minute');
  console.log('   - Expired sale cleanup: Every hour');
};

module.exports = { initCronJobs, deleteExpiredSales, updateSaleStatuses };
