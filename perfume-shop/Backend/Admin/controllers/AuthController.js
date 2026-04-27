const AuthModal = require('../models/AuthModal');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../../utils/jwtHelper');
const { success, created, error, validationError, notFound, isInvalidObjectId } = require('../../utils/apiResponse');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/admin/login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return validationError(res, 'Please provide email and password');
    }

    if (!EMAIL_REGEX.test(email)) {
      return validationError(res, 'Invalid email format');
    }

    const admin = await AuthModal.findOne({ email: email.toLowerCase().trim() });

    // Use same message for wrong email or wrong password — prevents user enumeration
    if (!admin) {
      return error(res, 'Invalid email or password', 401);
    }

    if (!admin.status) {
      return error(res, 'Your account has been deactivated', 401);
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch) {
      return error(res, 'Invalid email or password', 401);
    }

    const token = generateToken(admin);

    return success(res, {
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role }
    }, 'Login successful');
  } catch (err) {
    return error(res, 'Login failed', 500, err);
  }
};

// GET /api/admin/auth/me
exports.getMe = async (req, res) => {
  try {
    const admin = await AuthModal.findById(req.admin.id).select('-password');
    if (!admin) return notFound(res, 'Admin not found');

    return success(res, { admin }, 'Admin profile fetched');
  } catch (err) {
    return error(res, 'Failed to fetch profile', 500, err);
  }
};

// POST /api/admin/auth/create
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email || !password) {
      return validationError(res, 'Please provide name, email and password');
    }

    if (!EMAIL_REGEX.test(email)) {
      return validationError(res, 'Invalid email format');
    }

    if (password.length < 6) {
      return validationError(res, 'Password must be at least 6 characters');
    }

    const existingAdmin = await AuthModal.findOne({ email: email.toLowerCase().trim() });
    if (existingAdmin) {
      return error(res, 'Admin with this email already exists', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await AuthModal.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'admin',
      status: true
    });

    const token = generateToken(admin);

    return created(res, {
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role }
    }, 'Admin created successfully');
  } catch (err) {
    return error(res, 'Failed to create admin', 500, err);
  }
};

// PUT /api/admin/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name?.trim() || !email) {
      return validationError(res, 'Please provide name and email');
    }

    if (!EMAIL_REGEX.test(email)) {
      return validationError(res, 'Invalid email format');
    }

    const existingAdmin = await AuthModal.findOne({
      email: email.toLowerCase().trim(),
      _id: { $ne: req.admin.id }
    });

    if (existingAdmin) {
      return error(res, 'Email already in use by another admin', 400);
    }

    const admin = await AuthModal.findByIdAndUpdate(
      req.admin.id,
      { name: name.trim(), email: email.toLowerCase().trim() },
      { new: true, runValidators: true }
    ).select('-password');

    return success(res, { admin }, 'Profile updated successfully');
  } catch (err) {
    return error(res, 'Failed to update profile', 500, err);
  }
};

// PUT /api/admin/auth/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return validationError(res, 'Please provide current and new password');
    }

    if (newPassword.length < 6) {
      return validationError(res, 'New password must be at least 6 characters');
    }

    if (currentPassword === newPassword) {
      return validationError(res, 'New password must be different from current password');
    }

    const admin = await AuthModal.findById(req.admin.id);
    const isPasswordMatch = await bcrypt.compare(currentPassword, admin.password);

    if (!isPasswordMatch) {
      return error(res, 'Current password is incorrect', 401);
    }

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    await admin.save();

    return success(res, null, 'Password changed successfully');
  } catch (err) {
    return error(res, 'Failed to change password', 500, err);
  }
};

// GET /api/admin/auth/admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await AuthModal.find().select('-password').sort({ createdAt: -1 });
    return success(res, { admins, count: admins.length }, 'Admins fetched successfully');
  } catch (err) {
    return error(res, 'Failed to fetch admins', 500, err);
  }
};

// DELETE /api/admin/auth/admins/:id
exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.admin.id.toString()) {
      return error(res, 'You cannot delete your own account', 400);
    }

    const admin = await AuthModal.findById(id);
    if (!admin) return notFound(res, 'Admin not found');

    await admin.deleteOne();

    return success(res, null, 'Admin deleted successfully');
  } catch (err) {
    if (isInvalidObjectId(err)) return notFound(res, 'Admin not found');
    return error(res, 'Failed to delete admin', 500, err);
  }
};
