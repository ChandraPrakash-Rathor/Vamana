const express = require('express');
const router = express.Router();
const {
  getAllMembers,
  getMemberById,
  updateMemberStatus,
  deleteMember
} = require('../controllers/memberController');
const { protect } = require('../../middleware/authMiddleware');

// All routes are protected (admin only)
router.use(protect);

// Get all members
router.get('/', getAllMembers);

// Get single member
router.get('/:id', getMemberById);

// Update member status
router.put('/:id/status', updateMemberStatus);

// Delete member
router.delete('/:id', deleteMember);

module.exports = router;
