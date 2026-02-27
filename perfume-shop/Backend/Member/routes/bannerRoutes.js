const express = require('express');
const router = express.Router();
const {
  getActiveBanners,
  getBannerById
} = require('../controllers/bannerController');

// Get all active banners
router.get('/GetBanners', getActiveBanners);

// Get single banner
router.get('/GetBanner/:id', getBannerById);

module.exports = router;
