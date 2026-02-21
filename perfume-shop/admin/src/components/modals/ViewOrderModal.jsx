import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, faUser, faEnvelope, faPhone, faMapMarkerAlt,
  faBox, faRupeeSign, faClock, faCheckCircle, faTruck
} from '@fortawesome/free-solid-svg-icons';

export default function ViewOrderModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return '#28a745';
      case 'Shipped': return '#007bff';
      case 'Processing': return '#ffc107';
      case 'Pending': return '#dc3545';
      case 'Cancelled': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const getPaymentColor = (payment) => {
    switch (payment) {
      case 'Paid': return '#28a745';
      case 'Pending': return '#ffc107';
      case 'Refunded': return '#dc3545';
      default: return '#6c757d';
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
        borderRadius: '16px',
        width: '90%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflowY: 'auto',
        zIndex: 9999,
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>

        {/* Modal Header */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '2px solid var(--sand-200)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          zIndex: 10,
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px'
        }}>
          <div>
            <h3 style={{
              margin: 0,
              color: 'var(--sand-900)',
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.8rem',
              fontWeight: '700'
            }}>
              Order Details
            </h3>
            <p style={{ margin: '0.25rem 0 0 0', color: 'var(--sand-600)', fontSize: '0.9rem' }}>
              Order ID: <span className="fw-bold font-monospace">{order.id}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              color: 'var(--sand-600)',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--sand-200)';
              e.currentTarget.style.color = 'var(--sand-900)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--sand-600)';
            }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '2rem' }}>
          <div className="row g-4">
            {/* Order Status Card */}
            <div className="col-12">
              <div style={{
                background: 'linear-gradient(135deg, var(--sand-100) 0%, var(--sand-200) 100%)',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '2px solid var(--sand-300)'
              }}>
                <div className="row g-3">
                  <div className="col-6 col-md-3">
                    <div className="text-center">
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '12px',
                        background: `${getStatusColor(order.status)}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 0.75rem',
                        fontSize: '1.5rem',
                        color: getStatusColor(order.status)
                      }}>
                        <FontAwesomeIcon icon={faTruck} />
                      </div>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--sand-600)', fontWeight: '600' }}>
                        Order Status
                      </p>
                      <p style={{
                        margin: '0.25rem 0 0 0',
                        fontSize: '1rem',
                        fontWeight: '700',
                        color: getStatusColor(order.status)
                      }}>
                        {order.status}
                      </p>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="text-center">
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '12px',
                        background: `${getPaymentColor(order.payment)}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 0.75rem',
                        fontSize: '1.5rem',
                        color: getPaymentColor(order.payment)
                      }}>
                        <FontAwesomeIcon icon={faRupeeSign} />
                      </div>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--sand-600)', fontWeight: '600' }}>
                        Payment
                      </p>
                      <p style={{
                        margin: '0.25rem 0 0 0',
                        fontSize: '1rem',
                        fontWeight: '700',
                        color: getPaymentColor(order.payment)
                      }}>
                        {order.payment}
                      </p>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="text-center">
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '12px',
                        background: 'rgba(0, 123, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 0.75rem',
                        fontSize: '1.5rem',
                        color: '#007bff'
                      }}>
                        <FontAwesomeIcon icon={faClock} />
                      </div>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--sand-600)', fontWeight: '600' }}>
                        Order Date
                      </p>
                      <p style={{
                        margin: '0.25rem 0 0 0',
                        fontSize: '1rem',
                        fontWeight: '700',
                        color: 'var(--sand-900)'
                      }}>
                        {order.date}
                      </p>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="text-center">
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '12px',
                        background: 'rgba(40, 167, 69, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 0.75rem',
                        fontSize: '1.5rem',
                        color: '#28a745'
                      }}>
                        <FontAwesomeIcon icon={faRupeeSign} />
                      </div>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--sand-600)', fontWeight: '600' }}>
                        Total Amount
                      </p>
                      <p style={{
                        margin: '0.25rem 0 0 0',
                        fontSize: '1.2rem',
                        fontWeight: '800',
                        color: '#28a745'
                      }}>
                        ₹{order.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="col-12 col-md-6">
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '2px solid var(--sand-300)',
                height: '100%'
              }}>
                <h5 style={{
                  margin: '0 0 1rem 0',
                  color: 'var(--sand-900)',
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <FontAwesomeIcon icon={faUser} style={{ color: 'var(--sand-600)' }} />
                  Customer Information
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--sand-600)', fontWeight: '600' }}>
                      Name
                    </p>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '1rem', fontWeight: '600', color: 'var(--sand-900)' }}>
                      {order.customer}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--sand-600)', fontWeight: '600' }}>
                      <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                      Email
                    </p>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.95rem', color: 'var(--sand-800)' }}>
                      {order.email}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--sand-600)', fontWeight: '600' }}>
                      <FontAwesomeIcon icon={faPhone} className="me-2" />
                      Phone
                    </p>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.95rem', color: 'var(--sand-800)' }}>
                      +91 98765 43210
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="col-12 col-md-6">
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '2px solid var(--sand-300)',
                height: '100%'
              }}>
                <h5 style={{
                  margin: '0 0 1rem 0',
                  color: 'var(--sand-900)',
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: 'var(--sand-600)' }} />
                  Shipping Address
                </h5>
                <div style={{ lineHeight: '1.8', color: 'var(--sand-800)' }}>
                  <p style={{ margin: 0, fontWeight: '600' }}>{order.customer}</p>
                  <p style={{ margin: 0 }}>123, MG Road, Koramangala</p>
                  <p style={{ margin: 0 }}>Bangalore, Karnataka</p>
                  <p style={{ margin: 0 }}>PIN: 560034</p>
                  <p style={{ margin: 0 }}>India</p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="col-12">
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '2px solid var(--sand-300)'
              }}>
                <h5 style={{
                  margin: '0 0 1rem 0',
                  color: 'var(--sand-900)',
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <FontAwesomeIcon icon={faBox} style={{ color: 'var(--sand-600)' }} />
                  Product Details
                </h5>
                <div className="table-responsive">
                  <table className="table table-borderless">
                    <thead>
                      <tr style={{ backgroundColor: 'var(--sand-100)' }}>
                        <th style={{ padding: '0.75rem', color: 'var(--sand-800)', fontWeight: '700' }}>Product</th>
                        <th style={{ padding: '0.75rem', color: 'var(--sand-800)', fontWeight: '700', textAlign: 'center' }}>Quantity</th>
                        <th style={{ padding: '0.75rem', color: 'var(--sand-800)', fontWeight: '700', textAlign: 'right' }}>Price</th>
                        <th style={{ padding: '0.75rem', color: 'var(--sand-800)', fontWeight: '700', textAlign: 'right' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '1rem 0.75rem', color: 'var(--sand-900)', fontWeight: '600' }}>
                          {order.product}
                        </td>
                        <td style={{ padding: '1rem 0.75rem', color: 'var(--sand-800)', textAlign: 'center' }}>
                          {order.quantity}
                        </td>
                        <td style={{ padding: '1rem 0.75rem', color: 'var(--sand-800)', textAlign: 'right' }}>
                          ₹{(order.amount / order.quantity).toLocaleString()}
                        </td>
                        <td style={{ padding: '1rem 0.75rem', color: 'var(--sand-900)', fontWeight: '700', textAlign: 'right' }}>
                          ₹{order.amount.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr style={{ borderTop: '2px solid var(--sand-300)' }}>
                        <td colSpan="3" style={{ padding: '1rem 0.75rem', color: 'var(--sand-900)', fontWeight: '700', fontSize: '1.1rem' }}>
                          Grand Total
                        </td>
                        <td style={{ padding: '1rem 0.75rem', color: '#28a745', fontWeight: '800', fontSize: '1.2rem', textAlign: 'right' }}>
                          ₹{order.amount.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '1.5rem 2rem',
          borderTop: '2px solid var(--sand-200)',
          display: 'flex',
          gap: '1rem',
          justifyContent: 'flex-end',
          position: 'sticky',
          bottom: 0,
          backgroundColor: 'white',
          borderBottomLeftRadius: '16px',
          borderBottomRightRadius: '16px'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              border: '2px solid var(--sand-300)',
              backgroundColor: 'white',
              color: 'var(--sand-900)',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--sand-200)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            Close
          </button>
          <button
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, var(--sand-600) 0%, var(--sand-700) 100%)',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(179, 135, 63, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(179, 135, 63, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(179, 135, 63, 0.3)';
            }}
          >
            Print Invoice
          </button>
        </div>
      </div>
    </>
  );
}
