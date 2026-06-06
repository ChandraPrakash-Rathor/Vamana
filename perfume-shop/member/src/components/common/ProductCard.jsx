import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faShoppingCart, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { addToCart } from '../../redux/apis/CartApi';
import { toast } from 'react-toastify';
import ProductModal from './ProductModal';

export default function ProductCard({ product, showAddToCart = false }) {
  const [showModal, setShowModal] = useState(false);
  const [qty, setQty] = useState(1);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.AuthSlice);
  const { loading, items: cartItems } = useSelector((state) => state.CartSlice);

  // Map API data to component props
  const productData = {
    id: product._id || product.id,
    name: product.name,
    image: product.mainImage || product.image,
    discount: product.discount || 0,
    isNew: product.isNew || false,
    category: product.category || 'perfume',
    subLine: product.subLine || '',
    rating: product.rating || 0,
    reviews: product.reviews || 0,
    price: product.finalPrice || product.price,
    originalPrice: product.actualPrice || product.originalPrice,
    stock: product.stock || 0,
    status: product.status
  };

  // How many of this product are already in cart
  const inCartQty = cartItems?.find(i => (i.product?._id || i.product) === productData.id)?.quantity || 0;
  const remainingStock = Math.max(0, productData.stock - inCartQty);
  const maxQty = remainingStock;
  const getCategoryDisplay = (category) => {
    const categoryMap = {
      'perfume': 'Perfume',
      'attar': 'Attar',
      'combo': 'Combo Pack'
    };
    // 1. Plz remove the line perfume for men in all segments - now uses subLine from product
    const subLine = product.subLine;
    return subLine
      ? `${categoryMap[category] || 'Perfume'} • ${subLine}`
      : categoryMap[category] || 'Perfume';
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      // Store pending cart item
      sessionStorage.setItem('pendingCartItem', JSON.stringify({
        productId: productData.id,
        quantity: 1
      }));
      toast.info('Please login to add items to cart');
      window.openAuthModal('login');
      return;
    }

    const result = await dispatch(addToCart({ 
      productId: productData.id, 
      quantity: qty
    }));

    if (result.payload?.success) {
      toast.success(`Added ${qty > 1 ? qty + 'x ' : ''}to cart!`);
      setQty(1); // reset after adding
    } else {
      // Show the backend error message (e.g. "Only 4 units available...")
      const msg = result.payload?.message || 'Failed to add to cart';
      toast.warning(msg);
    }
  };

  return (
    <>
      <div 
        className="card border-0 h-100 overflow-hidden" 
        style={{ 
          backgroundColor: 'white', 
          transition: 'all 0.3s ease', 
          cursor: 'pointer', 
          position: 'relative',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}
        onMouseEnter={(e) => { 
          e.currentTarget.style.transform = 'translateY(-8px)'; 
          e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)'; 
        }}
        onMouseLeave={(e) => { 
          e.currentTarget.style.transform = 'translateY(0)'; 
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'; 
        }}
      >
        <Link to={`/product/${productData.id}`} style={{ textDecoration: 'none' }}>
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <img src={productData.image} alt={productData.name} style={{ width: '100%', height: 'clamp(200px, 30vw, 280px)', objectFit: 'cover' }} />
            {productData.discount > 0 && (
              <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#e74c3c', color: 'white', padding: '0.3rem 0.6rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }}>
                -{productData.discount}%
              </div>
            )}
            {productData.isNew && (
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
          <Link to={`/product/${productData.id}`} style={{ textDecoration: 'none' }}>
            <h6 style={{ color: 'var(--sand-900)', fontSize: 'clamp(0.9rem, 1.7vw, 1.1rem)', fontWeight: '700', marginBottom: '0.25rem' }}>
              {productData.name}
            </h6>
            <p style={{ color: 'var(--sand-600)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
              {getCategoryDisplay(productData.category)}
            </p>
            {/* Show rating only if product has reviews */}
            {productData.reviews > 0 && (
              <div className="d-flex align-items-center mb-2">
                <FontAwesomeIcon icon={faStar} style={{ color: '#FFD700', fontSize: '0.8rem' }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--sand-800)', marginLeft: '0.3rem', fontWeight: '600' }}>
                  {productData.rating.toFixed(1)}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--sand-600)', marginLeft: '0.3rem' }}>
                  ({productData.reviews} {productData.reviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}
          </Link>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <span style={{ color: 'var(--sand-900)', fontSize: 'clamp(1rem, 2vw, 1.2rem)', fontWeight: '700' }}>
                ₹{productData.price}
              </span>
              {productData.originalPrice > productData.price && (
                <span style={{ color: 'var(--sand-600)', fontSize: '0.85rem', textDecoration: 'line-through', marginLeft: '0.5rem' }}>
                  ₹{productData.originalPrice}
                </span>
              )}
            </div>
          </div>
          {/* Stock badge */}
          {productData.stock > 0 ? (
            <div style={{ fontSize: '0.72rem', color: remainingStock <= 5 ? '#e74c3c' : '#27ae60', fontWeight: '600', marginTop: '0.2rem' }}>
              {remainingStock === 0 ? '✗ Max qty in cart' : remainingStock <= 5 ? `⚠️ Only ${remainingStock} left!` : `✓ In Stock (${productData.stock})`}
            </div>
          ) : (
            <div style={{ fontSize: '0.72rem', color: '#e74c3c', fontWeight: '600', marginTop: '0.2rem' }}>
              ✗ Out of Stock
            </div>
          )}
          {showAddToCart && (
            <div style={{ marginTop: '0.5rem' }}>
              {productData.status === 'out-of-stock' || productData.stock === 0 || remainingStock === 0 ? (
                <button disabled style={{ width: '100%', padding: '0.4rem', border: 'none', borderRadius: '5px', backgroundColor: '#ccc', color: '#666', fontSize: '0.8rem', fontWeight: '600', cursor: 'not-allowed' }}>
                  {productData.stock === 0 ? 'Out of Stock' : 'Max Qty Added'}
                </button>
              ) : (
                <>
                  {/* Quantity selector — inline layout, works on narrow cards */}
                  <div className="d-flex align-items-center mb-2" style={{ gap: '6px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--sand-700)', fontWeight: '600', flexShrink: 0 }}>Qty:</span>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQty(q => Math.max(1, q - 1)); }}
                      disabled={qty <= 1}
                      style={{
                        width: '24px', height: '24px', border: '1.5px solid var(--sand-300)',
                        borderRadius: '5px', backgroundColor: qty <= 1 ? 'var(--sand-100)' : 'white',
                        cursor: qty <= 1 ? 'not-allowed' : 'pointer',
                        color: qty <= 1 ? 'var(--sand-400)' : 'var(--sand-900)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        opacity: qty <= 1 ? 0.5 : 1, flexShrink: 0, padding: 0
                      }}
                    >
                      <FontAwesomeIcon icon={faMinus} style={{ fontSize: '0.55rem' }} />
                    </button>
                    <span style={{ minWidth: '18px', textAlign: 'center', fontWeight: '700', fontSize: '0.85rem', color: 'var(--sand-900)', flexShrink: 0 }}>
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQty(q => Math.min(maxQty, q + 1)); }}
                      disabled={qty >= maxQty}
                      style={{
                        width: '24px', height: '24px', border: '1.5px solid var(--sand-300)',
                        borderRadius: '5px', backgroundColor: qty >= maxQty ? 'var(--sand-100)' : 'white',
                        cursor: qty >= maxQty ? 'not-allowed' : 'pointer',
                        color: qty >= maxQty ? 'var(--sand-400)' : 'var(--sand-900)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        opacity: qty >= maxQty ? 0.5 : 1, flexShrink: 0, padding: 0
                      }}
                    >
                      <FontAwesomeIcon icon={faPlus} style={{ fontSize: '0.55rem' }} />
                    </button>
                  </div>
                  {/* Add to Cart button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={loading}
                    style={{ width: '100%', padding: '0.4rem', border: 'none', borderRadius: '5px', backgroundColor: 'var(--sand-600)', color: 'white', fontSize: '0.8rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', opacity: loading ? 0.7 : 1 }}
                    onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = 'var(--sand-700)')}
                    onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = 'var(--sand-600)')}
                  >
                    <FontAwesomeIcon icon={faShoppingCart} /> {loading ? 'Adding...' : 'Add to Cart'}
                  </button>
                </>
              )}
            </div>
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
