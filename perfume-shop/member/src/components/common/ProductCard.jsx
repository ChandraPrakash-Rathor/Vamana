import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import ProductModal from './ProductModal';

export default function ProductCard({ product, showAddToCart = false }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div 
        className="card border-0 h-100 overflow-hidden" 
        style={{ backgroundColor: 'var(--sand-200)', transition: 'all 0.3s ease', cursor: 'pointer', position: 'relative' }}
        onMouseEnter={(e) => { 
          e.currentTarget.style.transform = 'translateY(-8px)'; 
          e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.12)'; 
        }}
        onMouseLeave={(e) => { 
          e.currentTarget.style.transform = 'translateY(0)'; 
          e.currentTarget.style.boxShadow = 'none'; 
        }}
      >
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <img src={product.image} alt={product.name} style={{ width: '100%', height: 'clamp(200px, 30vw, 280px)', objectFit: 'cover' }} />
            {product.discount > 0 && (
              <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#e74c3c', color: 'white', padding: '0.3rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }}>
                -{product.discount}%
              </div>
            )}
            {product.isNew && (
              <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#27ae60', color: 'white', padding: '0.3rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }}>
                NEW
              </div>
            )}
            
            {/* Quick View Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowModal(true);
              }}
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '0.5rem 1.2rem',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: 'none',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '600',
                color: 'var(--sand-900)',
                cursor: 'pointer',
                opacity: 0,
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
              className="quick-view-btn"
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--sand-600)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.95)'}
            >
              Quick View
            </button>
          </div>
        </Link>
        <div className="card-body p-3">
          <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
            <h6 style={{ color: 'var(--sand-900)', fontSize: 'clamp(0.9rem, 1.7vw, 1.1rem)', fontWeight: '700', marginBottom: '0.25rem' }}>
              {product.name}
            </h6>
            <p style={{ color: 'var(--sand-600)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
              {product.fragranceType} • {product.gender}
            </p>
            <div className="d-flex align-items-center mb-2">
              <FontAwesomeIcon icon={faStar} style={{ color: '#FFD700', fontSize: '0.8rem' }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--sand-800)', marginLeft: '0.3rem' }}>
                {product.rating} ({product.reviews})
              </span>
            </div>
          </Link>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <span style={{ color: 'var(--sand-900)', fontSize: 'clamp(1rem, 2vw, 1.2rem)', fontWeight: '700' }}>
                ₹{product.price}
              </span>
              {product.originalPrice > product.price && (
                <span style={{ color: 'var(--sand-600)', fontSize: '0.85rem', textDecoration: 'line-through', marginLeft: '0.5rem' }}>
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
          </div>
          {showAddToCart && (
            <button 
              onClick={(e) => { e.preventDefault(); alert('Added to cart!'); }} 
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.4rem', border: 'none', borderRadius: '5px', backgroundColor: 'var(--sand-600)', color: 'white', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--sand-700)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--sand-600)'}
            >
              <FontAwesomeIcon icon={faShoppingCart} /> Add to Cart
            </button>
          )}
        </div>
      </div>

      {/* Modal */}
      <ProductModal 
        product={product}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />

      <style>{`
        .card:hover .quick-view-btn {
          opacity: 1 !important;
        }
      `}</style>
    </>
  );
}
