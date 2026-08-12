const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');
const { success, created, error, validationError, notFound, isInvalidObjectId, getValidationMessages } = require('../../utils/apiResponse');

// Safe image URL builder — never double-prepend
const buildImageUrl = (req, filename) => {
  if (!filename) return null;
  if (filename.startsWith('http://') || filename.startsWith('https://')) return filename;
  return `${req.protocol}://${req.get('host')}/uploads/${filename}`;
};

// Strip full URL back to bare filename for storage — prevents double-URL on re-fetch
const stripToFilename = (urlOrFilename) => {
  if (!urlOrFilename) return urlOrFilename;
  if (urlOrFilename.startsWith('http://') || urlOrFilename.startsWith('https://')) {
    return urlOrFilename.split('/uploads/').pop();
  }
  return urlOrFilename;
};

// Safe file deletion — only delete bare filenames, not full URLs
const safeDeleteFile = (filename) => {
  if (!filename || filename.startsWith('http')) return;
  const filePath = path.join(__dirname, '../../uploads', filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const VALID_CATEGORIES = ['perfume', 'attar', 'combo'];
const VALID_STATUSES = ['active', 'inactive', 'out-of-stock'];

// GET /api/admin/GetProducts
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    const data = products.map(product => ({
      ...product._doc,
      volume: product.volume || '',
      subLine: product.subLine || '',
      mainImage: buildImageUrl(req, product.mainImage),
      subImages: [...new Set((product.subImages || []).filter(Boolean))].map(img => buildImageUrl(req, img))
    }));

    return success(res, data, 'Products fetched successfully');
  } catch (err) {
    return error(res, 'Failed to fetch products', 500, err);
  }
};

// GET /api/admin/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return notFound(res, 'Product not found');

    const data = {
      ...product._doc,
      volume: product.volume || '',
      subLine: product.subLine || '',
      mainImage: buildImageUrl(req, product.mainImage),
      subImages: [...new Set((product.subImages || []).filter(Boolean))].map(img => buildImageUrl(req, img))
    };

    return success(res, data, 'Product fetched successfully');
  } catch (err) {
    if (isInvalidObjectId(err)) return notFound(res, 'Product not found');
    return error(res, 'Failed to fetch product', 500, err);
  }
};

// POST /api/admin/insertProduct
exports.createProduct = async (req, res) => {
  try {
    let data;
    // Issue 1 fix: malformed JSON in req.body.data crashed before try-catch
    if (req.body.data) {
      try {
        data = JSON.parse(req.body.data);
      } catch {
        return validationError(res, 'Invalid JSON in data field');
      }
    } else {
      data = req.body;
    }

    const files = req.files || [];
    const { name, sku, category, actualPrice, discount, stock, volume, description, subLine } = data;

    // Required field validation
    const missing = [];
    if (!name?.trim()) missing.push('name');
    if (!description?.trim()) missing.push('description');
    if (!category) missing.push('category');
    if (!actualPrice) missing.push('actualPrice');

    const mainImageFile = files.find(f => f.fieldname === 'mainImage');
    if (!mainImageFile) missing.push('mainImage');

    if (missing.length > 0) {
      // Issue 4 fix: clean up uploaded files if validation fails
      files.forEach(f => safeDeleteFile(f.filename));
      return validationError(res, `Required fields missing: ${missing.join(', ')}`);
    }

    // Category validation — return 400 not 500
    if (!VALID_CATEGORIES.includes(category.toLowerCase())) {
      files.forEach(f => safeDeleteFile(f.filename));
      return validationError(res, `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`);
    }

    const parsedPrice = Number(actualPrice);
    const parsedDiscount = Number(discount) || 0;
    const parsedStock = Number(stock) || 0;

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      files.forEach(f => safeDeleteFile(f.filename));
      return validationError(res, 'actualPrice must be a positive number');
    }
    if (parsedDiscount < 0 || parsedDiscount > 100) {
      files.forEach(f => safeDeleteFile(f.filename));
      return validationError(res, 'discount must be between 0 and 100');
    }
    if (parsedStock < 0) {
      files.forEach(f => safeDeleteFile(f.filename));
      return validationError(res, 'stock cannot be negative');
    }

    const subImagesFiles = files.filter(f => f.fieldname === 'subImages').map(f => f.filename);
    // Deduplicate — remove any duplicate filenames
    const uniqueSubImages = [...new Set(subImagesFiles)];
    const finalPrice = parsedPrice - (parsedPrice * parsedDiscount) / 100;

    const product = await Product.create({
      name: name.trim(),
      sku: sku?.trim(),
      category: category.toLowerCase(),
      actualPrice: parsedPrice,
      discount: parsedDiscount,
      finalPrice: Math.round(finalPrice * 100) / 100,
      stock: parsedStock,
      volume: volume?.trim() || '',
      description: description.trim(),
      subLine: subLine?.trim() || '',
      mainImage: mainImageFile.filename,
      subImages: uniqueSubImages,
      status: parsedStock > 0 ? 'active' : 'out-of-stock'
    });

    return created(res, product, 'Product created successfully');
  } catch (err) {
    // Clean up any uploaded files on unexpected error
    (req.files || []).forEach(f => safeDeleteFile(f.filename));
    if (err.name === 'ValidationError') {
      return validationError(res, 'Validation failed', getValidationMessages(err));
    }
    return error(res, 'Failed to create product', 500, err);
  }
};

// PUT /api/admin/products/:id
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return notFound(res, 'Product not found');

    const files = req.files || [];
    let updateData = {};

    // Parse body data
    if (req.body.data) {
      try {
        updateData = JSON.parse(req.body.data);
      } catch {
        return validationError(res, 'Invalid JSON in data field');
      }
    } else {
      updateData = { ...req.body };
    }

    // Validate category if being updated
    if (updateData.category && !VALID_CATEGORIES.includes(updateData.category.toLowerCase())) {
      return validationError(res, `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}`);
    }

    // Validate status if being updated
    if (updateData.status && !VALID_STATUSES.includes(updateData.status)) {
      return validationError(res, `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`);
    }

    // Validate discount range
    if (updateData.discount !== undefined) {
      const d = Number(updateData.discount);
      if (isNaN(d) || d < 0 || d > 100) {
        return validationError(res, 'discount must be between 0 and 100');
      }
    }

    // Validate price
    if (updateData.actualPrice !== undefined) {
      const p = Number(updateData.actualPrice);
      if (isNaN(p) || p <= 0) {
        return validationError(res, 'actualPrice must be a positive number');
      }
    }

    // ────────────────────────────────────────────────
    // MAIN IMAGE
    // ────────────────────────────────────────────────
    const mainImageFile = files.find(f => f.fieldname === 'mainImage');

    if (mainImageFile) {
      // New main image uploaded → delete old one
      safeDeleteFile(product.mainImage);
      updateData.mainImage = mainImageFile.filename;
    } else if (updateData.mainImage) {
      // Frontend sent existing image (URL or filename)
      updateData.mainImage = stripToFilename(updateData.mainImage);
    }
    // Optional: allow removing main image
    // else if (updateData.mainImage === null || updateData.mainImage === '') {
    //   safeDeleteFile(product.mainImage);
    //   updateData.mainImage = null;
    // }

    // ────────────────────────────────────────────────
    // SUB IMAGES
    // ────────────────────────────────────────────────
    const subImagesFiles = files.filter(f => f.fieldname === 'subImages');

    // 1. Start with images the frontend wants to keep
    let finalSubImages = [];

    if (Array.isArray(updateData.subImages)) {
      finalSubImages = [...new Set(
        updateData.subImages
          .map(stripToFilename)
          .filter(Boolean)
      )];
    } else {
      // Frontend didn't send subImages list → keep current ones
      finalSubImages = [...(product.subImages || [])];
    }

    // 2. Add newly uploaded files
    if (subImagesFiles.length > 0) {
      const newFilenames = subImagesFiles.map(f => f.filename);
      finalSubImages = [...new Set([...finalSubImages, ...newFilenames])];
    }

    // 3. Delete files that were removed by the user
    const oldFilenames = product.subImages || [];
    oldFilenames.forEach(oldFile => {
      if (!finalSubImages.includes(oldFile)) {
        safeDeleteFile(oldFile);
      }
    });

    updateData.subImages = finalSubImages;

    // ────────────────────────────────────────────────
    // RECALCULATE finalPrice
    // ────────────────────────────────────────────────
    if (updateData.actualPrice !== undefined || updateData.discount !== undefined) {
      const newPrice = Number(updateData.actualPrice) ?? product.actualPrice;
      const newDiscount = updateData.discount !== undefined
        ? Number(updateData.discount)
        : product.discount;

      updateData.finalPrice = Math.round((newPrice - (newPrice * newDiscount) / 100) * 100) / 100;
    }

    // Update product
    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    return success(res, product, 'Product updated successfully');
  } catch (err) {
    if (isInvalidObjectId(err)) return notFound(res, 'Product not found');
    if (err.name === 'ValidationError') {
      return validationError(res, 'Validation failed', getValidationMessages(err));
    }
    return error(res, 'Failed to update product', 500, err);
  }
};

// DELETE /api/admin/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return notFound(res, 'Product not found');

    // Safe delete — handles both bare filenames and full URLs gracefully
    safeDeleteFile(product.mainImage);
    (product.subImages || []).forEach(img => safeDeleteFile(img));

    await product.deleteOne();

    return success(res, null, 'Product deleted successfully');
  } catch (err) {
    if (isInvalidObjectId(err)) return notFound(res, 'Product not found');
    return error(res, 'Failed to delete product', 500, err);
  }
};

// DELETE /api/admin/products/cleanup-images — delete orphaned upload files
exports.cleanupOrphanedImages = async (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, '../../uploads');

    // Get all files in uploads folder
    const allFiles = fs.readdirSync(uploadsDir).filter(f => {
      const ext = path.extname(f).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
    });

    // Get all image filenames used in DB
    const products = await Product.find().select('mainImage subImages').lean();
    const usedFiles = new Set();
    products.forEach(p => {
      if (p.mainImage) usedFiles.add(stripToFilename(p.mainImage));
      (p.subImages || []).forEach(img => { if (img) usedFiles.add(stripToFilename(img)); });
    });

    // Also check banner and site settings images
    try {
      const Banner = require('../models/Banner');
      const banners = await Banner.find().select('image').lean();
      banners.forEach(b => { if (b.image) usedFiles.add(stripToFilename(b.image)); });
    } catch {}

    try {
      const SiteSettings = require('../models/SiteSettings');
      const settings = await SiteSettings.findOne().select('logo').lean();
      if (settings?.logo) usedFiles.add(stripToFilename(settings.logo));
    } catch {}

    // Find orphaned files (in folder but not in DB)
    const orphaned = allFiles.filter(f => !usedFiles.has(f));

    // Delete them
    let deleted = 0;
    orphaned.forEach(f => {
      try {
        fs.unlinkSync(path.join(uploadsDir, f));
        deleted++;
      } catch {}
    });

    return success(res, { deleted, orphanedFiles: orphaned }, `Cleaned up ${deleted} orphaned images`);
  } catch (err) {
    return error(res, 'Cleanup failed', 500, err);
  }
};

// GET /api/admin/products/stats
exports.getProductStats = async (req, res) => {
  try {
    const [totalProducts, activeProducts, outOfStock, featuredProducts, bestsellers, categoryStats, inventoryValue] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ status: 'active' }),
      Product.countDocuments({ status: 'out-of-stock' }),
      Product.countDocuments({ featured: true }),
      Product.countDocuments({ bestseller: true }),
      Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 }, totalValue: { $sum: '$finalPrice' } } }]),
      Product.aggregate([{ $group: { _id: null, totalValue: { $sum: { $multiply: ['$finalPrice', '$stock'] } } } }])
    ]);

    return success(res, {
      totalProducts, activeProducts, outOfStock, featuredProducts, bestsellers,
      categoryStats,
      inventoryValue: inventoryValue[0]?.totalValue || 0
    }, 'Product stats fetched');
  } catch (err) {
    return error(res, 'Failed to fetch product stats', 500, err);
  }
};
