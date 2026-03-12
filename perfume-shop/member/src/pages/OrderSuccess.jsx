import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faHome, faBox, faFileInvoice } from '@fortawesome/free-solid-svg-icons';

export default function OrderSuccess() {
  const location = useLocation();
  const orderId = location.state?.orderId;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ 
      backgroundColor: 'var(--sand-100)', 
      minHeight: '100vh', 
      paddingTop: '90px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: 'clamp(2rem, 5vw, 3rem)',
              textAlign: 'center',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              animation: 'fadeInScale 0.5s ease'
            }}>
              {/* Success Icon */}
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: '#d4edda',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                animation: 'scaleIn 0.5s ease'
              }}>
                <FontAwesomeIcon 
                  icon={faCheckCircle} 
                  style={{ 
                    fontSize: '3.5rem', 
                    color: '#28a745'
                  }} 
                />
              </div>

              {/* Success Message */}
              <h1 style={{
                color: 'var(--sand-900)',
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                marginBottom: '1rem',
                fontWeight: '700'
              }}>
                Order Placed Successfully!
              </h1>

              <p style={{
                color: 'var(--sand-700)',
                fontSize: 'clamp(1rem, 2vw, 1.1rem)',
                marginBottom: '2rem',
                lineHeight: '1.6'
              }}>
                Thank you for your purchase! Your order has been confirmed and will be delivered soon.
              </p>

              {/* Order Details Box */}
              <div style={{
                backgroundColor: 'var(--sand-100)',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '2rem'
              }}>
                <p style={{
                  color: 'var(--sand-800)',
                  fontSize: '0.95rem',
                  marginBottom: '0.5rem'
                }}>
                  📧 A confirmation email has been sent to your registered email address.
                </p>
                <p style={{
                  color: 'var(--sand-800)',
                  fontSize: '0.95rem',
                  marginBottom: 0
                }}>
                  📦 You can track your order status from your account.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-3 flex-wrap justify-content-center">
                {orderId && (
                  <Link
                    to={`/invoice/${orderId}`}
                    style={{
                      padding: '0.9rem 2rem',
                      borderRadius: '10px',
                      backgroundColor: 'var(--sand-600)',
                      color: 'white',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--sand-700)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'var(--sand-600)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <FontAwesomeIcon icon={faFileInvoice} /> View Invoice
                  </Link>
                )}

                <Link
                  to="/orders"
                  style={{
                    padding: '0.9rem 2rem',
                    borderRadius: '10px',
                    backgroundColor: orderId ? 'white' : 'var(--sand-600)',
                    color: orderId ? 'var(--sand-600)' : 'white',
                    textDecoration: 'none',
                    fontSize: '1rem',
                    fontWeight: '600',
                    border: orderId ? '2px solid var(--sand-600)' : 'none',
                    transition: 'all 0.3s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    if (orderId) {
                      e.target.style.backgroundColor = 'var(--sand-100)';
                    } else {
                      e.target.style.backgroundColor = 'var(--sand-700)';
                      e.target.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (orderId) {
                      e.target.style.backgroundColor = 'white';
                    } else {
                      e.target.style.backgroundColor = 'var(--sand-600)';
                      e.target.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faBox} /> View Orders
                </Link>

                <Link
                  to="/"
                  style={{
                    padding: '0.9rem 2rem',
                    borderRadius: '10px',
                    backgroundColor: 'white',
                    color: 'var(--sand-600)',
                    textDecoration: 'none',
                    fontSize: '1rem',
                    fontWeight: '600',
                    border: '2px solid var(--sand-600)',
                    transition: 'all 0.3s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--sand-100)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'white';
                  }}
                >
                  <FontAwesomeIcon icon={faHome} /> Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
