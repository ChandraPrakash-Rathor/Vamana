import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseUrl } from '../redux/apis/config';

const TRACKING_STEPS = ['ordered', 'processing', 'shipped', 'out_for_delivery', 'delivered'];

const TRACKING_LABELS = {
  ordered: 'Ordered', processing: 'Processing', shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery', delivered: 'Delivered'
};

const TRACKING_ICONS = {
  ordered: '🛒', processing: '⚙️', shipped: '📦', out_for_delivery: '🚚', delivered: '✅'
};

const STATUS_COLOR = {
  pending: { bg: '#fff7ed', text: '#c2410c', dot: '#f97316' },
  paid:    { bg: '#f0fdf4', text: '#15803d', dot: '#22c55e' },
  failed:  { bg: '#fef2f2', text: '#b91c1c', dot: '#ef4444' },
};

const TRACKING_COLOR = {
  ordered:          '#94a3b8',
  processing:       '#f59e0b',
  shipped:          '#3b82f6',
  out_for_delivery: '#8b5cf6',
  delivered:        '#10b981',
};

export default function MyOrders() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.AuthSlice);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/'); return; }
    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('memberToken');
      const res = await axios.get(`${baseUrl}orders`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.data.success) setOrders(res.data.orders);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  const stepIndex = (status) => TRACKING_STEPS.indexOf(status);

  return (
    <div style={{ backgroundColor: 'var(--sand-50)', minHeight: '100vh', paddingTop: '100px', paddingBottom: '4rem' }}>
      <div className="container" style={{ maxWidth: '860px' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--sand-500)', fontSize: '0.9rem', cursor: 'pointer', padding: 0, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            ← Back
          </button>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--sand-900)', margin: 0, fontSize: '2rem', fontWeight: '700' }}>
            My Orders
          </h2>
          {!loading && orders.length > 0 && (
            <p style={{ color: 'var(--sand-500)', margin: '0.3rem 0 0', fontSize: '0.9rem' }}>
              {orders.length} order{orders.length > 1 ? 's' : ''} placed
            </p>
          )}
        </div>

        {/* Loading */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--sand-100)', animation: 'pulse 1.5s infinite' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ height: '14px', width: '40%', background: 'var(--sand-100)', borderRadius: '6px', marginBottom: '8px', animation: 'pulse 1.5s infinite' }} />
                    <div style={{ height: '12px', width: '25%', background: 'var(--sand-100)', borderRadius: '6px', animation: 'pulse 1.5s infinite' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          /* Empty State */
          <div style={{ background: 'white', borderRadius: '20px', padding: '5rem 2rem', textAlign: 'center', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1.5rem', lineHeight: 1 }}>🛍️</div>
            <h4 style={{ color: 'var(--sand-800)', fontFamily: "'Playfair Display', serif", marginBottom: '0.5rem', fontSize: '1.5rem' }}>No orders yet</h4>
            <p style={{ color: 'var(--sand-500)', marginBottom: '2rem', fontSize: '0.95rem' }}>Looks like you haven't placed any orders. Let's fix that!</p>
            <Link to="/catalog" style={{ padding: '0.8rem 2.5rem', backgroundColor: 'var(--sand-600)', color: 'white', borderRadius: '12px', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem' }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map(order => {
              const isOpen = expanded === order._id;
              const sColor = STATUS_COLOR[order.paymentStatus] || { bg: '#f8fafc', text: '#64748b', dot: '#94a3b8' };
              const tColor = TRACKING_COLOR[order.trackingStatus] || '#94a3b8';
              const tStep = stepIndex(order.trackingStatus);

              return (
                <div key={order._id} style={{ background: 'white', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden', transition: 'box-shadow 0.2s' }}>

                  {/* Top color bar based on tracking */}
                  <div style={{ height: '3px', background: `linear-gradient(90deg, ${tColor}, ${tColor}88)` }} />

                  {/* Main row */}
                  <div style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>

                      {/* Left: order info */}
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: tColor + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                          {TRACKING_ICONS[order.trackingStatus] || '📦'}
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', color: 'var(--sand-900)', fontSize: '0.95rem', letterSpacing: '0.02em' }}>
                            #{order._id.slice(-8).toUpperCase()}
                          </div>
                          <div style={{ color: 'var(--sand-500)', fontSize: '0.82rem', marginTop: '0.15rem' }}>
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            &nbsp;·&nbsp;{order.products?.length} item{order.products?.length > 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>

                      {/* Right: badges + amount */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                          {/* Payment badge */}
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.7rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', background: sColor.bg, color: sColor.text }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: sColor.dot, display: 'inline-block' }} />
                            {order.paymentMethod === 'cod' ? 'COD' : order.paymentStatus?.toUpperCase()}
                          </span>
                          {/* Tracking badge */}
                          <span style={{ padding: '0.25rem 0.7rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', background: tColor + '18', color: tColor }}>
                            {TRACKING_LABELS[order.trackingStatus] || order.trackingStatus}
                          </span>
                        </div>
                        <div style={{ fontWeight: '800', color: 'var(--sand-900)', fontSize: '1.1rem' }}>
                          ₹{order.totalAmount?.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Tracking progress bar */}
                    <div style={{ marginTop: '1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                        {TRACKING_STEPS.map((step, i) => {
                          const done = i <= tStep;
                          const active = i === tStep;
                          return (
                            <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                              {/* connector line */}
                              {i < TRACKING_STEPS.length - 1 && (
                                <div style={{ position: 'absolute', top: '10px', left: '50%', width: '100%', height: '2px', background: i < tStep ? tColor : 'var(--sand-200)', zIndex: 0, transition: 'background 0.3s' }} />
                              )}
                              {/* dot */}
                              <div style={{ width: active ? '22px' : '18px', height: active ? '22px' : '18px', borderRadius: '50%', background: done ? tColor : 'var(--sand-200)', border: active ? `3px solid ${tColor}` : 'none', boxShadow: active ? `0 0 0 3px ${tColor}22` : 'none', zIndex: 1, transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {done && !active && <span style={{ color: 'white', fontSize: '0.6rem' }}>✓</span>}
                              </div>
                              {/* label */}
                              <div style={{ fontSize: '0.65rem', color: done ? tColor : 'var(--sand-400)', fontWeight: active ? '700' : '500', marginTop: '0.35rem', textAlign: 'center', lineHeight: 1.2 }}>
                                {TRACKING_LABELS[step]}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Actions row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--sand-100)' }}>
                      <button onClick={() => setExpanded(isOpen ? null : order._id)} style={{ background: 'none', border: 'none', color: 'var(--sand-500)', fontSize: '0.85rem', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        {isOpen ? '▲ Hide items' : '▼ Show items'}
                      </button>
                      <Link to={`/invoice/${order._id}`} style={{ padding: '0.5rem 1.25rem', backgroundColor: 'var(--sand-700)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '0.85rem' }}>
                        View Invoice
                      </Link>
                    </div>
                  </div>

                  {/* Expandable items */}
                  {isOpen && (
                    <div style={{ borderTop: '1px solid var(--sand-100)', padding: '1rem 1.5rem', background: 'var(--sand-50)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {order.products?.map((item, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          {item.productDetails?.mainImage && (
                            <img src={item.productDetails.mainImage} alt={item.productDetails?.name}
                              style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                              onError={e => e.target.style.display = 'none'} />
                          )}
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--sand-900)' }}>{item.productDetails?.name || 'Product'}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--sand-500)' }}>Qty: {item.quantity}</div>
                          </div>
                          <div style={{ fontWeight: '700', color: 'var(--sand-800)', fontSize: '0.9rem' }}>₹{(item.price * item.quantity)?.toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
