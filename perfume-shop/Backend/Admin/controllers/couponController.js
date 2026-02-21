const Coupon = require('../models/Coupon');

// @desc    Get all coupons
// @route   GET /api/admin/coupons
// @access  Private (Admin)
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find()
      .populate('applicableProducts', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      success: true,
      count: coupons.length,
      data: coupons
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single coupon by ID
// @route   GET /api/admin/coupons/:id
// @access  Private (Admin)
exports.getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
      .populate('applicableProducts', 'name category');

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.status(200).json({
      status: 'success',
      success: true,
      data: coupon
    });
  } catch (error) {
    console.error('Error in getCouponById:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get coupon by code
// @route   GET /api/admin/coupons/code/:code
// @access  Private (Admin)
exports.getCouponByCode = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ 
      code: req.params.code.toUpperCase() 
    }).populate('applicableProducts', 'name category');

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.status(200).json({
      status: 'success',
      success: true,
      data: coupon
    });
  } catch (error) {
    console.error('Error in getCouponByCode:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Create new coupon
// @route   POST /api/admin/coupons
// @access  Private (Admin)
exports.createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minPurchase,
      maxDiscount,
      usageLimit,
      startDate,
      endDate,
      applicableProducts,
      applicableCategories
    } = req.body;

    // Validation
    if (!code || !description || !discountType || !discountValue || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing'
      });
    }

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code already exists'
      });
    }

    // Create coupon
    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      description,
      discountType: discountType.toLowerCase(),
      discountValue: Number(discountValue),
      minPurchase: Number(minPurchase) || 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : null,
      usageLimit: usageLimit ? Number(usageLimit) : null,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      applicableProducts: applicableProducts || [],
      applicableCategories: applicableCategories || ['all']
    });

    res.status(201).json({
      status: 'success',
      success: true,
      message: 'Coupon created successfully',
      data: coupon
    });
  } catch (error) {
    console.error('Error creating coupon:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update coupon
// @route   PUT /api/admin/coupons/:id
// @access  Private (Admin)
exports.updateCoupon = async (req, res) => {
  try {
    let coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    // If updating code, check if new code already exists
    if (req.body.code && req.body.code.toUpperCase() !== coupon.code) {
      const existingCoupon = await Coupon.findOne({ 
        code: req.body.code.toUpperCase() 
      });
      if (existingCoupon) {
        return res.status(400).json({
          success: false,
          message: 'Coupon code already exists'
        });
      }
    }

    // Update fields
    const updateData = { ...req.body };
    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase();
    }
    if (updateData.discountType) {
      updateData.discountType = updateData.discountType.toLowerCase();
    }

    // Manual date validation for updates
    if (updateData.startDate && updateData.endDate) {
      const startDate = new Date(updateData.startDate);
      const endDate = new Date(updateData.endDate);
      if (endDate <= startDate) {
        return res.status(400).json({
          success: false,
          message: 'End date must be after start date'
        });
      }
    } else if (updateData.startDate && !updateData.endDate) {
      const startDate = new Date(updateData.startDate);
      if (coupon.endDate <= startDate) {
        return res.status(400).json({
          success: false,
          message: 'End date must be after start date'
        });
      }
    } else if (!updateData.startDate && updateData.endDate) {
      const endDate = new Date(updateData.endDate);
      if (endDate <= coupon.startDate) {
        return res.status(400).json({
          success: false,
          message: 'End date must be after start date'
        });
      }
    }

    coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        returnDocument: 'after',
        runValidators: false // Disable built-in validators since we're doing manual validation
      }
    );

    res.status(200).json({
      status: 'success',
      success: true,
      message: 'Coupon updated successfully',
      data: coupon
    });
  } catch (error) {
    console.error('Error in updateCoupon:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Delete coupon
// @route   DELETE /api/admin/coupons/:id
// @access  Private (Admin)
exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    await coupon.deleteOne();

    res.status(200).json({
      status: 'success',
      success: true,
      message: 'Coupon deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Error in deleteCoupon:', error);

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Validate coupon
// @route   POST /api/admin/coupons/validate
// @access  Private (Admin)
exports.validateCoupon = async (req, res) => {
  try {
    const { code, purchaseAmount, productIds, categories } = req.body;

    if (!code || !purchaseAmount) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code and purchase amount are required'
      });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code'
      });
    }

    // Check if coupon can be used
    const validation = coupon.canUse(purchaseAmount, productIds, categories);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    // Calculate discount
    const discount = coupon.calculateDiscount(purchaseAmount);
    const finalAmount = purchaseAmount - discount;

    res.status(200).json({
      status: 'success',
      success: true,
      message: 'Coupon is valid',
      data: {
        coupon: {
          code: coupon.code,
          description: coupon.description,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue
        },
        discount,
        finalAmount
      }
    });
  } catch (error) {
    console.error('Error in validateCoupon:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get coupon statistics
// @route   GET /api/admin/coupons/stats
// @access  Private (Admin)
exports.getCouponStats = async (req, res) => {
  try {
    const now = new Date();

    const totalCoupons = await Coupon.countDocuments();
    const activeCoupons = await Coupon.countDocuments({
      status: 'active',
      startDate: { $lte: now },
      endDate: { $gte: now }
    });
    const expiredCoupons = await Coupon.countDocuments({ status: 'expired' });
    const inactiveCoupons = await Coupon.countDocuments({ status: 'inactive' });

    // Most used coupons
    const mostUsed = await Coupon.find()
      .sort({ usedCount: -1 })
      .limit(5)
      .select('code description usedCount usageLimit');

    res.status(200).json({
      status: 'success',
      success: true,
      data: {
        totalCoupons,
        activeCoupons,
        expiredCoupons,
        inactiveCoupons,
        mostUsed
      }
    });
  } catch (error) {
    console.error('Error in getCouponStats:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
