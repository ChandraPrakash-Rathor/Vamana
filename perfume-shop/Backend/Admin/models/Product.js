const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  subLine: {
    type: String,
    trim: true,
    maxlength: [100, 'Sub line cannot exceed 100 characters'],
    default: ''
  },
  volume: {
    type: String,
    trim: true,
    default: ''
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['perfume', 'attar', 'combo'],
    lowercase: true
  },
  actualPrice: {
    type: Number,
    required: [true, 'Actual price is required'],
    min: [0, 'Price cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  finalPrice: {
    type: Number,
    min: [0, 'Final price cannot be negative']
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  mainImage: {
    type: String,
    required: [true, 'Main product image is required']
  },
  subImages: {
    type: [String],
    default: [],
    validate: {
      validator: function(v) {
        return v.length <= 5;
      },
      message: 'Cannot have more than 5 sub-images'
    }
  },
  featured: {
    type: Boolean,
    default: false
  },
  bestseller: {
    type: Boolean,
    default: false
  },
  sales: {
    type: Number,
    default: 0,
    min: [0, 'Sales cannot be negative']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviews: {
    type: Number,
    default: 0,
    min: [0, 'Reviews count cannot be negative']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'out-of-stock'],
    default: 'active'
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Index for faster queries
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ bestseller: 1 });
productSchema.index({ status: 1 });

// Virtual for discount amount
productSchema.virtual('discountAmount').get(function() {
  return this.actualPrice - this.finalPrice;
});

// Method to update stock
productSchema.methods.updateStock = function(quantity) {
  this.stock += quantity;
  if (this.stock <= 0) {
    this.status = 'out-of-stock';
    this.stock = 0;
  } else if (this.status === 'out-of-stock') {
    this.status = 'active';
  }
  return this.save();
};

// Method to increment sales
productSchema.methods.incrementSales = function(quantity = 1) {
  this.sales += quantity;
  return this.save();
};

// Static method to get featured products
productSchema.statics.getFeatured = function() {
  return this.find({ featured: true, status: 'active' }).sort({ createdAt: -1 });
};

// Static method to get bestsellers
productSchema.statics.getBestsellers = function() {
  return this.find({ bestseller: true, status: 'active' }).sort({ sales: -1 });
};

// Pre-save middleware to calculate final price
productSchema.pre('save', function() {
  if (this.isModified('actualPrice') || this.isModified('discount')) {
    const discountAmount = (this.actualPrice * this.discount) / 100;
    this.finalPrice = this.actualPrice - discountAmount;
  }
});

module.exports = mongoose.model('Product', productSchema);
