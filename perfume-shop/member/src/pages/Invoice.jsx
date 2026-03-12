import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseUrl } from '../redux/apis/config';

export default function Invoice() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState(null);
  const [showAnimation, setShowAnimation] = useState(true);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
    fetchSiteSettings();
    
    // Hide animation after 4 seconds
    const animationTimer = setTimeout(() => {
      setShowAnimation(false);
      // Show invoice with fade in after animation
      setTimeout(() => {
        setShowInvoice(true);
      }, 500);
    }, 4000);

    return () => clearTimeout(animationTimer);
  }, [orderId]);

  const fetchSiteSettings = async () => {
    try {
      const response = await axios.get(`${baseUrl}site-settings`);
      setSiteSettings(response.data.data);
    } catch (error) {
      console.error('Failed to load site settings:', error);
    }
  };

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`${baseUrl}orders/${orderId}`);
      if (response.data.success) {
        setOrder(response.data.order);
      }
    } catch (error) {
      toast.error('Failed to load invoice');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner-border" style={{ color: 'var(--sand-600)' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--sand-600)', fontSize: '1.2rem' }}>Order not found</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      paid: '#10b981',
      failed: '#ef4444'
    };
    return colors[status] || '#6c757d';
  };

  const getTrackingLabel = (status) => {
    const labels = {
      ordered: 'Ordered',
      processing: 'Processing',
      shipped: 'Shipped',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered'
    };
    return labels[status] || status;
  };

  return (
    <div style={{ background: 'var(--sand-50)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '2rem', position: 'relative' }}>
      
      {/* Congratulations Animation Overlay */}
      {showAnimation && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeOut 0.5s ease 3.5s forwards'
        }}>
          {/* Simple Road */}
          <div style={{
            position: 'absolute',
            bottom: '35%',
            left: 0,
            right: 0,
            height: '80px',
            background: '#6b7280',
            borderTop: '3px solid #4b5563',
            borderBottom: '3px solid #4b5563'
          }}>
            {/* Road center line */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '4px',
              background: 'repeating-linear-gradient(to right, #fbbf24 0px, #fbbf24 30px, transparent 30px, transparent 50px)',
              transform: 'translateY(-50%)',
              animation: 'roadLineMove 1s linear infinite'
            }} />
          </div>

          {/* Truck Animation */}
          <div style={{
            position: 'absolute',
            bottom: '35%',
            animation: 'truckDrive 3.5s ease-in-out forwards',
            fontSize: '5rem',
            zIndex: 10
          }}>
            🚚
            {/* Smoke behind truck (left side) */}
            <span style={{
              position: 'absolute',
              left: '100%',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '2rem',
              opacity: 0.6,
              animation: 'smokeTrail 0.8s ease-out infinite'
            }}>
              💨
            </span>
          </div>

          {/* Destination House */}
          <div style={{
            position: 'absolute',
            left: '10%',
            bottom: '42%',
            fontSize: '4rem',
            animation: 'houseAppear 1s ease 3s backwards'
          }}>
            🏠
          </div>

          {/* Coins Animation */}
          <div style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            height: '200px'
          }}>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${20 + i * 10}%`,
                  fontSize: '2.5rem',
                  animation: `coinFall ${1 + i * 0.2}s ease-in ${i * 0.1}s infinite`
                }}
              >
                🪙
              </div>
            ))}
          </div>

          {/* Success Message */}
          <div style={{
            textAlign: 'center',
            animation: 'slideUp 1s ease 0.5s backwards',
            zIndex: 1
          }}>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              color: 'var(--sand-800)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              marginBottom: '1rem',
              fontWeight: '700'
            }}>
              🎉 Congratulations! 🎉
            </h1>
            <h2 style={{
              color: 'var(--sand-700)',
              fontSize: 'clamp(1.2rem, 3vw, 2rem)',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>
              Your Order is Placed Successfully!
            </h2>
            <p style={{
              color: 'var(--sand-600)',
              fontSize: 'clamp(1rem, 2vw, 1.3rem)',
              animation: 'pulse 1.5s ease-in-out infinite'
            }}>
              Preparing your invoice...
            </p>
          </div>

          {/* Sparkles */}
          {[...Array(12)].map((_, i) => (
            <div
              key={`sparkle-${i}`}
              style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: '1.5rem',
                animation: `sparkle ${1 + Math.random()}s ease-in-out ${Math.random() * 2}s infinite`
              }}
            >
              ✨
            </div>
          ))}
        </div>
      )}

      {/* Invoice Content */}
      <div style={{
        opacity: showInvoice ? 1 : 0,
        transform: showInvoice ? 'scale(1)' : 'scale(0.95)',
        transition: 'all 0.8s ease',
        pointerEvents: showInvoice ? 'auto' : 'none'
      }}>
        <div className="container invoice-container" style={{ maxWidth: '900px' }}>
          {/* Print Button */}
          <div className="d-flex justify-content-end mb-3 no-print">
            <button
              onClick={handlePrint}
              style={{
                padding: '0.75rem 2rem',
                background: 'var(--sand-600)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.background = 'var(--sand-700)'}
              onMouseLeave={(e) => e.target.style.background = 'var(--sand-600)'}
            >
              Print Invoice
            </button>
          </div>

          {/* Invoice Card */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: 'clamp(1.5rem, 4vw, 3rem)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            {/* Header */}
            <div style={{ borderBottom: '3px solid var(--sand-600)', paddingBottom: '2rem', marginBottom: '2rem' }}>
              <div className="row align-items-center">
                <div className="col-md-6 mb-3 mb-md-0">
                  <h1 style={{
                    fontFamily: "'Playfair Display', serif",
                    color: 'var(--sand-800)',
                    fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
                    marginBottom: '0.5rem'
                  }}>
                    INVOICE
                  </h1>
                  <p style={{ color: 'var(--sand-600)', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', margin: 0 }}>
                    Order #{order._id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <div className="col-md-6 text-md-end">
                  <h3 style={{
                    fontFamily: "'Playfair Display', serif",
                    color: 'var(--sand-700)',
                    fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
                    marginBottom: '0.5rem'
                  }}>
                    {siteSettings?.siteName || 'Vamana Perfumes'}
                  </h3>
                  <p style={{ color: 'var(--sand-600)', fontSize: 'clamp(0.75rem, 2vw, 0.9rem)', margin: 0 }}>
                    {siteSettings?.tagline || 'Premium Fragrances'}<br />
                    {siteSettings?.email || 'contact@vamana.com'}<br />
                    {siteSettings?.phone || '+91 1234567890'}<br />
                    {siteSettings?.address || 'Mumbai, India'}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Info */}
            <div className="row mb-4">
              <div className="col-md-6 mb-3 mb-md-0">
                <h5 style={{ color: 'var(--sand-800)', fontWeight: '600', marginBottom: '1rem', fontSize: 'clamp(1rem, 3vw, 1.1rem)' }}>Bill To:</h5>
                <p style={{ color: 'var(--sand-700)', lineHeight: '1.8', margin: 0, fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
                  <strong>{order.userDetails?.name || 'Customer'}</strong><br />
                  {order.userDetails?.email}<br />
                  {order.userDetails?.phone}<br />
                  {order.address?.street}, {order.address?.city}<br />
                  {order.address?.state} - {order.address?.pincode}
                </p>
              </div>
              <div className="col-md-6">
                <h5 style={{ color: 'var(--sand-800)', fontWeight: '600', marginBottom: '1rem', fontSize: 'clamp(1rem, 3vw, 1.1rem)' }}>Order Details:</h5>
                <div style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
                  <div className="d-flex justify-content-between mb-2">
                    <span style={{ color: 'var(--sand-700)' }}>Order Date:</span>
                    <strong style={{ color: 'var(--sand-700)' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span style={{ color: 'var(--sand-700)' }}>Payment Method:</span>
                    <strong style={{ color: 'var(--sand-700)' }}>{order.paymentMethod === 'cod' ? 'COD' : 'Online'}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span style={{ color: 'var(--sand-700)' }}>Payment Status:</span>
                    <span style={{
                      background: getStatusColor(order.paymentStatus),
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
                      fontWeight: '600'
                    }}>
                      {order.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span style={{ color: 'var(--sand-700)' }}>Tracking:</span>
                    <strong style={{ color: 'var(--sand-700)' }}>{getTrackingLabel(order.trackingStatus)}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div style={{ marginBottom: '2rem', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
                <thead>
                  <tr style={{ background: 'var(--sand-100)', borderBottom: '2px solid var(--sand-300)' }}>
                    <th style={{ padding: 'clamp(0.5rem, 2vw, 1rem)', textAlign: 'left', color: 'var(--sand-800)', fontWeight: '600', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>Product</th>
                    <th style={{ padding: 'clamp(0.5rem, 2vw, 1rem)', textAlign: 'center', color: 'var(--sand-800)', fontWeight: '600', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>Qty</th>
                    <th style={{ padding: 'clamp(0.5rem, 2vw, 1rem)', textAlign: 'right', color: 'var(--sand-800)', fontWeight: '600', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>Price</th>
                    <th style={{ padding: 'clamp(0.5rem, 2vw, 1rem)', textAlign: 'right', color: 'var(--sand-800)', fontWeight: '600', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((item, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid var(--sand-200)' }}>
                      <td style={{ padding: 'clamp(0.5rem, 2vw, 1rem)' }}>
                        <div className="d-flex align-items-center gap-2">
                          {item.productDetails?.mainImage && (
                            <img
                              src={item.productDetails.mainImage}
                              alt={item.productDetails?.name}
                              style={{
                                width: 'clamp(40px, 10vw, 60px)',
                                height: 'clamp(40px, 10vw, 60px)',
                                objectFit: 'cover',
                                borderRadius: '8px'
                              }}
                            />
                          )}
                          <div style={{ color: 'var(--sand-800)', fontWeight: '500', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
                            {item.productDetails?.name || 'Product'}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: 'clamp(0.5rem, 2vw, 1rem)', textAlign: 'center', color: 'var(--sand-700)', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
                        {item.quantity}
                      </td>
                      <td style={{ padding: 'clamp(0.5rem, 2vw, 1rem)', textAlign: 'right', color: 'var(--sand-700)', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
                        ₹{item.price.toLocaleString()}
                      </td>
                      <td style={{ padding: 'clamp(0.5rem, 2vw, 1rem)', textAlign: 'right', color: 'var(--sand-800)', fontWeight: '600', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div style={{ borderTop: '2px solid var(--sand-300)', paddingTop: '1.5rem' }}>
              <div className="row">
                <div className="col-md-6"></div>
                <div className="col-md-6">
                  <div style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
                    <div className="d-flex justify-content-between mb-2">
                      <span style={{ color: 'var(--sand-700)' }}>Subtotal:</span>
                      <span style={{ color: 'var(--sand-700)' }}>₹{order.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span style={{ color: 'var(--sand-700)' }}>Shipping:</span>
                      <span style={{ color: 'var(--sand-700)' }}>Free</span>
                    </div>
                    <div className="d-flex justify-content-between pt-3" style={{ borderTop: '2px solid var(--sand-600)' }}>
                      <span style={{ color: 'var(--sand-800)', fontSize: 'clamp(1.1rem, 3vw, 1.3rem)', fontWeight: '700' }}>Total:</span>
                      <span style={{ color: 'var(--sand-800)', fontSize: 'clamp(1.1rem, 3vw, 1.3rem)', fontWeight: '700' }}>₹{order.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              marginTop: '3rem',
              paddingTop: '2rem',
              borderTop: '1px solid var(--sand-200)',
              textAlign: 'center',
              color: 'var(--sand-600)',
              fontSize: 'clamp(0.8rem, 2vw, 0.9rem)'
            }}>
              <p style={{ margin: 0 }}>Thank you for your purchase!</p>
              <p style={{ margin: '0.5rem 0 0 0' }}>
                For any queries, contact us at {siteSettings?.email || 'support@vamana.com'} or call {siteSettings?.phone || '+91 1234567890'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .invoice-container, .invoice-container * {
            visibility: visible;
          }
          .invoice-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          nav, header, footer {
            display: none !important;
          }
          @page {
            margin: 1cm;
          }
        }

        @keyframes truckDrive {
          0% {
            left: 100%;
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
          100% {
            left: 15%;
            transform: translateY(0);
          }
        }

        @keyframes roadLineMove {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: -50px 0;
          }
        }

        @keyframes smokeTrail {
          0% {
            opacity: 0.6;
            transform: translateY(-50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-50%) translateX(20px) scale(1.5);
          }
        }

        @keyframes houseAppear {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounce {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-10px);
          }
        }

        @keyframes smoke {
          0% {
            opacity: 0.5;
            transform: translateX(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateX(30px) scale(1.5);
          }
        }

        @keyframes coinFall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(200px) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.5) rotate(180deg);
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          to {
            opacity: 0;
            visibility: hidden;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
