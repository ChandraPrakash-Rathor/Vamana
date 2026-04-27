import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTimes, faCheck, faClock } from '@fortawesome/free-solid-svg-icons';
import { addToCart } from '../../redux/apis/CartApi';
import { toast } from 'react-toastify';

export default function OfferModal({ offer, isOpen, onClose }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.AuthSlice);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Calculate countdown timer
  useEffect(() => {
    if (!offer || !isOpen) return;

    const calculateTimeLeft = () => {
      const endDate = new Date(offer.endDate);
      const now = new Date();
      const difference = endDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [offer, isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !offer) return null;

  const product = offer.product || {};
  const savings = offer.originalPrice - offer.offerPrice;
  const savingsPercent = offer.discount;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      // Store pending item and show login modal
      sessionStorage.setItem('pendingCartItem', JSON.stringify({
        productId: product._id,
        quantity: 1
      }));
      window.openAuthModal?.();
      onClose();
      return;
    }

    try {
      const result = await dispatch(addToCart({ 
        productId: product._id, 
        quantity: 1 
      }));
      
      if (result.payload?.success) {
        toast.success('Added to cart!');
        onClose();
      } else {
        toast.error(result.payload?.message || 'Failed to add to cart');
      }
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const benefits = [
    'Limited time special offer',
    'Premium quality guaranteed',
    'Free delivery on orders above ₹999',
    // 1. Plz remove the line perfume for men in all segments
    // 'Easy returns within 7 days'
  ];

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
        backdropFilter: 'blur(5px)',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--sand-100)',
          borderRadius: '20px',
          maxWidth: '650px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          animation: 'modalSlideIn 0.3s ease-out',
          marginTop: '80px',
          marginBottom: '20px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'sticky',
            top: '15px',
            left: 'calc(100% - 50px)',
            width: '35px',
            height: '35px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: 'var(--sand-300)',
            color: 'var(--sand-900)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            transition: 'all 0.3s ease',
            zIndex: 10,
            marginBottom: '-35px'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'var(--sand-600)';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'var(--sand-300)';
            e.target.style.color = 'var(--sand-900)';
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        {/* Modal Content */}
        <div className="row g-0">
          {/* Left Side - Image */}
          <div className="col-md-5">
            <div style={{ position: 'relative', height: '100%', minHeight: '350px' }}>
              <img
                src={product.mainImage}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '20px 0 0 20px'
                }}
                onError={(e) => {
                  e.target.src = '/placeholder-perfume.png';
                }}
              />
              {/* Discount Badge */}
              <div style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                color: 'white',
                padding: '12px',
                borderRadius: '50%',
                fontSize: '1rem',
                fontWeight: '800',
                width: '65px',
                height: '65px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(231, 76, 60, 0.5)'
              }}>
                <div style={{ fontSize: '1.3rem', lineHeight: '1' }}>{savingsPercent}%</div>
                <div style={{ fontSize: '0.55rem', marginTop: '2px' }}>OFF</div>
              </div>

              {/* Category Badge */}
              <div style={{
                position: 'absolute',
                top: '15px',
                left: '15px',
                backgroundColor: 'rgba(0,0,0,0.75)',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '15px',
                fontSize: '0.75rem',
                fontWeight: '700',
                textTransform: 'uppercase'
              }}>
                {product.category || 'Perfume'}
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="col-md-7">
            <div style={{ padding: 'clamp(1.5rem, 3vw, 2rem)' }}>
              {/* Limited Offer Badge */}
              <div style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                color: 'white',
                padding: '0.4rem 0.9rem',
                borderRadius: '20px',
                fontSize: '0.7rem',
                fontWeight: '700',
                marginBottom: '0.8rem',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}>
                ⚡ Limited Time Offer
              </div>

              {/* Product Name */}
              <h3 style={{
                color: 'var(--sand-900)',
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
                marginBottom: '0.5rem',
                fontWeight: '700'
              }}>
                {product.name}
              </h3>

              {/* Offer Title */}
              <p style={{
                color: 'var(--sand-700)',
                fontSize: '0.9rem',
                marginBottom: '1rem',
                fontWeight: '600'
              }}>
                {offer.title}
              </p>

              {/* Countdown Timer */}
              <div style={{
                background: 'linear-gradient(135deg, #fff5e6 0%, #ffe8cc 100%)',
                borderRadius: '12px',
                padding: '12px',
                marginBottom: '1rem',
                border: '2px solid #ffd699'
              }}>
                <div style={{
                  fontSize: '0.7rem',
                  color: '#e67e22',
                  fontWeight: '700',
                  marginBottom: '8px',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <FontAwesomeIcon icon={faClock} /> Offer Ends In
                </div>
                <div className="d-flex justify-content-center gap-2">
                  {[
                    { label: 'D', value: timeLeft.days },
                    { label: 'H', value: timeLeft.hours },
                    { label: 'M', value: timeLeft.minutes },
                    { label: 'S', value: timeLeft.seconds }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '6px',
                        minWidth: '45px',
                        textAlign: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    >
                      <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#e67e22', lineHeight: '1' }}>
                        {String(item.value).padStart(2, '0')}
                      </div>
                      <div style={{ fontSize: '0.6rem', color: '#95a5a6', marginTop: '3px', fontWeight: '600' }}>
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="mb-3">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span style={{
                    color: '#e74c3c',
                    fontSize: 'clamp(1.8rem, 3.5vw, 2.3rem)',
                    fontWeight: '800',
                    fontFamily: "'Playfair Display', serif"
                  }}>
                    ₹{offer.offerPrice?.toLocaleString()}
                  </span>
                  <span style={{
                    color: 'var(--sand-600)',
                    fontSize: '1.2rem',
                    textDecoration: 'line-through'
                  }}>
                    ₹{offer.originalPrice?.toLocaleString()}
                  </span>
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  color: '#27ae60',
                  fontWeight: '700'
                }}>
                  You save ₹{savings?.toLocaleString()} ({savingsPercent}% OFF)
                </div>
              </div>

              {/* Description */}
              <div className="mb-3">
                <h6 style={{
                  color: 'var(--sand-900)',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  marginBottom: '0.5rem'
                }}>
                  About This Offer
                </h6>
                <p style={{
                  color: 'var(--sand-800)',
                  fontSize: '0.85rem',
                  lineHeight: '1.6',
                  marginBottom: 0
                }}>
                  {offer.description}
                </p>
              </div>

              {/* Benefits */}
              <div className="mb-3">
                <h6 style={{
                  color: 'var(--sand-900)',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  marginBottom: '0.5rem'
                }}>
                  Why Buy Now?
                </h6>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {benefits.map((benefit, index) => (
                    <li key={index} style={{
                      color: 'var(--sand-800)',
                      fontSize: '0.8rem',
                      marginBottom: '0.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <FontAwesomeIcon icon={faCheck} style={{ color: '#27ae60', fontSize: '0.7rem' }} />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stock Info */}
              {offer.stockLimit && (
                <div style={{
                  backgroundColor: '#fff3cd',
                  border: '1px solid #ffc107',
                  borderRadius: '8px',
                  padding: '0.6rem',
                  marginBottom: '1rem',
                  fontSize: '0.8rem',
                  color: '#856404',
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  ⚠️ Only {offer.stockLimit - offer.soldCount} items left at this price!
                </div>
              )}

              {/* Buttons */}
              <div className="d-flex gap-2">
                <Link
                  to={`/product/${product._id}`}
                  onClick={onClose}
                  style={{
                    flex: 1,
                    padding: '0.8rem',
                    border: 'none',
                    borderRadius: '10px',
                    backgroundColor: 'var(--sand-900)',
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    textDecoration: 'none',
                    textAlign: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  View Product
                </Link>
                <button
                  onClick={handleAddToCart}
                  style={{
                    flex: 1,
                    padding: '0.8rem',
                    border: 'none',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(231, 76, 60, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(231, 76, 60, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(231, 76, 60, 0.3)';
                  }}
                >
                  <FontAwesomeIcon icon={faShoppingCart} /> Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );

  return createPortal(modalContent, document.body);
}
