const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sale name is required'],
    trim: true,
    maxlength: [100, 'Sale name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  discount: {
    type: Number,
    required: [true, 'Discount percentage is required'],
    min: [1, 'Discount must be at least 1%'],
    max: [90, 'Discount cannot exceed 90%']
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
  applicableProducts: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Product',
    default: []
  },
  applicableCategories: {
    type: [String],
    enum: ['perfume', 'attar', 'combo', 'all'],
    default: ['all']
  },
  productsCount: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0,
    min: [0, 'Revenue cannot be negative']
  },
  banner: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for faster queries
saleSchema.index({ status: 1 });
saleSchema.index({ startDate: 1, endDate: 1 });

// Pre-save validation for date comparison
saleSchema.pre('save', function() {
  // Ensure dates are Date objects for comparison
  const start = this.startDate instanceof Date ? this.startDate : new Date(this.startDate);
  const end = this.endDate instanceof Date ? this.endDate : new Date(this.endDate);
  
  // Compare dates (ignoring time)
  if (end <= start) {
    throw new Error('End date must be after start date');
  }
});

// Virtual to check if sale is currently active
saleSchema.virtual('isActive').get(function() {
  const now = new Date();
  return (
    this.status === 'active' &&
    this.startDate <= now &&
    this.endDate >= now
  );
});

// Method to update status based on dates
saleSchema.methods.updateStatus = function() {
  const now = new Date();
  
  if (this.status === 'inactive') {
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

// Static method to get active sales
saleSchema.statics.getActiveSales = function() {
  const now = new Date();
  return this.find({
    status: 'active',
    startDate: { $lte: now },
    endDate: { $gte: now }
  }).sort({ createdAt: -1 });
};

// Static method to update all sale statuses
saleSchema.statics.updateAllStatuses = async function() {
  const sales = await this.find({ status: { $ne: 'inactive' } });
  
  for (const sale of sales) {
    const oldStatus = sale.status;
    sale.updateStatus();
    
    if (oldStatus !== sale.status) {
      await sale.save();
    }
  }
  
  return sales.length;
};

module.exports = mongoose.model('Sale', saleSchema);
