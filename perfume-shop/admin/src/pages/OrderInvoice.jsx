import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseUrl, imageBaseUrl } from '../APIS/apis/config';
import { getSiteSettings } from '../APIS/apis/SiteSettingsApi';
import Cookies from 'js-cookie';

export default function OrderInvoice() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
    fetchSettings();
  }, [orderId]);

  const fetchSettings = async () => {
    try {
      const data = await getSiteSettings();
      setSiteSettings(data.data);
    } catch (error) {
      console.error('Failed to load site settings:', error);
    }
  };

  const fetchOrderDetails = async () => {
    try {
      const token = Cookies.get('authToken');
      const response = await axios.get(`${baseUrl}orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrder(response.data);
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
    <div style={{ background: 'var(--sand-50)', minHeight: '100vh', padding: '2rem 0' }}>
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
              cursor: 'pointer'
            }}
          >
            Print Invoice
          </button>
        </div>

        {/* Invoice Card */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '3rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          {/* Header */}
          <div style={{ borderBottom: '3px solid var(--sand-600)', paddingBottom: '2rem', marginBottom: '2rem' }}>
            <div className="row align-items-center">
              <div className="col-md-6">
                <h1 style={{
                  fontFamily: "'Playfair Display', serif",
                  color: 'var(--sand-800)',
                  fontSize: '2.5rem',
                  marginBottom: '0.5rem'
                }}>
                  INVOICE
                </h1>
                <p style={{ color: 'var(--sand-600)', fontSize: '0.9rem', margin: 0 }}>
                  Order #{order._id.slice(-8).toUpperCase()}
                </p>
              </div>
              <div className="col-md-6 text-md-end">
                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  color: 'var(--sand-700)',
                  fontSize: '1.8rem',
                  marginBottom: '0.5rem'
                }}>
                  {siteSettings?.siteName || 'Vamana Perfumes'}
                </h3>
                <p style={{ color: 'var(--sand-600)', fontSize: '0.9rem', margin: 0 }}>
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
            <div className="col-md-6">
              <h5 style={{ color: 'var(--sand-800)', fontWeight: '600', marginBottom: '1rem' }}>Bill To:</h5>
              <p style={{ color: 'var(--sand-700)', lineHeight: '1.8', margin: 0 }}>
                <strong>{order.userDetails?.name || 'Customer'}</strong><br />
                {order.userDetails?.email}<br />
                {order.userDetails?.phone}<br />
                {order.address?.street}, {order.address?.city}<br />
                {order.address?.state} - {order.address?.pincode}
              </p>
            </div>
            <div className="col-md-6">
              <h5 style={{ color: 'var(--sand-800)', fontWeight: '600', marginBottom: '1rem' }}>Order Details:</h5>
              <table style={{ width: '100%', color: 'var(--sand-700)' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '0.5rem 0' }}>Order Date:</td>
                    <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>
                      <strong>{new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem 0' }}>Payment Method:</td>
                    <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>
                      <strong>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem 0' }}>Payment Status:</td>
                    <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>
                      <span style={{
                        background: getStatusColor(order.paymentStatus),
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}>
                        {order.paymentStatus.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.5rem 0' }}>Tracking Status:</td>
                    <td style={{ padding: '0.5rem 0', textAlign: 'right' }}>
                      <strong>{getTrackingLabel(order.trackingStatus)}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Products Table */}
          <div style={{ marginBottom: '2rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--sand-100)', borderBottom: '2px solid var(--sand-300)' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--sand-800)', fontWeight: '600' }}>Product</th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--sand-800)', fontWeight: '600' }}>Quantity</th>
                  <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--sand-800)', fontWeight: '600' }}>Price</th>
                  <th style={{ padding: '1rem', textAlign: 'right', color: 'var(--sand-800)', fontWeight: '600' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid var(--sand-200)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div className="d-flex align-items-center gap-3">
                        {item.productDetails?.mainImage && (
                          <img
                            src={item.productDetails.mainImage}
                            alt={item.productDetails?.name}
                            style={{
                              width: '60px',
                              height: '60px',
                              objectFit: 'cover',
                              borderRadius: '8px'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <div style={{ color: 'var(--sand-800)', fontWeight: '500' }}>
                            {item.productDetails?.name || 'Product'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: 'var(--sand-700)' }}>
                      {item.quantity}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', color: 'var(--sand-700)' }}>
                      ₹{item.price.toLocaleString()}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right', color: 'var(--sand-800)', fontWeight: '600' }}>
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
                <table style={{ width: '100%' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '0.5rem 0', color: 'var(--sand-700)' }}>Subtotal:</td>
                      <td style={{ padding: '0.5rem 0', textAlign: 'right', color: 'var(--sand-700)' }}>
                        ₹{order.totalAmount.toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '0.5rem 0', color: 'var(--sand-700)' }}>Shipping:</td>
                      <td style={{ padding: '0.5rem 0', textAlign: 'right', color: 'var(--sand-700)' }}>
                        Free
                      </td>
                    </tr>
                    <tr style={{ borderTop: '2px solid var(--sand-600)' }}>
                      <td style={{ padding: '1rem 0', color: 'var(--sand-800)', fontSize: '1.3rem', fontWeight: '700' }}>
                        Total:
                      </td>
                      <td style={{ padding: '1rem 0', textAlign: 'right', color: 'var(--sand-800)', fontSize: '1.3rem', fontWeight: '700' }}>
                        ₹{order.totalAmount.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
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
            fontSize: '0.9rem'
          }}>
            <p style={{ margin: 0 }}>Thank you for your purchase!</p>
            <p style={{ margin: '0.5rem 0 0 0' }}>
              For any queries, contact us at {siteSettings?.email || 'support@vamana.com'} or call {siteSettings?.phone || '+91 1234567890'}
            </p>
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
          .sidebar, .topbar, nav, header, footer {
            display: none !important;
          }
          @page {
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  );
}
