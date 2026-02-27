const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    const updatedProducts = products.map(product => ({
      ...product._doc,
      mainImage: product.mainImage
        ? `${req.protocol}://${req.get("host")}/uploads/${product.mainImage}`
        : null,
      subImages: product.subImages?.map(img =>
        `${req.protocol}://${req.get("host")}/uploads/${img}`
      )
    }));

    res.status(200).json({
      status:"success",
      success: true,
      count: updatedProducts.length,
      data: updatedProducts
    });

  } catch (error) {
    console.error("Error fetching products:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error in getProductById:', error);
    
    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};


exports.createProduct = async (req, res) => {
  try {
    const data = req.body.data ? JSON.parse(req.body.data) : req.body;
    const files = req.files || [];

    // Extract fields
    const {
      name,
      sku,
      category,
      actualPrice,
      discount,
      finalPrice,
      stock,
      volume,
      description
    } = data;

    // Get images
    const mainImageFile = files.find(file => file.fieldname === "mainImage");
    const subImagesFiles = files
      .filter(file => file.fieldname === "subImages")
      .map(file => file.filename);

    // Validation
    if (!name || !description || !category || !actualPrice || !mainImageFile) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    // Create product
    const product = await Product.create({
      name,
      sku,
      category: category.toLowerCase(),
      actualPrice: Number(actualPrice),
      discount: Number(discount) || 0,
      finalPrice: Number(finalPrice),
      stock: Number(stock) || 0,
      volume,
      description,
      mainImage: mainImageFile.filename,
      subImages: subImagesFiles,
      status: Number(stock) > 0 ? "active" : "out-of-stock"
    });

    res.status(201).json({
      status:"success",
      success: true,
      message: "Product created successfully",
      data: product
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private (Admin)
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if this is a FormData request (with files) or regular JSON
    let updateData = {};
    const files = req.files || [];
    
    if (req.body.data) {
      // FormData request with files
      try {
        const data = JSON.parse(req.body.data);
        updateData = { ...data };
      } catch (parseError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid data format',
          error: parseError.message
        });
      }
    } else {
      // Regular JSON request (no files)
      updateData = { ...req.body };
    }

    // Handle main image update
    const mainImageFile = files.find(file => file.fieldname === "mainImage");
    if (mainImageFile) {
      // Delete old main image if exists
      if (product.mainImage) {
        const oldImagePath = path.join(__dirname, '../../uploads', product.mainImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log('Deleted old main image:', product.mainImage);
        }
      }
      updateData.mainImage = mainImageFile.filename;
    }

    // Handle sub images update
    const subImagesFiles = files.filter(file => file.fieldname === "subImages");
    if (subImagesFiles.length > 0) {
      // Delete old sub images if exists
      if (product.subImages && product.subImages.length > 0) {
        product.subImages.forEach(img => {
          const oldImagePath = path.join(__dirname, '../../uploads', img);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
            console.log('Deleted old sub image:', img);
          }
        });
      }
      updateData.subImages = subImagesFiles.map(file => file.filename);
    }

    // Update product
    product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: 'success',
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Error in updateProduct:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }

    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private (Admin)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete main image if exists
    if (product.mainImage) {
      const mainImagePath = path.join(__dirname, '../../uploads', product.mainImage);
      if (fs.existsSync(mainImagePath)) {
        fs.unlinkSync(mainImagePath);
        console.log('✅ Deleted main image:', product.mainImage);
      }
    }

    // Delete all sub images if exist
    if (product.subImages && product.subImages.length > 0) {
      product.subImages.forEach(img => {
        const subImagePath = path.join(__dirname, '../../uploads', img);
        if (fs.existsSync(subImagePath)) {
          fs.unlinkSync(subImagePath);
          console.log('✅ Deleted sub image:', img);
        }
      });
    }

    await product.deleteOne();

    res.status(200).json({
      status: 'success',
      success: true,
      message: 'Product and all images deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('❌ Error in deleteProduct:', error);

    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get product statistics
// @route   GET /api/admin/products/stats
// @access  Private (Admin)
exports.getProductStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ status: 'active' });
    const outOfStock = await Product.countDocuments({ status: 'out-of-stock' });
    const featuredProducts = await Product.countDocuments({ featured: true });
    const bestsellers = await Product.countDocuments({ bestseller: true });

    // Category breakdown
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalValue: { $sum: '$finalPrice' }
        }
      }
    ]);

    // Total inventory value
    const inventoryValue = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ['$finalPrice', '$stock'] } }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        activeProducts,
        outOfStock,
        featuredProducts,
        bestsellers,
        categoryStats,
        inventoryValue: inventoryValue[0]?.totalValue || 0
      }
    });
  } catch (error) {
    console.error('Error in getProductStats:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
