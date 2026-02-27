/**
 * Image Helper Utility
 * Centralized image URL management for the entire application
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

/**
 * Get full image URL from filename
 * @param {string} filename - Image filename (e.g., '1234567890.png' or 'default-avatar.png')
 * @returns {string} Full image URL
 */
const getImageUrl = (filename) => {
  if (!filename) {
    return `${BASE_URL}/uploads/default-avatar.png`;
  }
  
  // If already a full URL, return as is
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  
  // Build full URL
  return `${BASE_URL}/uploads/${filename}`;
};

/**
 * Get image URL with default fallback
 * @param {string} filename - Image filename
 * @param {string} defaultImage - Default image filename (default: 'default-avatar.png')
 * @returns {string} Full image URL
 */
const getImageUrlWithFallback = (filename, defaultImage = 'default-avatar.png') => {
  if (!filename || filename === defaultImage) {
    return `${BASE_URL}/uploads/${defaultImage}`;
  }
  
  return getImageUrl(filename);
};

/**
 * Process object with image fields and add full URLs
 * @param {Object} obj - Object containing image fields
 * @param {Array<string>} imageFields - Array of field names that contain images
 * @returns {Object} Object with full image URLs
 */
const processImageUrls = (obj, imageFields = ['image']) => {
  const processed = { ...obj };
  
  imageFields.forEach(field => {
    if (processed[field]) {
      processed[field] = getImageUrl(processed[field]);
    }
  });
  
  return processed;
};

/**
 * Process array of objects with image fields
 * @param {Array<Object>} array - Array of objects
 * @param {Array<string>} imageFields - Array of field names that contain images
 * @returns {Array<Object>} Array with full image URLs
 */
const processArrayImageUrls = (array, imageFields = ['image']) => {
  return array.map(item => processImageUrls(item, imageFields));
};

/**
 * Save image filename (strips base URL if present)
 * Use this before saving to database to store only filename
 * @param {string} imageUrl - Full URL or filename
 * @returns {string} Just the filename
 */
const getFilenameFromUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // If it's a full URL, extract filename
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    const parts = imageUrl.split('/uploads/');
    return parts.length > 1 ? parts[1] : imageUrl;
  }
  
  // Already a filename
  return imageUrl;
};

module.exports = {
  getImageUrl,
  getImageUrlWithFallback,
  processImageUrls,
  processArrayImageUrls,
  getFilenameFromUrl,
  BASE_URL
};
