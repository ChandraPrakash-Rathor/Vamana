const Product = require('../../Admin/models/Product');

// @desc    Get all active products for customers
// @route   GET /api/member/products
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
  
    const products = await Product.find({ 
      status: { $in: ['active', 'out-of-stock'] } 
    })
      .sort({ createdAt: -1 })
      .select('-__v');

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

// @desc    Get featured products
// @route   GET /api/member/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ 
      status: { $in: ['active', 'out-of-stock'] },
      featured: true 
    })
      .limit(8)
      .sort({ createdAt: -1 })
      .select('-__v');

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
      success: true,
      count: updatedProducts.length,
      data: updatedProducts
    });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// @desc    Get bestseller products
// @route   GET /api/member/products/bestsellers
// @access  Public
exports.getBestsellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ 
      status: { $in: ['active', 'out-of-stock'] },
      bestseller: true 
    })
      .limit(8)
      .sort({ sales: -1 })
      .select('-__v');

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
      success: true,
      count: updatedProducts.length,
      data: updatedProducts
    });
  } catch (error) {
    console.error("Error fetching bestseller products:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/member/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select('-__v');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const updatedProduct = {
      ...product._doc,
      mainImage: product.mainImage
        ? `${req.protocol}://${req.get("host")}/uploads/${product.mainImage}`
        : null,
      subImages: product.subImages?.map(img =>
        `${req.protocol}://${req.get("host")}/uploads/${img}`
      )
    };

    res.status(200).json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error in getProductById:', error);
    
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

// @desc    Get products by category
// @route   GET /api/member/products/category/:category
// @access  Public
exports.getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category.toLowerCase();
    
    const products = await Product.find({ 
      status: { $in: ['active', 'out-of-stock'] },
      category: category
    })
      .sort({ createdAt: -1 })
      .select('-__v');

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
      success: true,
      count: updatedProducts.length,
      data: updatedProducts
    });
  } catch (error) {
    console.error('Error in getProductsByCategory:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
