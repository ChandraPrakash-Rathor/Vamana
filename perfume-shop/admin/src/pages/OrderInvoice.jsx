import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseUrl, imageBaseUrl } from '../APIS/apis/config';
import { getSiteSettings } from '../APIS/apis/SiteSettingsApi';
import Cookies from 'js-cookie';

// GST config — perfume/attar HSN 3303 = 28% GST (14% CGST + 14% SGST)
const GST_RATE = 28;
const HSN_CODE = '3303';

// Calculate base amount (pre-GST) and GST from total (GST-inclusive)
const calcGST = (totalWithGST) => {
  const base = totalWithGST / (1 + GST_RATE / 100);
  const gstAmount = totalWithGST - base;
  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;
  return { base, cgst, sgst, gstAmount };
};

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
      setOrder(response.data.data);
    } catch (error) {
      toast.error('Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner-border" style={{ color: 'var(--sand-600)' }} role="status" />
    </div>
  );

  if (!order) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--sand-600)', fontSize: '1.2rem' }}>Order not found</p>
    </div>
  );

  // GST calculations
  const subtotalWithGST = order.totalAmount || 0;
  const { base: baseAmount, cgst, sgst, gstAmount } = calcGST(subtotalWithGST);

  const invoiceNo = `INV-${order._id.slice(-6).toUpperCase()}`;
  const invoiceDate = new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const fmt = (n) => `₹${Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

  const thStyle = { padding: '0.75rem 1rem', textAlign: 'center', fontWeight: '600', fontSize: '0.88rem', whiteSpace: 'nowrap', background: 'var(--sand-800)', color: 'white' };
  const tdStyle = (align = 'center') => ({ padding: '0.75rem 1rem', textAlign: align, fontSize: '0.9rem', color: 'var(--sand-800)', borderBottom: '1px solid var(--sand-200)' });

  return (
    <div style={{ background: '#f3f4f6', minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container invoice-container" style={{ maxWidth: '860px' }}>

        {/* Action Buttons */}
        <div className="d-flex justify-content-end gap-2 mb-3 no-print">
          <button onClick={() => window.print()} style={{ padding: '0.65rem 1.8rem', background: 'var(--sand-700)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
            🖨 Print Invoice
          </button>
        </div>

        {/* Invoice Card */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '2.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>

          {/* Top: INVOICE title + No/Date + Logo */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', borderBottom: '3px solid var(--sand-600)', paddingBottom: '1.5rem' }}>
            <div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: '700', color: 'var(--sand-800)', marginBottom: '1rem' }}>INVOICE</h1>
              <table style={{ borderCollapse: 'collapse' }}>
                <tbody>
                  {[['Invoice No', invoiceNo], ['Invoice Date', invoiceDate]].map(([label, val]) => (
                    <tr key={label}>
                      <td style={{ color: 'var(--sand-600)', fontSize: '0.9rem', paddingRight: '1.5rem', paddingBottom: '0.3rem' }}>{label}</td>
                      <td style={{ fontWeight: '700', color: 'var(--sand-900)', fontSize: '0.9rem', paddingBottom: '0.3rem' }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ textAlign: 'right' }}>
              {siteSettings?.logo
                ? <img src={`${imageBaseUrl}${siteSettings.logo}`} alt="Logo" style={{ height: '70px', width: 'auto', objectFit: 'contain', borderRadius: '8px' }} />
                : <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: '700', color: 'var(--sand-800)' }}>{siteSettings?.siteName || 'Vamana Perfumes'}</div>
              }
            </div>
          </div>

          {/* Billed By / Billed To */}
          <div className="row mb-4">
            <div className="col-md-6 mb-3 mb-md-0">
              <div style={{ background: 'var(--sand-100)', borderRadius: '10px', padding: '1.25rem', borderLeft: '4px solid var(--sand-600)' }}>
                <p style={{ color: 'var(--sand-700)', fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Billed By</p>
                <p style={{ fontWeight: '700', color: 'var(--sand-900)', marginBottom: '0.3rem', fontSize: '0.95rem' }}>{siteSettings?.siteName || 'Vamana Perfumes'}</p>
                <p style={{ color: 'var(--sand-700)', fontSize: '0.88rem', marginBottom: '0.2rem' }}>{siteSettings?.address || 'Madhya Pradesh, India'}</p>
                <p style={{ color: 'var(--sand-700)', fontSize: '0.88rem', marginBottom: '0.2rem' }}><strong>GSTIN:</strong> {siteSettings?.gstin || '23DUQPG5822R1ZY'}</p>
                <p style={{ color: 'var(--sand-700)', fontSize: '0.88rem', marginBottom: 0 }}><strong>PAN:</strong> {siteSettings?.pan || 'DUQPG5822R'}</p>
              </div>
            </div>
            <div className="col-md-6">
              <div style={{ background: 'var(--sand-100)', borderRadius: '10px', padding: '1.25rem', borderLeft: '4px solid var(--sand-500)' }}>
                <p style={{ color: 'var(--sand-700)', fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Billed To</p>
                <p style={{ fontWeight: '700', color: 'var(--sand-900)', marginBottom: '0.3rem', fontSize: '0.95rem' }}>{order.userDetails?.name || (order.address?.firstName + ' ' + (order.address?.lastName || ''))}</p>
                <p style={{ color: 'var(--sand-700)', fontSize: '0.88rem', marginBottom: '0.2rem' }}>{order.address?.address || order.address?.street}</p>
                <p style={{ color: 'var(--sand-700)', fontSize: '0.88rem', marginBottom: '0.2rem' }}>{order.address?.city}, {order.address?.state}, India - {order.address?.pincode}</p>
                {order.userDetails?.phone && <p style={{ color: 'var(--sand-700)', fontSize: '0.88rem', marginBottom: 0 }}>{order.userDetails.phone}</p>}
              </div>
            </div>
          </div>

          {/* Country / Place of Supply */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.88rem', color: 'var(--sand-700)', borderBottom: '1px solid var(--sand-200)', paddingBottom: '0.75rem' }}>
            <span><strong>Country of Supply:</strong> India</span>
            <span><strong>Place of Supply:</strong> {order.address?.state || 'India'}</span>
          </div>

          {/* Items Table */}
          <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, textAlign: 'left' }}>Item</th>
                  <th style={thStyle}>GST Rate</th>
                  <th style={thStyle}>Quantity</th>
                  <th style={thStyle}>Rate</th>
                  <th style={thStyle}>Amount</th>
                  <th style={thStyle}>CGST</th>
                  <th style={thStyle}>SGST</th>
                  <th style={thStyle}>Total</th>
                </tr>
              </thead>
              <tbody>
                {(order.products || []).map((item, index) => {
                  const lineTotal = item.price * item.quantity;
                  const { base: lineBase, cgst: lineCgst, sgst: lineSgst } = calcGST(lineTotal);
                  return (
                    <tr key={index} style={{ background: index % 2 === 0 ? 'white' : 'var(--sand-50)' }}>
                      <td style={{ ...tdStyle('left') }}>
                        <div style={{ fontWeight: '600', color: 'var(--sand-900)' }}>{item.productDetails?.name || 'Product'}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--sand-500)' }}>HSN/SAC: {HSN_CODE}</div>
                      </td>
                      <td style={tdStyle()}>{GST_RATE}%</td>
                      <td style={tdStyle()}>{item.quantity}</td>
                      <td style={tdStyle()}>₹{item.price?.toLocaleString()}</td>
                      <td style={tdStyle()}>{fmt(lineBase)}</td>
                      <td style={tdStyle()}>{fmt(lineCgst)}</td>
                      <td style={tdStyle()}>{fmt(lineSgst)}</td>
                      <td style={{ ...tdStyle(), fontWeight: '700', color: 'var(--sand-900)' }}>{fmt(lineTotal)}</td>
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
                  {[['Amount', fmt(baseAmount)], ['CGST', fmt(cgst)], ['SGST', fmt(sgst)]].map(([label, val]) => (
                    <tr key={label}>
                      <td style={{ padding: '0.5rem 0.75rem', color: 'var(--sand-700)', fontSize: '0.9rem', borderBottom: '1px solid var(--sand-200)' }}>{label}</td>
                      <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', color: 'var(--sand-700)', fontSize: '0.9rem', borderBottom: '1px solid var(--sand-200)' }}>{val}</td>
                    </tr>
                  ))}
                  <tr>
                    <td style={{ padding: '1rem 0.75rem', fontWeight: '800', fontSize: '1.2rem', color: 'var(--sand-900)', borderTop: '3px solid var(--sand-600)' }}>Total (INR)</td>
                    <td style={{ padding: '1rem 0.75rem', textAlign: 'right', fontWeight: '800', fontSize: '1.2rem', color: 'var(--sand-900)', borderTop: '3px solid var(--sand-600)' }}>{fmt(subtotalWithGST)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--sand-200)', textAlign: 'center', color: 'var(--sand-500)', fontSize: '0.82rem' }}>
            This is an electronically generated document, no signature is required.
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .invoice-container, .invoice-container * { visibility: visible; }
          .invoice-container { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
          .sidebar, .topbar, nav, header, footer { display: none !important; }
          @page { margin: 1cm; }
        }
      `}</style>
    </div>
  );
}
