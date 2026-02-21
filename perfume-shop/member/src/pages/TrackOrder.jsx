import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faBox, 
  faTruck, 
  faCheckCircle,
  faMapMarkerAlt,
  faCalendar,
  faPhone
} from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '../components/common/Breadcrumb';

export default function TrackOrder() {
  const [trackingResult, setTrackingResult] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleTrack = (data) => {
    const formData = new FormData();
    formData.append('orderId', data.orderId);
    
    console.log('Track Order Form Data:', Object.fromEntries(formData));
    
    // Simulate tracking result
    setTrackingResult({
      orderId: data.orderId,
        status: 'In Transit',
        estimatedDelivery: 'Dec 25, 2024',
        currentLocation: 'Mumbai Distribution Center',
        timeline: [
          { 
            status: 'Order Placed', 
            date: 'Dec 20, 2024 10:30 AM', 
            location: 'Mumbai',
            completed: true,
            icon: faCheckCircle
          },
          { 
            status: 'Order Confirmed', 
            date: 'Dec 20, 2024 11:00 AM', 
            location: 'Mumbai',
            completed: true,
            icon: faCheckCircle
          },
          { 
            status: 'Shipped', 
            date: 'Dec 21, 2024 09:15 AM', 
            location: 'Mumbai Warehouse',
            completed: true,
            icon: faBox
          },
          { 
            status: 'In Transit', 
            date: 'Dec 22, 2024 02:30 PM', 
            location: 'Mumbai Distribution Center',
            completed: true,
            icon: faTruck,
            current: true
          },
          { 
            status: 'Out for Delivery', 
            date: 'Pending', 
            location: 'Your City',
            completed: false,
            icon: faTruck
          },
          { 
            status: 'Delivered', 
            date: 'Pending', 
            location: 'Your Address',
            completed: false,
            icon: faCheckCircle
          }
        ],
        items: [
          { name: 'Eternal Rose', quantity: 1, size: '50ml', image: '/product1.jpg' },
          { name: 'Midnight Oud', quantity: 2, size: '100ml', image: '/product3.jpg' }
        ]
      });
  };

  return (
    <div style={{ backgroundColor: 'var(--sand-100)', minHeight: '100vh', paddingTop: '90px' }}>
      <Breadcrumb items={[{ label: 'Track Order', path: '/track-order' }]} />
      
      <div className="container py-5">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 style={{
            color: 'var(--sand-900)',
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            marginBottom: '1rem',
            fontWeight: '600'
          }}>
            Track Your Order
          </h1>
          <p style={{
            color: 'var(--sand-700)',
            fontSize: 'clamp(1rem, 2vw, 1.1rem)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Enter your order ID to track your package in real-time
          </p>
        </div>

        {/* Search Form */}
        <div style={{
          maxWidth: '700px',
          margin: '0 auto 3rem',
          backgroundColor: 'var(--sand-200)',
          borderRadius: '20px',
          padding: 'clamp(2rem, 4vw, 3rem)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
        }}>
          <form onSubmit={handleSubmit(handleTrack)}>
            <div className="mb-3">
              <label style={{
                display: 'block',
                color: 'var(--sand-900)',
                fontSize: '0.95rem',
                fontWeight: '600',
                marginBottom: '0.8rem'
              }}>
                Order ID / Tracking Number
              </label>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  placeholder="Enter your order ID (e.g., VN123456789)"
                  {...register('orderId', {
                    required: 'Order ID is required',
                    minLength: {
                      value: 3,
                      message: 'Order ID must be at least 3 characters'
                    }
                  })}
                  style={{
                    flex: 1,
                    padding: '1rem 1.2rem',
                    border: '2px solid var(--sand-400)',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    backgroundColor: 'white'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '1rem 2rem',
                    border: 'none',
                    borderRadius: '12px',
                    backgroundColor: 'var(--sand-600)',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap'
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
                  <FontAwesomeIcon icon={faSearch} /> Track
                </button>
              </div>
              {errors.orderId && (
                <small className="text-danger mt-1 d-block">
                  {errors.orderId.message}
                </small>
              )}
            </div>
            <p style={{
              color: 'var(--sand-600)',
              fontSize: '0.85rem',
              marginBottom: 0
            }}>
              💡 You can find your order ID in the confirmation email we sent you
            </p>
          </form>
        </div>

        {/* Tracking Result */}
        {trackingResult && (
          <div className="row g-4">
            {/* Order Status Card */}
            <div className="col-lg-8">
              <div style={{
                backgroundColor: 'var(--sand-200)',
                borderRadius: '20px',
                padding: 'clamp(1.5rem, 3vw, 2rem)',
                marginBottom: '1.5rem'
              }}>
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <h3 style={{
                      color: 'var(--sand-900)',
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                      marginBottom: '0.5rem'
                    }}>
                      Order #{trackingResult.orderId}
                    </h3>
                    <div style={{
                      display: 'inline-block',
                      padding: '0.4rem 1rem',
                      backgroundColor: '#ffc107',
                      color: '#856404',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}>
                      {trackingResult.status}
                    </div>
                  </div>
                  <div className="text-end">
                    <div style={{ color: 'var(--sand-700)', fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                      Estimated Delivery
                    </div>
                    <div style={{ color: 'var(--sand-900)', fontSize: '1.1rem', fontWeight: '700' }}>
                      <FontAwesomeIcon icon={faCalendar} /> {trackingResult.estimatedDelivery}
                    </div>
                  </div>
                </div>

                {/* Current Location */}
                <div style={{
                  backgroundColor: 'var(--sand-100)',
                  borderRadius: '12px',
                  padding: '1rem',
                  marginBottom: '2rem'
                }}>
                  <div style={{ color: 'var(--sand-700)', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                    Current Location
                  </div>
                  <div style={{ color: 'var(--sand-900)', fontSize: '1.1rem', fontWeight: '600' }}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: 'var(--sand-600)' }} /> {trackingResult.currentLocation}
                  </div>
                </div>

                {/* Timeline */}
                <h5 style={{
                  color: 'var(--sand-900)',
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  marginBottom: '1.5rem'
                }}>
                  Tracking Timeline
                </h5>

                <div style={{ position: 'relative' }}>
                  {trackingResult.timeline.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        position: 'relative',
                        paddingLeft: '3rem',
                        paddingBottom: index === trackingResult.timeline.length - 1 ? 0 : '2rem'
                      }}
                    >
                      {/* Timeline Line */}
                      {index !== trackingResult.timeline.length - 1 && (
                        <div style={{
                          position: 'absolute',
                          left: '1.15rem',
                          top: '2.5rem',
                          bottom: 0,
                          width: '2px',
                          backgroundColor: item.completed ? 'var(--sand-600)' : 'var(--sand-400)'
                        }} />
                      )}

                      {/* Timeline Icon */}
                      <div style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '2.5rem',
                        height: '2.5rem',
                        borderRadius: '50%',
                        backgroundColor: item.current ? 'var(--sand-600)' : item.completed ? 'var(--sand-600)' : 'var(--sand-300)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1rem',
                        boxShadow: item.current ? '0 0 0 4px rgba(200, 164, 93, 0.2)' : 'none',
                        animation: item.current ? 'pulse 2s infinite' : 'none'
                      }}>
                        <FontAwesomeIcon icon={item.icon} />
                      </div>

                      {/* Timeline Content */}
                      <div style={{
                        backgroundColor: item.current ? 'var(--sand-100)' : 'transparent',
                        padding: item.current ? '1rem' : '0.5rem 0',
                        borderRadius: '10px',
                        border: item.current ? '2px solid var(--sand-600)' : 'none'
                      }}>
                        <div style={{
                          color: 'var(--sand-900)',
                          fontSize: '1rem',
                          fontWeight: '700',
                          marginBottom: '0.3rem'
                        }}>
                          {item.status}
                        </div>
                        <div style={{
                          color: 'var(--sand-700)',
                          fontSize: '0.85rem',
                          marginBottom: '0.2rem'
                        }}>
                          {item.date}
                        </div>
                        <div style={{
                          color: 'var(--sand-600)',
                          fontSize: '0.85rem'
                        }}>
                          <FontAwesomeIcon icon={faMapMarkerAlt} /> {item.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Items & Support */}
            <div className="col-lg-4">
              {/* Order Items */}
              <div style={{
                backgroundColor: 'var(--sand-200)',
                borderRadius: '20px',
                padding: 'clamp(1.5rem, 3vw, 2rem)',
                marginBottom: '1.5rem'
              }}>
                <h5 style={{
                  color: 'var(--sand-900)',
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  marginBottom: '1rem'
                }}>
                  Order Items
                </h5>
                {trackingResult.items.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      marginBottom: '1rem',
                      paddingBottom: index === trackingResult.items.length - 1 ? 0 : '1rem',
                      borderBottom: index === trackingResult.items.length - 1 ? 'none' : '1px solid var(--sand-400)'
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                    <div>
                      <div style={{
                        color: 'var(--sand-900)',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        marginBottom: '0.2rem'
                      }}>
                        {item.name}
                      </div>
                      <div style={{
                        color: 'var(--sand-600)',
                        fontSize: '0.85rem'
                      }}>
                        Qty: {item.quantity} • {item.size}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Support Card */}
              <div style={{
                backgroundColor: 'var(--sand-200)',
                borderRadius: '20px',
                padding: 'clamp(1.5rem, 3vw, 2rem)'
              }}>
                <h5 style={{
                  color: 'var(--sand-900)',
                  fontSize: '1.2rem',
                  fontWeight: '700',
                  marginBottom: '1rem'
                }}>
                  Need Help?
                </h5>
                <p style={{
                  color: 'var(--sand-700)',
                  fontSize: '0.9rem',
                  marginBottom: '1rem'
                }}>
                  Our customer support team is here to help you with any questions about your order.
                </p>
                <a
                  href="tel:+911234567890"
                  style={{
                    display: 'block',
                    padding: '0.8rem',
                    backgroundColor: 'var(--sand-600)',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '10px',
                    textAlign: 'center',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--sand-700)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--sand-600)'}
                >
                  <FontAwesomeIcon icon={faPhone} /> Call Support
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 4px rgba(200, 164, 93, 0.2);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(200, 164, 93, 0.1);
          }
        }
      `}</style>
    </div>
  );
}
