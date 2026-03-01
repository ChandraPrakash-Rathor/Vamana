const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protectMember } = require('../../middleware/memberAuthMiddleware');

// Public routes
router.post('/check-phone', authController.checkPhone);
router.post('/register', authController.register);

// Protected routes (require member authentication)
router.get('/me', protectMember, authController.getMe);
router.put('/profile', protectMember, authController.updateProfile);

module.exports = router;
