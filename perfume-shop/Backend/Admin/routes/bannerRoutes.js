const express = require('express');
const router = express.Router();
const upload = require('../../config/multer');
const {
  getAllBanners,
  getBannerById,
  createBanner,
  updateBanner
} = require('../controllers/bannerController');

// Get all banners
router.get('/GetBanners', getAllBanners);

// Get single banner
router.get('/GetBanner/:id', getBannerById);

// Create banner (with image upload)
router.post('/CreateBanner', upload.single('bannerImage'), createBanner);

// Update banner (with image upload)
router.put('/UpdateBanner/:id', upload.single('bannerImage'), updateBanner);

module.exports = router;
