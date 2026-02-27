const Review = require('../models/Review');
const path = require('path');
const fs = require('fs');
const { getImageUrl, getFilenameFromUrl } = require('../../utils/imageHelper');

// Get all reviews
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    
    // Add full image URLs
    const reviewsWithUrls = reviews.map(review => ({
      ...review.toObject(),
      image: getImageUrl(review.image)
    }));

    res.status(200).json({
      success: true,
      data: reviewsWithUrls
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
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
    console.error('Error fetching review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review',
      error: error.message
    });
  }
};

// Add new review
exports.addReview = async (req, res) => {
  try {
    const { name, role, location, rating, review, product, verified } = req.body;

    // Validation
    if (!name || !review) {
      return res.status(400).json({
        success: false,
        message: 'Name and review text are required'
      });
    }

    // Handle image upload - use default avatar if no image provided
    let imagePath = 'default-avatar.png'; // Default placeholder
    if (req.file) {
      imagePath = req.file.filename;
    } else if (req.body.image && req.body.image.trim() !== '') {
      // Extract filename if full URL provided
      imagePath = getFilenameFromUrl(req.body.image);
    }

    const newReview = new Review({
      name,
      role: role || '',
      location: location || '',
      image: imagePath,
      rating: parseInt(rating) || 5,
      review,
      product: product || '',
      verified: verified === 'true' || verified === true
    });

    await newReview.save();

    const reviewWithUrl = {
      ...newReview.toObject(),
      image: getImageUrl(newReview.image)
    };

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: reviewWithUrl
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add review',
      error: error.message
    });
  }
};

// Update review
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, location, rating, review, product, verified } = req.body;

    const existingReview = await Review.findById(id);
    if (!existingReview) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Handle image update
    let imagePath = existingReview.image;
    if (req.file) {
      // Delete old image if it exists and is not default avatar
      if (existingReview.image && existingReview.image !== 'default-avatar.png') {
        const oldImagePath = path.join(__dirname, '../../uploads', existingReview.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imagePath = req.file.filename;
    } else if (req.body.image && req.body.image.trim() !== '') {
      // Extract filename if full URL provided
      imagePath = getFilenameFromUrl(req.body.image);
    }

    // Update fields
    existingReview.name = name || existingReview.name;
    existingReview.role = role !== undefined ? role : existingReview.role;
    existingReview.location = location !== undefined ? location : existingReview.location;
    existingReview.image = imagePath;
    existingReview.rating = rating ? parseInt(rating) : existingReview.rating;
    existingReview.review = review || existingReview.review;
    existingReview.product = product !== undefined ? product : existingReview.product;
    existingReview.verified = verified !== undefined ? (verified === 'true' || verified === true) : existingReview.verified;

    await existingReview.save();

    const reviewWithUrl = {
      ...existingReview.toObject(),
      image: getImageUrl(existingReview.image)
    };

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: reviewWithUrl
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review',
      error: error.message
    });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Delete image if it exists and is not default avatar
    if (review.image && review.image !== 'default-avatar.png') {
      const imagePath = path.join(__dirname, '../../uploads', review.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Review.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message
    });
  }
};
