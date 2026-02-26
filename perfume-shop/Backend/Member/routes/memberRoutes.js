const express = require('express');
const router = express.Router();

// Import controllers
const productController = require('../controllers/productController');
const limitedOfferController = require('../controllers/limitedOfferController');
const saleController = require('../controllers/saleController');

// ============ PRODUCT ROUTES ============
// Get featured products (must be before /:id route)
router.get('/products/featured', productController.getFeaturedProducts);

// Get bestseller products (must be before /:id route)
router.get('/products/bestsellers', productController.getBestsellerProducts);

// Get products by category (must be before /:id route)
router.get('/products/category/:category', productController.getProductsByCategory);

// Get all products
router.get('/products', productController.getAllProducts);

// Get single product by ID
router.get('/products/:id', productController.getProductById);

// ============ LIMITED OFFER ROUTES ============
// Get all active limited offers
router.get('/limited-offers', limitedOfferController.getActiveOffers);

// Get single limited offer by ID
router.get('/limited-offers/:id', limitedOfferController.getOfferById);

// ============ SALE ROUTES ============
// Get all active sales
router.get('/sales', saleController.getActiveSales);

// Get single sale by ID
router.get('/sales/:id', saleController.getSaleById);

// ============ HEALTH CHECK ============
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Member API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
