const Sale = require('../../Admin/models/Sale');

// @desc    Get all active and scheduled sales for members
// @route   GET /api/member/sales
// @access  Public
exports.getActiveSales = async (req, res) => {
  try {
    const now = new Date();
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    
    // Find active and upcoming scheduled sales
    const sales = await Sale.find({
      status: { $in: ['active', 'scheduled'] },
      endDate: { $gte: now } // Only show sales that haven't ended yet
    })
      .populate('applicableProducts', 'name mainImage category actualPrice finalPrice status description')
      .sort({ startDate: 1 }) // Sort by start date (earliest first)
      .select('-__v -totalRevenue -productsCount');

    // Transform sales to include calculated sale prices and full image URLs
    const transformedSales = sales.map(sale => {
      const saleObj = sale.toObject();
      
      // Calculate sale price for each product
      if (saleObj.applicableProducts && saleObj.applicableProducts.length > 0) {
        saleObj.applicableProducts = saleObj.applicableProducts
          .filter(product => product && (product.status === 'active' || product.status === 'out-of-stock'))
          .map(product => ({
            ...product,
            mainImage: product.mainImage ? `${baseUrl}/uploads/${product.mainImage}` : null,
            originalPrice: product.actualPrice || product.finalPrice,
            salePrice: Math.round((product.actualPrice || product.finalPrice) * (1 - sale.discount / 100)),
            discount: sale.discount
          }));
      }
      
      return saleObj;
    });

    res.status(200).json({
      success: true,
      count: transformedSales.length,
      data: transformedSales
    });
  } catch (error) {
    console.error("Error fetching active sales:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// @desc    Get single sale by ID
// @route   GET /api/member/sales/:id
// @access  Public
exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate('applicableProducts', 'name mainImage category actualPrice finalPrice status')
      .select('-__v -totalRevenue');

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Sale not found'
      });
    }

    // Check if sale is active
    const now = new Date();
    if (sale.status !== 'active' || sale.startDate > now || sale.endDate < now) {
      return res.status(404).json({
        success: false,
        message: 'Sale is not currently active'
      });
    }

    res.status(200).json({
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
