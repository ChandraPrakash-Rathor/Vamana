const router = require('express').Router();
const {
  getAllOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
  getOfferStats,
  updateAllStatuses
} = require('../controllers/limitedOfferController');

// Stats and utility routes (must be before :id routes)
router.get('/stats', getOfferStats);
router.post('/update-statuses', updateAllStatuses);

// CRUD routes
router.route('/')
  .get(getAllOffers)
  .post(createOffer);

router.route('/:id')
  .get(getOfferById)
  .put(updateOffer)
  .delete(deleteOffer);

module.exports = router;
