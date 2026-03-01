const Coupon = require('../../Admin/models/Coupon');
const Cart = require('../models/Cart');

// @desc    Validate and apply coupon to cart
// @route   POST /api/member/coupon/validate
// @access  Private
exports.validateCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body;

    console.log('🎫 Validating coupon:', couponCode);

    if (!couponCode) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code is required'
      });
    }

    // Find coupon by code
    const coupon = await Coupon.findOne({ 
      code: couponCode.toUpperCase() 
    }).populate('applicableProducts', '_id name category finalPrice');

    if (!coupon) {
      console.log('❌ Coupon not found');
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code'
      });
    }

    console.log('✅ Coupon found:', {
      code: coupon.code,
      status: coupon.status,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minPurchase: coupon.minPurchase,
      applicableProducts: coupon.applicableProducts.length,
      applicableCategories: coupon.applicableCategories
    });

    // Get user's cart
    const cart = await Cart.findOne({ user: req.member._id }).populate('items.product', '_id name category finalPrice');

    if (!cart || cart.items.length === 0) {
      console.log('❌ Cart is empty');
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    console.log('🛒 Cart items:', cart.items.length);

    // Calculate cart subtotal
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    console.log('💰 Cart subtotal:', subtotal);

    // Get product IDs and categories from cart
    const productIds = cart.items.map(item => item.product._id.toString());
    const categories = [...new Set(cart.items.map(item => item.product.category))];

    console.log('📦 Cart products:', productIds);
    console.log('🏷️ Cart categories:', categories);

    // Check if coupon can be used
    const canUseResult = coupon.canUse(subtotal, productIds, categories);
    console.log('✔️ Can use result:', canUseResult);

    if (!canUseResult.valid) {
      console.log('❌ Coupon validation failed:', canUseResult.message);
      return res.status(400).json({
        success: false,
        message: canUseResult.message
      });
    }

    // Find applicable items in cart
    let applicableItems = [];
    let applicableSubtotal = 0;

    // Priority 1: If specific products are defined, ONLY apply to those products
    if (coupon.applicableProducts.length > 0) {
      const applicableProductIds = coupon.applicableProducts.map(p => p._id.toString());
      applicableItems = cart.items.filter(item => 
        applicableProductIds.includes(item.product._id.toString())
      );
      console.log('📌 Coupon applies to SPECIFIC PRODUCTS only:', applicableProductIds);
    } 
    // Priority 2: If no specific products, check categories
    else if (!coupon.applicableCategories.includes('all')) {
      applicableItems = cart.items.filter(item => 
        coupon.applicableCategories.includes(item.product.category)
      );
      console.log('📌 Coupon applies to SPECIFIC CATEGORIES:', coupon.applicableCategories);
    } 
    // Priority 3: Apply to all items
    else {
      applicableItems = cart.items;
      console.log('📌 Coupon applies to ALL PRODUCTS');
    }

    console.log('✅ Applicable items:', applicableItems.length);

    // Calculate applicable subtotal
    applicableSubtotal = applicableItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    console.log('💵 Applicable subtotal:', applicableSubtotal);

    // Calculate discount
    const discount = coupon.calculateDiscount(applicableSubtotal);
    console.log('🎉 Discount calculated:', discount);

    // Prepare response
    res.json({
      success: true,
      message: 'Coupon applied successfully',
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discount: discount,
        applicableItems: applicableItems.map(item => ({
          productId: item.product._id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.price
        })),
        minPurchase: coupon.minPurchase,
        maxDiscount: coupon.maxDiscount
      }
    });

  } catch (error) {
    console.error('❌ Validate coupon error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all active coupons for display
// @route   GET /api/member/coupons
// @access  Public
exports.getActiveCoupons = async (req, res) => {
  try {
    const now = new Date();
    
    const coupons = await Coupon.find({
      status: 'active',
      startDate: { $lte: now },
      endDate: { $gte: now }
    })
      .select('code description discountType discountValue minPurchase maxDiscount')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: coupons.length,
      data: coupons
    });

  } catch (error) {
    console.error('❌ Get coupons error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
