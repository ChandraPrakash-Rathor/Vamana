const { verifyToken } = require('../utils/jwtHelper');
const AuthModal = require('../Admin/models/AuthModal');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided',
        data: null,
        error: null
      });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      // Bug fix: don't expose internal token error details
      return res.status(401).json({
        success: false,
        message: 'Not authorized, invalid or expired token',
        data: null,
        error: null
      });
    }

    const admin = await AuthModal.findById(decoded.id).select('-password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, admin not found',
        data: null,
        error: null
      });
    }

    if (!admin.status) {
      return res.status(401).json({
        success: false,
        message: 'Admin account is inactive',
        data: null,
        error: null
      });
    }

    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized',
      data: null,
      error: null
    });
  }
};

const isAdmin = (req, res, next) => {
  if (req.admin?.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied. Admin only.',
    data: null,
    error: null
  });
};

module.exports = { protect, isAdmin };
