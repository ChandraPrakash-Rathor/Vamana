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
      subImages: (product.subImages || []).filter(Boolean).map(img => buildImageUrl(req, img))
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
      subImages: (product.subImages || []).filter(Boolean).map(img => buildImageUrl(req, img))
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
      subImages: subImagesFiles,
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

    // Handle main image replacement
    const mainImageFile = files.find(f => f.fieldname === 'mainImage');
    if (mainImageFile) {
      safeDeleteFile(product.mainImage); // only deletes bare filenames
      updateData.mainImage = mainImageFile.filename;
    }

    // Handle sub images replacement
    const subImagesFiles = files.filter(f => f.fieldname === 'subImages');
    if (subImagesFiles.length > 0) {
      (product.subImages || []).forEach(img => safeDeleteFile(img));
      updateData.subImages = subImagesFiles.map(f => f.filename);
    }

    // Issue 5 fix: only recalculate finalPrice if price or discount actually changed
    if (updateData.actualPrice !== undefined || updateData.discount !== undefined) {
      const newPrice = Number(updateData.actualPrice) || product.actualPrice;
      const newDiscount = updateData.discount !== undefined ? Number(updateData.discount) : product.discount;
      updateData.finalPrice = Math.round((newPrice - (newPrice * newDiscount) / 100) * 100) / 100;
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    return success(res, product, 'Product updated successfully');
  } catch (err) {
    if (isInvalidObjectId(err)) return notFound(res, 'Product not found');
    if (err.name === 'ValidationError') return validationError(res, 'Validation failed', getValidationMessages(err));
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
