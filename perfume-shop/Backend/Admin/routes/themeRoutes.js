const express = require('express');
const router = express.Router();
const themeController = require('../controllers/themeController');

// Get all themes
router.get('/', themeController.getAllThemes);

// Get active theme (public)
router.get('/active', themeController.getActiveTheme);

// Create new theme
router.post('/', themeController.createTheme);

// Update theme
router.put('/:id', themeController.updateTheme);

// Activate theme
router.put('/:id/activate', themeController.setActiveTheme);

// Delete theme
router.delete('/:id', themeController.deleteTheme);

module.exports = router;
