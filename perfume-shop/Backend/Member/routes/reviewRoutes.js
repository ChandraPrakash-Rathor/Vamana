const express = require('express');
const router = express.Router();
const {
  getAllReviews,
  getReviewsByProduct,
  getReviewById,
  getFeaturedReviews
} = require('../controllers/reviewController');

// Get all reviews
router.get('/GetReviews', getAllReviews);

// Get featured reviews (top rated)
router.get('/GetFeaturedReviews', getFeaturedReviews);

// Get reviews by product
router.get('/GetReviewsByProduct/:product', getReviewsByProduct);

// Get single review
router.get('/GetReview/:id', getReviewById);

module.exports = router;
