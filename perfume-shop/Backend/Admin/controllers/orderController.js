const Order = require("../../Member/models/order");
const Member = require("../../Member/models/Member");
const Product = require("../models/Product");

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .lean();

    // Populate user and product details
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        // Get user details
        const user = await Member.findById(order.userId).select('name email phone');
        
        // Get product details
        const productsWithDetails = await Promise.all(
          order.products.map(async (item) => {
            const product = await Product.findById(item.productId).select('name mainImage');
            return {
              ...item,
              productDetails: product
            };
          })
        );

        return {
          ...order,
          userDetails: user,
          products: productsWithDetails
        };
      })
    );

    res.json(ordersWithDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single order
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Get user details
    const user = await Member.findById(order.userId).select('name email phone');
    
    // Get product details
    const productsWithDetails = await Promise.all(
      order.products.map(async (item) => {
        const product = await Product.findById(item.productId).select('name mainImage price');
        return {
          ...item,
          productDetails: product
        };
      })
    );

    res.json({
      ...order,
      userDetails: user,
      products: productsWithDetails
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { paymentStatus, trackingStatus } = req.body;
    
    const updateData = {};
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (trackingStatus) updateData.trackingStatus = trackingStatus;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order statistics
exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.countDocuments({ paymentStatus: 'paid' });
    const pendingOrders = await Order.countDocuments({ paymentStatus: 'pending' });
    const failedOrders = await Order.countDocuments({ paymentStatus: 'failed' });
    
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      totalOrders,
      paidOrders,
      pendingOrders,
      failedOrders,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
