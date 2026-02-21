import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, faBolt, faPercent, faCalendarAlt, 
  faCheckCircle, faTimesCircle, faEdit, faFire, faStar
} from '@fortawesome/free-solid-svg-icons';

export default function ViewLimitedOfferModal({ isOpen, onClose, offer, onEdit }) {
  if (!isOpen || !offer) return null;

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
              Limited Offer Details
            </h3>
            <p style={{ margin: '0.25rem 0 0 0', color: '#6c757d', fontSize: '0.875rem' }}>
              View complete offer information
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
          {/* Title & Status Section */}
          <div className="mb-4 p-3" style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #dee2e6',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#ff5722',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.25rem'
              }}>
                <FontAwesomeIcon icon={faBolt} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6c757d', fontWeight: '500' }}>
                  OFFER TITLE
                </p>
                <h4 style={{
                  margin: '0.25rem 0 0 0',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#212529'
                }}>
                  {offer.title}
                </h4>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {offer.featured && (
                <span style={{
                  padding: '0.375rem 0.75rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  backgroundColor: '#ffc10715',
                  color: '#ffc107',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem'
                }}>
                  <FontAwesomeIcon icon={faStar} />
                  Featured
                </span>
              )}
              <span style={{
                padding: '0.375rem 0.75rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: '600',
                backgroundColor: `${getStatusColor(offer.status)}15`,
                color: getStatusColor(offer.status),
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem'
              }}>
                <FontAwesomeIcon icon={getStatusIcon(offer.status)} />
                {offer.status}
              </span>
            </div>
          </div>

          {/* Description */}
          {offer.description && (
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
                {offer.description}
              </p>
            </div>
          )}

          {/* Product Information */}
          {offer.product && (
            <div className="mb-4">
              <h5 style={{
                margin: '0 0 1rem 0',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#495057',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Product Information
              </h5>
              <div className="p-3" style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #dee2e6'
              }}>
                <p style={{ margin: 0, fontSize: '0.9375rem', color: '#212529', fontWeight: '600' }}>
                  {typeof offer.product === 'object' ? offer.product.name : 'Product'}
                </p>
              </div>
            </div>
          )}

          {/* Pricing Information */}
          <div className="mb-4">
            <h5 style={{
              margin: '0 0 1rem 0',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#495057',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Pricing Information
            </h5>
            <div className="row g-3">
              <div className="col-6 col-md-3">
                <div className="p-3" style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '1px solid #dee2e6',
                  textAlign: 'center'
                }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#6c757d', fontWeight: '500' }}>
                    Original Price
                  </p>
                  <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#6c757d', textDecoration: 'line-through' }}>
                    ₹{offer.originalPrice.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3" style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '1px solid #dee2e6',
                  textAlign: 'center'
                }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#6c757d', fontWeight: '500' }}>
                    Offer Price
                  </p>
                  <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#ff5722' }}>
                    ₹{offer.offerPrice.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3" style={{
                  backgroundColor: '#ff572215',
                  borderRadius: '8px',
                  border: '1px solid #ff572230',
                  textAlign: 'center'
                }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#ff5722', fontWeight: '500' }}>
                    Discount
                  </p>
                  <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#ff5722' }}>
                    {offer.discount}%
                  </p>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="p-3" style={{
                  backgroundColor: '#28a74515',
                  borderRadius: '8px',
                  border: '1px solid #28a74530',
                  textAlign: 'center'
                }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#28a745', fontWeight: '500' }}>
                    You Save
                  </p>
                  <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#28a745' }}>
                    ₹{(offer.originalPrice - offer.offerPrice).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Date Information */}
          <div className="mb-4">
            <h5 style={{
              margin: '0 0 1rem 0',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#495057',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Offer Duration
            </h5>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <div className="p-3" style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '1px solid #dee2e6'
                }}>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faCalendarAlt} style={{ color: '#28a745' }} />
                    <span style={{ fontSize: '0.75rem', color: '#6c757d', fontWeight: '500' }}>
                      START DATE
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9375rem', fontWeight: '600', color: '#212529' }}>
                    {formatDate(offer.startDate)}
                  </p>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="p-3" style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '1px solid #dee2e6'
                }}>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <FontAwesomeIcon icon={faCalendarAlt} style={{ color: '#dc3545' }} />
                    <span style={{ fontSize: '0.75rem', color: '#6c757d', fontWeight: '500' }}>
                      END DATE
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9375rem', fontWeight: '600', color: '#212529' }}>
                    {formatDate(offer.endDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stock Information */}
          {offer.stockLimit && (
            <div className="mb-4">
              <h5 style={{
                margin: '0 0 1rem 0',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#495057',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Stock Information
              </h5>
              <div className="p-3" style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #dee2e6'
              }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span style={{ fontSize: '0.875rem', color: '#495057' }}>
                    Stock Progress
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#212529' }}>
                    {offer.soldCount} / {offer.stockLimit} sold
                  </span>
                </div>
                <div style={{
                  height: '8px',
                  backgroundColor: '#e9ecef',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${(offer.soldCount / offer.stockLimit) * 100}%`,
                    backgroundColor: offer.soldCount >= offer.stockLimit ? '#dc3545' : '#ff5722',
                    transition: 'width 0.3s'
                  }} />
                </div>
                <div className="mt-2">
                  <span style={{ 
                    fontSize: '0.75rem', 
                    color: offer.soldCount >= offer.stockLimit ? '#dc3545' : '#28a745',
                    fontWeight: '600'
                  }}>
                    {offer.soldCount >= offer.stockLimit 
                      ? 'Out of Stock' 
                      : `${offer.stockLimit - offer.soldCount} remaining`
                    }
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="d-flex gap-2 justify-content-end">
            <button
              onClick={onClose}
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '8px',
                border: '1px solid #dee2e6',
                backgroundColor: 'white',
                color: '#495057',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              Close
            </button>
            <button
              onClick={() => onEdit(offer)}
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#ff5722',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e64a19'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff5722'}
            >
              <FontAwesomeIcon icon={faEdit} />
              Edit Offer
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
