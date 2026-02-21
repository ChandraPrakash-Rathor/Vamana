import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, faTags, faPercent, faCalendarAlt, 
  faCheckCircle, faTimesCircle, faEdit, faFire
} from '@fortawesome/free-solid-svg-icons';

export default function ViewSaleModal({ isOpen, onClose, sale, onEdit }) {
  if (!isOpen || !sale) return null;

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return '#28a745';
      case 'scheduled': return '#ffc107';
      case 'expired': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return faFire;
      case 'scheduled': return faCalendarAlt;
      case 'expired': return faTimesCircle;
      default: return faCheckCircle;
    }
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
        maxWidth: '800px',
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
              Sale Details
            </h3>
            <p style={{ margin: '0.25rem 0 0 0', color: '#6c757d', fontSize: '0.875rem' }}>
              View complete sale information
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
          {/* Sale Name & Status Section */}
          <div className="mb-4 p-3" style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #dee2e6',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: 'var(--sand-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.25rem'
              }}>
                <FontAwesomeIcon icon={faTags} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6c757d', fontWeight: '500' }}>
                  SALE NAME
                </p>
                <h4 style={{
                  margin: '0.25rem 0 0 0',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#212529'
                }}>
                  {sale.name}
                </h4>
              </div>
            </div>
            <span style={{
              padding: '0.375rem 0.75rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: '600',
              backgroundColor: `${getStatusColor(sale.status)}15`,
              color: getStatusColor(sale.status),
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem'
            }}>
              <FontAwesomeIcon icon={getStatusIcon(sale.status)} />
              {sale.status}
            </span>
          </div>

          {/* Description */}
          {sale.description && (
            <div className="mb-4 p-3" style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #dee2e6'
            }}>
              <p style={{ 
                margin: 0, 
                color: '#495057', 
                fontSize: '0.9375rem', 
                lineHeight: '1.6'
              }}>
                {sale.description}
              </p>
            </div>
          )}

          {/* Discount Information */}
          <div className="mb-4">
            <h5 style={{
              margin: '0 0 1rem 0',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#495057',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Discount Information
            </h5>
            <div className="row g-3">
              <div className="col-6 col-md-4">
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
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#ff5722'
                  }}>
                    <FontAwesomeIcon 
                      icon={faPercent} 
                      style={{ marginRight: '0.375rem', fontSize: '1.25rem' }}
                    />
                    {sale.discount}%
                  </p>
                </div>
              </div>

              <div className="col-6 col-md-4">
                <div className="p-3" style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '1px solid #dee2e6'
                }}>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#6c757d', fontWeight: '500' }}>
                    Products
                  </p>
                  <p style={{
                    margin: '0.5rem 0 0 0',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#212529'
                  }}>
                    <FontAwesomeIcon 
                      icon={faTags} 
                      style={{ marginRight: '0.375rem', fontSize: '0.875rem', color: '#6c757d' }}
                    />
                    {sale.productsCount} items
                  </p>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="p-3" style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '1px solid #dee2e6'
                }}>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#6c757d', fontWeight: '500' }}>
                    Revenue
                  </p>
                  <p style={{
                    margin: '0.5rem 0 0 0',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#28a745'
                  }}>
                    ₹{sale.totalRevenue.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Validity Period */}
          <div className="mb-4">
            <h5 style={{
              margin: '0 0 1rem 0',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#495057',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Validity Period
            </h5>
            <div className="p-3" style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #dee2e6'
            }}>
              <div className="row g-3">
                <div className="col-6">
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#6c757d', fontWeight: '500' }}>
                    <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '0.375rem' }} />
                    Start Date
                  </p>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9375rem', fontWeight: '600', color: '#212529' }}>
                    {new Date(sale.startDate).toLocaleDateString('en-IN', { 
                      day: '2-digit', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="col-6">
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#6c757d', fontWeight: '500' }}>
                    <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '0.375rem' }} />
                    End Date
                  </p>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9375rem', fontWeight: '600', color: '#212529' }}>
                    {new Date(sale.endDate).toLocaleDateString('en-IN', { 
                      day: '2-digit', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Applicable Products */}
          <div>
            <h5 style={{
              margin: '0 0 1rem 0',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#495057',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Applicable Products
            </h5>
            <div className="p-3" style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #dee2e6'
            }}>
              {sale.rawApplicableProductsWithNames && sale.rawApplicableProductsWithNames.length > 0 ? (
                <>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', color: '#6c757d', fontWeight: '500' }}>
                    <FontAwesomeIcon icon={faTags} style={{ marginRight: '0.5rem' }} />
                    Selected Products ({sale.rawApplicableProductsWithNames.length})
                  </p>
                  <div className="row g-2">
                    {sale.rawApplicableProductsWithNames.map((product, index) => (
                      <div key={index} className="col-12 col-md-6">
                        <div style={{
                          padding: '0.5rem 0.75rem',
                          borderRadius: '6px',
                          backgroundColor: '#f8f9fa',
                          border: '1px solid #e9ecef',
                          fontSize: '0.875rem',
                          color: '#495057'
                        }}>
                          • {typeof product === 'object' ? product.name : product}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p style={{ margin: 0, fontSize: '0.9375rem', color: '#212529', fontWeight: '500' }}>
                  <FontAwesomeIcon icon={faTags} style={{ marginRight: '0.5rem', color: '#6c757d' }} />
                  No products selected
                </p>
              )}
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
              if (onEdit) onEdit(sale);
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
            Edit Sale
          </button>
        </div>
      </div>
    </>
  );
}
