const LimitedOffer = require('../../Admin/models/LimitedOffer');

// @desc    Get all active limited offers for members
// @route   GET /api/member/limited-offers
// @access  Public
exports.getActiveOffers = async (req, res) => {
  try {
    const now = new Date();
    
    // Find active offers where current date is between start and end date
    const offers = await LimitedOffer.find({
      status: 'active',
      startDate: { $lte: now },
      endDate: { $gte: now }
    })
      .populate('product', 'name mainImage category actualPrice finalPrice status')
      .sort({ featured: -1, createdAt: -1 })
      .select('-__v');

    // Filter and transform offers
    const validOffers = offers
      .filter(offer => {
        // Handle both array and single product
        const products = Array.isArray(offer.product) ? offer.product : [offer.product];
        const firstProduct = products[0];
        
        return firstProduct && 
               (firstProduct.status === 'active' || firstProduct.status === 'out-of-stock');
      })
      .map(offer => {
        // Convert to plain object and ensure product is the first item if array
        const offerObj = offer.toObject();
        if (Array.isArray(offerObj.product) && offerObj.product.length > 0) {
          offerObj.product = offerObj.product[0];
        }
        return offerObj;
      });

    res.status(200).json({
      success: true,
      count: validOffers.length,
      data: validOffers
    });
  } catch (error) {
    console.error("Error fetching active offers:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// @desc    Get single limited offer by ID
// @route   GET /api/member/limited-offers/:id
// @access  Public
exports.getOfferById = async (req, res) => {
  try {
    const offer = await LimitedOffer.findById(req.params.id)
      .populate('product', 'name mainImage category actualPrice finalPrice status description images')
      .select('-__v');

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    // Check if offer is active
    const now = new Date();
    if (offer.status !== 'active' || offer.startDate > now || offer.endDate < now) {
      return res.status(404).json({
        success: false,
        message: 'Offer is not currently active'
      });
    }

    // Convert to plain object and handle product array
    const offerObj = offer.toObject();
    if (Array.isArray(offerObj.product) && offerObj.product.length > 0) {
      offerObj.product = offerObj.product[0];
    }

    res.status(200).json({
      success: true,
      data: offerObj
    });
  } catch (error) {
    console.error('Error in getOfferById:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
