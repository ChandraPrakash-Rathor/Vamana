import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faTag } from '@fortawesome/free-solid-svg-icons';
import ProductCard from '../components/common/ProductCard';
import Breadcrumb from '../components/common/Breadcrumb';
import ScrollToTop from '../components/common/ScrollToTop';
import { GetActiveSales } from '../redux/apis/SaleApi';

export default function Sale() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sales, loading } = useSelector((state) => state.SaleSlice);
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Fetch active sales
  useEffect(() => {
    dispatch(GetActiveSales());
  }, [dispatch]);

  // Redirect if no sales available
  useEffect(() => {
    if (!loading && sales && sales.length === 0) {
      navigate('/', { replace: true });
    }
  }, [sales, loading, navigate]);

  // Get first active/scheduled sale from backend
  const currentSale = sales && sales.length > 0 ? sales[0] : null;

  // Calculate countdown timer based on sale dates
  useEffect(() => {
    if (!currentSale) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const startDate = new Date(currentSale.startDate);
      const endDate = new Date(currentSale.endDate);
      
      // If sale hasn't started yet, countdown to start
      // If sale is active, countdown to end
      const targetDate = now < startDate ? startDate : endDate;
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [currentSale]);

  // Show loading state
  if (loading) {
    return (
      <div style={{ 
        backgroundColor: 'var(--sand-100)', 
        minHeight: '100vh', 
        paddingTop: '90px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="text-center">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading sale...</p>
        </div>
      </div>
    );
  }

  // If no sale data, return null (will redirect)
  if (!currentSale) {
    return null;
  }

  // Determine sale status
  const now = new Date();
  const startDate = new Date(currentSale.startDate);
  const endDate = new Date(currentSale.endDate);
  const isUpcoming = now < startDate;
  const isActive = now >= startDate && now <= endDate;

  // Get sale products from backend - only show if sale is active
  const saleProducts = currentSale && currentSale.applicableProducts && isActive
    ? currentSale.applicableProducts.map(product => ({
        id: product._id,
        name: product.name,
        image: product.mainImage, // Just the filename
        mainImage: product.mainImage,
        category: product.category,
        description: product.description,
        price: product.salePrice, // Sale price
        originalPrice: product.originalPrice, // Original price
        actualPrice: product.originalPrice,
        finalPrice: product.salePrice,
        discount: product.discount,
        status: product.status,
        _id: product._id
      }))
    : [];

  return (
    <div style={{ backgroundColor: 'var(--sand-100)', minHeight: '100vh', paddingTop: '90px' }}>
      <Breadcrumb items={[{ label: currentSale.name, path: '/sale' }]} />
      
      <div className="container py-4">
        {/* Hero Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #ff6b35 0%, #9c27b0 100%)',
          borderRadius: '20px',
          padding: 'clamp(2rem, 4vw, 3rem)',
          marginBottom: '3rem',
          position: 'relative',
          overflow: 'hidden',
          color: 'white',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
        }}>
          {/* Animated Background Elements */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            animation: 'float 6s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-30px',
            left: '-30px',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            animation: 'float 8s ease-in-out infinite 2s'
          }} />

          <div className="row align-items-center position-relative" style={{ zIndex: 2 }}>
            <div className="col-lg-7 mb-4 mb-lg-0">
              {/* Status Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: isUpcoming ? 'rgba(255, 193, 7, 0.3)' : 'rgba(76, 175, 80, 0.3)',
                borderRadius: '20px',
                marginBottom: '1rem',
                fontSize: '0.85rem',
                fontWeight: '700',
                border: `2px solid ${isUpcoming ? '#ffc107' : '#4caf50'}`
              }}>
                {isUpcoming ? '🕐 Coming Soon' : '🔥 Live Now'}
              </div>

              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: '700',
                marginBottom: '1rem',
                lineHeight: '1.2',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}>
                {currentSale.name}
              </h1>

              <p style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                marginBottom: '1.5rem',
                opacity: 0.95,
                lineHeight: '1.6'
              }}>
                {currentSale.description}
              </p>

              <div style={{
                display: 'inline-block',
                padding: '1rem 2rem',
                backgroundColor: 'white',
                color: '#ff6b35',
                borderRadius: '15px',
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                fontWeight: '800',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
              }}>
                Up to {currentSale.discount}% OFF
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
                  fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}>
                  <FontAwesomeIcon icon={faClock} />
                  {isUpcoming ? 'Sale Starts In' : 'Sale Ends In'}
                </div>

                <div className="row g-2">
                  {[
                    { label: 'Days', value: timeLeft.days },
                    { label: 'Hours', value: timeLeft.hours },
                    { label: 'Mins', value: timeLeft.minutes },
                    { label: 'Secs', value: timeLeft.seconds }
                  ].map((item, idx) => (
                    <div key={idx} className="col-3">
                      <div style={{
                        backgroundColor: 'white',
                        color: '#ff6b35',
                        borderRadius: '10px',
                        padding: 'clamp(0.8rem, 2vw, 1.2rem)',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                          fontWeight: '800',
                          lineHeight: '1',
                          fontFamily: "'Courier New', monospace"
                        }}>
                          {String(item.value).padStart(2, '0')}
                        </div>
                        <div style={{
                          fontSize: 'clamp(0.7rem, 1.4vw, 0.85rem)',
                          marginTop: '0.5rem',
                          fontWeight: '600',
                          color: '#666'
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

        {/* Products Grid - Only show when sale is active */}
        {isUpcoming ? (
          <div className="text-center py-5">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⏰</div>
            <h3 style={{ color: 'var(--sand-900)', marginBottom: '0.5rem', fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
              Sale Starts Soon!
            </h3>
            <p style={{ color: 'var(--sand-600)', fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)' }}>
              Products will be available when the sale starts on {new Date(currentSale.startDate).toLocaleDateString('en-IN', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        ) : saleProducts && saleProducts.length > 0 ? (
          <div className="mb-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h2 style={{
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                fontWeight: '700',
                color: 'var(--sand-900)',
                margin: 0
              }}>
                <FontAwesomeIcon icon={faTag} style={{ color: '#ff6b35', marginRight: '0.5rem' }} />
                Sale Products ({saleProducts.length})
              </h2>
              <Link 
                to="/catalog"
                style={{
                  color: 'var(--sand-600)',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}
              >
                View All →
              </Link>
            </div>

            <div className="row g-3">
              {saleProducts.map((product) => (
                <div key={product.id} className="col-6 col-md-4 col-lg-3">
                  <ProductCard product={product} showAddToCart={true} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-5">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <h3 style={{ color: 'var(--sand-900)', marginBottom: '0.5rem' }}>No Products Available</h3>
            <p style={{ color: 'var(--sand-600)' }}>Products will be added soon for this sale</p>
          </div>
        )}

        {/* Trust Badges */}
        <div className="row mt-4 pt-3 border-top g-3">
          <div className="col-6 col-md-3 text-center">
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚚</div>
            <h6 style={{ fontWeight: '700', color: 'var(--sand-900)', fontSize: '0.9rem' }}>Free Delivery</h6>
            <p style={{ fontSize: '0.75rem', color: 'var(--sand-600)', margin: 0 }}>On orders above ₹999</p>
          </div>
          <div className="col-6 col-md-3 text-center">
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
            <h6 style={{ fontWeight: '700', color: 'var(--sand-900)', fontSize: '0.9rem' }}>100% Authentic</h6>
            <p style={{ fontSize: '0.75rem', color: 'var(--sand-600)', margin: 0 }}>Original products</p>
          </div>
          <div className="col-6 col-md-3 text-center">
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔄</div>
            <h6 style={{ fontWeight: '700', color: 'var(--sand-900)', fontSize: '0.9rem' }}>Easy Returns</h6>
            <p style={{ fontSize: '0.75rem', color: 'var(--sand-600)', margin: 0 }}>7 days policy</p>
          </div>
          <div className="col-6 col-md-3 text-center">
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💳</div>
            <h6 style={{ fontWeight: '700', color: 'var(--sand-900)', fontSize: '0.9rem' }}>Secure Payment</h6>
            <p style={{ fontSize: '0.75rem', color: 'var(--sand-600)', margin: 0 }}>Safe & encrypted</p>
          </div>
        </div>
      </div>

      <ScrollToTop />

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
      `}</style>
    </div>
  );
}
