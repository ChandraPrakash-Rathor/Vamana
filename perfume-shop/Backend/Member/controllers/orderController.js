const Order = require("../models/order");
const crypto = require("crypto");
const {createRazorpayOrder} = require("../services/payment.service");
const { sendOrderPlacedSMS } = require("../../utils/smsHelper");
const Member = require("../models/Member");
const Product = require("../../Admin/models/Product");

/**
 * Deduct stock for each product in an order.
 * Also increments sales count and sets status to 'out-of-stock' if stock hits 0.
 * Called only for confirmed orders (COD placed, or Razorpay payment verified).
 */
const deductStock = async (products) => {
  for (const item of products) {
    const product = await Product.findById(item.productId);
    if (!product) continue;

    const newStock = Math.max(0, product.stock - item.quantity);
    product.stock = newStock;
    product.sales = (product.sales || 0) + item.quantity;

    if (newStock === 0) {
      product.status = 'out-of-stock';
    }

    await product.save();
  }
};

exports.createOrder = async(req,res)=>{

 try{

   const {userId,products,address,totalAmount,paymentMethod} = req.body;

   // Check if payment method is COD
   if (paymentMethod === 'cod') {
     const order = await Order.create({
       userId,
       products,
       address,
       totalAmount,
       paymentMethod: 'cod',
       paymentStatus: 'pending'
     });

     // Deduct stock immediately for COD (payment is guaranteed on delivery)
     await deductStock(products);

     // Send order confirmation SMS (non-blocking)
     const member = await Member.findById(userId).select('name phone').lean();
     if (member?.phone) {
       sendOrderPlacedSMS(member.phone, member.name, order._id, totalAmount).catch(() => {});
     }

     return res.json({
       success: true,
       orderId: order._id,
       message: 'Order placed successfully with COD'
     });
   }

   // For online payment (Razorpay)
   // 1️⃣ DB Order (Pending)
   const order = await Order.create({
     userId,
     products,
     address,
     totalAmount,
     paymentMethod: 'razorpay'
   });

   // 2️⃣ Razorpay Order
   const razorOrder =
     await createRazorpayOrder(
        totalAmount,
        order._id.toString()
     );

   // 3️⃣ Save Razorpay ID
   order.razorpayOrderId = razorOrder.id;
   await order.save();

   res.json({
     razorpayOrderId:razorOrder.id,
     amount:razorOrder.amount,
     orderId: order._id
   });

 }catch(err){
   res.status(500).json(err);
 }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Update order status to paid
      const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
      
      if (order) {
        order.paymentStatus = "paid";
        order.razorpayPaymentId = razorpay_payment_id;
        order.razorpaySignature = razorpay_signature;
        await order.save();

        // Deduct stock only after payment is confirmed — failed payments don't count
        await deductStock(order.products);

        // Send order confirmation SMS after successful payment (non-blocking)
        const member = await Member.findById(order.userId).select('name phone').lean();
        if (member?.phone) {
          sendOrderPlacedSMS(member.phone, member.name, order._id, order.totalAmount).catch(() => {});
        }

        return res.json({
          success: true,
          message: "Payment verified successfully",
          orderId: order._id
        });
      } else {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Cancel/abandon a pending Razorpay order (called when user dismisses payment modal)
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'orderId required' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Only cancel pending Razorpay orders — don't touch paid or COD
    if (order.paymentStatus === 'pending' && order.paymentMethod === 'razorpay') {
      order.paymentStatus = 'failed';
      await order.save();
    }

    return res.json({ success: true, message: 'Order cancelled' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.member?._id?.toString() || req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID required' });
    }

    // Only show meaningful orders — exclude abandoned/failed Razorpay sessions
    const orders = await Order.find({
      userId,
      $or: [
        { paymentStatus: 'paid' },
        { paymentStatus: 'refunded' },
        { paymentMethod: 'cod' }
      ]
    })
      .sort({ createdAt: -1 })
      .lean();

    // Populate product details
    const Product = require('../../Admin/models/Product');
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const productsWithDetails = await Promise.all(
          order.products.map(async (item) => {
            const product = await Product.findById(item.productId).select('name mainImage price');
            return {
              ...item,
              productDetails: product
            };
          })
        );

        return {
          ...order,
          products: productsWithDetails
        };
      })
    );

    res.json({ success: true, orders: ordersWithDetails });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single order by ID (for invoice)
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).lean();
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Populate product details
    const Product = require('../../Admin/models/Product');
    const Member = require('../models/Member');
    
    const productsWithDetails = await Promise.all(
      order.products.map(async (item) => {
        const product = await Product.findById(item.productId).select('name mainImage price');
        return {
          ...item,
          productDetails: product
        };
      })
    );

    // Get user details
    const user = await Member.findById(order.userId).select('name email phone');

    res.json({
      success: true,
      order: {
        ...order,
        products: productsWithDetails,
        userDetails: user
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
