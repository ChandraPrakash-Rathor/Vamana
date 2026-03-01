const { verifyToken } = require('../utils/jwtHelper');
const Member = require('../Member/models/Member');

/**
 * Middleware to protect member routes
 * Checks for valid JWT token in Authorization header
 */
const protectMember = async (req, res, next) => {
  console.log('\n🔵 ========== MEMBER AUTH MIDDLEWARE ==========');
  console.log('🔵 Request URL:', req.originalUrl);
  console.log('🔵 Request Method:', req.method);
  
  try {
    // Check Authorization header
    const authHeader = req.headers.authorization;
    console.log('🔵 Authorization header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No valid Authorization header');
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided'
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    console.log('🔵 Token extracted:', token ? 'Yes' : 'No');
    console.log('🔵 Token length:', token?.length);

    if (!token) {
      console.log('❌ Token is empty');
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token is empty'
      });
    }

    // Verify token
    console.log('🔐 Verifying token...');
    const decoded = verifyToken(token);
    console.log('✅ Token decoded successfully');
    console.log('✅ Decoded payload:', JSON.stringify(decoded, null, 2));

    // Check if member exists
    console.log('🔍 Looking up member with ID:', decoded.id);
    const member = await Member.findById(decoded.id).select('-__v');
    
    if (!member) {
      console.log('❌ Member not found in database');
      return res.status(401).json({
        success: false,
        message: 'Member not found'
      });
    }

    console.log('✅ Member found:', {
      id: member._id,
      name: member.name,
      email: member.email,
      phone: member.phone
    });

    // Attach member to request
    req.member = member;
    req.userId = member._id;
    
    console.log('✅ Member attached to req.member');
    console.log('✅ Calling next()...');
    console.log('🔵 ========================================\n');
    
    return next();

  } catch (error) {
    console.error('❌ Member auth middleware error:', error.message);
    console.error('❌ Error stack:', error.stack);
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed',
      error: error.message
    });
  }
};

module.exports = {
  protectMember
};
