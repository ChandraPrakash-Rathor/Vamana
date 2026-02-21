const express = require('express');
const router = express.Router();
const {
  getAllSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
  getSaleStats,
  updateAllStatuses
} = require('../controllers/saleController');

// Sale statistics route (must be before /:id route)
router.get('/stats', getSaleStats);

// Update all statuses route
router.post('/update-statuses', updateAllStatuses);

// Get all sales & Create new sale
router.route('/')
  .get(getAllSales)
  .post(createSale);

// Get, Update, Delete single sale
router.route('/:id')
  .get(getSaleById)
  .put(updateSale)
  .delete(deleteSale);

module.exports = router;
