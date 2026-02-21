import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, faBox, faRupeeSign, faLayerGroup, faBarcode,
  faWarehouse, faChevronLeft, faChevronRight, faEdit
} from '@fortawesome/free-solid-svg-icons';

export default function ViewProductModal({ isOpen, onClose, product, onEdit }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!isOpen || !product) return null;

  // Combine main image with sub images
  const images = [
    product.image,
    ...(product.subImages || [])
  ].filter(Boolean);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
          backdropFilter: 'blur(4px)'
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '1000px',
        maxHeight: '90vh',
        overflowY: 'auto',
        zIndex: 9999,
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid #e9ecef',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          zIndex: 10,
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px'
        }}>
          <div>
            <h3 style={{
              margin: 0,
              color: '#212529',
              fontSize: '1.25rem',
              fontWeight: '600'
            }}>
              Product Details
            </h3>
            <p style={{ margin: '0.25rem 0 0 0', color: '#6c757d', fontSize: '0.875rem' }}>
              View complete product information
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              color: '#6c757d',
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#212529'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6c757d'}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '2rem' }}>
          <div className="row g-4">
            {/* Product Images */}
            <div className="col-12 col-md-5">
              <div style={{
                position: 'relative',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid #dee2e6'
              }}>
                {/* Main Image */}
                <div style={{
                  position: 'relative',
                  paddingTop: '100%',
                  backgroundColor: '#f8f9fa'
                }}>
                  <img
                    src={images[currentImageIndex]}
                    alt={product.name}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  
                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        style={{
                          position: 'absolute',
                          left: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #dee2e6',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          color: '#212529',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                        }}
                      >
                        <FontAwesomeIcon icon={faChevronLeft} />
                      </button>
                      <button
                        onClick={nextImage}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #dee2e6',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          color: '#212529',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
                        }}
                      >
                        <FontAwesomeIcon icon={faChevronRight} />
                      </button>
                    </>
                  )}

                  {/* Status Badge */}
                  <span className="position-absolute top-0 end-0 m-3" style={{
                    padding: '0.375rem 0.75rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    backgroundColor: product.status === 'Active' ? '#28a74515' : '#ffc10715',
                    color: product.status === 'Active' ? '#28a745' : '#ffc107',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {product.status}
                  </span>
                </div>

                {/* Thumbnail Images */}
                {images.length > 1 && (
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    padding: '1rem',
                    backgroundColor: 'white'
                  }}>
                    {images.map((img, index) => (
                      <div
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        style={{
                          flex: 1,
                          paddingTop: '25%',
                          position: 'relative',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border: currentImageIndex === index ? '2px solid var(--sand-600)' : '1px solid #dee2e6',
                          transition: 'all 0.2s'
                        }}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Information */}
            <div className="col-12 col-md-7">
              {/* Product Name & Category */}
              <div className="mb-4">
                <h2 style={{
                  margin: '0 0 0.75rem 0',
                  color: '#212529',
                  fontSize: '1.75rem',
                  fontWeight: '600'
                }}>
                  {product.name}
                </h2>
                <span style={{
                  padding: '0.375rem 0.75rem',
                  borderRadius: '4px',
                  backgroundColor: '#f8f9fa',
                  color: '#495057',
                  fontSize: '0.8125rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <FontAwesomeIcon icon={faLayerGroup} style={{ marginRight: '0.375rem', fontSize: '0.75rem' }} />
                  {product.category}
                </span>
              </div>

              {/* Price Information */}
              <div className="mb-4">
                <h5 style={{
                  margin: '0 0 1rem 0',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#495057',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Pricing
                </h5>
                <div className="row g-3">
                  {product.discount > 0 ? (
                    <>
                      <div className="col-4">
                        <div className="p-3" style={{
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          border: '1px solid #dee2e6'
                        }}>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: '#6c757d', fontWeight: '500' }}>
                            Final Price
                          </p>
                          <p style={{
                            margin: '0.5rem 0 0 0',
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            color: '#28a745'
                          }}>
                            ₹{product.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="p-3" style={{
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          border: '1px solid #dee2e6'
                        }}>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: '#6c757d', fontWeight: '500' }}>
                            Actual Price
                          </p>
                          <p style={{
                            margin: '0.5rem 0 0 0',
                            fontSize: '1rem',
                            fontWeight: '600',
                            color: '#6c757d',
                            textDecoration: 'line-through'
                          }}>
                            ₹{product.actualPrice.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="p-3" style={{
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          border: '1px solid #dee2e6'
                        }}>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: '#6c757d', fontWeight: '500' }}>
                            Discount
                          </p>
                          <p style={{
                            margin: '0.5rem 0 0 0',
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            color: '#28a745'
                          }}>
                            {product.discount}%
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="col-6">
                      <div className="p-3" style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        border: '1px solid #dee2e6'
                      }}>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#6c757d', fontWeight: '500' }}>
                          Price
                        </p>
                        <p style={{
                          margin: '0.5rem 0 0 0',
                          fontSize: '1.25rem',
                          fontWeight: '700',
                          color: '#28a745'
                        }}>
                          ₹{product.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stock & Details */}
              <div className="mb-4">
                <h5 style={{
                  margin: '0 0 1rem 0',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#495057',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Inventory & Details
                </h5>
                <div className="row g-3">
                  <div className="col-4">
                    <div className="p-3" style={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      border: '1px solid #dee2e6'
                    }}>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#6c757d', fontWeight: '500' }}>
                        <FontAwesomeIcon icon={faWarehouse} style={{ marginRight: '0.375rem' }} />
                        Stock
                      </p>
                      <p style={{
                        margin: '0.5rem 0 0 0',
                        fontSize: '1rem',
                        fontWeight: '700',
                        color: product.stock < 20 ? '#dc3545' : '#212529'
                      }}>
                        {product.stock}
                      </p>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-3" style={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      border: '1px solid #dee2e6'
                    }}>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#6c757d', fontWeight: '500' }}>
                        <FontAwesomeIcon icon={faBox} style={{ marginRight: '0.375rem' }} />
                        Sales
                      </p>
                      <p style={{
                        margin: '0.5rem 0 0 0',
                        fontSize: '1rem',
                        fontWeight: '700',
                        color: '#212529'
                      }}>
                        {product.sales || 0}
                      </p>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-3" style={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      border: '1px solid #dee2e6'
                    }}>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#6c757d', fontWeight: '500' }}>
                        <FontAwesomeIcon icon={faBarcode} style={{ marginRight: '0.375rem' }} />
                        Product #
                      </p>
                      <p style={{
                        margin: '0.5rem 0 0 0',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#212529',
                        fontFamily: 'monospace'
                      }}>
                        {product.serialNumber || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <h5 style={{
                  margin: '0 0 1rem 0',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#495057',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Description
                </h5>
                <div className="p-3" style={{
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #dee2e6'
                }}>
                  <p style={{
                    margin: 0,
                    color: '#495057',
                    lineHeight: '1.6',
                    fontSize: '0.9375rem'
                  }}>
                    {product.description || 'No description available'}
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div>
                <h5 style={{
                  margin: '0 0 1rem 0',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#495057',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Additional Information
                </h5>
                <div className="p-3" style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '1px solid #dee2e6'
                }}>
                  <div className="row g-3">
                    <div className="col-6">
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#6c757d', fontWeight: '500' }}>
                        Volume
                      </p>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9375rem', color: '#212529', fontWeight: '600' }}>
                        50ml
                      </p>
                    </div>
                    <div className="col-6">
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#6c757d', fontWeight: '500' }}>
                        Type
                      </p>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9375rem', color: '#212529', fontWeight: '600' }}>
                        Eau de Parfum
                      </p>
                    </div>
                    <div className="col-6">
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#6c757d', fontWeight: '500' }}>
                        Brand
                      </p>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9375rem', color: '#212529', fontWeight: '600' }}>
                        Vamana Perfumes
                      </p>
                    </div>
                    <div className="col-6">
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#6c757d', fontWeight: '500' }}>
                        Gender
                      </p>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9375rem', color: '#212529', fontWeight: '600' }}>
                        Unisex
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 2rem',
          borderTop: '1px solid #e9ecef',
          display: 'flex',
          gap: '0.75rem',
          justifyContent: 'flex-end',
          backgroundColor: '#f8f9fa',
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '6px',
              border: '1px solid #dee2e6',
              backgroundColor: 'white',
              color: '#495057',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e9ecef';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              if (onEdit) onEdit(product);
            }}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'var(--sand-600)',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--sand-700)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--sand-600)';
            }}
          >
            <FontAwesomeIcon icon={faEdit} />
            Edit Product
          </button>
        </div>
      </div>
    </>
  );
}
