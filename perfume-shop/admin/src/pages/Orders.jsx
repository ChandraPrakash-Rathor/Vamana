import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, fetchOrderStats, updateOrderStatus, deleteOrder } from '../APIS/apis/OrderApi';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag, faCheckCircle, faClock, faTrash, faTruck, faChevronLeft, faChevronRight, faTimes, faFileInvoice } from '@fortawesome/free-solid-svg-icons';

export default function Orders() {
  const dispatch = useDispatch();
  const { orders, stats, loading } = useSelector(state => state.OrderSlice);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchOrderStats());
  }, [dispatch]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ id: orderId, paymentStatus: newStatus })).unwrap();
      toast.success('Payment status updated');
      dispatch(fetchOrders());
    } catch (error) {
      toast.error(error);
    }
  };

  const handleTrackingUpdate = async (trackingStatus) => {
    try {
      await dispatch(updateOrderStatus({ 
        id: selectedOrder._id, 
        trackingStatus 
      })).unwrap();
      toast.success('Tracking status updated');
      setShowTrackingModal(false);
      dispatch(fetchOrders());
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await dispatch(deleteOrder(orderId)).unwrap();
        toast.success('Order deleted');
      } catch (error) {
        toast.error(error);
      }
    }
  };

  const filteredOrders = (Array.isArray(orders) ? orders : []).filter(order => {
    if (filter === 'all') return true;
    return order.paymentStatus === filter;
  });

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getTrackingColor = (status) => {
    const colors = {
      ordered: '#6c757d',
      processing: '#ffc107',
      shipped: '#17a2b8',
      out_for_delivery: '#fd7e14',
      delivered: '#28a745'
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border" style={{ color: 'var(--sand-600)' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4" style={{ color: 'var(--sand-800)', fontWeight: '600' }}>Orders Management</h2>

      {/* Stats Cards */}
      {stats && (
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div style={{
              background: 'linear-gradient(135deg, var(--sand-600), var(--sand-700))',
              borderRadius: '12px',
              padding: '1.5rem',
              color: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div style={{ fontSize: '0.85rem', opacity: '0.9', marginBottom: '0.5rem' }}>Total Orders</div>
                  <div style={{ fontSize: '2rem', fontWeight: '700' }}>{stats.totalOrders}</div>
                </div>
                <FontAwesomeIcon icon={faShoppingBag} style={{ fontSize: '2.5rem', opacity: '0.3' }} />
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '12px',
              padding: '1.5rem',
              color: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div style={{ fontSize: '0.85rem', opacity: '0.9', marginBottom: '0.5rem' }}>Paid Orders</div>
                  <div style={{ fontSize: '2rem', fontWeight: '700' }}>{stats.paidOrders}</div>
                </div>
                <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '2.5rem', opacity: '0.3' }} />
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              borderRadius: '12px',
              padding: '1.5rem',
              color: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div style={{ fontSize: '0.85rem', opacity: '0.9', marginBottom: '0.5rem' }}>Pending Orders</div>
                  <div style={{ fontSize: '2rem', fontWeight: '700' }}>{stats.pendingOrders}</div>
                </div>
                <FontAwesomeIcon icon={faClock} style={{ fontSize: '2.5rem', opacity: '0.3' }} />
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div style={{
              background: 'linear-gradient(135deg, var(--sand-500), var(--sand-600))',
              borderRadius: '12px',
              padding: '1.5rem',
              color: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div>
                <div style={{ fontSize: '0.85rem', opacity: '0.9', marginBottom: '0.5rem' }}>Total Revenue</div>
                <div style={{ fontSize: '2rem', fontWeight: '700' }}>₹{stats.totalRevenue.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Buttons */}
      <div className="mb-4">
        {['all', 'paid', 'pending', 'failed'].map(status => (
          <button
            key={status}
            onClick={() => {
              setFilter(status);
              setCurrentPage(1);
            }}
            style={{
              padding: '0.5rem 1.5rem',
              marginRight: '0.75rem',
              border: filter === status ? 'none' : '2px solid var(--sand-300)',
              borderRadius: '8px',
              background: filter === status ? 'var(--sand-600)' : 'white',
              color: filter === status ? 'white' : 'var(--sand-700)',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (filter !== status) {
                e.target.style.background = 'var(--sand-100)';
              }
            }}
            onMouseLeave={(e) => {
              if (filter !== status) {
                e.target.style.background = 'white';
              }
            }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        <div className="table-responsive">
          <table className="table mb-0" style={{ borderCollapse: 'separate', borderSpacing: '0' }}>
            <thead>
              <tr style={{ background: 'var(--sand-100)', borderBottom: '2px solid var(--sand-200)' }}>
                <th style={{ padding: '1rem', color: 'var(--sand-800)', fontWeight: '600', fontSize: '0.9rem' }}>Order ID</th>
                <th style={{ padding: '1rem', color: 'var(--sand-800)', fontWeight: '600', fontSize: '0.9rem' }}>Customer</th>
                <th style={{ padding: '1rem', color: 'var(--sand-800)', fontWeight: '600', fontSize: '0.9rem' }}>Products</th>
                <th style={{ padding: '1rem', color: 'var(--sand-800)', fontWeight: '600', fontSize: '0.9rem' }}>Amount</th>
                <th style={{ padding: '1rem', color: 'var(--sand-800)', fontWeight: '600', fontSize: '0.9rem' }}>Payment</th>
                <th style={{ padding: '1rem', color: 'var(--sand-800)', fontWeight: '600', fontSize: '0.9rem' }}>Status</th>
                <th style={{ padding: '1rem', color: 'var(--sand-800)', fontWeight: '600', fontSize: '0.9rem' }}>Tracking</th>
                <th style={{ padding: '1rem', color: 'var(--sand-800)', fontWeight: '600', fontSize: '0.9rem' }}>Date</th>
                <th style={{ padding: '1rem', color: 'var(--sand-800)', fontWeight: '600', fontSize: '0.9rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => (
                <tr key={order._id} style={{
                  borderBottom: '1px solid var(--sand-200)',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--sand-50)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      background: 'var(--sand-100)',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      fontFamily: 'monospace',
                      color: 'var(--sand-700)'
                    }}>
                      #{order._id.slice(-8)}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: '500', color: 'var(--sand-800)' }}>
                        {order.userDetails?.name || 'N/A'}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--sand-600)' }}>
                        {order.userDetails?.email}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {(order.products || []).slice(0, 2).map((item, idx) => (
                      <div key={idx} style={{ fontSize: '0.85rem', color: 'var(--sand-700)', marginBottom: '0.25rem' }}>
                        {item.productDetails?.name || 'Product'} × {item.quantity}
                      </div>
                    ))}
                    {(order.products || []).length > 2 && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--sand-500)' }}>
                        +{order.products.length - 2} more
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ fontWeight: '600', color: 'var(--sand-800)', fontSize: '1rem' }}>
                      ₹{order.totalAmount.toLocaleString()}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      background: order.paymentMethod === 'cod' ? 'var(--sand-200)' : 'var(--sand-600)',
                      color: order.paymentMethod === 'cod' ? 'var(--sand-800)' : 'white',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: '500'
                    }}>
                      {order.paymentMethod === 'cod' ? 'COD' : 'Online'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <select
                      value={order.paymentStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      style={{
                        padding: '0.4rem 0.75rem',
                        borderRadius: '6px',
                        border: '2px solid var(--sand-300)',
                        background: order.paymentStatus === 'paid' ? '#10b981' : 
                                   order.paymentStatus === 'pending' ? '#f59e0b' : '#ef4444',
                        color: 'white',
                        fontWeight: '500',
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                    </select>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      background: getTrackingColor(order.trackingStatus),
                      color: 'white',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      display: 'inline-block'
                    }}>
                      {getTrackingLabel(order.trackingStatus)}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--sand-600)' }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div className="d-flex gap-2">
                      <button
                        onClick={() => window.open(`/orders/invoice/${order._id}`, '_blank')}
                        style={{
                          padding: '0.4rem 0.75rem',
                          border: 'none',
                          borderRadius: '6px',
                          background: '#10b981',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#059669'}
                        onMouseLeave={(e) => e.target.style.background = '#10b981'}
                      >
                        <FontAwesomeIcon icon={faFileInvoice} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowTrackingModal(true);
                        }}
                        style={{
                          padding: '0.4rem 0.75rem',
                          border: 'none',
                          borderRadius: '6px',
                          background: 'var(--sand-600)',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'var(--sand-700)'}
                        onMouseLeave={(e) => e.target.style.background = 'var(--sand-600)'}
                      >
                        <FontAwesomeIcon icon={faTruck} />
                      </button>
                      <button
                        onClick={() => handleDelete(order._id)}
                        style={{
                          padding: '0.4rem 0.75rem',
                          border: 'none',
                          borderRadius: '6px',
                          background: '#ef4444',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#dc2626'}
                        onMouseLeave={(e) => e.target.style.background = '#ef4444'}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {currentOrders.length === 0 && (
          <div className="text-center py-5">
            <p style={{ color: 'var(--sand-500)', fontSize: '1.1rem' }}>No orders found</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center gap-2 py-3" style={{ borderTop: '1px solid var(--sand-200)' }}>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                padding: '0.5rem 1rem',
                border: '2px solid var(--sand-300)',
                borderRadius: '8px',
                background: 'white',
                color: 'var(--sand-700)',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.5 : 1
              }}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                style={{
                  padding: '0.5rem 1rem',
                  border: currentPage === index + 1 ? 'none' : '2px solid var(--sand-300)',
                  borderRadius: '8px',
                  background: currentPage === index + 1 ? 'var(--sand-600)' : 'white',
                  color: currentPage === index + 1 ? 'white' : 'var(--sand-700)',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                padding: '0.5rem 1rem',
                border: '2px solid var(--sand-300)',
                borderRadius: '8px',
                background: 'white',
                color: 'var(--sand-700)',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.5 : 1
              }}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        )}
      </div>

      {/* Tracking Modal */}
      {showTrackingModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }} onClick={() => setShowTrackingModal(false)}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '2px solid var(--sand-200)'
            }}>
              <h4 style={{ color: 'var(--sand-800)', fontWeight: '600', margin: 0 }}>
                Update Order Tracking
              </h4>
              <button
                onClick={() => setShowTrackingModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  color: 'var(--sand-600)',
                  cursor: 'pointer',
                  padding: '0',
                  width: '30px',
                  height: '30px'
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            {selectedOrder && (
              <div>
                <p style={{ color: 'var(--sand-700)', marginBottom: '1rem' }}>
                  Order ID: <strong>#{selectedOrder._id.slice(-8)}</strong>
                </p>
                <p style={{ color: 'var(--sand-700)', marginBottom: '1.5rem' }}>
                  Current Status: <strong style={{ color: getTrackingColor(selectedOrder.trackingStatus) }}>
                    {getTrackingLabel(selectedOrder.trackingStatus)}
                  </strong>
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {['ordered', 'processing', 'shipped', 'out_for_delivery', 'delivered'].map(status => (
                    <button
                      key={status}
                      onClick={() => handleTrackingUpdate(status)}
                      disabled={selectedOrder.trackingStatus === status}
                      style={{
                        padding: '0.75rem',
                        border: 'none',
                        borderRadius: '8px',
                        background: selectedOrder.trackingStatus === status ? 'var(--sand-300)' : getTrackingColor(status),
                        color: 'white',
                        fontWeight: '500',
                        cursor: selectedOrder.trackingStatus === status ? 'not-allowed' : 'pointer',
                        opacity: selectedOrder.trackingStatus === status ? 0.6 : 1,
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedOrder.trackingStatus !== status) {
                          e.target.style.opacity = '0.9';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedOrder.trackingStatus !== status) {
                          e.target.style.opacity = '1';
                        }
                      }}
                    >
                      {getTrackingLabel(status)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
