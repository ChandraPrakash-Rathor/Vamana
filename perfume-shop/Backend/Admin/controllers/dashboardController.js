const Product = require('../models/Product');
const Order = require('../../Member/models/order');
const Member = require('../../Member/models/Member');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Get total products count
    const totalProducts = await Product.countDocuments();

    // Get total users count
    const totalUsers = await Member.countDocuments();

    // Get total orders count
    const totalOrders = await Order.countDocuments();

    // Calculate total revenue from paid orders
    const revenueData = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // Get last month's data for comparison
    const lastMonthDate = new Date();
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

    // Last month revenue
    const lastMonthRevenue = await Order.aggregate([
      { 
        $match: { 
          paymentStatus: 'paid',
          createdAt: { $lt: lastMonthDate }
        } 
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const lastMonthRevenueTotal = lastMonthRevenue.length > 0 ? lastMonthRevenue[0].total : 0;

    // Last month orders
    const lastMonthOrders = await Order.countDocuments({
      createdAt: { $lt: lastMonthDate }
    });

    // Last month users
    const lastMonthUsers = await Member.countDocuments({
      createdAt: { $lt: lastMonthDate }
    });

    // Calculate percentage changes
    const revenueChange = lastMonthRevenueTotal > 0 
      ? (((totalRevenue - lastMonthRevenueTotal) / lastMonthRevenueTotal) * 100).toFixed(1)
      : 0;

    const ordersChange = lastMonthOrders > 0
      ? (((totalOrders - lastMonthOrders) / lastMonthOrders) * 100).toFixed(1)
      : 0;

    const usersChange = lastMonthUsers > 0
      ? (((totalUsers - lastMonthUsers) / lastMonthUsers) * 100).toFixed(1)
      : 0;

    // Get recent orders (last 5)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Manually populate user and product details
    const formattedOrders = await Promise.all(recentOrders.map(async (order) => {
      // Get user details
      let userName = 'Guest';
      if (order.userId) {
        const user = await Member.findById(order.userId).select('name');
        userName = user?.name || 'Guest';
      }

      // Get first product details
      let productName = 'Product';
      if (order.products && order.products.length > 0) {
        const product = await Product.findById(order.products[0].productId).select('name');
        productName = product?.name || 'Product';
      }

      return {
        id: order._id.toString().slice(-8).toUpperCase(),
        customer: userName,
        product: productName,
        amount: order.totalAmount,
        status: order.trackingStatus,
        date: order.createdAt
      };
    }));

    res.json({
      success: true,
      stats: {
        totalRevenue,
        revenueChange: `${revenueChange >= 0 ? '+' : ''}${revenueChange}%`,
        totalOrders,
        ordersChange: `${ordersChange >= 0 ? '+' : ''}${ordersChange}%`,
        totalProducts,
        productsChange: '+0', // Static for now as we don't track product history
        totalUsers,
        usersChange: `${usersChange >= 0 ? '+' : ''}${usersChange}%`
      },
      recentOrders: formattedOrders
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};
