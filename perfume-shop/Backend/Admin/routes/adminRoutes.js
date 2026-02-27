const express = require('express');
const router = express.Router();
const productRoutes = require('./productRoutes');
const couponRoutes = require('./couponRoutes');
const saleRoutes = require('./saleRoutes');
const limitedOfferRoutes = require('./limitedOfferRoutes');
const bannerRoutes = require('./bannerRoutes');
const authController = require("../controllers/AuthController");
const productController =require("../controllers/productController")
const couponController = require("../controllers/couponController");
const saleController = require("../controllers/saleController");
const limitedOfferController = require("../controllers/limitedOfferController");
const reviewController = require("../controllers/reviewController");
const upload = require("../../config/multer");



router.post("/login",upload.any(), authController.loginAdmin);
router.post("/insertProduct", upload.any(),productController.createProduct)
router.get("/GetProducts", productController.getAllProducts)
router.use('/products', productRoutes);

// Coupon routes
router.post("/insertCoupon", couponController.createCoupon);
router.get("/GetCoupons", couponController.getAllCoupons);
router.use('/coupons', couponRoutes);

// Sale routes
router.post("/insertSale", saleController.createSale);
router.get("/GetSales", saleController.getAllSales);
router.use('/sales', saleRoutes);

// Limited Offer routes
router.post("/insertLimitedOffer", limitedOfferController.createOffer);
router.get("/GetLimitedOffers", limitedOfferController.getAllOffers);
router.use('/limited-offers', limitedOfferRoutes);

// Review routes
router.get("/GetReviews", reviewController.getReviews);
router.get("/GetReview/:id", reviewController.getReviewById);
router.post("/insertReview", upload.single('image'), reviewController.addReview);
router.put("/updateReview/:id", upload.single('image'), reviewController.updateReview);
router.delete("/deleteReview/:id", reviewController.deleteReview);

// Banner routes
router.use('/banners', bannerRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
