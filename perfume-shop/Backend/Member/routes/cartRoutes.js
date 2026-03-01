const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protectMember } = require('../../middleware/memberAuthMiddleware');

// All cart routes are protected (require member authentication)
router.get('/', protectMember, cartController.getCart);
router.post('/add', protectMember, cartController.addToCart);
router.put('/update', protectMember, cartController.updateCartItem);
router.delete('/remove/:productId', protectMember, cartController.removeFromCart);
router.delete('/clear', protectMember, cartController.clearCart);

module.exports = router;
