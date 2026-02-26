const express = require('express');
const router = express.Router();
const limitedOfferController = require('../controllers/limitedOfferController');

// Get all active limited offers
router.get('/', limitedOfferController.getAllLimitedOffers);

// Get single limited offer by ID
router.get('/:id', limitedOfferController.getLimitedOfferById);

module.exports = router;

