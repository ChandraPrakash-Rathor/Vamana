import { useState } from 'react';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShoppingCart, faRupeeSign, faClock, faCheckCircle,
  faSearch, faFilter, faEye, faEdit, faTrash, faTruck
} from '@fortawesome/free-solid-svg-icons';
import ViewOrderModal from '../components/modals/ViewOrderModal';

export default function Orders() {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [viewOrderModal, setViewOrderModal] = useState({ isOpen: false, order: null });
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('desc');

  // Sample orders data
  const orders = [
    { id: 'VN001234', customer: 'Rahul Sharma', email: 'rahul@example.com', product: 'Eternal Rose', quantity: 2, amount: 4998, status: 'Delivered', date: '2024-02-15', payment: 'Paid' },
    { id: 'VN001235', customer: 'Priya Patel', email: 'priya@example.com', product: 'Midnight Oud', quantity: 1, amount: 3999, status: 'Shipped', date: '2024-02-16', payment: 'Paid' },
    { id: 'VN001236', customer: 'Amit Kumar', email: 'amit@example.com', product: 'Ocean Breeze', quantity: 3, amount: 5997, status: 'Processing', date: '2024-02-17', payment: 'Paid' },
    { id: 'VN001237', customer: 'Sneha Reddy', email: 'sneha@example.com', product: 'Golden Amber', quantity: 1, amount: 2799, status: 'Pending', date: '2024-02-17', payment: 'Pending' },
    { id: 'VN001238', customer: 'Vikram Singh', email: 'vikram@example.com', product: 'Royal Musk', quantity: 2, amount: 8998, status: 'Delivered', date: '2024-02-17', payment: 'Paid' },
    { id: 'VN001239', customer: 'Anjali Gupta', email: 'anjali@example.com', product: 'Jasmine Essence', quantity: 1, amount: 1899, status: 'Cancelled', date: '2024-02-18', payment: 'Refunded' },
    { id: 'VN001240', customer: 'Rohan Mehta', email: 'rohan@example.com', product: 'Velvet Night', quantity: 2, amount: 6598, status: 'Shipped', date: '2024-02-18', payment: 'Paid' },
    { id: 'VN001241', customer: 'Kavya Iyer', email: 'kavya@example.com', product: 'Luxury Combo Pack', quantity: 1, amount: 5999, status: 'Processing', date: '2024-02-18', payment: 'Paid' }
  ];

  // Calculate stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => order.payment === 'Paid' ? sum + order.amount : sum, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
  const completedOrders = orders.filter(o => o.status === 'Delivered').length;

  // Status options for filter
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  // Custom styles for react-select
  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: '10px',
      border: '2px solid var(--sand-300)',
      padding: '0.3rem',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(179, 135, 63, 0.1)' : 'none',
      borderColor: state.isFocused ? 'var(--sand-600)' : 'var(--sand-300)',
      '&:hover': {
        borderColor: 'var(--sand-600)'
      }
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? 'var(--sand-600)' : state.isFocused ? 'var(--sand-200)' : 'white',
      color: state.isSelected ? 'white' : 'var(--sand-900)',
      cursor: 'pointer',
      padding: '0.8rem 1rem'
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: 9999
    })
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const statusMatch = !selectedStatus || selectedStatus.value === 'all' || order.status.toLowerCase() === selectedStatus.value;
    const searchMatch = !searchQuery || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle string sorting
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort icon
  const getSortIcon = (field) => {
    if (sortField !== field) return '⇅';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  // Get status color
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

  // Get payment status color
  const getPaymentColor = (payment) => {
    switch (payment) {
      case 'Paid': return '#28a745';
      case 'Pending': return '#ffc107';
      case 'Refunded': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-4">
        <h2 className="mb-2" style={{
          color: 'var(--sand-900)',
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
          fontWeight: '700'
        }}>
          Orders Management
        </h2>
        <p className="mb-0" style={{ 
          color: 'var(--sand-700)', 
          fontSize: 'clamp(0.9rem, 2vw, 1rem)',
          fontWeight: '500'
        }}>
          Track and manage all customer orders
        </p>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 g-md-4 mb-4">
        {/* Total Orders */}
        <div className="col-6 col-lg-3">
          <div className="h-100" style={{
            background: 'linear-gradient(135deg, rgba(0, 123, 255, 0.1) 0%, rgba(0, 86, 179, 0.1) 100%)',
            borderRadius: '16px',
            padding: 'clamp(1rem, 3vw, 1.8rem)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
              opacity: 0.1,
              animation: 'pulse 3s ease-in-out infinite'
            }} />
            
            <div className="d-flex justify-content-between align-items-start mb-3 position-relative">
              <div className="flex-grow-1">
                <p className="mb-2 text-uppercase" style={{
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)',
                  color: 'var(--sand-700)',
                  fontWeight: '600',
                  letterSpacing: '0.5px'
                }}>
                  Total Orders
                </p>
                <h3 className="mb-0" style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {totalOrders}
                </h3>
              </div>
              <div className="d-none d-sm-flex align-items-center justify-content-center" style={{
                width: 'clamp(45px, 8vw, 60px)',
                height: 'clamp(45px, 8vw, 60px)',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                color: 'white',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                animation: 'float 3s ease-in-out infinite'
              }}>
                <FontAwesomeIcon icon={faShoppingCart} />
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 position-relative" style={{
              fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
              color: 'var(--sand-700)',
              fontWeight: '600'
            }}>
              All time orders
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="col-6 col-lg-3">
          <div className="h-100" style={{
            background: 'linear-gradient(135deg, rgba(40, 167, 69, 0.1) 0%, rgba(32, 201, 151, 0.1) 100%)',
            borderRadius: '16px',
            padding: 'clamp(1rem, 3vw, 1.8rem)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              opacity: 0.1,
              animation: 'pulse 3s ease-in-out infinite'
            }} />
            
            <div className="d-flex justify-content-between align-items-start mb-3 position-relative">
              <div className="flex-grow-1">
                <p className="mb-2 text-uppercase" style={{
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)',
                  color: 'var(--sand-700)',
                  fontWeight: '600',
                  letterSpacing: '0.5px'
                }}>
                  Total Revenue
                </p>
                <h3 className="mb-0" style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  ₹{(totalRevenue / 1000).toFixed(1)}K
                </h3>
              </div>
              <div className="d-none d-sm-flex align-items-center justify-content-center" style={{
                width: 'clamp(45px, 8vw, 60px)',
                height: 'clamp(45px, 8vw, 60px)',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                color: 'white',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                animation: 'float 3s ease-in-out infinite'
              }}>
                <FontAwesomeIcon icon={faRupeeSign} />
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 position-relative" style={{
              fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
              color: 'var(--sand-700)',
              fontWeight: '600'
            }}>
              From paid orders
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="col-6 col-lg-3">
          <div className="h-100" style={{
            background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 152, 0, 0.1) 100%)',
            borderRadius: '16px',
            padding: 'clamp(1rem, 3vw, 1.8rem)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
              opacity: 0.1,
              animation: 'pulse 3s ease-in-out infinite'
            }} />
            
            <div className="d-flex justify-content-between align-items-start mb-3 position-relative">
              <div className="flex-grow-1">
                <p className="mb-2 text-uppercase" style={{
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)',
                  color: 'var(--sand-700)',
                  fontWeight: '600',
                  letterSpacing: '0.5px'
                }}>
                  Pending Orders
                </p>
                <h3 className="mb-0" style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {pendingOrders}
                </h3>
              </div>
              <div className="d-none d-sm-flex align-items-center justify-content-center" style={{
                width: 'clamp(45px, 8vw, 60px)',
                height: 'clamp(45px, 8vw, 60px)',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                color: 'white',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                animation: 'float 3s ease-in-out infinite'
              }}>
                <FontAwesomeIcon icon={faClock} />
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 position-relative" style={{
              fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
              color: 'var(--sand-700)',
              fontWeight: '600'
            }}>
              Awaiting processing
            </div>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="col-6 col-lg-3">
          <div className="h-100" style={{
            background: 'linear-gradient(135deg, rgba(23, 162, 184, 0.1) 0%, rgba(19, 132, 150, 0.1) 100%)',
            borderRadius: '16px',
            padding: 'clamp(1rem, 3vw, 1.8rem)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
              opacity: 0.1,
              animation: 'pulse 3s ease-in-out infinite'
            }} />
            
            <div className="d-flex justify-content-between align-items-start mb-3 position-relative">
              <div className="flex-grow-1">
                <p className="mb-2 text-uppercase" style={{
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)',
                  color: 'var(--sand-700)',
                  fontWeight: '600',
                  letterSpacing: '0.5px'
                }}>
                  Completed
                </p>
                <h3 className="mb-0" style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {completedOrders}
                </h3>
              </div>
              <div className="d-none d-sm-flex align-items-center justify-content-center" style={{
                width: 'clamp(45px, 8vw, 60px)',
                height: 'clamp(45px, 8vw, 60px)',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                color: 'white',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                animation: 'float 3s ease-in-out infinite'
              }}>
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 position-relative" style={{
              fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
              color: 'var(--sand-700)',
              fontWeight: '600'
            }}>
              Successfully delivered
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="card border-0 shadow-sm" style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: 'clamp(1.5rem, 3vw, 2rem)'
      }}>
        {/* Filters Section */}
        <div className="mb-4 pb-4" style={{ borderBottom: '2px solid var(--sand-200)' }}>
          <div className="row g-3 align-items-end">
            {/* Search Bar */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold mb-2" style={{ 
                color: 'var(--sand-900)', 
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FontAwesomeIcon icon={faSearch} style={{ color: 'var(--sand-600)' }} />
                Search Orders
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by order ID, customer, or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  paddingLeft: '1rem',
                  paddingRight: '1rem',
                  paddingTop: '0.75rem',
                  paddingBottom: '0.75rem',
                  borderRadius: '10px',
                  border: '2px solid var(--sand-300)',
                  fontSize: '0.95rem',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--sand-600)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(179, 135, 63, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--sand-300)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Status Filter */}
            <div className="col-12 col-md-3">
              <label className="form-label fw-semibold mb-2" style={{ 
                color: 'var(--sand-900)', 
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FontAwesomeIcon icon={faFilter} style={{ color: 'var(--sand-600)' }} />
                Status
              </label>
              <Select
                options={statusOptions}
                value={selectedStatus}
                onChange={setSelectedStatus}
                placeholder="All Status"
                styles={customSelectStyles}
                isClearable
              />
            </div>

            {/* Results Count */}
            <div className="col-12 col-md-3">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <span style={{ color: 'var(--sand-700)', fontSize: '0.95rem', fontWeight: '500' }}>
                  Showing {sortedOrders.length} of {orders.length} orders
                </span>
                {(searchQuery || selectedStatus) && (
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedStatus(null);
                    }}
                    style={{
                      padding: '0.4rem 1rem',
                      borderRadius: '8px',
                      backgroundColor: 'var(--sand-200)',
                      border: 'none',
                      color: 'var(--sand-900)',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--sand-300)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--sand-200)';
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr className="bg-light">
                <th 
                  className="px-3 py-3 text-uppercase fw-bold" 
                  style={{
                    color: 'var(--sand-800)',
                    fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                    letterSpacing: '0.5px',
                    borderRadius: '12px 0 0 12px',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                  onClick={() => handleSort('id')}
                >
                  Order ID {getSortIcon('id')}
                </th>
                <th 
                  className="px-3 py-3 text-uppercase fw-bold d-none d-md-table-cell" 
                  style={{
                    color: 'var(--sand-800)',
                    fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                  onClick={() => handleSort('customer')}
                >
                  Customer {getSortIcon('customer')}
                </th>
                <th 
                  className="px-3 py-3 text-uppercase fw-bold" 
                  style={{
                    color: 'var(--sand-800)',
                    fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                  onClick={() => handleSort('product')}
                >
                  Product {getSortIcon('product')}
                </th>
                <th 
                  className="px-3 py-3 text-uppercase fw-bold d-none d-lg-table-cell" 
                  style={{
                    color: 'var(--sand-800)',
                    fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                  onClick={() => handleSort('quantity')}
                >
                  Qty {getSortIcon('quantity')}
                </th>
                <th 
                  className="px-3 py-3 text-uppercase fw-bold" 
                  style={{
                    color: 'var(--sand-800)',
                    fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                  onClick={() => handleSort('amount')}
                >
                  Amount {getSortIcon('amount')}
                </th>
                <th 
                  className="px-3 py-3 text-uppercase fw-bold" 
                  style={{
                    color: 'var(--sand-800)',
                    fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                  onClick={() => handleSort('status')}
                >
                  Status {getSortIcon('status')}
                </th>
                <th className="px-3 py-3 text-uppercase fw-bold d-none d-xl-table-cell" style={{
                  color: 'var(--sand-800)',
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                  letterSpacing: '0.5px'
                }}>Payment</th>
                <th className="px-3 py-3 text-uppercase fw-bold" style={{
                  color: 'var(--sand-800)',
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                  letterSpacing: '0.5px',
                  borderRadius: '0 12px 12px 0'
                }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order, index) => (
                <tr key={index} className="border-0" style={{
                  backgroundColor: 'var(--sand-100)',
                  cursor: 'pointer'
                }}>
                  <td className="px-3 py-3 fw-bold font-monospace" style={{
                    color: 'var(--sand-900)',
                    fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
                    borderRadius: '12px 0 0 12px'
                  }}>{order.id}</td>
                  <td className="px-3 py-3 d-none d-md-table-cell" style={{
                    color: 'var(--sand-800)',
                    fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)',
                    fontWeight: '500'
                  }}>
                    <div>{order.customer}</div>
                    <small style={{ color: 'var(--sand-600)' }}>{order.email}</small>
                  </td>
                  <td className="px-3 py-3" style={{
                    color: 'var(--sand-800)',
                    fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)'
                  }}>{order.product}</td>
                  <td className="px-3 py-3 d-none d-lg-table-cell" style={{
                    color: 'var(--sand-800)',
                    fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)',
                    fontWeight: '600'
                  }}>{order.quantity}</td>
                  <td className="px-3 py-3 fw-bold" style={{
                    color: 'var(--sand-900)',
                    fontSize: 'clamp(0.85rem, 1.5vw, 1rem)'
                  }}>₹{order.amount.toLocaleString()}</td>
                  <td className="px-3 py-3">
                    <span className="badge rounded-pill px-2 px-md-3 py-2 text-uppercase fw-bold" style={{
                      fontSize: 'clamp(0.65rem, 1.2vw, 0.8rem)',
                      backgroundColor: `${getStatusColor(order.status)}20`,
                      color: getStatusColor(order.status),
                      letterSpacing: '0.5px',
                      border: `2px solid ${getStatusColor(order.status)}40`
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 d-none d-xl-table-cell">
                    <span className="badge rounded-pill px-3 py-2 text-uppercase fw-bold" style={{
                      fontSize: '0.75rem',
                      backgroundColor: `${getPaymentColor(order.payment)}20`,
                      color: getPaymentColor(order.payment),
                      letterSpacing: '0.5px',
                      border: `2px solid ${getPaymentColor(order.payment)}40`
                    }}>
                      {order.payment}
                    </span>
                  </td>
                  <td className="px-3 py-3" style={{ borderRadius: '0 12px 12px 0' }}>
                    <div className="d-flex gap-2">
                      <button 
                        onClick={() => setViewOrderModal({ isOpen: true, order })}
                        className="btn btn-sm" style={{
                        backgroundColor: 'var(--sand-200)',
                        border: 'none',
                        color: 'var(--sand-900)',
                        padding: '0.4rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--sand-300)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--sand-200)';
                      }}>
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button className="btn btn-sm d-none d-sm-inline" style={{
                        backgroundColor: '#007bff20',
                        border: 'none',
                        color: '#007bff',
                        padding: '0.4rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#007bff40';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#007bff20';
                      }}>
                        <FontAwesomeIcon icon={faTruck} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* No Results */}
        {sortedOrders.length === 0 && (
          <div className="text-center py-5">
            <div className="mb-4" style={{ fontSize: '5rem', opacity: 0.2 }}>📦</div>
            <h4 className="mb-2" style={{ 
              color: 'var(--sand-900)', 
              fontFamily: "'Playfair Display', serif",
              fontWeight: '700'
            }}>
              No orders found
            </h4>
            <p className="mb-4" style={{ color: 'var(--sand-700)' }}>
              Try adjusting your filters or search query
            </p>
            <button 
              className="btn"
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus(null);
              }}
              style={{
                padding: '0.8rem 2rem',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--sand-600) 0%, var(--sand-700) 100%)',
                border: 'none',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
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
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* View Order Modal */}
      <ViewOrderModal 
        isOpen={viewOrderModal.isOpen}
        onClose={() => setViewOrderModal({ isOpen: false, order: null })}
        order={viewOrderModal.order}
      />

      {/* Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.15;
          }
        }
      `}</style>
    </div>
  );
}
