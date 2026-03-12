import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, faTicket, faPercent, faRupeeSign, faCalendarAlt, 
  faUsers, faCheckCircle, faTimesCircle, faCopy, faEdit, faTag
} from '@fortawesome/free-solid-svg-icons';
import { toast } from "react-toastify";
import { GetProduct } from '../../APIS/apis/ProductApi';
import { useDispatch, useSelector } from 'react-redux';

export default function ViewCouponModal({ isOpen, onClose, coupon, onEdit }) {
  const dispatch = useDispatch();
  const { productData } = useSelector((state) => state?.ProductSlice);

  // Fetch products when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(GetProduct());
    }
  }, [isOpen, dispatch]);

  if (!isOpen || !coupon) return null;

  // Get product names from populated data
  const applicableProductNames = coupon.rawApplicableProductsWithNames
    ?.filter(p => typeof p === 'object' && p.name)
    .map(p => p.name) || [];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(coupon.code);
    toast.success(`Coupon code "${coupon.code}" copied!`);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return '#28a745';
      case 'expired': return '#dc3545';
      case 'inactive': return '#6c757d';
      default: return '#ffc107';
    }
  };

  const usagePercentage = coupon.usageLimit !== 'Unlimited' 
    ? (coupon.usedCount / coupon.usageLimit) * 100 
    : 0;

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
              Coupon Details
            </h3>
            <p style={{ margin: '0.25rem 0 0 0', color: '#6c757d', fontSize: '0.875rem' }}>
              View complete coupon information
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
          {/* Coupon Code Section */}
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
                <FontAwesomeIcon icon={faTicket} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6c757d', fontWeight: '500' }}>
                  COUPON CODE
                </p>
                <h4 style={{
                  margin: '0.25rem 0 0 0',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#212529',
                  fontFamily: 'monospace',
                  letterSpacing: '1px'
                }}>
                  {coupon.code}
                </h4>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{
                padding: '0.375rem 0.75rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: '600',
                backgroundColor: `${getStatusColor(coupon.status)}15`,
                color: getStatusColor(coupon.status),
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                <FontAwesomeIcon 
                  icon={coupon.status === 'Active' ? faCheckCircle : faTimesCircle} 
                  style={{ marginRight: '0.375rem' }}
                />
                {coupon.status}
              </span>
              <button
                onClick={handleCopyCode}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid var(--sand-600)',
                  backgroundColor: 'white',
                  color: 'var(--sand-600)',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--sand-600)';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = 'var(--sand-600)';
                }}
              >
                <FontAwesomeIcon icon={faCopy} />
                Copy
              </button>
            </div>
          </div>

          {/* Description */}
          {coupon.description && (
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
                {coupon.description}
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
              <div className="col-6 col-md-3">
                <div className="p-3" style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '1px solid #dee2e6'
                }}>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#6c757d', fontWeight: '500' }}>
                    Type
                  </p>
                  <p style={{
                    margin: '0.5rem 0 0 0',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#212529'
                  }}>
                    <FontAwesomeIcon 
                      icon={coupon.type === 'Percentage' ? faPercent : faRupeeSign} 
                      style={{ marginRight: '0.375rem', fontSize: '0.875rem', color: '#6c757d' }}
                    />
                    {coupon.type}
                  </p>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div className="p-3" style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '1px solid #dee2e6'
                }}>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#6c757d', fontWeight: '500' }}>
                    Value
                  </p>
                  <p style={{
                    margin: '0.5rem 0 0 0',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#28a745'
                  }}>
                    {coupon.type === 'Percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                  </p>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div className="p-3" style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '1px solid #dee2e6'
                }}>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#6c757d', fontWeight: '500' }}>
                    Min Order
                  </p>
                  <p style={{
                    margin: '0.5rem 0 0 0',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#212529'
                  }}>
                    ₹{coupon.minOrder.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div className="p-3" style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '1px solid #dee2e6'
                }}>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#6c757d', fontWeight: '500' }}>
                    Max Discount
                  </p>
                  <p style={{
                    margin: '0.5rem 0 0 0',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#212529'
                  }}>
                    {coupon.maxDiscount ? `₹${coupon.maxDiscount.toLocaleString()}` : '—'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Statistics */}
          <div className="mb-4">
            <h5 style={{
              margin: '0 0 1rem 0',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#495057',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Usage Statistics
            </h5>
            <div className="p-3" style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #dee2e6'
            }}>
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#6c757d', fontWeight: '500' }}>
                    Usage Limit
                  </p>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', fontWeight: '600', color: '#212529' }}>
                    {coupon.usageLimit === 'Unlimited' ? 'Unlimited' : coupon.usageLimit}
                  </p>
                </div>
                <div className="col-6">
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#6c757d', fontWeight: '500' }}>
                    Times Used
                  </p>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', fontWeight: '600', color: '#007bff' }}>
                    {coupon.usedCount}
                  </p>
                </div>
              </div>

              {coupon.usageLimit !== 'Unlimited' && (
                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6c757d' }}>
                      Progress
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#212529' }}>
                      {usagePercentage.toFixed(0)}%
                    </span>
                  </div>
                  <div style={{
                    height: '8px',
                    backgroundColor: '#e9ecef',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${usagePercentage}%`,
                      height: '100%',
                      backgroundColor: usagePercentage >= 90 ? '#dc3545' : usagePercentage >= 70 ? '#ffc107' : '#28a745',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              )}
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
                    Valid From
                  </p>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9375rem', fontWeight: '600', color: '#212529' }}>
                    {coupon.validFrom}
                  </p>
                </div>
                <div className="col-6">
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#6c757d', fontWeight: '500' }}>
                    <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '0.375rem' }} />
                    Valid To
                  </p>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9375rem', fontWeight: '600', color: '#212529' }}>
                    {coupon.validTo}
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
              Applicable To
            </h5>
            <div className="p-3" style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #dee2e6'
            }}>
              {applicableProductNames.length > 0 ? (
                <>
                  <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', color: '#6c757d', fontWeight: '500' }}>
                    <FontAwesomeIcon icon={faTag} style={{ marginRight: '0.5rem' }} />
                    Specific Products ({applicableProductNames.length})
                  </p>
                  <div className="row g-2">
                    {applicableProductNames.map((productName, index) => (
                      <div key={index} className="col-12 col-md-6">
                        <div style={{
                          padding: '0.5rem 0.75rem',
                          borderRadius: '6px',
                          backgroundColor: '#f8f9fa',
                          border: '1px solid #e9ecef',
                          fontSize: '0.875rem',
                          color: '#495057'
                        }}>
                          • {productName}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p style={{ margin: 0, fontSize: '0.9375rem', color: '#212529', fontWeight: '500' }}>
                  <FontAwesomeIcon icon={faTag} style={{ marginRight: '0.5rem', color: '#6c757d' }} />
                  {coupon.applicableProducts}
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
              if (onEdit) onEdit(coupon);
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
            Edit Coupon
          </button>
        </div>
      </div>
    </>
  );
}
