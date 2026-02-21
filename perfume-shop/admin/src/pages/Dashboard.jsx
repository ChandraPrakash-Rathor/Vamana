import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingCart,
  faBox,
  faUsers,
  faRupeeSign,
  faArrowTrendUp,
  faClock
} from '@fortawesome/free-solid-svg-icons';

export default function Dashboard() {
  const stats = [
    {
      title: 'Total Revenue',
      value: '₹2,45,890',
      change: '+12.5%',
      icon: faRupeeSign,
      gradient: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
      bgGradient: 'linear-gradient(135deg, rgba(40, 167, 69, 0.1) 0%, rgba(32, 201, 151, 0.1) 100%)'
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: '+8.2%',
      icon: faShoppingCart,
      gradient: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
      bgGradient: 'linear-gradient(135deg, rgba(0, 123, 255, 0.1) 0%, rgba(0, 86, 179, 0.1) 100%)'
    },
    {
      title: 'Total Products',
      value: '156',
      change: '+3',
      icon: faBox,
      gradient: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
      bgGradient: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 152, 0, 0.1) 100%)'
    },
    {
      title: 'Total Users',
      value: '892',
      change: '+15.3%',
      icon: faUsers,
      gradient: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)',
      bgGradient: 'linear-gradient(135deg, rgba(23, 162, 184, 0.1) 0%, rgba(19, 132, 150, 0.1) 100%)'
    }
  ];

  const recentOrders = [
    { id: 'VN001234', customer: 'Rahul Sharma', product: 'Eternal Rose', amount: '₹2,499', status: 'Delivered', date: '2024-02-15' },
    { id: 'VN001235', customer: 'Priya Patel', product: 'Midnight Oud', amount: '₹3,999', status: 'Shipped', date: '2024-02-16' },
    { id: 'VN001236', customer: 'Amit Kumar', product: 'Ocean Breeze', amount: '₹1,999', status: 'Processing', date: '2024-02-17' },
    { id: 'VN001237', customer: 'Sneha Reddy', product: 'Golden Amber', amount: '₹2,799', status: 'Pending', date: '2024-02-17' },
    { id: 'VN001238', customer: 'Vikram Singh', product: 'Royal Musk', amount: '₹4,499', status: 'Delivered', date: '2024-02-17' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return '#28a745';
      case 'Shipped': return '#007bff';
      case 'Processing': return '#ffc107';
      case 'Pending': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-4 mb-md-5" style={{ animation: 'fadeInDown 0.6s ease-out' }}>
        <h2 className="mb-2" style={{
          color: 'var(--sand-900)',
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
          fontWeight: '700'
        }}>
          Dashboard
        </h2>
        <p className="mb-0" style={{ 
          color: 'var(--sand-700)', 
          fontSize: 'clamp(0.9rem, 2vw, 1rem)',
          fontWeight: '500'
        }}>
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 g-md-4 mb-4 mb-md-5">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="col-6 col-lg-3"
            style={{
              animation: `slideInUp 0.6s ease-out ${index * 0.1}s backwards`
            }}
          >
            <div className="h-100" style={{
              background: stat.bgGradient,
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
              {/* Decorative Circle */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: stat.gradient,
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
                    {stat.title}
                  </p>
                  <h3 className="mb-0" style={{
                    fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                    fontWeight: '800',
                    background: stat.gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {stat.value}
                  </h3>
                </div>
                <div className="d-none d-sm-flex align-items-center justify-content-center" style={{
                  width: 'clamp(45px, 8vw, 60px)',
                  height: 'clamp(45px, 8vw, 60px)',
                  borderRadius: '16px',
                  background: stat.gradient,
                  fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                  color: 'white',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                  animation: 'float 3s ease-in-out infinite'
                }}>
                  <FontAwesomeIcon icon={stat.icon} />
                </div>
              </div>
              <div className="d-flex align-items-center gap-2 position-relative" style={{
                fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
                color: '#28a745',
                fontWeight: '600'
              }}>
                <FontAwesomeIcon icon={faArrowTrendUp} />
                <span className="d-none d-sm-inline">{stat.change} from last month</span>
                <span className="d-sm-none">{stat.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-4 p-3 p-md-4 shadow-sm" style={{
        animation: 'slideInUp 0.6s ease-out 0.4s backwards'
      }}>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 mb-md-4 pb-3 border-bottom border-2">
          <div className="mb-3 mb-md-0">
            <h4 className="mb-1" style={{
              color: 'var(--sand-900)',
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
              fontWeight: '700'
            }}>
              Recent Orders
            </h4>
            <p className="mb-0 d-none d-md-block" style={{
              color: 'var(--sand-600)',
              fontSize: '0.9rem'
            }}>
              Latest transactions from your store
            </p>
          </div>
          <button className="btn btn-primary px-3 px-md-4 py-2" style={{
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--sand-600) 0%, var(--sand-700) 100%)',
            border: 'none',
            fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(179, 135, 63, 0.3)',
            transition: 'all 0.3s ease'
          }}>
            <span className="d-none d-sm-inline">View All Orders</span>
            <span className="d-sm-none">View All</span>
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr className="bg-light">
                <th className="px-3 py-3 text-uppercase fw-bold" style={{
                  color: 'var(--sand-800)',
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                  letterSpacing: '0.5px',
                  borderRadius: '12px 0 0 12px'
                }}>Order ID</th>
                <th className="px-3 py-3 text-uppercase fw-bold d-none d-md-table-cell" style={{
                  color: 'var(--sand-800)',
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                  letterSpacing: '0.5px'
                }}>Customer</th>
                <th className="px-3 py-3 text-uppercase fw-bold" style={{
                  color: 'var(--sand-800)',
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                  letterSpacing: '0.5px'
                }}>Product</th>
                <th className="px-3 py-3 text-uppercase fw-bold" style={{
                  color: 'var(--sand-800)',
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                  letterSpacing: '0.5px'
                }}>Amount</th>
                <th className="px-3 py-3 text-uppercase fw-bold" style={{
                  color: 'var(--sand-800)',
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                  letterSpacing: '0.5px'
                }}>Status</th>
                <th className="px-3 py-3 text-uppercase fw-bold d-none d-lg-table-cell" style={{
                  color: 'var(--sand-800)',
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                  letterSpacing: '0.5px',
                  borderRadius: '0 12px 12px 0'
                }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
                <tr key={index} className="border-0" style={{
                  backgroundColor: 'var(--sand-100)',
                  cursor: 'pointer',
                  animation: `fadeIn 0.5s ease-out ${index * 0.1}s backwards`
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
                  }}>{order.customer}</td>
                  <td className="px-3 py-3" style={{
                    color: 'var(--sand-800)',
                    fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)'
                  }}>{order.product}</td>
                  <td className="px-3 py-3 fw-bold" style={{
                    color: 'var(--sand-900)',
                    fontSize: 'clamp(0.85rem, 1.5vw, 1rem)'
                  }}>{order.amount}</td>
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
                  <td className="px-3 py-3 d-none d-lg-table-cell" style={{
                    color: 'var(--sand-700)',
                    fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
                    borderRadius: '0 12px 12px 0'
                  }}>
                    <FontAwesomeIcon icon={faClock} className="me-2" style={{ color: 'var(--sand-600)' }} />
                    {order.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

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
