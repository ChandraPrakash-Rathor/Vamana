import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTruck, 
  faBox, 
  faShippingFast,
  faGlobe,
  faCheckCircle,
  faMapMarkerAlt,
  faClock,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '../components/common/Breadcrumb';

export default function ShippingInfo() {
  const shippingMethods = [
    {
      icon: faTruck,
      title: 'Standard Shipping',
      time: '5-7 Business Days',
      cost: 'Free on orders above ₹999',
      description: 'Reliable delivery across India'
    },
    {
      icon: faShippingFast,
      title: 'Express Shipping',
      time: '2-3 Business Days',
      cost: '₹199',
      description: 'Fast delivery to major cities'
    },
    {
      icon: faGlobe,
      title: 'International Shipping',
      time: '10-15 Business Days',
      cost: 'Calculated at checkout',
      description: 'Worldwide delivery available'
    }
  ];

  const deliveryZones = [
    { zone: 'Metro Cities', time: '2-3 days', cities: 'Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad' },
    { zone: 'Tier 1 Cities', time: '3-5 days', cities: 'Pune, Ahmedabad, Jaipur, Lucknow, Chandigarh' },
    { zone: 'Tier 2 Cities', time: '5-7 days', cities: 'Indore, Bhopal, Nagpur, Coimbatore, Kochi' },
    { zone: 'Remote Areas', time: '7-10 days', cities: 'Hill stations, Islands, Remote locations' }
  ];

  return (
    <div style={{ backgroundColor: 'var(--sand-100)', minHeight: '100vh', paddingTop: '90px' }}>
      <Breadcrumb items={[{ label: 'Shipping Information', path: '/shipping-info' }]} />
      
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
            Shipping Information
          </h1>
          <p style={{
            color: 'var(--sand-700)',
            fontSize: 'clamp(1rem, 2vw, 1.1rem)',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            Fast, reliable, and secure delivery to your doorstep
          </p>
        </div>

        {/* Shipping Methods */}
        <div className="row g-4 mb-5">
          {shippingMethods.map((method, index) => (
            <div key={index} className="col-lg-4 col-md-6">
              <div style={{
                backgroundColor: 'var(--sand-200)',
                borderRadius: '15px',
                padding: '2rem',
                height: '100%',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--sand-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  color: 'white',
                  fontSize: '2rem'
                }}>
                  <FontAwesomeIcon icon={method.icon} />
                </div>
                <h4 style={{
                  color: 'var(--sand-900)',
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  marginBottom: '0.8rem'
                }}>
                  {method.title}
                </h4>
                <div style={{
                  color: 'var(--sand-600)',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem'
                }}>
                  <FontAwesomeIcon icon={faClock} /> {method.time}
                </div>
                <div style={{
                  color: 'var(--sand-700)',
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginBottom: '0.8rem'
                }}>
                  {method.cost}
                </div>
                <p style={{
                  color: 'var(--sand-700)',
                  fontSize: '0.9rem',
                  marginBottom: 0
                }}>
                  {method.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery Zones */}
        <div style={{
          backgroundColor: 'var(--sand-200)',
          borderRadius: '20px',
          padding: 'clamp(2rem, 4vw, 3rem)',
          marginBottom: '3rem'
        }}>
          <h2 style={{
            color: 'var(--sand-900)',
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.8rem, 3vw, 2.2rem)',
            marginBottom: '2rem',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            Delivery Timeline by Zone
          </h2>

          <div className="row g-3">
            {deliveryZones.map((zone, index) => (
              <div key={index} className="col-12">
                <div style={{
                  backgroundColor: 'var(--sand-100)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  flexWrap: 'wrap'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--sand-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem',
                    flexShrink: 0
                  }}>
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </div>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <h5 style={{
                      color: 'var(--sand-900)',
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      marginBottom: '0.3rem'
                    }}>
                      {zone.zone}
                    </h5>
                    <div style={{
                      color: 'var(--sand-700)',
                      fontSize: '0.9rem'
                    }}>
                      {zone.cities}
                    </div>
                  </div>
                  <div style={{
                    padding: '0.6rem 1.5rem',
                    backgroundColor: 'var(--sand-600)',
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    whiteSpace: 'nowrap'
                  }}>
                    {zone.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Features */}
        <div className="row g-4 mb-5">
          <div className="col-md-6 col-lg-3">
            <div style={{
              backgroundColor: 'var(--sand-200)',
              borderRadius: '15px',
              padding: '2rem',
              textAlign: 'center',
              height: '100%'
            }}>
              <FontAwesomeIcon 
                icon={faShieldAlt} 
                style={{ 
                  color: 'var(--sand-600)', 
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }} 
              />
              <h5 style={{
                color: 'var(--sand-900)',
                fontSize: '1.1rem',
                fontWeight: '700',
                marginBottom: '0.5rem'
              }}>
                Secure Packaging
              </h5>
              <p style={{
                color: 'var(--sand-700)',
                fontSize: '0.9rem',
                marginBottom: 0
              }}>
                All products are carefully packed to prevent damage
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div style={{
              backgroundColor: 'var(--sand-200)',
              borderRadius: '15px',
              padding: '2rem',
              textAlign: 'center',
              height: '100%'
            }}>
              <FontAwesomeIcon 
                icon={faCheckCircle} 
                style={{ 
                  color: 'var(--sand-600)', 
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }} 
              />
              <h5 style={{
                color: 'var(--sand-900)',
                fontSize: '1.1rem',
                fontWeight: '700',
                marginBottom: '0.5rem'
              }}>
                Order Tracking
              </h5>
              <p style={{
                color: 'var(--sand-700)',
                fontSize: '0.9rem',
                marginBottom: 0
              }}>
                Track your order in real-time from dispatch to delivery
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div style={{
              backgroundColor: 'var(--sand-200)',
              borderRadius: '15px',
              padding: '2rem',
              textAlign: 'center',
              height: '100%'
            }}>
              <FontAwesomeIcon 
                icon={faBox} 
                style={{ 
                  color: 'var(--sand-600)', 
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }} 
              />
              <h5 style={{
                color: 'var(--sand-900)',
                fontSize: '1.1rem',
                fontWeight: '700',
                marginBottom: '0.5rem'
              }}>
                Free Shipping
              </h5>
              <p style={{
                color: 'var(--sand-700)',
                fontSize: '0.9rem',
                marginBottom: 0
              }}>
                Enjoy free standard shipping on orders above ₹999
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div style={{
              backgroundColor: 'var(--sand-200)',
              borderRadius: '15px',
              padding: '2rem',
              textAlign: 'center',
              height: '100%'
            }}>
              <FontAwesomeIcon 
                icon={faTruck} 
                style={{ 
                  color: 'var(--sand-600)', 
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }} 
              />
              <h5 style={{
                color: 'var(--sand-900)',
                fontSize: '1.1rem',
                fontWeight: '700',
                marginBottom: '0.5rem'
              }}>
                Trusted Partners
              </h5>
              <p style={{
                color: 'var(--sand-700)',
                fontSize: '0.9rem',
                marginBottom: 0
              }}>
                We work with reliable courier services for safe delivery
              </p>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div style={{
          backgroundColor: 'var(--sand-200)',
          borderRadius: '20px',
          padding: 'clamp(2rem, 4vw, 2.5rem)',
          marginBottom: '3rem'
        }}>
          <h3 style={{
            color: 'var(--sand-900)',
            fontSize: '1.5rem',
            fontWeight: '700',
            marginBottom: '1.5rem'
          }}>
            Important Shipping Notes
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            {[
              'Orders are processed within 24 hours on business days',
              'Delivery times may vary during festive seasons and sale periods',
              'A signature may be required upon delivery for security',
              'Please ensure someone is available to receive the package',
              'We ship to PO boxes and APO/FPO addresses',
              'International orders may be subject to customs duties and taxes',
              'Track your order anytime using the tracking number provided',
              'Contact us immediately if you notice any damage to the package'
            ].map((note, index) => (
              <li key={index} style={{
                padding: '0.8rem 0',
                borderBottom: index === 7 ? 'none' : '1px solid var(--sand-400)',
                color: 'var(--sand-800)',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'start',
                gap: '0.8rem'
              }}>
                <FontAwesomeIcon 
                  icon={faCheckCircle} 
                  style={{ 
                    color: 'var(--sand-600)', 
                    fontSize: '1rem',
                    marginTop: '0.2rem',
                    flexShrink: 0
                  }} 
                />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Section */}
        <div style={{
          backgroundColor: 'var(--sand-600)',
          borderRadius: '20px',
          padding: 'clamp(2rem, 4vw, 3rem)',
          textAlign: 'center',
          color: 'white'
        }}>
          <h3 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            marginBottom: '1rem',
            fontWeight: '600'
          }}>
            Questions About Shipping?
          </h3>
          <p style={{
            fontSize: '1rem',
            marginBottom: '1.5rem',
            opacity: 0.95
          }}>
            Our team is here to help with any shipping-related queries
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <a
              href="mailto:info@vamana.com"
              style={{
                padding: '0.9rem 2rem',
                backgroundColor: 'white',
                color: 'var(--sand-900)',
                textDecoration: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Email Support
            </a>
            <a
              href="tel:+911234567890"
              style={{
                padding: '0.9rem 2rem',
                backgroundColor: 'transparent',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: '600',
                border: '2px solid white',
                transition: 'all 0.3s ease',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = 'var(--sand-900)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Call Us Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
