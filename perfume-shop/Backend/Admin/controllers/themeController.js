const Theme = require('../models/Theme');

// @desc    Get all themes
// @route   GET /api/admin/themes
// @access  Private (Admin)
exports.getAllThemes = async (req, res) => {
  try {
    const themes = await Theme.find().sort({ createdAt: 1 });
    
    res.json({
      success: true,
      count: themes.length,
      data: themes
    });
  } catch (error) {
    console.error('❌ Get themes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get active theme
// @route   GET /api/admin/themes/active
// @access  Public
exports.getActiveTheme = async (req, res) => {
  try {
    let theme = await Theme.findOne({ isActive: true });
    
    // If no active theme, return default
    if (!theme) {
      theme = await Theme.findOne({ name: 'Sand Theme' });
    }
    
    res.json({
      success: true,
      data: theme
    });
  } catch (error) {
    console.error('❌ Get active theme error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Set active theme
// @route   PUT /api/admin/themes/:id/activate
// @access  Private (Admin)
exports.setActiveTheme = async (req, res) => {
  try {
    const theme = await Theme.findById(req.params.id);
    
    if (!theme) {
      return res.status(404).json({
        success: false,
        message: 'Theme not found'
      });
    }
    
    // Deactivate all themes
    await Theme.updateMany({}, { isActive: false });
    
    // Activate selected theme
    theme.isActive = true;
    await theme.save();
    
    res.json({
      success: true,
      message: 'Theme activated successfully',
      data: theme
    });
  } catch (error) {
    console.error('❌ Set active theme error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create new theme
// @route   POST /api/admin/themes
// @access  Private (Admin)
exports.createTheme = async (req, res) => {
  try {
    const { name, colors } = req.body;
    
    const theme = await Theme.create({
      name,
      colors,
      isActive: false
    });
    
    res.status(201).json({
      success: true,
      message: 'Theme created successfully',
      data: theme
    });
  } catch (error) {
    console.error('❌ Create theme error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update theme
// @route   PUT /api/admin/themes/:id
// @access  Private (Admin)
exports.updateTheme = async (req, res) => {
  try {
    const { name, colors } = req.body;
    
    const theme = await Theme.findByIdAndUpdate(
      req.params.id,
      { name, colors },
      { new: true, runValidators: true }
    );
    
    if (!theme) {
      return res.status(404).json({
        success: false,
        message: 'Theme not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Theme updated successfully',
      data: theme
    });
  } catch (error) {
    console.error('❌ Update theme error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete theme
// @route   DELETE /api/admin/themes/:id
// @access  Private (Admin)
exports.deleteTheme = async (req, res) => {
  try {
    const theme = await Theme.findById(req.params.id);
    
    if (!theme) {
      return res.status(404).json({
        success: false,
        message: 'Theme not found'
      });
    }
    
    if (theme.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete active theme'
      });
    }
    
    await theme.deleteOne();
    
    res.json({
      success: true,
      message: 'Theme deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete theme error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
