const { verifyToken } = require('../utils/jwtHelper');
const AuthModal = require('../Admin/models/AuthModal');

/**
 * Middleware to protect admin routes
 * Checks for valid JWT token in Authorization header
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided'
      });
    }

    // Verify token
    const decoded = verifyToken(token);

    // Check if admin still exists and is active
    const admin = await AuthModal.findById(decoded.id).select('-password');
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin not found'
      });
    }

    if (!admin.status) {
      return res.status(401).json({
        success: false,
        message: 'Admin account is inactive'
      });
    }

    // Attach admin to request object
    req.admin = admin;
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed',
      error: error.message
    });
  }
};

/**
 * Middleware to check if user is admin
 */
const isAdmin = (req, res, next) => {
  if (req.admin && req.admin.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin only.'
    });
  }
};

module.exports = {
  protect,
  isAdmin
};
