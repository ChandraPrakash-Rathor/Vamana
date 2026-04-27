const Product = require('../../Admin/models/Product');
const { addRatingsToProducts, addRatingToProduct } = require('../../utils/reviewHelper');

// Helper — only prepend host if it's a bare filename (not already a full URL)
const buildImageUrl = (req, filename) => {
  if (!filename) return null;
  if (filename.startsWith('http://') || filename.startsWith('https://')) return filename;
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
};

const mapProduct = (req, product) => ({
  ...product._doc,
  volume: product.volume || '',
  subLine: product.subLine || '',
  mainImage: buildImageUrl(req, product.mainImage),
  subImages: (product.subImages || []).filter(Boolean).map(img => buildImageUrl(req, img))
});

// @desc    Get all active products for customers
// @route   GET /api/member/products
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({
      status: { $in: ['active', 'out-of-stock'] }
    }).sort({ createdAt: -1 }).select('-__v');

    const updatedProducts = products.map(p => mapProduct(req, p));
    const productsWithRatings = await addRatingsToProducts(updatedProducts);

    res.status(200).json({ success: true, count: productsWithRatings.length, data: productsWithRatings });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
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
    }).limit(8).sort({ createdAt: -1 }).select('-__v');

    const updatedProducts = products.map(p => mapProduct(req, p));
    const productsWithRatings = await addRatingsToProducts(updatedProducts);

    res.status(200).json({ success: true, count: productsWithRatings.length, data: productsWithRatings });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
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
    }).limit(8).sort({ sales: -1 }).select('-__v');

    const updatedProducts = products.map(p => mapProduct(req, p));
    const productsWithRatings = await addRatingsToProducts(updatedProducts);

    res.status(200).json({ success: true, count: productsWithRatings.length, data: productsWithRatings });
  } catch (error) {
    console.error('Error fetching bestseller products:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get top rated products (3+ reviews)
// @route   GET /api/member/products/top-rated
// @access  Public
exports.getTopRatedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const products = await Product.find({
      status: { $in: ['active', 'out-of-stock'] }
    }).select('-__v');

    const updatedProducts = products.map(p => mapProduct(req, p));
    const productsWithRatings = await addRatingsToProducts(updatedProducts);

    const topRated = productsWithRatings
      .filter(p => p.reviews >= 3 && p.rating >= 3.5)
      .sort((a, b) => b.rating !== a.rating ? b.rating - a.rating : b.reviews - a.reviews)
      .slice(0, limit);

    res.status(200).json({ success: true, count: topRated.length, data: topRated });
  } catch (error) {
    console.error('Error fetching top rated products:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/member/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select('-__v');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const updatedProduct = mapProduct(req, product);
    const productWithRating = await addRatingToProduct(updatedProduct);

    res.status(200).json({ success: true, data: productWithRating });
  } catch (error) {
    console.error('Error in getProductById:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
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
      category
    }).sort({ createdAt: -1 }).select('-__v');

    const updatedProducts = products.map(p => mapProduct(req, p));
    const productsWithRatings = await addRatingsToProducts(updatedProducts);

    res.status(200).json({ success: true, count: productsWithRatings.length, data: productsWithRatings });
  } catch (error) {
    console.error('Error in getProductsByCategory:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
