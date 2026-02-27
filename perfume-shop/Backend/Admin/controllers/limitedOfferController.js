const LimitedOffer = require('../models/LimitedOffer');

// @desc    Get all limited offers
// @route   GET /api/admin/limited-offers
// @access  Private (Admin)
exports.getAllOffers = async (req, res) => {
  try {
    const offers = await LimitedOffer.find()
      .populate('product', 'name mainImage category finalPrice actualPrice')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      success: true,
      count: offers.length,
      data: offers
    });
  } catch (error) {
    console.error('Error fetching limited offers:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single limited offer by ID
// @route   GET /api/admin/limited-offers/:id
// @access  Private (Admin)
exports.getOfferById = async (req, res) => {
  try {
    const offer = await LimitedOffer.findById(req.params.id)
      .populate('product', 'name mainImage category finalPrice actualPrice description');

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Limited offer not found'
      });
    }

    res.status(200).json({
      status: 'success',
      success: true,
      data: offer
    });
  } catch (error) {
    console.error('Error in getOfferById:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Limited offer not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Create new limited offer
// @route   POST /api/admin/limited-offers
// @access  Private (Admin)
exports.createOffer = async (req, res) => {
  try {
    const {
      title,
      description,
      product,
      originalPrice,
      offerPrice,
      startDate,
      endDate,
      stockLimit,
      featured
    } = req.body;

    // Validation
    if (!title || !description || !product || !originalPrice || !offerPrice || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing'
      });
    }

    // Convert dates to local timezone start/end of day
    // If date is "2026-02-27", make it start at 00:00:00 local time, not UTC
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    
    // Set start date to beginning of day in local timezone
    startDateObj.setHours(0, 0, 0, 0);
    
    // Set end date to end of day in local timezone
    endDateObj.setHours(23, 59, 59, 999);

    const offer = await LimitedOffer.create({
      title,
      description,
      product,
      originalPrice: Number(originalPrice),
      offerPrice: Number(offerPrice),
      startDate: startDateObj,
      endDate: endDateObj,
      stockLimit: stockLimit ? Number(stockLimit) : null,
      featured: featured || false
    });

    // Update status based on current time
    offer.updateStatus();
    await offer.save();

    // Populate product details
    await offer.populate('product', 'name mainImage category');

    res.status(201).json({
      status: 'success',
      success: true,
      message: 'Limited offer created successfully',
      data: offer
    });
  } catch (error) {
    console.error('Error creating limited offer:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update limited offer
// @route   PUT /api/admin/limited-offers/:id
// @access  Private (Admin)
exports.updateOffer = async (req, res) => {
  try {
    let offer = await LimitedOffer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Limited offer not found'
      });
    }

    // Update fields
    const updateData = { ...req.body };

    // Manual date validation for updates
    if (updateData.startDate && updateData.endDate) {
      const startDate = new Date(updateData.startDate);
      const endDate = new Date(updateData.endDate);
      if (endDate <= startDate) {
        return res.status(400).json({
          success: false,
          message: 'End date must be after start date'
        });
      }
    }

    // Validate prices if being updated
    if (updateData.offerPrice && updateData.originalPrice) {
      if (Number(updateData.offerPrice) >= Number(updateData.originalPrice)) {
        return res.status(400).json({
          success: false,
          message: 'Offer price must be less than original price'
        });
      }
    }

    offer = await LimitedOffer.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        returnDocument: 'after',
        runValidators: false
      }
    );

    // Update status
    offer.updateStatus();
    await offer.save();

    // Populate product details
    await offer.populate('product', 'name mainImage category');

    res.status(200).json({
      status: 'success',
      success: true,
      message: 'Limited offer updated successfully',
      data: offer
    });
  } catch (error) {
    console.error('Error in updateOffer:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Limited offer not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

exports.deleteOffer = async (req, res) => {
  try {
    const offer = await LimitedOffer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Limited offer not found'
      });
    }

    await offer.deleteOne();

    res.status(200).json({
      status: 'success',
      success: true,
      message: 'Limited offer deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Error in deleteOffer:', error);

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Limited offer not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get limited offer statistics
// @route   GET /api/admin/limited-offers/stats
// @access  Private (Admin)
exports.getOfferStats = async (req, res) => {
  try {
    const now = new Date();

    const totalOffers = await LimitedOffer.countDocuments();
    const activeOffers = await LimitedOffer.countDocuments({
      status: 'active',
      startDate: { $lte: now },
      endDate: { $gte: now }
    });
    const expiredOffers = await LimitedOffer.countDocuments({ status: 'expired' });
    const scheduledOffers = await LimitedOffer.countDocuments({ status: 'scheduled' });

    // Total sold count
    const soldStats = await LimitedOffer.aggregate([
      { $group: { _id: null, totalSold: { $sum: '$soldCount' } } }
    ]);
    const totalSold = soldStats.length > 0 ? soldStats[0].totalSold : 0;

    res.status(200).json({
      status: 'success',
      success: true,
      data: {
        totalOffers,
        activeOffers,
        expiredOffers,
        scheduledOffers,
        totalSold
      }
    });
  } catch (error) {
    console.error('Error in getOfferStats:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update all offer statuses
// @route   POST /api/admin/limited-offers/update-statuses
// @access  Private (Admin)
exports.updateAllStatuses = async (req, res) => {
  try {
    const offers = await LimitedOffer.find({ status: { $ne: 'inactive' } });
    
    let updatedCount = 0;
    for (const offer of offers) {
      const oldStatus = offer.status;
      offer.updateStatus();
      
      if (oldStatus !== offer.status) {
        await offer.save();
        updatedCount++;
      }
    }

    res.status(200).json({
      status: 'success',
      success: true,
      message: `Updated ${updatedCount} offer statuses`,
      data: { updatedCount }
    });
  } catch (error) {
    console.error('Error in updateAllStatuses:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
