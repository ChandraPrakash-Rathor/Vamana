import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseUrl } from '../redux/apis/config';

export default function Invoice() {
  const { orderId } = useParams();
  const location = useLocation();
  const isNewOrder = new URLSearchParams(location.search).get('new') === 'true';

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState(null);
  const [showAnimation, setShowAnimation] = useState(isNewOrder);
  const [showInvoice, setShowInvoice] = useState(!isNewOrder);

  useEffect(() => {
    fetchOrderDetails();
    fetchSiteSettings();

    if (isNewOrder) {
      const animationTimer = setTimeout(() => {
        setShowAnimation(false);
        setTimeout(() => setShowInvoice(true), 500);
      }, 4000);
      return () => clearTimeout(animationTimer);
    }
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
        // API returns {success, message, data:{...order}} or {success, ...order}
        setOrder(response.data.data || response.data.order || response.data);
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
            padding: 'clamp(1.5rem, 4vw, 2.5rem)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            fontFamily: 'sans-serif'
          }}>
            {(() => {
              const GST_RATE = 28;
              const HSN_CODE = '3303';
              const calcGST = (total) => { const base = total / (1 + GST_RATE / 100); const gst = total - base; return { base, cgst: gst / 2, sgst: gst / 2 }; };
              const fmt = (n) => `₹${Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
              const invoiceNo = `INV-${order._id.slice(-6).toUpperCase()}`;
              const invoiceDate = new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
              const { base: baseAmount, cgst, sgst } = calcGST(order.totalAmount || 0);
              const thS = { padding: '0.65rem 0.75rem', textAlign: 'center', fontWeight: '600', fontSize: '0.82rem', whiteSpace: 'nowrap', background: 'var(--sand-800)', color: 'white' };
              const tdS = (align='center') => ({ padding: '0.65rem 0.75rem', textAlign: align, fontSize: '0.85rem', color: 'var(--sand-800)', borderBottom: '1px solid var(--sand-200)' });
              return (<>
                {/* Invoice title + dates */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', borderBottom: '3px solid var(--sand-600)', paddingBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem,5vw,2.5rem)', fontWeight: '700', color: 'var(--sand-800)', marginBottom: '1rem' }}>INVOICE</h1>
                    <table style={{ borderCollapse: 'collapse' }}>
                      <tbody>
                        {[['Invoice No', invoiceNo], ['Invoice Date', invoiceDate]].map(([l, v]) => (
                          <tr key={l}><td style={{ color: 'var(--sand-600)', fontSize: '0.88rem', paddingRight: '1.5rem', paddingBottom: '0.25rem' }}>{l}</td><td style={{ fontWeight: '700', color: 'var(--sand-900)', fontSize: '0.88rem', paddingBottom: '0.25rem' }}>{v}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: '700', color: 'var(--sand-800)' }}>{siteSettings?.siteName || 'Vamana Perfumes'}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--sand-600)', marginTop: '0.25rem' }}>{siteSettings?.tagline || 'Premium Fragrances'}</div>
                  </div>
                </div>

                {/* Billed By / Billed To */}
                <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <div style={{ background: 'var(--sand-100)', borderRadius: '10px', padding: '1rem', borderLeft: '4px solid var(--sand-600)' }}>
                      <p style={{ color: 'var(--sand-700)', fontWeight: '700', fontSize: '0.88rem', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Billed By</p>
                      <p style={{ fontWeight: '700', color: 'var(--sand-900)', marginBottom: '0.2rem', fontSize: '0.9rem' }}>{siteSettings?.siteName || 'Vamana Perfumes'}</p>
                      <p style={{ color: 'var(--sand-700)', fontSize: '0.84rem', marginBottom: '0.15rem' }}>{siteSettings?.address || 'Madhya Pradesh, India'}</p>
                      <p style={{ color: 'var(--sand-700)', fontSize: '0.84rem', marginBottom: '0.15rem' }}><strong>GSTIN:</strong> {siteSettings?.gstin || '23DUQPG5822R1ZY'}</p>
                      <p style={{ color: 'var(--sand-700)', fontSize: '0.84rem', marginBottom: 0 }}><strong>PAN:</strong> {siteSettings?.pan || 'DUQPG5822R'}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div style={{ background: 'var(--sand-100)', borderRadius: '10px', padding: '1rem', borderLeft: '4px solid var(--sand-500)' }}>
                      <p style={{ color: 'var(--sand-700)', fontWeight: '700', fontSize: '0.88rem', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Billed To</p>
                      <p style={{ fontWeight: '700', color: 'var(--sand-900)', marginBottom: '0.2rem', fontSize: '0.9rem' }}>{order.userDetails?.name || ((order.address?.firstName || '') + ' ' + (order.address?.lastName || '')).trim()}</p>
                      <p style={{ color: 'var(--sand-700)', fontSize: '0.84rem', marginBottom: '0.15rem' }}>{order.address?.address || order.address?.street}</p>
                      <p style={{ color: 'var(--sand-700)', fontSize: '0.84rem', marginBottom: '0.15rem' }}>{order.address?.city}, {order.address?.state}, India - {order.address?.pincode}</p>
                    </div>
                  </div>
                </div>

                {/* Supply info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.84rem', color: 'var(--sand-700)', borderBottom: '1px solid var(--sand-200)', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span><strong>Country of Supply:</strong> India</span>
                  <span><strong>Place of Supply:</strong> {order.address?.state || 'India'}</span>
                </div>

                {/* Items table */}
                <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '560px' }}>
                    <thead>
                      <tr>
                        <th style={{ ...thS, textAlign: 'left' }}>Item</th>
                        {['GST Rate','Qty','Rate','Amount','CGST','SGST','Total'].map(h => <th key={h} style={thS}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {(order.products || []).map((item, idx) => {
                        const lineTotal = item.price * item.quantity;
                        const { base: lb, cgst: lc, sgst: ls } = calcGST(lineTotal);
                        return (
                          <tr key={idx} style={{ background: idx % 2 === 0 ? 'white' : 'var(--sand-50)' }}>
                            <td style={{ ...tdS('left') }}>
                              <div style={{ fontWeight: '600', color: 'var(--sand-900)' }}>{item.productDetails?.name || 'Product'}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--sand-500)' }}>HSN/SAC: {HSN_CODE}</div>
                            </td>
                            <td style={tdS()}>{GST_RATE}%</td>
                            <td style={tdS()}>{item.quantity}</td>
                            <td style={tdS()}>₹{item.price?.toLocaleString()}</td>
                            <td style={tdS()}>{fmt(lb)}</td>
                            <td style={tdS()}>{fmt(lc)}</td>
                            <td style={tdS()}>{fmt(ls)}</td>
                            <td style={{ ...tdS(), fontWeight: '700', color: 'var(--sand-900)' }}>{fmt(lineTotal)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Summary */}
                <div className="row">
                  <div className="col-md-6"></div>
                  <div className="col-md-6">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <tbody>
                        {[['Amount', fmt(baseAmount)], ['CGST', fmt(cgst)], ['SGST', fmt(sgst)]].map(([l, v]) => (
                          <tr key={l}><td style={{ padding: '0.5rem 0.75rem', color: 'var(--sand-700)', fontSize: '0.9rem', borderBottom: '1px solid var(--sand-200)' }}>{l}</td><td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', color: 'var(--sand-700)', fontSize: '0.9rem', borderBottom: '1px solid var(--sand-200)' }}>{v}</td></tr>
                        ))}
                        <tr>
                          <td style={{ padding: '0.85rem 0.75rem', fontWeight: '800', fontSize: '1.1rem', color: 'var(--sand-900)', borderTop: '3px solid var(--sand-600)' }}>Total (INR)</td>
                          <td style={{ padding: '0.85rem 0.75rem', textAlign: 'right', fontWeight: '800', fontSize: '1.1rem', color: 'var(--sand-900)', borderTop: '3px solid var(--sand-600)' }}>{fmt(order.totalAmount || 0)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--sand-200)', textAlign: 'center', color: 'var(--sand-500)', fontSize: '0.8rem' }}>
                  This is an electronically generated document, no signature is required.
                </div>
              </>);
            })()}
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
