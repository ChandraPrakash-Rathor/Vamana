const express = require('express');
const router = express.Router();
const upload = require('../../config/multer');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats
} = require('../controllers/productController');

// Product statistics route (must be before /:id route)
router.get('/stats', getProductStats);

// Get all products & Create new product
router.route('/')
  .get(getAllProducts)
  .post(upload.any(), createProduct);

// Get, Update, Delete single product
router.route('/:id')
  .get(getProductById)
  .put(upload.any(), updateProduct)
  .delete(deleteProduct);

module.exports = router;
