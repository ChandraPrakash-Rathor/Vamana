const SiteSettings = require('../models/SiteSettings');
const fs = require('fs');
const path = require('path');

// Get site settings
exports.getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne({ isActive: true });
    
    // If no settings exist, create default
    if (!settings) {
      settings = await SiteSettings.create({ isActive: true });
    }
    
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update site settings
exports.updateSettings = async (req, res) => {
  try {
    const {
      siteName,
      tagline,
      email,
      phone,
      address,
      socialLinks,
      footerAbout,
      footerCopyright
    } = req.body;

    let settings = await SiteSettings.findOne({ isActive: true });
    
    if (!settings) {
      settings = await SiteSettings.create({ isActive: true });
    }

    // Update fields
    if (siteName) settings.siteName = siteName;
    if (tagline) settings.tagline = tagline;
    if (email) settings.email = email;
    if (phone) settings.phone = phone;
    if (address) settings.address = address;
    if (socialLinks) settings.socialLinks = { ...settings.socialLinks, ...socialLinks };
    if (footerAbout) settings.footerAbout = footerAbout;
    if (footerCopyright) settings.footerCopyright = footerCopyright;

    // Handle logo upload
    if (req.file) {
      // Delete old logo if exists
      if (settings.logo && settings.logo !== '/uploads/logo.png') {
        const oldLogoPath = path.join(__dirname, '../../', settings.logo);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }
      settings.logo = `/uploads/${req.file.filename}`;
    }

    await settings.save();

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
