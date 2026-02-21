import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faMinus, faShoppingBag, faTruck, faShieldAlt, faArrowLeft, faTag } from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '../components/common/Breadcrumb';

export default function Cart() {
  // Sample cart items - in real app, this would come from state management
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Eternal Rose',
      brand: 'Vamana',
      price: 2899,
      originalPrice: 3499,
      quantity: 1,
      size: '50ml',
      image: '/product1.jpg',
      inStock: true
    },
    {
      id: 3,
      name: 'Midnight Oud',
      brand: 'Vamana',
      price: 3299,
      originalPrice: 3999,
      quantity: 2,
      size: '100ml',
      image: '/product3.jpg',
      inStock: true
    }
  ]);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = cartItems.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
  const couponDiscount = appliedCoupon ? subtotal * 0.1 : 0; // 10% off with coupon
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal - couponDiscount + shipping;

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'VAMANA10') {
      setAppliedCoupon({ code: 'VAMANA10', discount: 10 });
      alert('Coupon applied! 10% discount added.');
    } else {
      alert('Invalid coupon code');
    }
  };

  if (cartItems.length === 0) {
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
                  Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
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
              {cartItems.map((item) => (
                <div
                  key={item.id}
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
                      <Link to={`/product/${item.id}`}>
                        <img
                          src={item.image}
                          alt={item.name}
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
                        to={`/product/${item.id}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <h6 style={{
                          color: 'var(--sand-900)',
                          fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                          fontWeight: '700',
                          marginBottom: '0.3rem'
                        }}>
                          {item.name}
                        </h6>
                      </Link>
                      <p style={{
                        color: 'var(--sand-600)',
                        fontSize: '0.85rem',
                        marginBottom: '0.3rem'
                      }}>
                        {item.brand} • {item.size}
                      </p>
                      {item.inStock ? (
                        <span style={{
                          color: '#27ae60',
                          fontSize: '0.8rem',
                          fontWeight: '600'
                        }}>
                          ✓ In Stock
                        </span>
                      ) : (
                        <span style={{
                          color: '#e74c3c',
                          fontSize: '0.8rem',
                          fontWeight: '600'
                        }}>
                          Out of Stock
                        </span>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="col-md-3 col-6">
                      <div className="d-flex align-items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
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
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
                        ₹{item.price * item.quantity}
                      </div>
                      {item.originalPrice > item.price && (
                        <div style={{
                          color: 'var(--sand-600)',
                          fontSize: '0.85rem',
                          textDecoration: 'line-through',
                          marginBottom: '0.5rem'
                        }}>
                          ₹{item.originalPrice * item.quantity}
                        </div>
                      )}
                      <button
                        onClick={() => removeItem(item.id)}
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
              ))}
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
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  style={{
                    flex: 1,
                    padding: '0.7rem 1rem',
                    border: '2px solid var(--sand-400)',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    backgroundColor: 'white'
                  }}
                />
                <button
                  onClick={applyCoupon}
                  style={{
                    padding: '0.7rem 1.5rem',
                    border: 'none',
                    borderRadius: '10px',
                    backgroundColor: 'var(--sand-600)',
                    color: 'white',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--sand-700)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--sand-600)'}
                >
                  Apply
                </button>
              </div>
              {appliedCoupon && (
                <div style={{
                  marginTop: '0.8rem',
                  padding: '0.6rem 1rem',
                  backgroundColor: '#d4edda',
                  border: '1px solid #c3e6cb',
                  borderRadius: '8px',
                  color: '#155724',
                  fontSize: '0.9rem'
                }}>
                  ✓ Coupon "{appliedCoupon.code}" applied! {appliedCoupon.discount}% discount
                </div>
              )}
              <p style={{
                color: 'var(--sand-600)',
                fontSize: '0.85rem',
                marginTop: '0.8rem',
                marginBottom: 0
              }}>
                Try code: <strong>VAMANA10</strong> for 10% off
              </p>
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
                  <span style={{ color: 'var(--sand-900)', fontSize: '0.95rem', fontWeight: '600' }}>₹{subtotal}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: 'var(--sand-700)', fontSize: '0.95rem' }}>Savings</span>
                  <span style={{ color: '#27ae60', fontSize: '0.95rem', fontWeight: '600' }}>-₹{discount}</span>
                </div>
                {appliedCoupon && (
                  <div className="d-flex justify-content-between mb-2">
                    <span style={{ color: 'var(--sand-700)', fontSize: '0.95rem' }}>Coupon Discount</span>
                    <span style={{ color: '#27ae60', fontSize: '0.95rem', fontWeight: '600' }}>-₹{couponDiscount.toFixed(0)}</span>
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
                  <span style={{ color: 'var(--sand-900)', fontSize: '1.2rem', fontWeight: '700' }}>₹{total.toFixed(0)}</span>
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
                      On orders above ₹999
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
                  💡 Add ₹{999 - subtotal} more to get FREE delivery!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
