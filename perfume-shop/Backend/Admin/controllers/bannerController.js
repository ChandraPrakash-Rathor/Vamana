const Banner = require('../models/Banner');
const fs = require('fs');
const path = require('path');

// Get all banners
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1 });
    
    // Add full image URLs
    const bannersWithUrls = banners.map(banner => {
      const bannerObj = banner.toObject();
      if (bannerObj.image) {
        const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
        bannerObj.image = `${baseUrl}/uploads/${bannerObj.image}`;
      }
      return bannerObj;
    });

    res.status(200).json({
      success: true,
      count: bannersWithUrls.length,
      data: bannersWithUrls
    });
  } catch (error) {
    console.error('❌ Error fetching banners:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch banners',
      error: error.message
    });
  }
};

// Get single banner by ID
exports.getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    
    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    const bannerObj = banner.toObject();
    if (bannerObj.image) {
      const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
      bannerObj.image = `${baseUrl}/uploads/${bannerObj.image}`;
    }

    res.status(200).json({
      success: true,
      data: bannerObj
    });
  } catch (error) {
    console.error('❌ Error fetching banner:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch banner',
      error: error.message
    });
  }
};

// Create new banner
exports.createBanner = async (req, res) => {
  try {
    const { type, topBadge, title, subtitle, websiteUrl, bottomBadge, bottomText, order } = req.body;

    // Validate required fields
    if (!type || !topBadge || !title || !subtitle || !websiteUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const bannerData = {
      type,
      topBadge,
      title,
      subtitle,
      websiteUrl,
      order: order || 0
    };

    // Add optional fields based on banner type
    if (type === 'circle' && bottomBadge) {
      bannerData.bottomBadge = bottomBadge;
    }
    if (type === 'arch' && bottomText) {
      bannerData.bottomText = bottomText;
    }

    // Handle image upload
    if (req.file) {
      bannerData.image = req.file.filename;
    }

    const banner = await Banner.create(bannerData);

    res.status(201).json({
      success: true,
      message: 'Banner created successfully',
      data: banner
    });
  } catch (error) {
    console.error('❌ Error creating banner:', error);
    
    // Delete uploaded file if banner creation fails
    if (req.file) {
      const filePath = path.join(__dirname, '../../uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create banner',
      error: error.message
    });
  }
};

// Update banner
exports.updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      // Delete uploaded file if banner not found
      if (req.file) {
        const filePath = path.join(__dirname, '../../uploads', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    const { type, topBadge, title, subtitle, websiteUrl, bottomBadge, bottomText, order, isActive } = req.body;

    // Update fields
    if (type) banner.type = type;
    if (topBadge) banner.topBadge = topBadge;
    if (title) banner.title = title;
    if (subtitle) banner.subtitle = subtitle;
    if (websiteUrl) banner.websiteUrl = websiteUrl;
    if (order !== undefined) banner.order = order;
    if (isActive !== undefined) banner.isActive = isActive;

    // Update type-specific fields
    if (type === 'circle') {
      banner.bottomBadge = bottomBadge || '';
      banner.bottomText = '';
    } else if (type === 'arch') {
      banner.bottomText = bottomText || '';
      banner.bottomBadge = '';
    }

    // Handle image update
    if (req.file) {
      // Delete old image if exists
      if (banner.image) {
        const oldImagePath = path.join(__dirname, '../../uploads', banner.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      banner.image = req.file.filename;
    }

    await banner.save();

    res.status(200).json({
      success: true,
      message: 'Banner updated successfully',
      data: banner
    });
  } catch (error) {
    console.error('❌ Error updating banner:', error);
    
    // Delete uploaded file if update fails
    if (req.file) {
      const filePath = path.join(__dirname, '../../uploads', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update banner',
      error: error.message
    });
  }
};
