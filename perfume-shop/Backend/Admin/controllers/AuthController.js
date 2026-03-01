const AuthModal = require("../models/AuthModal");
const bcrypt = require('bcryptjs');
const { generateToken } = require('../../utils/jwtHelper');

// @desc    Login admin
// @route   POST /api/admin/auth/login
// @access  Public
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Please provide email and password" 
      });
    }

    // Find admin by email
    const admin = await AuthModal.findOne({ email });

    if (!admin) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    // Check if admin is active
    if (!admin.status) {
      return res.status(401).json({ 
        success: false,
        message: "Your account has been deactivated" 
      });
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, admin.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    // Generate JWT token
    const token = generateToken(admin);

    // Send response
    res.json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message 
    });
  }
};

// @desc    Get current logged in admin
// @route   GET /api/admin/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const admin = await AuthModal.findById(req.admin.id).select('-password');
    
    res.json({
      success: true,
      admin
    });
  } catch (error) {
    console.error('❌ Get me error:', error);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message 
    });
  }
};

// @desc    Create new admin (for initial setup)
// @route   POST /api/admin/auth/create
// @access  Public (should be protected in production)
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Please provide name, email and password" 
      });
    }

    // Check if admin already exists
    const existingAdmin = await AuthModal.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ 
        success: false,
        message: "Admin with this email already exists" 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    const admin = await AuthModal.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      status: true
    });

    // Generate token
    const token = generateToken(admin);

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('❌ Create admin error:', error);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message 
    });
  }
};


// @desc    Update admin profile (name, email)
// @route   PUT /api/admin/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Validate input
    if (!name || !email) {
      return res.status(400).json({ 
        success: false,
        message: "Please provide name and email" 
      });
    }

    // Check if email is already taken by another admin
    const existingAdmin = await AuthModal.findOne({ 
      email, 
      _id: { $ne: req.admin.id } 
    });

    if (existingAdmin) {
      return res.status(400).json({ 
        success: false,
        message: "Email already in use by another admin" 
      });
    }

    // Update admin
    const admin = await AuthModal.findByIdAndUpdate(
      req.admin.id,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: "Profile updated successfully",
      admin
    });

  } catch (error) {
    console.error('❌ Update profile error:', error);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message 
    });
  }
};

// @desc    Change password
// @route   PUT /api/admin/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false,
        message: "Please provide current and new password" 
      });
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: "New password must be at least 6 characters" 
      });
    }

    // Get admin with password
    const admin = await AuthModal.findById(req.admin.id);

    // Verify current password
    const isPasswordMatch = await bcrypt.compare(currentPassword, admin.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ 
        success: false,
        message: "Current password is incorrect" 
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);

    await admin.save();

    res.json({
      success: true,
      message: "Password changed successfully"
    });

  } catch (error) {
    console.error('❌ Change password error:', error);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message 
    });
  }
};

// @desc    Get all admins
// @route   GET /api/admin/auth/admins
// @access  Private (Admin only)
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await AuthModal.find().select('-password').sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: admins.length,
      admins
    });
  } catch (error) {
    console.error('❌ Get admins error:', error);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message 
    });
  }
};

// @desc    Delete admin
// @route   DELETE /api/admin/auth/admins/:id
// @access  Private (Admin only)
exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting self
    if (id === req.admin.id.toString()) {
      return res.status(400).json({ 
        success: false,
        message: "You cannot delete your own account" 
      });
    }

    const admin = await AuthModal.findById(id);

    if (!admin) {
      return res.status(404).json({ 
        success: false,
        message: "Admin not found" 
      });
    }

    await admin.deleteOne();

    res.json({
      success: true,
      message: "Admin deleted successfully"
    });

  } catch (error) {
    console.error('❌ Delete admin error:', error);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message 
    });
  }
};
