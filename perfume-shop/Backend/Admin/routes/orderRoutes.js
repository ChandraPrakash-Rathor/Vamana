const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getOrderStats
} = require('../controllers/orderController');

// Order statistics route
router.get('/stats', getOrderStats);

// Get all orders & Create new order
router.route('/')
  .get(getAllOrders);

// Get, Update, Delete single order
router.route('/:id')
  .get(getOrderById)
  .put(updateOrderStatus)
  .delete(deleteOrder);

module.exports = router;
