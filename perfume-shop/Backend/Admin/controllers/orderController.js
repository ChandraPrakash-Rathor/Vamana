const Order = require('../../Member/models/order');
const Member = require('../../Member/models/Member');
const Product = require('../models/Product');
const { success, error, notFound, validationError, isInvalidObjectId } = require('../../utils/apiResponse');

const VALID_PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'];
const VALID_TRACKING_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

// GET /api/admin/GetOrders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();

    if (orders.length === 0) {
      return success(res, [], 'Orders fetched successfully');
    }

    // Issue 2 fix: batch fetch instead of N+1 queries
    const userIds = [...new Set(orders.map(o => o.userId?.toString()).filter(Boolean))];
    const allProductIds = [...new Set(
      orders.flatMap(o => (o.products || []).map(p => p.productId?.toString()).filter(Boolean))
    )];

    const [users, products] = await Promise.all([
      Member.find({ _id: { $in: userIds } }).select('name email phone').lean(),
      Product.find({ _id: { $in: allProductIds } }).select('name mainImage').lean()
    ]);

    const userMap = Object.fromEntries(users.map(u => [u._id.toString(), u]));
    const productMap = Object.fromEntries(products.map(p => [p._id.toString(), p]));

    const ordersWithDetails = orders.map(order => ({
      ...order,
      userDetails: userMap[order.userId?.toString()] || null,
      products: (order.products || []).map(item => ({
        ...item,
        productDetails: productMap[item.productId?.toString()] || null
      }))
    }));

    return success(res, ordersWithDetails, 'Orders fetched successfully');
  } catch (err) {
    return error(res, 'Failed to fetch orders', 500, err);
  }
};

// GET /api/admin/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return notFound(res, 'Order not found');

    const user = await Member.findById(order.userId).select('name email phone').lean();

    const products = await Promise.all(
      (order.products || []).map(async (item) => {
        const product = await Product.findById(item.productId).select('name mainImage').lean();
        return { ...item, productDetails: product || null };
      })
    );

    return success(res, { ...order, userDetails: user || null, products }, 'Order fetched successfully');
  } catch (err) {
    if (isInvalidObjectId(err)) return notFound(res, 'Order not found');
    return error(res, 'Failed to fetch order', 500, err);
  }
};

// PUT /api/admin/orders/:id
exports.updateOrderStatus = async (req, res) => {
  try {
    const { paymentStatus, trackingStatus } = req.body;

    // Bug fix: empty body silently did nothing — now return 400
    if (!paymentStatus && !trackingStatus) {
      return validationError(res, 'Provide at least one of: paymentStatus, trackingStatus');
    }

    const updateData = {};

    if (paymentStatus) {
      if (!VALID_PAYMENT_STATUSES.includes(paymentStatus)) {
        return validationError(res, `Invalid paymentStatus. Must be one of: ${VALID_PAYMENT_STATUSES.join(', ')}`);
      }
      updateData.paymentStatus = paymentStatus;
    }

    if (trackingStatus) {
      if (!VALID_TRACKING_STATUSES.includes(trackingStatus)) {
        return validationError(res, `Invalid trackingStatus. Must be one of: ${VALID_TRACKING_STATUSES.join(', ')}`);
      }
      updateData.trackingStatus = trackingStatus;
    }

    const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!order) return notFound(res, 'Order not found');

    return success(res, order, 'Order status updated successfully');
  } catch (err) {
    if (isInvalidObjectId(err)) return notFound(res, 'Order not found');
    return error(res, 'Failed to update order', 500, err);
  }
};

// DELETE /api/admin/orders/:id
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return notFound(res, 'Order not found');

    return success(res, null, 'Order deleted successfully');
  } catch (err) {
    if (isInvalidObjectId(err)) return notFound(res, 'Order not found');
    return error(res, 'Failed to delete order', 500, err);
  }
};

// GET /api/admin/orders/stats
exports.getOrderStats = async (req, res) => {
  try {
    const [totalOrders, paidOrders, pendingOrders, failedOrders, totalRevenue] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ paymentStatus: 'paid' }),
      Order.countDocuments({ paymentStatus: 'pending' }),
      Order.countDocuments({ paymentStatus: 'failed' }),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);

    return success(res, {
      totalOrders, paidOrders, pendingOrders, failedOrders,
      totalRevenue: totalRevenue[0]?.total || 0
    }, 'Order stats fetched');
  } catch (err) {
    return error(res, 'Failed to fetch order stats', 500, err);
  }
};
