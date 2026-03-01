const express = require('express');
const router = express.Router();
const { validateCoupon, getActiveCoupons } = require('../controllers/couponController');
const { protectMember } = require('../../middleware/memberAuthMiddleware');

// Public route - Get active coupons
router.get('/', getActiveCoupons);

// Protected route - Validate coupon
router.post('/validate', protectMember, validateCoupon);

module.exports = router;
