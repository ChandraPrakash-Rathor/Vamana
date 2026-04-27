import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faShoppingCart, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { addToCart } from '../../redux/apis/CartApi';
import { toast } from 'react-toastify';

export default function ProductModal({ product, isOpen, onClose }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.AuthSlice);
  
  const benefits = [
    'Long-lasting fragrance',
    'Premium quality ingredients',
    'Suitable for all occasions',
    'Elegant and sophisticated scent'
  ];

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  // Map API data to component props
  const productData = {
    id: product._id || product.id,
    name: product.name,
    image: product.mainImage || product.image,
    discount: product.discount || 0,
    brand: product.brand || 'VAMANA',
    rating: product.rating || 0,
    reviews: product.reviews || 0,
    price: product.finalPrice || product.price,
    originalPrice: product.actualPrice || product.originalPrice,
    description: product.description || 'Premium quality fragrance',
    category: product.category || 'perfume',
    volume: product.volume,
    stock: product.stock,
    status: product.status
  };

  const handleAddToCart = async () => {
    if (productData.status === 'out-of-stock') {
      return;
    }

    if (!isAuthenticated) {
      // Store pending item and show login modal
      sessionStorage.setItem('pendingCartItem', JSON.stringify({
        productId: productData.id,
        quantity: 1
      }));
      window.openAuthModal?.();
      onClose();
      return;
    }

    try {
      const result = await dispatch(addToCart({ 
        productId: productData.id, 
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

  // Format category display using subLine from product data
  const getCategoryDisplay = (category) => {
    const categoryMap = {
      'perfume': 'Perfume',
      'attar': 'Attar',
      'combo': 'Combo Pack'
    };
    // 1. Plz remove the line perfume for men in all segments - now uses subLine from product
    const subLine = productData.subLine || product.subLine;
    return subLine
      ? `${categoryMap[category] || 'Perfume'} • ${subLine}`
      : categoryMap[category] || 'Perfume';
  };

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
          maxWidth: '600px',
          width: '100%',
          maxHeight: '85vh',
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
            <div style={{ position: 'relative', height: '100%', minHeight: '300px' }}>
              <img
                src={productData.image}
                alt={productData.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '20px 0 0 20px'
                }}
              />
              {productData.discount > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  left: '15px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '700'
                }}>
                  {productData.discount}% OFF
                </div>
              )}
              {productData.status === 'out-of-stock' && (
                <div style={{
                  position: 'absolute',
                  bottom: '15px',
                  left: '15px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '700'
                }}>
                  OUT OF STOCK
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="col-md-7">
            <div style={{ padding: 'clamp(1.5rem, 3vw, 2rem)' }}>
              {/* Brand */}
              <p style={{
                color: 'var(--sand-600)',
                fontSize: '0.75rem',
                fontWeight: '600',
                marginBottom: '0.3rem',
                letterSpacing: '2px',
                textTransform: 'uppercase'
              }}>
                {productData.brand}
              </p>

              {/* Product Name */}
              <h3 style={{
                color: 'var(--sand-900)',
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
                marginBottom: '0.8rem',
                fontWeight: '600'
              }}>
                {productData.name}
              </h3>

              {/* Rating */}
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="d-flex align-items-center">
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon
                      key={i}
                      icon={faStar}
                      style={{
                        color: i < Math.floor(productData.rating) ? '#FFD700' : '#ddd',
                        fontSize: '0.85rem',
                        marginRight: '0.15rem'
                      }}
                    />
                  ))}
                </div>
                <span style={{ color: 'var(--sand-900)', fontSize: '0.9rem', fontWeight: '600' }}>
                  {productData.rating}
                </span>
                <span style={{ color: 'var(--sand-700)', fontSize: '0.85rem' }}>
                  ({productData.reviews})
                </span>
              </div>

              {/* Price */}
              <div className="mb-3">
                <div className="d-flex align-items-center gap-2">
                  <span style={{
                    color: 'var(--sand-900)',
                    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                    fontWeight: '700',
                    fontFamily: "'Playfair Display', serif"
                  }}>
                    ₹{productData.price}
                  </span>
                  {productData.originalPrice > productData.price && (
                    <span style={{
                      color: 'var(--sand-600)',
                      fontSize: '1rem',
                      textDecoration: 'line-through'
                    }}>
                      ₹{productData.originalPrice}
                    </span>
                  )}
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
                  Description
                </h6>
                <p style={{
                  color: 'var(--sand-800)',
                  fontSize: '0.85rem',
                  lineHeight: '1.6',
                  marginBottom: 0
                }}>
                  {productData.description}
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
                  Key Benefits
                </h6>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {benefits.map((benefit, index) => (
                    <li key={index} style={{
                      color: 'var(--sand-800)',
                      fontSize: '0.85rem',
                      marginBottom: '0.4rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <FontAwesomeIcon icon={faCheck} style={{ color: 'var(--sand-600)', fontSize: '0.75rem' }} />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Product Info Tags */}
              <div className="d-flex gap-2 mb-3 flex-wrap">
                <span style={{
                  backgroundColor: 'var(--sand-200)',
                  padding: '0.35rem 0.9rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  color: 'var(--sand-900)',
                  fontWeight: '600'
                }}>
                  {getCategoryDisplay(productData.category)}
                </span>
                {productData.volume && (
                  <span style={{
                    backgroundColor: 'var(--sand-200)',
                    padding: '0.35rem 0.9rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    color: 'var(--sand-900)',
                    fontWeight: '600'
                  }}>
                    {productData.volume}
                  </span>
                )}
                {productData.stock > 0 && (
                  <span style={{
                    backgroundColor: '#27ae60',
                    padding: '0.35rem 0.9rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    color: 'white',
                    fontWeight: '600'
                  }}>
                    In Stock: {productData.stock}
                  </span>
                )}
              </div>

              {/* Buttons */}
              <div className="d-flex gap-2">
                <Link
                  to={`/product/${productData.id}`}
                  onClick={onClose}
                  style={{
                    flex: 1,
                    padding: '0.7rem',
                    border: 'none',
                    borderRadius: '10px',
                    backgroundColor: 'var(--sand-900)',
                    color: 'white',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    textDecoration: 'none',
                    textAlign: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  View Details
                </Link>
                <button
                  onClick={handleAddToCart}
                  disabled={productData.status === 'out-of-stock'}
                  style={{
                    flex: 1,
                    padding: '0.7rem',
                    border: '2px solid var(--sand-600)',
                    borderRadius: '10px',
                    backgroundColor: productData.status === 'out-of-stock' ? '#ccc' : 'white',
                    color: productData.status === 'out-of-stock' ? '#666' : 'var(--sand-600)',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: productData.status === 'out-of-stock' ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    opacity: productData.status === 'out-of-stock' ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (productData.status !== 'out-of-stock') {
                      e.target.style.backgroundColor = 'var(--sand-600)';
                      e.target.style.color = 'white';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (productData.status !== 'out-of-stock') {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.color = 'var(--sand-600)';
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faShoppingCart} /> {productData.status === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart'}
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
