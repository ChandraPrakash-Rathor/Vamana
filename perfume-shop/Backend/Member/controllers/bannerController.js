const Banner = require('../../Admin/models/Banner');

// Get all active banners for member site
exports.getActiveBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1 });
    
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
    const banner = await Banner.findOne({ _id: req.params.id, isActive: true });
    
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
