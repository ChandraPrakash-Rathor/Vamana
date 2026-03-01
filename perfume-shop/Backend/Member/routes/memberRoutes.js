const express = require('express');
const router = express.Router();

// Import controllers
const productController = require('../controllers/productController');
const limitedOfferController = require('../controllers/limitedOfferController');
const saleController = require('../controllers/saleController');
const bannerController = require('../controllers/bannerController');
const reviewController = require('../controllers/reviewController');
const themeController = require('../../Admin/controllers/themeController');
const orderController =require("../controllers/orderController");
const paymentController =require("../controllers/paymentController");

// Import routes
const authRoutes = require('./authRoutes');
const cartRoutes = require('./cartRoutes');
const couponRoutes = require('./couponRoutes');

// ============ AUTH ROUTES ============
router.use('/auth', authRoutes);

// ============ CART ROUTES ============
router.use('/cart', cartRoutes);

// ============ COUPON ROUTES ============
router.use('/coupons', couponRoutes);

// ============ THEME ROUTES (Public) ============
router.get('/theme/active', themeController.getActiveTheme);

// ============ PRODUCT ROUTES ============
// Get featured products (must be before /:id route)
router.get('/products/featured', productController.getFeaturedProducts);

// Get bestseller products (must be before /:id route)
router.get('/products/bestsellers', productController.getBestsellerProducts);

// Get top rated products (must be before /:id route)
router.get('/products/top-rated', productController.getTopRatedProducts);

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

// Manual status update trigger (for testing)
router.post('/limited-offers/update-statuses', async (req, res) => {
  try {
    const LimitedOffer = require('../../Admin/models/LimitedOffer');
    const now = new Date();

    console.log('🔄 Manual status update triggered');
    console.log('🕐 Current time:', now.toISOString(), '(', now.toString(), ')');

    // Get all scheduled offers
    const scheduledOffers = await LimitedOffer.find({ status: 'scheduled' });
    console.log('📊 Found', scheduledOffers.length, 'scheduled offers');

    let adjustedCount = 0;
    
    for (const offer of scheduledOffers) {
      console.log(`\n📋 Checking offer: ${offer.title}`);
      console.log(`   Start: ${offer.startDate.toISOString()} (${offer.startDate.toString()})`);
      console.log(`   End: ${offer.endDate.toISOString()} (${offer.endDate.toString()})`);
      
      // Check if it's the same calendar day in local timezone
      const offerStartLocal = new Date(offer.startDate);
      const nowLocal = new Date(now);
      
      const isSameDay = 
        offerStartLocal.getFullYear() === nowLocal.getFullYear() &&
        offerStartLocal.getMonth() === nowLocal.getMonth() &&
        offerStartLocal.getDate() === nowLocal.getDate();
      
      console.log(`   Same day? ${isSameDay}`);
      
      if (isSameDay && offer.startDate > now) {
        // Adjust start date to current time (local timezone)
        const newStartDate = new Date(now);
        newStartDate.setHours(0, 0, 0, 0);
        
        offer.startDate = newStartDate;
        offer.updateStatus();
        await offer.save();
        
        console.log(`   ✅ Adjusted start date to: ${offer.startDate.toISOString()}`);
        console.log(`   ✅ New status: ${offer.status}`);
        adjustedCount++;
      }
    }

    // Now update statuses based on dates
    const activated = await LimitedOffer.updateMany(
      { status: 'scheduled', startDate: { $lte: now }, endDate: { $gte: now } },
      { $set: { status: 'active' } }
    );

    const expired = await LimitedOffer.updateMany(
      { status: 'active', endDate: { $lt: now } },
      { $set: { status: 'expired' } }
    );

    console.log(`\n✅ Update complete:`);
    console.log(`   - Adjusted: ${adjustedCount}`);
    console.log(`   - Activated: ${activated.modifiedCount}`);
    console.log(`   - Expired: ${expired.modifiedCount}`);

    res.json({
      success: true,
      message: 'Status update complete',
      adjusted: adjustedCount,
      activated: activated.modifiedCount,
      expired: expired.modifiedCount,
      serverTime: now.toISOString(),
      serverTimeLocal: now.toString()
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ SALE ROUTES ============
// Get all active sales
router.get('/sales', saleController.getActiveSales);

// Get single sale by ID
router.get('/sales/:id', saleController.getSaleById);

// ============ BANNER ROUTES ============
// Get all active banners
router.get('/banners', bannerController.getActiveBanners);

// Get single banner by ID
router.get('/banners/:id', bannerController.getBannerById);

// ============ REVIEW ROUTES ============
// Get featured reviews (must be before other routes)
router.get('/reviews/featured', reviewController.getFeaturedReviews);

// Get products with best reviews (3+ reviews, 3+ rating)
router.get('/reviews/best-products', reviewController.getProductsWithBestReviews);

// Get reviews by product
router.get('/reviews/product/:product', reviewController.getReviewsByProduct);

// Get all reviews
router.get('/reviews', reviewController.getAllReviews);

// Get single review by ID
router.get('/reviews/:id', reviewController.getReviewById);
 // ORDER CREATE
router.post("/create-order", orderController.createOrder);

// PAYMENT VERIFY
router.post("/verify-payment", paymentController.verifyPayment);

// ============ HEALTH CHECK ============
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Member API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
