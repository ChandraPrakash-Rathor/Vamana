const Cart = require('../models/Cart');
const Product = require('../../Admin/models/Product');
const { getImageUrl } = require('../../utils/imageHelper');

// @desc    Get user cart
// @route   GET /api/member/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.member._id }).populate('items.product');

    if (!cart) {
      // Create empty cart if doesn't exist
      cart = await Cart.create({
        user: req.member._id,
        items: []
      });
    }

    // Add full image URLs to products
    if (cart.items && cart.items.length > 0) {
      cart = cart.toObject();
      cart.items = cart.items.map(item => {
        if (item.product) {
          item.product.mainImage = getImageUrl(item.product.mainImage);
          if (item.product.subImages && item.product.subImages.length > 0) {
            item.product.subImages = item.product.subImages.map(img => getImageUrl(img));
          }
        }
        return item;
      });
    }

    res.json({
      success: true,
      cart
    });

  } catch (error) {
    console.error('❌ Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/member/cart/add
// @access  Private
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if product is in stock
    if (product.status === 'out-of-stock') {
      return res.status(400).json({
        success: false,
        message: 'Product is out of stock'
      });
    }

    // Check if product is in any active Limited Offer
    const LimitedOffer = require('../../Admin/models/LimitedOffer');
    const now = new Date();
    const activeOffer = await LimitedOffer.findOne({
      product: productId,
      status: 'active',
      startDate: { $lte: now },
      endDate: { $gte: now }
    });

    // Determine the price to use
    let priceToUse = product.finalPrice;
    if (activeOffer && activeOffer.offerPrice < priceToUse) {
      priceToUse = activeOffer.offerPrice;
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.member._id });

    if (!cart) {
      cart = new Cart({
        user: req.member._id,
        items: []
      });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
      // Update price to current price (in case offer changed)
      cart.items[existingItemIndex].price = priceToUse;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: priceToUse
      });
    }

    await cart.save();
    await cart.populate('items.product');

    // Add full image URLs to products
    let cartObj = cart.toObject();
    cartObj.items = cartObj.items.map(item => {
      if (item.product) {
        item.product.mainImage = getImageUrl(item.product.mainImage);
        if (item.product.subImages && item.product.subImages.length > 0) {
          item.product.subImages = item.product.subImages.map(img => getImageUrl(img));
        }
      }
      return item;
    });

    res.json({
      success: true,
      message: 'Product added to cart',
      cart: cartObj
    });

  } catch (error) {
    console.error('❌ Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/member/cart/update
// @access  Private
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity are required'
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    const cart = await Cart.findOne({ user: req.member._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in cart'
      });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate('items.product');

    // Add full image URLs to products
    let cartObj = cart.toObject();
    cartObj.items = cartObj.items.map(item => {
      if (item.product) {
        item.product.mainImage = getImageUrl(item.product.mainImage);
        if (item.product.subImages && item.product.subImages.length > 0) {
          item.product.subImages = item.product.subImages.map(img => getImageUrl(img));
        }
      }
      return item;
    });

    res.json({
      success: true,
      message: 'Cart updated',
      cart: cartObj
    });

  } catch (error) {
    console.error('❌ Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/member/cart/remove/:productId
// @access  Private
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.member._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate('items.product');

    // Add full image URLs to products
    let cartObj = cart.toObject();
    cartObj.items = cartObj.items.map(item => {
      if (item.product) {
        item.product.mainImage = getImageUrl(item.product.mainImage);
        if (item.product.subImages && item.product.subImages.length > 0) {
          item.product.subImages = item.product.subImages.map(img => getImageUrl(img));
        }
      }
      return item;
    });

    res.json({
      success: true,
      message: 'Product removed from cart',
      cart: cartObj
    });

  } catch (error) {
    console.error('❌ Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/member/cart/clear
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.member._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared',
      cart
    });

  } catch (error) {
    console.error('❌ Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
