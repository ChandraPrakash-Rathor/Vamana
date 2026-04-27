const Coupon = require('../models/Coupon');
const { success, created, error, validationError, notFound, isInvalidObjectId, getValidationMessages } = require('../../utils/apiResponse');

const VALID_DISCOUNT_TYPES = ['percentage', 'fixed'];

// GET /api/admin/GetCoupons
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find()
      .populate('applicableProducts', 'name')
      .sort({ createdAt: -1 });

    return success(res, { coupons, count: coupons.length }, 'Coupons fetched successfully');
  } catch (err) {
    return error(res, 'Failed to fetch coupons', 500, err);
  }
};

// GET /api/admin/coupons/:id
exports.getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
      .populate('applicableProducts', 'name category');

    if (!coupon) return notFound(res, 'Coupon not found');

    return success(res, coupon, 'Coupon fetched successfully');
  } catch (err) {
    if (isInvalidObjectId(err)) return notFound(res, 'Coupon not found');
    return error(res, 'Failed to fetch coupon', 500, err);
  }
};

// GET /api/admin/coupons/code/:code
exports.getCouponByCode = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      code: req.params.code.toUpperCase().trim()
    }).populate('applicableProducts', 'name category');

    if (!coupon) return notFound(res, 'Coupon not found');

    return success(res, coupon, 'Coupon fetched successfully');
  } catch (err) {
    return error(res, 'Failed to fetch coupon', 500, err);
  }
};

// POST /api/admin/insertCoupon
exports.createCoupon = async (req, res) => {
  try {
    const {
      code, description, discountType, discountValue,
      minPurchase, maxDiscount, usageLimit,
      startDate, endDate, applicableProducts, applicableCategories
    } = req.body;

    // Required field validation
    if (!code?.trim() || !description?.trim() || !discountType || discountValue === undefined || !startDate || !endDate) {
      return validationError(res, 'Required fields missing: code, description, discountType, discountValue, startDate, endDate');
    }

    // Bug fix: "flat" was accepted but model only allows "fixed"
    if (!VALID_DISCOUNT_TYPES.includes(discountType.toLowerCase())) {
      return validationError(res, `Invalid discountType. Must be one of: ${VALID_DISCOUNT_TYPES.join(', ')}`);
    }

    const parsedValue = Number(discountValue);
    if (isNaN(parsedValue) || parsedValue <= 0) {
      return validationError(res, 'discountValue must be a positive number');
    }

    // Bug fix: percentage > 100 was not validated
    if (discountType.toLowerCase() === 'percentage' && parsedValue > 100) {
      return validationError(res, 'Percentage discount cannot exceed 100');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return validationError(res, 'Invalid date format for startDate or endDate');
    }

    if (end <= start) {
      return validationError(res, 'endDate must be after startDate');
    }

    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (existingCoupon) {
      return error(res, 'Coupon code already exists', 400);
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase().trim(),
      description: description.trim(),
      discountType: discountType.toLowerCase(),
      discountValue: parsedValue,
      minPurchase: Number(minPurchase) || 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : null,
      usageLimit: usageLimit ? Number(usageLimit) : null,
      startDate: start,
      endDate: end,
      applicableProducts: applicableProducts || [],
      applicableCategories: applicableCategories || ['all']
    });

    return created(res, coupon, 'Coupon created successfully');
  } catch (err) {
    if (err.name === 'ValidationError') return validationError(res, 'Validation failed', getValidationMessages(err));
    return error(res, 'Failed to create coupon', 500, err);
  }
};

// PUT /api/admin/coupons/:id
exports.updateCoupon = async (req, res) => {
  try {
    let coupon = await Coupon.findById(req.params.id);
    if (!coupon) return notFound(res, 'Coupon not found');

    const updateData = { ...req.body };

    // Validate discountType if being updated
    if (updateData.discountType) {
      if (!VALID_DISCOUNT_TYPES.includes(updateData.discountType.toLowerCase())) {
        return validationError(res, `Invalid discountType. Must be one of: ${VALID_DISCOUNT_TYPES.join(', ')}`);
      }
      updateData.discountType = updateData.discountType.toLowerCase();
    }

    // Validate discountValue
    if (updateData.discountValue !== undefined) {
      const val = Number(updateData.discountValue);
      if (isNaN(val) || val <= 0) {
        return validationError(res, 'discountValue must be a positive number');
      }
      const type = updateData.discountType || coupon.discountType;
      if (type === 'percentage' && val > 100) {
        return validationError(res, 'Percentage discount cannot exceed 100');
      }
    }

    // Normalize code
    if (updateData.code) {
      updateData.code = updateData.code.toUpperCase().trim();
      if (updateData.code !== coupon.code) {
        const existing = await Coupon.findOne({ code: updateData.code });
        if (existing) return error(res, 'Coupon code already exists', 400);
      }
    }

    // Date validation
    const newStart = updateData.startDate ? new Date(updateData.startDate) : coupon.startDate;
    const newEnd = updateData.endDate ? new Date(updateData.endDate) : coupon.endDate;

    if (updateData.startDate && isNaN(newStart.getTime())) {
      return validationError(res, 'Invalid startDate format');
    }
    if (updateData.endDate && isNaN(newEnd.getTime())) {
      return validationError(res, 'Invalid endDate format');
    }
    if (newEnd <= newStart) {
      return validationError(res, 'endDate must be after startDate');
    }

    coupon = await Coupon.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true // Issue 7 fix: must run validators to enforce schema constraints
    });

    return success(res, coupon, 'Coupon updated successfully');
  } catch (err) {
    if (isInvalidObjectId(err)) return notFound(res, 'Coupon not found');
    if (err.name === 'ValidationError') return validationError(res, 'Validation failed', getValidationMessages(err));
    return error(res, 'Failed to update coupon', 500, err);
  }
};

// DELETE /api/admin/coupons/:id
exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return notFound(res, 'Coupon not found');

    await coupon.deleteOne();

    return success(res, null, 'Coupon deleted successfully');
  } catch (err) {
    if (isInvalidObjectId(err)) return notFound(res, 'Coupon not found');
    return error(res, 'Failed to delete coupon', 500, err);
  }
};

// POST /api/admin/coupons/validate
exports.validateCoupon = async (req, res) => {
  try {
    const { code, purchaseAmount, productIds, categories } = req.body;

    if (!code?.trim() || !purchaseAmount) {
      return validationError(res, 'code and purchaseAmount are required');
    }

    const amount = Number(purchaseAmount);
    if (isNaN(amount) || amount <= 0) {
      return validationError(res, 'purchaseAmount must be a positive number');
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (!coupon) return notFound(res, 'Invalid coupon code');

    const validation = coupon.canUse(amount, productIds || [], categories || []);
    if (!validation.valid) {
      return error(res, validation.message, 400);
    }

    const discount = coupon.calculateDiscount(amount);

    return success(res, {
      coupon: { code: coupon.code, description: coupon.description, discountType: coupon.discountType, discountValue: coupon.discountValue },
      discount,
      finalAmount: amount - discount
    }, 'Coupon is valid');
  } catch (err) {
    return error(res, 'Failed to validate coupon', 500, err);
  }
};

// GET /api/admin/coupons/stats
exports.getCouponStats = async (req, res) => {
  try {
    const now = new Date();

    const [totalCoupons, activeCoupons, expiredCoupons, inactiveCoupons, mostUsed] = await Promise.all([
      Coupon.countDocuments(),
      Coupon.countDocuments({ status: 'active', startDate: { $lte: now }, endDate: { $gte: now } }),
      Coupon.countDocuments({ status: 'expired' }),
      Coupon.countDocuments({ status: 'inactive' }),
      Coupon.find().sort({ usedCount: -1 }).limit(5).select('code description usedCount usageLimit')
    ]);

    return success(res, { totalCoupons, activeCoupons, expiredCoupons, inactiveCoupons, mostUsed }, 'Coupon stats fetched');
  } catch (err) {
    return error(res, 'Failed to fetch coupon stats', 500, err);
  }
};
