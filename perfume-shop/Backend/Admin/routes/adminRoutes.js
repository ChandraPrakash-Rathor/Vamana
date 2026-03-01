const express = require('express');
const router = express.Router();
const productRoutes = require('./productRoutes');
const couponRoutes = require('./couponRoutes');
const saleRoutes = require('./saleRoutes');
const limitedOfferRoutes = require('./limitedOfferRoutes');
const bannerRoutes = require('./bannerRoutes');
const memberRoutes = require('./memberRoutes');
const themeRoutes = require('./themeRoutes');
const authController = require("../controllers/AuthController");
const productController =require("../controllers/productController")
const couponController = require("../controllers/couponController");
const saleController = require("../controllers/saleController");
const limitedOfferController = require("../controllers/limitedOfferController");
const reviewController = require("../controllers/reviewController");
const upload = require("../../config/multer");
const { protect, isAdmin } = require("../../middleware/authMiddleware");

// ============ AUTH ROUTES (Public) ============
router.post("/login", upload.any(), authController.loginAdmin);

// ============ AUTH ROUTES (Protected) ============
router.get("/auth/me", protect, authController.getMe); // Get current admin
router.put("/auth/profile", protect, isAdmin, authController.updateProfile); // Update profile
router.put("/auth/change-password", protect, isAdmin, authController.changePassword); // Change password
router.get("/auth/admins", protect, isAdmin, authController.getAllAdmins); // Get all admins
router.post("/auth/create", protect, isAdmin, authController.createAdmin); // Create new admin
router.delete("/auth/admins/:id", protect, isAdmin, authController.deleteAdmin); // Delete admin

// ============ PROTECTED ROUTES (Require Authentication) ============

// Product routes
router.post("/insertProduct", protect, isAdmin, upload.any(), productController.createProduct);
router.get("/GetProducts", protect, isAdmin, productController.getAllProducts);
router.use('/products', protect, isAdmin, productRoutes);

// Coupon routes
router.post("/insertCoupon", protect, isAdmin, couponController.createCoupon);
router.get("/GetCoupons", protect, isAdmin, couponController.getAllCoupons);
router.use('/coupons', protect, isAdmin, couponRoutes);

// Sale routes
router.post("/insertSale", protect, isAdmin, saleController.createSale);
router.get("/GetSales", protect, isAdmin, saleController.getAllSales);
router.use('/sales', protect, isAdmin, saleRoutes);

// Limited Offer routes
router.post("/insertLimitedOffer", protect, isAdmin, limitedOfferController.createOffer);
router.get("/GetLimitedOffers", protect, isAdmin, limitedOfferController.getAllOffers);
router.use('/limited-offers', protect, isAdmin, limitedOfferRoutes);

// Review routes
router.get("/GetReviews", protect, isAdmin, reviewController.getReviews);
router.get("/GetReview/:id", protect, isAdmin, reviewController.getReviewById);
router.post("/insertReview", protect, isAdmin, upload.single('image'), reviewController.addReview);
router.put("/updateReview/:id", protect, isAdmin, upload.single('image'), reviewController.updateReview);
router.delete("/deleteReview/:id", protect, isAdmin, reviewController.deleteReview);

// Banner routes
router.use('/banners', protect, isAdmin, bannerRoutes);

// Member routes (Users management)
router.use('/members', protect, isAdmin, memberRoutes);

// Theme routes
router.use('/themes', protect, isAdmin, themeRoutes);

// Health check (public)
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
