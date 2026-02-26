const mongoose = require('mongoose');

const limitedOfferSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Offer title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  product: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'At least one product is required']
  }],
  originalPrice: {
    type: Number,
    required: [true, 'Original price is required'],
    min: [0, 'Price cannot be negative']
  },
  offerPrice: {
    type: Number,
    required: [true, 'Offer price is required'],
    min: [0, 'Price cannot be negative']
  },
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
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
    enum: ['active', 'scheduled', 'expired', 'inactive'],
    default: 'scheduled'
  },
  stockLimit: {
    type: Number,
    default: null
  },
  soldCount: {
    type: Number,
    default: 0,
    min: [0, 'Sold count cannot be negative']
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
limitedOfferSchema.index({ status: 1 });
limitedOfferSchema.index({ startDate: 1, endDate: 1 });
limitedOfferSchema.index({ featured: 1 });

// Pre-save validation and calculations
limitedOfferSchema.pre('save', function() {
  // Validate dates
  const start = this.startDate instanceof Date ? this.startDate : new Date(this.startDate);
  const end = this.endDate instanceof Date ? this.endDate : new Date(this.endDate);
  
  if (end <= start) {
    throw new Error('End date must be after start date');
  }

  // Calculate discount percentage
  if (this.originalPrice && this.offerPrice) {
    this.discount = Math.round(((this.originalPrice - this.offerPrice) / this.originalPrice) * 100);
  }

  // Validate offer price is less than original price
  if (this.offerPrice >= this.originalPrice) {
    throw new Error('Offer price must be less than original price');
  }
});

// Virtual to check if offer is currently active
limitedOfferSchema.virtual('isActive').get(function() {
  const now = new Date();
  return (
    this.status === 'active' &&
    this.startDate <= now &&
    this.endDate >= now &&
    (this.stockLimit === null || this.soldCount < this.stockLimit)
  );
});

// Method to update status based on dates and stock
limitedOfferSchema.methods.updateStatus = function() {
  const now = new Date();
  
  if (this.status === 'inactive') {
    return this.status;
  }

  // Check stock limit
  if (this.stockLimit !== null && this.soldCount >= this.stockLimit) {
    this.status = 'expired';
    return this.status;
  }
  
  if (now < this.startDate) {
    this.status = 'scheduled';
  } else if (now >= this.startDate && now <= this.endDate) {
    this.status = 'active';
  } else if (now > this.endDate) {
    this.status = 'expired';
  }
  
  return this.status;
};

// Method to increment sold count
limitedOfferSchema.methods.incrementSold = function(quantity = 1) {
  this.soldCount += quantity;
  this.updateStatus();
  return this.save();
};

// Static method to get active offers
limitedOfferSchema.statics.getActiveOffers = function() {
  const now = new Date();
  return this.find({
    status: 'active',
    startDate: { $lte: now },
    endDate: { $gte: now }
  })
  .populate('product', 'name mainImage category')
  .sort({ featured: -1, createdAt: -1 });
};

// Static method to get featured offers
limitedOfferSchema.statics.getFeaturedOffers = function() {
  const now = new Date();
  return this.find({
    status: 'active',
    featured: true,
    startDate: { $lte: now },
    endDate: { $gte: now }
  })
  .populate('product', 'name mainImage category')
  .sort({ createdAt: -1 });
};

module.exports = mongoose.model('LimitedOffer', limitedOfferSchema);
