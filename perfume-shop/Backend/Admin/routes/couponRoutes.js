const express = require('express');
const router = express.Router();
const {
  getAllCoupons,
  getCouponById,
  getCouponByCode,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  getCouponStats
} = require('../controllers/couponController');

// Coupon statistics route (must be before /:id route)
router.get('/stats', getCouponStats);

// Validate coupon route
router.post('/validate', validateCoupon);

// Get coupon by code
router.get('/code/:code', getCouponByCode);

// Get all coupons & Create new coupon
router.route('/')
  .get(getAllCoupons)
  .post(createCoupon);

// Get, Update, Delete single coupon
router.route('/:id')
  .get(getCouponById)
  .put(updateCoupon)
  .delete(deleteCoupon);

module.exports = router;
