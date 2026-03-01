const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  colors: {
    50: { type: String, required: true },
    100: { type: String, required: true },
    200: { type: String, required: true },
    300: { type: String, required: true },
    400: { type: String, required: true },
    500: { type: String, required: true },
    600: { type: String, required: true },
    700: { type: String, required: true },
    800: { type: String, required: true },
    900: { type: String, required: true },
    950: { type: String, required: true }
  },
  isActive: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Ensure only one theme is active at a time
themeSchema.pre('save', async function() {
  if (this.isActive) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { isActive: false }
    );
  }
});

module.exports = mongoose.model('Theme', themeSchema);
