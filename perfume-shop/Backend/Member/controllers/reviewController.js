const Review = require('../../Admin/models/Review');
const { getImageUrl } = require('../../utils/imageHelper');

// Get all reviews for member site
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    
    // Add full image URLs
    const reviewsWithUrls = reviews.map(review => ({
      ...review.toObject(),
      image: getImageUrl(review.image)
    }));

    res.status(200).json({
      success: true,
      count: reviewsWithUrls.length,
      data: reviewsWithUrls
    });
  } catch (error) {
    console.error('❌ Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

// Get reviews by product
exports.getReviewsByProduct = async (req, res) => {
  try {
    const { product } = req.params;
    const reviews = await Review.find({ product }).sort({ createdAt: -1 });
    
    // Add full image URLs
    const reviewsWithUrls = reviews.map(review => ({
      ...review.toObject(),
      image: getImageUrl(review.image)
    }));

    res.status(200).json({
      success: true,
      count: reviewsWithUrls.length,
      data: reviewsWithUrls
    });
  } catch (error) {
    console.error('❌ Error fetching reviews by product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

// Get single review by ID
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const reviewWithUrl = {
      ...review.toObject(),
      image: getImageUrl(review.image)
    };

    res.status(200).json({
      success: true,
      data: reviewWithUrl
    });
  } catch (error) {
    console.error('❌ Error fetching review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review',
      error: error.message
    });
  }
};

// Get featured/top reviews (highest ratings)
exports.getFeaturedReviews = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const reviews = await Review.find({ rating: { $gte: 4 } })
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit);
    
    // Add full image URLs
    const reviewsWithUrls = reviews.map(review => ({
      ...review.toObject(),
      image: getImageUrl(review.image)
    }));

    res.status(200).json({
      success: true,
      count: reviewsWithUrls.length,
      data: reviewsWithUrls
    });
  } catch (error) {
    console.error('❌ Error fetching featured reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured reviews',
      error: error.message
    });
  }
};

// Get products with best reviews (3+ rating, grouped by product)
exports.getProductsWithBestReviews = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    const minReviews = parseInt(req.query.minReviews) || 1; // Default 1 for testing, change to 3 in production
    
    // Aggregate reviews to find products with high ratings
    const topProducts = await Review.aggregate([
      // Filter reviews with rating >= 3
      { $match: { rating: { $gte: 3 } } },
      
      // Group by product name
      { 
        $group: {
          _id: '$product',
          avgRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 },
          reviews: { $push: '$$ROOT' }
        }
      },
      
      // Filter products with minimum reviews
      { $match: { reviewCount: { $gte: minReviews } } },
      
      // Sort by average rating and review count
      { $sort: { avgRating: -1, reviewCount: -1 } },
      
      // Limit results
      { $limit: limit }
    ]);

    // Get product details from Product collection
    const Product = require('../../Admin/models/Product');
    const productsWithReviews = await Promise.all(
      topProducts.map(async (item) => {
        const product = await Product.findOne({ 
          name: item._id,
          status: { $in: ['active', 'out-of-stock'] }
        });
        
        if (!product) {
          return null;
        }
        
        const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
        
        return {
          product: {
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            actualPrice: product.actualPrice,
            discount: product.discount,
            finalPrice: product.finalPrice,
            stock: product.stock,
            mainImage: product.mainImage ? `${baseUrl}/uploads/${product.mainImage}` : null,
            subImages: product.subImages?.map(img => `${baseUrl}/uploads/${img}`),
            status: product.status,
            rating: product.rating,
            reviews: product.reviews
          },
          avgRating: Math.round(item.avgRating * 10) / 10,
          reviewCount: item.reviewCount,
          topReviews: item.reviews.slice(0, 3).map(review => ({
            name: review.name,
            rating: review.rating,
            review: review.review,
            image: getImageUrl(review.image)
          }))
        };
      })
    );

    // Filter out null values (products not found)
    const validProducts = productsWithReviews.filter(item => item !== null);

    res.status(200).json({
      success: true,
      count: validProducts.length,
      data: validProducts
    });
  } catch (error) {
    console.error('❌ Error fetching products with best reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products with best reviews',
      error: error.message
    });
  }
};
