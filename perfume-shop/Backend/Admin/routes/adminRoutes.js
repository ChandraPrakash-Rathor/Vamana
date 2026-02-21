const express = require('express');
const router = express.Router();
const productRoutes = require('./productRoutes');
const couponRoutes = require('./couponRoutes');
const saleRoutes = require('./saleRoutes');
const limitedOfferRoutes = require('./limitedOfferRoutes');
const authController = require("../controllers/AuthController");
const productController =require("../controllers/productController")
const couponController = require("../controllers/couponController");
const saleController = require("../controllers/saleController");
const limitedOfferController = require("../controllers/limitedOfferController");
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

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
