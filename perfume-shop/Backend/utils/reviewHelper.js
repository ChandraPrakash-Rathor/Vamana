const Review = require('../Admin/models/Review');

/**
 * Calculate actual rating and review count from Review collection
 * @param {String} productName - Product name to search reviews for
 * @returns {Object} { rating, reviewCount }
 */
async function getProductRatingFromReviews(productName) {
  try {
    const reviews = await Review.find({ product: productName });
    
    if (reviews.length === 0) {
      return { rating: 0, reviewCount: 0 };
    }
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = totalRating / reviews.length;
    
    return {
      rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
      reviewCount: reviews.length
    };
  } catch (error) {
    console.error('Error calculating rating from reviews:', error);
    return { rating: 0, reviewCount: 0 };
  }
}

/**
 * Add actual ratings to multiple products from Review collection
 * @param {Array} products - Array of product objects
 * @returns {Array} Products with updated rating and reviewCount
 */
async function addRatingsToProducts(products) {
  try {
    const productsWithRatings = await Promise.all(
      products.map(async (product) => {
        const { rating, reviewCount } = await getProductRatingFromReviews(product.name);
        return {
          ...product,
          rating,
          reviews: reviewCount
        };
      })
    );
    
    return productsWithRatings;
  } catch (error) {
    console.error('Error adding ratings to products:', error);
    return products; // Return original products if error
  }
}

/**
 * Add actual rating to a single product from Review collection
 * @param {Object} product - Product object
 * @returns {Object} Product with updated rating and reviewCount
 */
async function addRatingToProduct(product) {
  try {
    const { rating, reviewCount } = await getProductRatingFromReviews(product.name);
    return {
      ...product,
      rating,
      reviews: reviewCount
    };
  } catch (error) {
    console.error('Error adding rating to product:', error);
    return product; // Return original product if error
  }
}

module.exports = {
  getProductRatingFromReviews,
  addRatingsToProducts,
  addRatingToProduct
};
