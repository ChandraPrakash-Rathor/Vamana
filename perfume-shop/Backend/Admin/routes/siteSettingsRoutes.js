const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/siteSettingsController');
const upload = require('../../config/multer');

// Get settings
router.get('/', getSettings);

// Update settings (with logo upload)
router.put('/', upload.single('logo'), updateSettings);

module.exports = router;
