const Sale = require('../models/Sale');

// @desc    Get all sales
// @route   GET /api/admin/sales
// @access  Private (Admin)
exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate('applicableProducts', 'name')
      .sort({ createdAt: -1 });

    // Update statuses before sending
    for (const sale of sales) {
      sale.updateStatus();
    }

    res.status(200).json({
      status: 'success',
      success: true,
      count: sales.length,
      data: sales
    });
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get single sale by ID
// @route   GET /api/admin/sales/:id
// @access  Private (Admin)
exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('applicableProducts', 'name category');

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
      });
    }

    // Update status
    sale.updateStatus();

    res.status(200).json({
      status: 'success',
      success: true,
      data: sale
    });
  } catch (error) {
    console.error('Error in getSaleById:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Create new sale
// @route   POST /api/admin/sales
// @access  Private (Admin)
exports.createSale = async (req, res) => {
  try {
    const {
      name,
      description,
      discount,
      startDate,
      endDate,
      applicableProducts,
      applicableCategories,
      productsCount,
      banner
    } = req.body;

    // Validation
    if (!name || !description || !discount || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing'
      });
    }

    // Create sale
    const sale = await Sale.create({
      name,
      description,
      discount: Number(discount),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      applicableProducts: applicableProducts || [],
      applicableCategories: applicableCategories || ['all'],
      productsCount: productsCount || 0,
      banner: banner || ''
    });

    // Update status based on dates
    sale.updateStatus();
    await sale.save();

    res.status(201).json({
      status: 'success',
      success: true,
      message: 'Sale created successfully',
      data: sale
    });
  } catch (error) {
    console.error('Error creating sale:', error);

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

// @desc    Update sale
// @route   PUT /api/admin/sales/:id
// @access  Private (Admin)
exports.updateSale = async (req, res) => {
  try {
    let sale = await Sale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
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
    } else if (updateData.startDate && !updateData.endDate) {
      const startDate = new Date(updateData.startDate);
      if (sale.endDate <= startDate) {
        return res.status(400).json({
          success: false,
          message: 'End date must be after start date'
        });
      }
    } else if (!updateData.startDate && updateData.endDate) {
      const endDate = new Date(updateData.endDate);
      if (endDate <= sale.startDate) {
        return res.status(400).json({
          success: false,
          message: 'End date must be after start date'
        });
      }
    }

    sale = await Sale.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        returnDocument: 'after',
        runValidators: false
      }
    );

    // Update status based on dates
    sale.updateStatus();
    await sale.save();

    res.status(200).json({
      status: 'success',
      success: true,
      message: 'Sale updated successfully',
      data: sale
    });
  } catch (error) {
    console.error('Error in updateSale:', error);

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
        message: 'Sale not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Delete sale
// @route   DELETE /api/admin/sales/:id
// @access  Private (Admin)
exports.deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
      });
    }

    await sale.deleteOne();

    res.status(200).json({
      status: 'success',
      success: true,
      message: 'Sale deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Error in deleteSale:', error);

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get sale statistics
// @route   GET /api/admin/sales/stats
// @access  Private (Admin)
exports.getSaleStats = async (req, res) => {
  try {
    const now = new Date();

    const totalSales = await Sale.countDocuments();
    const activeSales = await Sale.countDocuments({
      status: 'active',
      startDate: { $lte: now },
      endDate: { $gte: now }
    });
    const scheduledSales = await Sale.countDocuments({ status: 'scheduled' });
    const expiredSales = await Sale.countDocuments({ status: 'expired' });

    // Calculate total revenue
    const revenueResult = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalRevenue' }
        }
      }
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Top performing sales
    const topSales = await Sale.find({ totalRevenue: { $gt: 0 } })
      .sort({ totalRevenue: -1 })
      .limit(5)
      .select('name discount totalRevenue productsCount');

    res.status(200).json({
      status: 'success',
      success: true,
      data: {
        totalSales,
        activeSales,
        scheduledSales,
        expiredSales,
        totalRevenue,
        topSales
      }
    });
  } catch (error) {
    console.error('Error in getSaleStats:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update all sale statuses
// @route   POST /api/admin/sales/update-statuses
// @access  Private (Admin)
exports.updateAllStatuses = async (req, res) => {
  try {
    const count = await Sale.updateAllStatuses();

    res.status(200).json({
      status: 'success',
      success: true,
      message: `Updated ${count} sale statuses`,
      data: { count }
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
