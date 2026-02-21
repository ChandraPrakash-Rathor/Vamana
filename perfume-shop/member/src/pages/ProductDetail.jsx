import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faShoppingCart, faHeart, faTruck, faShieldAlt, faUndo } from '@fortawesome/free-solid-svg-icons';
import { perfumes } from '../data/perfumes';
import ScrollToTop from '../components/common/ScrollToTop';
import Breadcrumb from '../components/common/Breadcrumb';

export default function ProductDetail() {
  const { id } = useParams();
  const product = perfumes.find(p => p.id === parseInt(id));
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="container py-5" style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: 'var(--sand-100)' }}>
        <h2 style={{ color: 'var(--sand-900)' }}>Product not found</h2>
        <Link to="/catalog" style={{ color: 'var(--sand-600)' }}>Back to Catalog</Link>
      </div>
    );
  }

  const relatedProducts = perfumes
    .filter(p => p.id !== product.id && (p.fragranceType === product.fragranceType || p.category === product.category))
    .slice(0, 4);

  const currentPrice = product.sizes[selectedSize].price;

  return (
    <div style={{ backgroundColor: 'var(--sand-100)', minHeight: '100vh', paddingTop: '90px' }}>
      <Breadcrumb 
        items={[
          { label: 'Catalog', path: '/catalog' },
          { label: product.name, path: `/product/${product.id}` }
        ]} 
      />
      
      <div className="container pb-4 pt-3">
        <div className="row g-4">
          {/* Left Side - Image Gallery */}
          <div className="col-lg-6">
            <div style={{ position: 'sticky', top: '100px' }}>
              {/* Main Image */}
              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <div style={{
                  backgroundColor: 'var(--sand-200)',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
                }}>
                  <img
                    src={product.images[selectedImage]}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: 'clamp(350px, 45vw, 500px)',
                      objectFit: 'cover'
                    }}
                  />
                  
                  {/* Decorative corner */}
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    left: '15px',
                    display: 'flex',
                    gap: '6px'
                  }}>
                    <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--sand-600)', transform: 'rotate(45deg)' }}></div>
                    <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--sand-600)', transform: 'rotate(45deg)' }}></div>
                    <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--sand-600)', transform: 'rotate(45deg)' }}></div>
                  </div>

                  {/* Badges */}
                  {product.discount > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      backgroundColor: '#e74c3c',
                      color: 'white',
                      padding: '0.4rem 0.9rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      boxShadow: '0 3px 10px rgba(231, 76, 60, 0.3)'
                    }}>
                      {product.discount}% OFF
                    </div>
                  )}
                  {product.isNew && (
                    <div style={{
                      position: 'absolute',
                      bottom: '15px',
                      left: '15px',
                      backgroundColor: '#27ae60',
                      color: 'white',
                      padding: '0.4rem 0.9rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      boxShadow: '0 3px 10px rgba(39, 174, 96, 0.3)'
                    }}>
                      NEW
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="d-flex gap-2 justify-content-center">
                {product.images.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    style={{
                      width: '80px',
                      height: '80px',
                      cursor: 'pointer',
                      border: selectedImage === index ? '2px solid var(--sand-600)' : '2px solid var(--sand-300)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      transform: selectedImage === index ? 'scale(1.05)' : 'scale(1)',
                      boxShadow: selectedImage === index ? '0 4px 12px rgba(200, 164, 93, 0.25)' : 'none'
                    }}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Product Info */}
          <div className="col-lg-6">
            <div style={{
              backgroundColor: 'var(--sand-200)',
              borderRadius: '20px',
              padding: 'clamp(1.5rem, 3vw, 2rem)',
              boxShadow: '0 5px 20px rgba(0,0,0,0.06)'
            }}>
              {/* Brand */}
              <p style={{
                color: 'var(--sand-600)',
                fontSize: '0.75rem',
                fontWeight: '600',
                marginBottom: '0.3rem',
                letterSpacing: '2px',
                textTransform: 'uppercase'
              }}>
                {product.brand}
              </p>

              {/* Product Name */}
              <h1 style={{
                color: 'var(--sand-900)',
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                marginBottom: '0.8rem',
                lineHeight: '1.3',
                fontWeight: '600'
              }}>
                {product.name}
              </h1>

              {/* Rating */}
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="d-flex align-items-center">
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon
                      key={i}
                      icon={faStar}
                      style={{
                        color: i < Math.floor(product.rating) ? '#FFD700' : '#ddd',
                        fontSize: '0.85rem',
                        marginRight: '0.15rem'
                      }}
                    />
                  ))}
                </div>
                <span style={{ color: 'var(--sand-900)', fontSize: '0.9rem', fontWeight: '600' }}>
                  {product.rating}
                </span>
                <span style={{ color: 'var(--sand-700)', fontSize: '0.85rem' }}>
                  ({product.reviews} reviews)
                </span>
              </div>

              {/* Description */}
              <p style={{
                color: 'var(--sand-800)',
                fontSize: '0.9rem',
                lineHeight: '1.7',
                marginBottom: '1.5rem'
              }}>
                {product.description}
              </p>

              {/* Tags */}
              <div className="d-flex gap-2 mb-3 flex-wrap">
                <span style={{
                  backgroundColor: 'var(--sand-100)',
                  padding: '0.35rem 0.9rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  color: 'var(--sand-900)',
                  fontWeight: '600'
                }}>
                  {product.fragranceType}
                </span>
                <span style={{
                  backgroundColor: 'var(--sand-100)',
                  padding: '0.35rem 0.9rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  color: 'var(--sand-900)',
                  fontWeight: '600'
                }}>
                  {product.gender}
                </span>
                <span style={{
                  backgroundColor: 'var(--sand-100)',
                  padding: '0.35rem 0.9rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  color: 'var(--sand-900)',
                  fontWeight: '600',
                  textTransform: 'capitalize'
                }}>
                  {product.category}
                </span>
              </div>

              {/* Price */}
              <div className="mb-3">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span style={{
                    color: 'var(--sand-900)',
                    fontSize: 'clamp(1.8rem, 3.5vw, 2.2rem)',
                    fontWeight: '700',
                    fontFamily: "'Playfair Display', serif"
                  }}>
                    ₹{currentPrice}
                  </span>
                  {product.originalPrice > product.price && (
                    <span style={{
                      color: 'var(--sand-600)',
                      fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                      textDecoration: 'line-through'
                    }}>
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>
                <p style={{ color: 'var(--sand-700)', fontSize: '0.75rem', marginBottom: 0 }}>
                  Inclusive of all taxes • Free shipping on orders above ₹999
                </p>
              </div>

              {/* Size Selection */}
              <div className="mb-3">
                <h6 style={{
                  color: 'var(--sand-900)',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  marginBottom: '0.7rem'
                }}>
                  Select Size
                </h6>
                <div className="d-flex gap-2">
                  {product.sizes.map((size, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSize(index)}
                      style={{
                        padding: '0.6rem 1.2rem',
                        border: selectedSize === index ? '2px solid var(--sand-600)' : '2px solid var(--sand-400)',
                        borderRadius: '10px',
                        backgroundColor: selectedSize === index ? 'var(--sand-600)' : 'white',
                        color: selectedSize === index ? 'white' : 'var(--sand-900)',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: selectedSize === index ? '0 4px 12px rgba(200, 164, 93, 0.25)' : 'none'
                      }}
                    >
                      {size.ml}ml
                      <div style={{ fontSize: '0.7rem', marginTop: '0.2rem', opacity: 0.9 }}>
                        ₹{size.price}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-3">
                <h6 style={{
                  color: 'var(--sand-900)',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  marginBottom: '0.7rem'
                }}>
                  Quantity
                </h6>
                <div className="d-flex align-items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{
                      width: '35px',
                      height: '35px',
                      border: '2px solid var(--sand-400)',
                      borderRadius: '8px',
                      backgroundColor: 'white',
                      fontSize: '1.1rem',
                      cursor: 'pointer',
                      fontWeight: '600',
                      color: 'var(--sand-900)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--sand-300)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  >
                    -
                  </button>
                  <span style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    minWidth: '35px',
                    textAlign: 'center',
                    color: 'var(--sand-900)'
                  }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    style={{
                      width: '35px',
                      height: '35px',
                      border: '2px solid var(--sand-400)',
                      borderRadius: '8px',
                      backgroundColor: 'white',
                      fontSize: '1.1rem',
                      cursor: 'pointer',
                      fontWeight: '600',
                      color: 'var(--sand-900)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--sand-300)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  >
                    +
                  </button>
                  <span style={{ color: 'var(--sand-700)', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                    {product.stock} available
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-2 mb-3">
                <button
                  onClick={() => alert('Added to cart!')}
                  style={{
                    flex: 1,
                    padding: '0.7rem',
                    border: '2px solid var(--sand-600)',
                    borderRadius: '10px',
                    backgroundColor: 'white',
                    color: 'var(--sand-600)',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--sand-600)';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.color = 'var(--sand-600)';
                  }}
                >
                  <FontAwesomeIcon icon={faShoppingCart} style={{ fontSize: '0.85rem' }} /> Add to Cart
                </button>
                <button
                  style={{
                    padding: '0.7rem 1rem',
                    border: '2px solid var(--sand-600)',
                    borderRadius: '10px',
                    backgroundColor: 'white',
                    color: 'var(--sand-600)',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--sand-600)';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.color = 'var(--sand-600)';
                  }}
                >
                  <FontAwesomeIcon icon={faHeart} style={{ fontSize: '0.85rem' }} />
                </button>
              </div>

              <button
                onClick={() => alert('Proceeding to checkout...')}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  border: 'none',
                  borderRadius: '10px',
                  backgroundColor: 'var(--sand-900)',
                  color: 'white',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)';
                }}
              >
                Buy Now
              </button>

              {/* Features */}
              <div className="row g-2 mt-3">
                <div className="col-4">
                  <div className="text-center">
                    <FontAwesomeIcon icon={faTruck} style={{ color: 'var(--sand-600)', fontSize: '1.3rem', marginBottom: '0.3rem' }} />
                    <div style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--sand-900)' }}>
                      Free Delivery
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="text-center">
                    <FontAwesomeIcon icon={faShieldAlt} style={{ color: 'var(--sand-600)', fontSize: '1.3rem', marginBottom: '0.3rem' }} />
                    <div style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--sand-900)' }}>
                      100% Authentic
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="text-center">
                    <FontAwesomeIcon icon={faUndo} style={{ color: 'var(--sand-600)', fontSize: '1.3rem', marginBottom: '0.3rem' }} />
                    <div style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--sand-900)' }}>
                      Easy Returns
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fragrance Notes */}
            <div style={{
              backgroundColor: 'var(--sand-200)',
              borderRadius: '20px',
              padding: 'clamp(1.5rem, 3vw, 2rem)',
              marginTop: '1.5rem',
              boxShadow: '0 5px 20px rgba(0,0,0,0.06)'
            }}>
              <h3 style={{
                color: 'var(--sand-900)',
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                marginBottom: '1rem',
                fontWeight: '600'
              }}>
                Fragrance Notes
              </h3>
              <div className="row g-2">
                <div className="col-12">
                  <div style={{
                    backgroundColor: 'var(--sand-100)',
                    borderRadius: '12px',
                    padding: '0.9rem'
                  }}>
                    <h6 style={{ color: 'var(--sand-900)', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.8rem' }}>
                      Top Notes
                    </h6>
                    <p style={{ color: 'var(--sand-800)', marginBottom: 0, fontSize: '0.85rem' }}>
                      {product.notes.top.join(', ')}
                    </p>
                  </div>
                </div>
                <div className="col-12">
                  <div style={{
                    backgroundColor: 'var(--sand-100)',
                    borderRadius: '12px',
                    padding: '0.9rem'
                  }}>
                    <h6 style={{ color: 'var(--sand-900)', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.8rem' }}>
                      Middle Notes
                    </h6>
                    <p style={{ color: 'var(--sand-800)', marginBottom: 0, fontSize: '0.85rem' }}>
                      {product.notes.middle.join(', ')}
                    </p>
                  </div>
                </div>
                <div className="col-12">
                  <div style={{
                    backgroundColor: 'var(--sand-100)',
                    borderRadius: '12px',
                    padding: '0.9rem'
                  }}>
                    <h6 style={{ color: 'var(--sand-900)', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.8rem' }}>
                      Base Notes
                    </h6>
                    <p style={{ color: 'var(--sand-800)', marginBottom: 0, fontSize: '0.85rem' }}>
                      {product.notes.base.join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-4">
            <h3 style={{
              color: 'var(--sand-900)',
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              marginBottom: '1.5rem',
              textAlign: 'center',
              fontWeight: '600'
            }}>
              You May Also Like
            </h3>
            <div className="row g-3">
              {relatedProducts.map(relatedProduct => (
                <div key={relatedProduct.id} className="col-6 col-md-3">
                  <Link to={`/product/${relatedProduct.id}`} style={{ textDecoration: 'none' }}>
                    <div
                      className="card border-0 h-100"
                      style={{
                        backgroundColor: 'var(--sand-200)',
                        borderRadius: '15px',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px)';
                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.12)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '15px 15px 0 0' }}>
                        <img
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          style={{
                            width: '100%',
                            height: 'clamp(200px, 30vw, 280px)',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                      <div className="card-body p-3">
                        <h6 style={{ color: 'var(--sand-900)', fontSize: 'clamp(0.9rem, 1.7vw, 1.1rem)', fontWeight: '700', marginBottom: '0.5rem' }}>
                          {relatedProduct.name}
                        </h6>
                        <div className="d-flex align-items-center mb-2">
                          <FontAwesomeIcon icon={faStar} style={{ color: '#FFD700', fontSize: '0.8rem' }} />
                          <span style={{ fontSize: '0.85rem', color: 'var(--sand-800)', marginLeft: '0.3rem' }}>
                            {relatedProduct.rating}
                          </span>
                        </div>
                        <span style={{ color: 'var(--sand-900)', fontSize: 'clamp(1rem, 2vw, 1.2rem)', fontWeight: '700' }}>
                          ₹{relatedProduct.price}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <ScrollToTop />
    </div>
  );
}
