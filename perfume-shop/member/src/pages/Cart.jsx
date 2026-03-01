import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faMinus, faShoppingBag, faTruck, faShieldAlt, faArrowLeft, faTag } from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '../components/common/Breadcrumb';
import { getCart, updateCartItem, removeFromCart } from '../redux/apis/CartApi';
import { validateCoupon, getActiveCoupons } from '../redux/apis/CouponApi';
import { removeCoupon } from '../redux/slices/CouponSlice';
import { toast } from 'react-toastify';

export default function Cart() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(state => state.CartSlice);
  const { isAuthenticated } = useSelector(state => state.AuthSlice);
  const { appliedCoupon, coupons, loading: couponLoading } = useSelector(state => state.CouponSlice);

  const [couponCode, setCouponCode] = useState('');

  // Fetch cart and coupons on component mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCart());
    }
    dispatch(getActiveCoupons());
  }, [dispatch, isAuthenticated]);

  // Calculate totals from Redux cart items
  const subtotal = items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const discount = items?.reduce((sum, item) => {
    const product = item.product;
    if (product && product.actualPrice > product.finalPrice) {
      return sum + ((product.actualPrice - product.finalPrice) * item.quantity);
    }
    return sum;
  }, 0) || 0;
  
  // Calculate coupon discount
  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  
  const shipping = subtotal >= 2000 ? 0 : 99; // Free shipping above ₹2000
  const total = subtotal - couponDiscount + shipping;

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await dispatch(updateCartItem({ productId, quantity: newQuantity }));
      toast.success('Cart updated');
      // Re-validate coupon if applied
      if (appliedCoupon) {
        dispatch(validateCoupon(appliedCoupon.code));
      }
    } catch (error) {
      toast.error('Failed to update cart');
    }
  };

  const removeItem = async (productId) => {
    try {
      await dispatch(removeFromCart(productId));
      toast.success('Item removed from cart');
      // Re-validate coupon if applied
      if (appliedCoupon) {
        dispatch(validateCoupon(appliedCoupon.code));
      }
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    
    const result = await dispatch(validateCoupon(couponCode.toUpperCase()));
    
    if (result.payload?.success) {
      toast.success(result.payload.message);
      setCouponCode('');
    } else {
      toast.error(result.payload?.message || 'Invalid coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    toast.info('Coupon removed');
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--sand-100)', minHeight: '100vh', paddingTop: '90px' }}>
        <div className="container py-5 text-center">
          <div className="spinner-border" role="status" style={{ color: 'var(--sand-600)' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div style={{ backgroundColor: 'var(--sand-100)', minHeight: '100vh', paddingTop: '90px' }}>
        <Breadcrumb items={[{ label: 'Shopping Cart', path: '/cart' }]} />
        
        <div className="container py-5">
          <div className="text-center py-5">
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🛒</div>
            <h2 style={{ 
              color: 'var(--sand-900)', 
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              marginBottom: '1rem'
            }}>
              Your Cart is Empty
            </h2>
            <p style={{ color: 'var(--sand-700)', fontSize: '1.1rem', marginBottom: '2rem' }}>
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              to="/catalog"
              style={{
                display: 'inline-block',
                padding: '0.8rem 2rem',
                backgroundColor: 'var(--sand-600)',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--sand-700)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--sand-600)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <FontAwesomeIcon icon={faShoppingBag} /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--sand-100)', minHeight: '100vh', paddingTop: '90px' }}>
      <Breadcrumb items={[{ label: 'Shopping Cart', path: '/cart' }]} />
      
      <div className="container py-4">
        <div className="row g-4">
          {/* Cart Items Section */}
          <div className="col-lg-8">
            <div style={{
              backgroundColor: 'var(--sand-200)',
              borderRadius: '20px',
              padding: 'clamp(1.5rem, 3vw, 2rem)',
              marginBottom: '1.5rem'
            }}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{
                  color: 'var(--sand-900)',
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  marginBottom: 0
                }}>
                  Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
                </h2>
                <Link
                  to="/catalog"
                  style={{
                    color: 'var(--sand-600)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--sand-900)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--sand-600)'}
                >
                  <FontAwesomeIcon icon={faArrowLeft} /> Continue Shopping
                </Link>
              </div>

              {/* Cart Items */}
              {items
                .filter(item => item.product) // Filter out items without product
                .map((item) => {
                const product = item.product;
                
                return (
                <div
                  key={item._id}
                  style={{
                    backgroundColor: 'var(--sand-100)',
                    borderRadius: '15px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div className="row g-3 align-items-center">
                    {/* Product Image */}
                    <div className="col-md-2 col-3">
                      <Link to={`/product/${product._id}`}>
                        <img
                          src={product.mainImage || '/product1.jpg'}
                          alt={product.name}
                          style={{
                            width: '100%',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '10px'
                          }}
                        />
                      </Link>
                    </div>

                    {/* Product Details */}
                    <div className="col-md-4 col-9">
                      <Link 
                        to={`/product/${product._id}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <h6 style={{
                          color: 'var(--sand-900)',
                          fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                          fontWeight: '700',
                          marginBottom: '0.3rem'
                        }}>
                          {product.name}
                        </h6>
                      </Link>
                      <p style={{
                        color: 'var(--sand-600)',
                        fontSize: '0.85rem',
                        marginBottom: '0.3rem'
                      }}>
                        {product.brand} • {product.size}ml
                      </p>
                      {product.status === 'active' ? (
                        <span style={{
                          color: '#27ae60',
                          fontSize: '0.8rem',
                          fontWeight: '600'
                        }}>
                          ✓ In Stock
                        </span>
                      ) : product.status === 'out-of-stock' ? (
                        <span style={{
                          color: '#e74c3c',
                          fontSize: '0.8rem',
                          fontWeight: '600'
                        }}>
                          Out of Stock
                        </span>
                      ) : (
                        <span style={{
                          color: '#f39c12',
                          fontSize: '0.8rem',
                          fontWeight: '600'
                        }}>
                          Unavailable
                        </span>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="col-md-3 col-6">
                      <div className="d-flex align-items-center gap-2">
                        <button
                          onClick={() => updateQuantity(product._id, item.quantity - 1)}
                          style={{
                            width: '32px',
                            height: '32px',
                            border: '2px solid var(--sand-400)',
                            borderRadius: '8px',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '600',
                            color: 'var(--sand-900)',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--sand-300)'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                        >
                          <FontAwesomeIcon icon={faMinus} style={{ fontSize: '0.7rem' }} />
                        </button>
                        <span style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          minWidth: '30px',
                          textAlign: 'center',
                          color: 'var(--sand-900)'
                        }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product._id, item.quantity + 1)}
                          style={{
                            width: '32px',
                            height: '32px',
                            border: '2px solid var(--sand-400)',
                            borderRadius: '8px',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '600',
                            color: 'var(--sand-900)',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--sand-300)'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                        >
                          <FontAwesomeIcon icon={faPlus} style={{ fontSize: '0.7rem' }} />
                        </button>
                      </div>
                    </div>

                    {/* Price & Remove */}
                    <div className="col-md-3 col-6 text-end">
                      <div style={{
                        color: 'var(--sand-900)',
                        fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
                        fontWeight: '700',
                        marginBottom: '0.3rem'
                      }}>
                        ₹{Math.round(item.price * item.quantity)}
                      </div>
                      {product.actualPrice > product.finalPrice && (
                        <div style={{
                          color: 'var(--sand-600)',
                          fontSize: '0.85rem',
                          textDecoration: 'line-through',
                          marginBottom: '0.5rem'
                        }}>
                          ₹{Math.round(product.actualPrice * item.quantity)}
                        </div>
                      )}
                      <button
                        onClick={() => removeItem(product._id)}
                        style={{
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: '#e74c3c',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          transition: 'color 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#c0392b'}
                        onMouseLeave={(e) => e.target.style.color = '#e74c3c'}
                      >
                        <FontAwesomeIcon icon={faTrash} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              )})}
            </div>

            {/* Coupon Section */}
            <div style={{
              backgroundColor: 'var(--sand-200)',
              borderRadius: '20px',
              padding: 'clamp(1.5rem, 3vw, 2rem)'
            }}>
              <h6 style={{
                color: 'var(--sand-900)',
                fontSize: '1.1rem',
                fontWeight: '700',
                marginBottom: '1rem'
              }}>
                <FontAwesomeIcon icon={faTag} /> Have a Coupon Code?
              </h6>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  disabled={appliedCoupon !== null}
                  style={{
                    flex: 1,
                    padding: '0.7rem 1rem',
                    border: '2px solid var(--sand-400)',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    backgroundColor: appliedCoupon ? 'var(--sand-200)' : 'white',
                    textTransform: 'uppercase'
                  }}
                />
                {!appliedCoupon ? (
                  <button
                    onClick={applyCoupon}
                    disabled={couponLoading}
                    style={{
                      padding: '0.7rem 1.5rem',
                      border: 'none',
                      borderRadius: '10px',
                      backgroundColor: 'var(--sand-600)',
                      color: 'white',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      cursor: couponLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      opacity: couponLoading ? 0.7 : 1
                    }}
                    onMouseEnter={(e) => !couponLoading && (e.target.style.backgroundColor = 'var(--sand-700)')}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--sand-600)'}
                  >
                    {couponLoading ? 'Applying...' : 'Apply'}
                  </button>
                ) : (
                  <button
                    onClick={handleRemoveCoupon}
                    style={{
                      padding: '0.7rem 1.5rem',
                      border: 'none',
                      borderRadius: '10px',
                      backgroundColor: '#e74c3c',
                      color: 'white',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
                  >
                    Remove
                  </button>
                )}
              </div>
              {appliedCoupon && (
                <div style={{
                  marginTop: '0.8rem',
                  padding: '0.8rem 1rem',
                  backgroundColor: '#d4edda',
                  border: '1px solid #c3e6cb',
                  borderRadius: '8px',
                  color: '#155724',
                  fontSize: '0.9rem'
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '0.3rem' }}>
                    ✓ Coupon "{appliedCoupon.code}" Applied!
                  </div>
                  <div style={{ fontSize: '0.85rem' }}>
                    {appliedCoupon.description}
                  </div>
                  <div style={{ fontSize: '0.85rem', marginTop: '0.3rem' }}>
                    Discount: ₹{Math.round(appliedCoupon.discount)}
                  </div>
                  {appliedCoupon.applicableItems && appliedCoupon.applicableItems.length > 0 && (
                    <div style={{ fontSize: '0.8rem', marginTop: '0.3rem', color: '#0c5460' }}>
                      Applied to {appliedCoupon.applicableItems.length} item(s)
                    </div>
                  )}
                </div>
              )}
              
              {/* Available Coupons */}
              {coupons && coupons.length > 0 && !appliedCoupon && (
                <div style={{ marginTop: '1rem' }}>
                  <p style={{
                    color: 'var(--sand-700)',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem'
                  }}>
                    Available Coupons:
                  </p>
                  {coupons.slice(0, 3).map((coupon) => (
                    <div
                      key={coupon._id}
                      onClick={() => setCouponCode(coupon.code)}
                      style={{
                        padding: '0.6rem 0.8rem',
                        backgroundColor: 'var(--sand-100)',
                        border: '1px dashed var(--sand-500)',
                        borderRadius: '6px',
                        marginBottom: '0.5rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--sand-300)';
                        e.currentTarget.style.borderColor = 'var(--sand-600)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--sand-100)';
                        e.currentTarget.style.borderColor = 'var(--sand-500)';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ 
                          color: 'var(--sand-900)', 
                          fontSize: '0.9rem', 
                          fontWeight: '700',
                          fontFamily: 'monospace'
                        }}>
                          {coupon.code}
                        </span>
                        <span style={{ 
                          color: '#27ae60', 
                          fontSize: '0.85rem', 
                          fontWeight: '600' 
                        }}>
                          {coupon.discountType === 'percentage' 
                            ? `${coupon.discountValue}% OFF` 
                            : `₹${coupon.discountValue} OFF`}
                        </span>
                      </div>
                      <div style={{ 
                        color: 'var(--sand-600)', 
                        fontSize: '0.75rem',
                        marginTop: '0.2rem'
                      }}>
                        {coupon.description}
                      </div>
                      {coupon.minPurchase > 0 && (
                        <div style={{ 
                          color: 'var(--sand-600)', 
                          fontSize: '0.7rem',
                          marginTop: '0.2rem'
                        }}>
                          Min. purchase: ₹{coupon.minPurchase}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="col-lg-4">
            <div style={{
              backgroundColor: 'var(--sand-200)',
              borderRadius: '20px',
              padding: 'clamp(1.5rem, 3vw, 2rem)',
              position: 'sticky',
              top: '100px'
            }}>
              <h3 style={{
                color: 'var(--sand-900)',
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
                marginBottom: '1.5rem'
              }}>
                Order Summary
              </h3>

              {/* Price Breakdown */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: 'var(--sand-700)', fontSize: '0.95rem' }}>Subtotal</span>
                  <span style={{ color: 'var(--sand-900)', fontSize: '0.95rem', fontWeight: '600' }}>₹{Math.round(subtotal)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: 'var(--sand-700)', fontSize: '0.95rem' }}>Savings</span>
                  <span style={{ color: '#27ae60', fontSize: '0.95rem', fontWeight: '600' }}>-₹{Math.round(discount)}</span>
                </div>
                {appliedCoupon && (
                  <div className="d-flex justify-content-between mb-2">
                    <span style={{ color: 'var(--sand-700)', fontSize: '0.95rem' }}>Coupon Discount</span>
                    <span style={{ color: '#27ae60', fontSize: '0.95rem', fontWeight: '600' }}>-₹{Math.round(couponDiscount)}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: 'var(--sand-700)', fontSize: '0.95rem' }}>Shipping</span>
                  <span style={{ color: shipping === 0 ? '#27ae60' : 'var(--sand-900)', fontSize: '0.95rem', fontWeight: '600' }}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <hr style={{ borderColor: 'var(--sand-400)', margin: '1rem 0' }} />
                <div className="d-flex justify-content-between">
                  <span style={{ color: 'var(--sand-900)', fontSize: '1.2rem', fontWeight: '700' }}>Total</span>
                  <span style={{ color: 'var(--sand-900)', fontSize: '1.2rem', fontWeight: '700' }}>₹{Math.round(total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                to="/checkout"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '1rem',
                  border: 'none',
                  borderRadius: '12px',
                  backgroundColor: 'var(--sand-900)',
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  marginBottom: '1rem',
                  transition: 'all 0.3s ease',
                  textDecoration: 'none',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Proceed to Checkout
              </Link>

              {/* Benefits */}
              <div style={{
                backgroundColor: 'var(--sand-100)',
                borderRadius: '12px',
                padding: '1rem'
              }}>
                <div className="d-flex align-items-start gap-2 mb-2">
                  <FontAwesomeIcon icon={faTruck} style={{ color: 'var(--sand-600)', fontSize: '1.2rem', marginTop: '0.2rem' }} />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--sand-900)' }}>
                      Free Delivery
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--sand-700)' }}>
                      On orders above ₹2000
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-start gap-2">
                  <FontAwesomeIcon icon={faShieldAlt} style={{ color: 'var(--sand-600)', fontSize: '1.2rem', marginTop: '0.2rem' }} />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--sand-900)' }}>
                      Secure Checkout
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--sand-700)' }}>
                      100% secure payment
                    </div>
                  </div>
                </div>
              </div>

              {shipping > 0 && (
                <div style={{
                  marginTop: '1rem',
                  padding: '0.8rem',
                  backgroundColor: '#fff3cd',
                  border: '1px solid #ffc107',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  color: '#856404'
                }}>
                  💡 Add ₹{Math.ceil(2000 - subtotal)} more to get FREE delivery!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
