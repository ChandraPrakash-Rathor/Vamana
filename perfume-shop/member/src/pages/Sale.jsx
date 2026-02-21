import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClock, 
  faFire, 
  faSnowflake, 
  faSun,
  faLeaf,
  faGift,
  faTag,
  faBolt,
  faHeart,
  faMoon,
  faStar
} from '@fortawesome/free-solid-svg-icons';
import { perfumes } from '../data/perfumes';
import ProductCard from '../components/common/ProductCard';
import Breadcrumb from '../components/common/Breadcrumb';
import ScrollToTop from '../components/common/ScrollToTop';
import SaleAnimations from '../components/sale/SaleAnimations';

export default function Sale() {
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 12,
    minutes: 30,
    seconds: 45
  });

  // Current active sale - can be changed based on season
  const [activeSale, setActiveSale] = useState('diwali');

  // Sale configurations
  const sales = {
    summer: {
      name: 'Summer Sale',
      icon: faSun,
      discount: '50%',
      color: '#ff6b35',
      gradient: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
      bgColor: '#fff5f0',
      description: 'Beat the heat with our refreshing summer fragrances',
      endDate: 'June 30, 2024'
    },
    winter: {
      name: 'Winter Sale',
      icon: faSnowflake,
      discount: '40%',
      color: '#4a90e2',
      gradient: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)',
      bgColor: '#f0f7ff',
      description: 'Warm up with cozy winter scents at amazing prices',
      endDate: 'December 31, 2024'
    },
    spring: {
      name: 'Spring Sale',
      icon: faLeaf,
      discount: '35%',
      color: '#7cb342',
      gradient: 'linear-gradient(135deg, #7cb342 0%, #558b2f 100%)',
      bgColor: '#f1f8e9',
      description: 'Fresh floral fragrances for the blooming season',
      endDate: 'March 31, 2024'
    },
    christmas: {
      name: 'Christmas Sale',
      icon: faGift,
      discount: '55%',
      color: '#c41e3a',
      gradient: 'linear-gradient(135deg, #c41e3a 0%, #0c7c59 100%)',
      bgColor: '#fff0f0',
      description: 'Celebrate Christmas with magical fragrances',
      endDate: 'December 25, 2024'
    },
    diwali: {
      name: 'Diwali Sale',
      icon: faStar,
      discount: '60%',
      color: '#ff6b35',
      gradient: 'linear-gradient(135deg, #ff6b35 0%, #9c27b0 100%)',
      bgColor: '#fff5f0',
      description: 'Light up your Diwali with divine fragrances',
      endDate: 'November 12, 2024'
    },
    newyear: {
      name: 'New Year Sale',
      icon: faStar,
      discount: '65%',
      color: '#ffd700',
      gradient: 'linear-gradient(135deg, #ffd700 0%, #ff1493 100%)',
      bgColor: '#fffef0',
      description: 'Start the new year with fresh scents',
      endDate: 'January 5, 2025'
    },
    valentine: {
      name: 'Valentine Sale',
      icon: faHeart,
      discount: '45%',
      color: '#ff1493',
      gradient: 'linear-gradient(135deg, #ff1493 0%, #ff69b4 100%)',
      bgColor: '#fff0f5',
      description: 'Spread love with romantic fragrances',
      endDate: 'February 14, 2024'
    },
    eid: {
      name: 'Eid Sale',
      icon: faMoon,
      discount: '50%',
      color: '#0c7c59',
      gradient: 'linear-gradient(135deg, #0c7c59 0%, #4a90e2 100%)',
      bgColor: '#f0fff4',
      description: 'Celebrate Eid with premium fragrances',
      endDate: 'April 10, 2024'
    },
    holi: {
      name: 'Holi Sale',
      icon: faStar,
      discount: '55%',
      color: '#ff1493',
      gradient: 'linear-gradient(135deg, #ff1493 0%, #ffd700 50%, #00bfff 100%)',
      bgColor: '#fff0ff',
      description: 'Add colors to your life with vibrant scents',
      endDate: 'March 25, 2024'
    },
    festive: {
      name: 'Festive Sale',
      icon: faGift,
      discount: '60%',
      color: '#e91e63',
      gradient: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)',
      bgColor: '#fce4ec',
      description: 'Celebrate with exclusive festive offers',
      endDate: 'December 25, 2024'
    }
  };

  const currentSale = sales[activeSale];

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Get sale products (first 8 products with discounted prices)
  const saleProducts = perfumes.slice(0, 8).map(product => ({
    ...product,
    originalPrice: product.price,
    price: Math.round(product.price * 0.6) // 40% off
  }));

  return (
    <div style={{ backgroundColor: 'var(--sand-100)', minHeight: '100vh', paddingTop: '90px' }}>
      <Breadcrumb items={[{ label: 'Sale', path: '/sale' }]} />
      
      <div className="container py-4">
        {/* Hero Banner */}
        <div style={{
          background: currentSale.gradient,
          borderRadius: '20px',
          padding: 'clamp(2rem, 4vw, 4rem)',
          marginBottom: '3rem',
          position: 'relative',
          overflow: 'hidden',
          color: 'white'
        }}>
          {/* Festival Animations */}
          <SaleAnimations saleType={activeSale} />

          {/* Animated Background Elements */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            animation: 'float 6s ease-in-out infinite',
            zIndex: 0
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-30px',
            left: '-30px',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            animation: 'float 8s ease-in-out infinite',
            zIndex: 0
          }} />

          <div className="row align-items-center position-relative" style={{ zIndex: 3 }}>
            <div className="col-lg-7 mb-4 mb-lg-0">
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                marginBottom: '1rem',
                fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)',
                fontWeight: '600'
              }}>
                <FontAwesomeIcon icon={faBolt} />
                Limited Time Offer
              </div>

              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: '700',
                marginBottom: '1rem',
                lineHeight: '1.2'
              }}>
                <FontAwesomeIcon icon={currentSale.icon} style={{ marginRight: '1rem' }} />
                {currentSale.name}
              </h1>

              <p style={{
                fontSize: 'clamp(1rem, 2vw, 1.3rem)',
                marginBottom: '1.5rem',
                opacity: 0.95
              }}>
                {currentSale.description}
              </p>

              <div style={{
                display: 'inline-block',
                padding: '1rem 2rem',
                backgroundColor: 'white',
                color: currentSale.color,
                borderRadius: '15px',
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                fontWeight: '700',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
              }}>
                Up to {currentSale.discount} OFF
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="col-lg-5">
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '15px',
                padding: 'clamp(1.5rem, 3vw, 2rem)',
                border: '2px solid rgba(255, 255, 255, 0.3)'
              }}>
                <div style={{
                  textAlign: 'center',
                  marginBottom: '1rem',
                  fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}>
                  <FontAwesomeIcon icon={faClock} />
                  Sale Ends In
                </div>

                <div className="row g-2 g-md-3">
                  {[
                    { value: timeLeft.days, label: 'Days' },
                    { value: timeLeft.hours, label: 'Hours' },
                    { value: timeLeft.minutes, label: 'Mins' },
                    { value: timeLeft.seconds, label: 'Secs' }
                  ].map((item, index) => (
                    <div key={index} className="col-3">
                      <div style={{
                        backgroundColor: 'white',
                        color: currentSale.color,
                        borderRadius: '10px',
                        padding: 'clamp(0.8rem, 2vw, 1.2rem)',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                          fontWeight: '700',
                          lineHeight: '1'
                        }}>
                          {String(item.value).padStart(2, '0')}
                        </div>
                        <div style={{
                          fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                          marginTop: '0.3rem',
                          opacity: 0.8
                        }}>
                          {item.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sale Type Selector */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '3rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {Object.entries(sales).map(([key, sale]) => (
            <button
              key={key}
              onClick={() => setActiveSale(key)}
              style={{
                padding: '1rem 2rem',
                border: activeSale === key ? `3px solid ${sale.color}` : '2px solid var(--sand-400)',
                borderRadius: '15px',
                backgroundColor: activeSale === key ? sale.bgColor : 'white',
                color: activeSale === key ? sale.color : 'var(--sand-800)',
                fontSize: 'clamp(0.9rem, 1.8vw, 1rem)',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: activeSale === key ? `0 5px 20px ${sale.color}40` : 'none'
              }}
              onMouseEnter={(e) => {
                if (activeSale !== key) {
                  e.target.style.backgroundColor = 'var(--sand-200)';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeSale !== key) {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              <FontAwesomeIcon icon={sale.icon} />
              {sale.name}
            </button>
          ))}
        </div>

        {/* Hot Deals Banner */}
        <div style={{
          backgroundColor: '#ff4444',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '15px',
          marginBottom: '2rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
            animation: 'slide 20s linear infinite'
          }} />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <FontAwesomeIcon icon={faFire} style={{ fontSize: '2rem', marginBottom: '0.5rem' }} />
            <h3 style={{
              fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
              fontWeight: '700',
              marginBottom: '0.5rem'
            }}>
              🔥 Hot Deals Alert!
            </h3>
            <p style={{
              fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
              marginBottom: 0,
              opacity: 0.95
            }}>
              Extra 10% off on orders above ₹2999 • Free shipping on all sale items
            </p>
          </div>
        </div>

        {/* Products Section */}
        <div className="text-center mb-4">
          <h2 style={{
            color: 'var(--sand-900)',
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
            marginBottom: '0.5rem',
            fontWeight: '600'
          }}>
            <FontAwesomeIcon icon={faTag} style={{ color: currentSale.color, marginRight: '1rem' }} />
            Sale Products
          </h2>
          <p style={{
            color: 'var(--sand-700)',
            fontSize: 'clamp(0.9rem, 1.8vw, 1rem)'
          }}>
            {saleProducts.length} Products on Sale
          </p>
        </div>

        {/* Products Grid */}
        <div className="row g-3 mb-4">
          {saleProducts.map((product) => (
            <div key={product.id} className="col-6 col-md-3">
              <div style={{ position: 'relative' }}>
                {/* Sale Badge */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  zIndex: 10,
                  padding: '0.4rem 0.8rem',
                  background: currentSale.gradient,
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                }}>
                  {currentSale.discount} OFF
                </div>
                <ProductCard product={product} showAddToCart={true} />
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-4">
          <Link
            to="/catalog"
            style={{
              display: 'inline-block',
              padding: '1rem 3rem',
              background: currentSale.gradient,
              color: 'white',
              textDecoration: 'none',
              borderRadius: '15px',
              fontSize: '1.1rem',
              fontWeight: '700',
              transition: 'all 0.3s ease',
              boxShadow: `0 5px 20px ${currentSale.color}40`
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = `0 8px 25px ${currentSale.color}60`;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = `0 5px 20px ${currentSale.color}40`;
            }}
          >
            View All Products →
          </Link>
        </div>
      </div>

      <ScrollToTop />

      {/* Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(20px);
          }
        }
      `}</style>
    </div>
  );
}
