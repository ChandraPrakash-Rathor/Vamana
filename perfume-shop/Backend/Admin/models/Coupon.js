const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: [20, 'Coupon code cannot exceed 20 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  discountType: {
    type: String,
    required: [true, 'Discount type is required'],
    enum: ['percentage', 'fixed'],
    lowercase: true
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [0, 'Discount value cannot be negative']
  },
  minPurchase: {
    type: Number,
    default: 0,
    min: [0, 'Minimum purchase cannot be negative']
  },
  maxDiscount: {
    type: Number,
    default: null
  },
  usageLimit: {
    type: Number,
    default: null
  },
  usedCount: {
    type: Number,
    default: 0,
    min: [0, 'Used count cannot be negative']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'expired'],
    default: 'active'
  },
  applicableProducts: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Product',
    default: []
  },
  applicableCategories: {
    type: [String],
    enum: ['perfume', 'attar', 'combo', 'all'],
    default: ['all']
  }
}, {
  timestamps: true
});

// Pre-save validation for date comparison
couponSchema.pre('save', function () {
  if (this.endDate <= this.startDate) {
    throw new Error('End date must be after start date');
  }
});
// Index for faster queries
couponSchema.index({ status: 1 });
couponSchema.index({ startDate: 1, endDate: 1 });

// Virtual for checking if coupon is valid
couponSchema.virtual('isValid').get(function() {
  const now = new Date();
  return (
    this.status === 'active' &&
    this.startDate <= now &&
    this.endDate >= now &&
    (this.usageLimit === null || this.usedCount < this.usageLimit)
  );
});

// Method to check if coupon can be used
couponSchema.methods.canUse = function(purchaseAmount, productIds = [], categories = []) {
  // Check if coupon is valid
  if (!this.isValid) {
    return { valid: false, message: 'Coupon is not valid or has expired' };
  }

  // Check minimum purchase
  if (purchaseAmount < this.minPurchase) {
    return { 
      valid: false, 
      message: `Minimum purchase of ₹${this.minPurchase} required` 
    };
  }

  // Check usage limit
  if (this.usageLimit !== null && this.usedCount >= this.usageLimit) {
    return { valid: false, message: 'Coupon usage limit reached' };
  }

  // Check applicable products (if specified)
  if (this.applicableProducts.length > 0) {
    const hasApplicableProduct = productIds.some(id => 
      this.applicableProducts.includes(id)
    );
    if (!hasApplicableProduct) {
      return { valid: false, message: 'Coupon not applicable to selected products' };
    }
  }

  // Check applicable categories (if not 'all')
  if (!this.applicableCategories.includes('all')) {
    const hasApplicableCategory = categories.some(cat => 
      this.applicableCategories.includes(cat)
    );
    if (!hasApplicableCategory) {
      return { valid: false, message: 'Coupon not applicable to selected categories' };
    }
  }

  return { valid: true, message: 'Coupon is valid' };
};

// Method to calculate discount
couponSchema.methods.calculateDiscount = function(purchaseAmount) {
  let discount = 0;

  if (this.discountType === 'percentage') {
    discount = (purchaseAmount * this.discountValue) / 100;
    
    // Apply max discount cap if specified
    if (this.maxDiscount !== null && discount > this.maxDiscount) {
      discount = this.maxDiscount;
    }
  } else if (this.discountType === 'fixed') {
    discount = this.discountValue;
    
    // Discount cannot exceed purchase amount
    if (discount > purchaseAmount) {
      discount = purchaseAmount;
    }
  }

  return Math.round(discount * 100) / 100;
};

// Method to increment usage count
couponSchema.methods.incrementUsage = function() {
  this.usedCount += 1;
  return this.save();
};

// Static method to get active coupons
couponSchema.statics.getActiveCoupons = function() {
  const now = new Date();
  return this.find({
    status: 'active',
    startDate: { $lte: now },
    endDate: { $gte: now }
  }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Coupon', couponSchema);
