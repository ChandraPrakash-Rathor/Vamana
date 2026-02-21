import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBoxOpen, 
  faUndo, 
  faCheckCircle,
  faTimesCircle,
  faClock,
  faShieldAlt,
  faHeadset
} from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '../components/common/Breadcrumb';

export default function Returns() {
  const returnSteps = [
    {
      icon: faBoxOpen,
      title: 'Initiate Return',
      description: 'Contact us within 7 days of delivery with your order number'
    },
    {
      icon: faUndo,
      title: 'Pack the Product',
      description: 'Pack the item securely in its original packaging with all accessories'
    },
    {
      icon: faShieldAlt,
      title: 'Ship It Back',
      description: 'Use our prepaid return label or ship via your preferred courier'
    },
    {
      icon: faCheckCircle,
      title: 'Get Refund',
      description: 'Receive your refund within 5-7 business days after inspection'
    }
  ];

  const eligibleReturns = [
    'Unopened and unused products',
    'Products in original packaging',
    'Items with intact seals',
    'Products with all accessories and tags',
    'Damaged or defective items (with proof)'
  ];

  const nonEligibleReturns = [
    'Opened or used perfumes/attars',
    'Products without original packaging',
    'Items damaged due to misuse',
    'Products purchased on final sale',
    'Custom or personalized items'
  ];

  return (
    <div style={{ backgroundColor: 'var(--sand-100)', minHeight: '100vh', paddingTop: '90px' }}>
      <Breadcrumb items={[{ label: 'Returns & Refunds', path: '/returns' }]} />
      
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
            Returns & Refunds
          </h1>
          <p style={{
            color: 'var(--sand-700)',
            fontSize: 'clamp(1rem, 2vw, 1.1rem)',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            We want you to love your purchase. If you're not completely satisfied, we're here to help.
          </p>
        </div>

        {/* Return Policy Highlights */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div style={{
              backgroundColor: 'var(--sand-200)',
              borderRadius: '15px',
              padding: '2rem',
              textAlign: 'center',
              height: '100%'
            }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: 'var(--sand-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                color: 'white',
                fontSize: '1.8rem'
              }}>
                <FontAwesomeIcon icon={faClock} />
              </div>
              <h4 style={{
                color: 'var(--sand-900)',
                fontSize: '1.3rem',
                fontWeight: '700',
                marginBottom: '0.5rem'
              }}>
                7-Day Returns
              </h4>
              <p style={{
                color: 'var(--sand-700)',
                fontSize: '0.95rem',
                marginBottom: 0
              }}>
                Return unopened products within 7 days of delivery
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div style={{
              backgroundColor: 'var(--sand-200)',
              borderRadius: '15px',
              padding: '2rem',
              textAlign: 'center',
              height: '100%'
            }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: 'var(--sand-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                color: 'white',
                fontSize: '1.8rem'
              }}>
                <FontAwesomeIcon icon={faShieldAlt} />
              </div>
              <h4 style={{
                color: 'var(--sand-900)',
                fontSize: '1.3rem',
                fontWeight: '700',
                marginBottom: '0.5rem'
              }}>
                Quality Guarantee
              </h4>
              <p style={{
                color: 'var(--sand-700)',
                fontSize: '0.95rem',
                marginBottom: 0
              }}>
                100% authentic products with quality assurance
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div style={{
              backgroundColor: 'var(--sand-200)',
              borderRadius: '15px',
              padding: '2rem',
              textAlign: 'center',
              height: '100%'
            }}>
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: 'var(--sand-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                color: 'white',
                fontSize: '1.8rem'
              }}>
                <FontAwesomeIcon icon={faHeadset} />
              </div>
              <h4 style={{
                color: 'var(--sand-900)',
                fontSize: '1.3rem',
                fontWeight: '700',
                marginBottom: '0.5rem'
              }}>
                Easy Process
              </h4>
              <p style={{
                color: 'var(--sand-700)',
                fontSize: '0.95rem',
                marginBottom: 0
              }}>
                Simple return process with dedicated support
              </p>
            </div>
          </div>
        </div>

        {/* Return Process */}
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
            How to Return Your Order
          </h2>

          <div className="row g-4">
            {returnSteps.map((step, index) => (
              <div key={index} className="col-md-6 col-lg-3">
                <div style={{
                  textAlign: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--sand-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    color: 'white',
                    fontSize: '2rem',
                    position: 'relative',
                    zIndex: 2
                  }}>
                    <FontAwesomeIcon icon={step.icon} />
                  </div>
                  <div style={{
                    position: 'absolute',
                    top: '40px',
                    left: '50%',
                    width: '100%',
                    height: '2px',
                    backgroundColor: 'var(--sand-400)',
                    zIndex: 1,
                    display: index === returnSteps.length - 1 ? 'none' : 'block'
                  }} className="d-none d-lg-block" />
                  <h5 style={{
                    color: 'var(--sand-900)',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    marginBottom: '0.5rem'
                  }}>
                    {step.title}
                  </h5>
                  <p style={{
                    color: 'var(--sand-700)',
                    fontSize: '0.9rem',
                    marginBottom: 0
                  }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Eligible & Non-Eligible Returns */}
        <div className="row g-4 mb-5">
          <div className="col-lg-6">
            <div style={{
              backgroundColor: 'var(--sand-200)',
              borderRadius: '20px',
              padding: 'clamp(2rem, 4vw, 2.5rem)',
              height: '100%'
            }}>
              <div className="d-flex align-items-center mb-3">
                <FontAwesomeIcon 
                  icon={faCheckCircle} 
                  style={{ 
                    color: '#28a745', 
                    fontSize: '1.8rem',
                    marginRight: '1rem'
                  }} 
                />
                <h3 style={{
                  color: 'var(--sand-900)',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  marginBottom: 0
                }}>
                  Eligible for Return
                </h3>
              </div>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {eligibleReturns.map((item, index) => (
                  <li key={index} style={{
                    padding: '0.8rem 0',
                    borderBottom: index === eligibleReturns.length - 1 ? 'none' : '1px solid var(--sand-400)',
                    color: 'var(--sand-800)',
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem'
                  }}>
                    <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#28a745', fontSize: '1rem' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-lg-6">
            <div style={{
              backgroundColor: 'var(--sand-200)',
              borderRadius: '20px',
              padding: 'clamp(2rem, 4vw, 2.5rem)',
              height: '100%'
            }}>
              <div className="d-flex align-items-center mb-3">
                <FontAwesomeIcon 
                  icon={faTimesCircle} 
                  style={{ 
                    color: '#dc3545', 
                    fontSize: '1.8rem',
                    marginRight: '1rem'
                  }} 
                />
                <h3 style={{
                  color: 'var(--sand-900)',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  marginBottom: 0
                }}>
                  Not Eligible for Return
                </h3>
              </div>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {nonEligibleReturns.map((item, index) => (
                  <li key={index} style={{
                    padding: '0.8rem 0',
                    borderBottom: index === nonEligibleReturns.length - 1 ? 'none' : '1px solid var(--sand-400)',
                    color: 'var(--sand-800)',
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem'
                  }}>
                    <FontAwesomeIcon icon={faTimesCircle} style={{ color: '#dc3545', fontSize: '1rem' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Support */}
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
            Need Help with Your Return?
          </h3>
          <p style={{
            fontSize: '1rem',
            marginBottom: '1.5rem',
            opacity: 0.95
          }}>
            Our customer support team is ready to assist you with any questions about returns or refunds
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
              Email Us
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
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
