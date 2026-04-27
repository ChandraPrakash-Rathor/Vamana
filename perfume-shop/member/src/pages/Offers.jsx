import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetActiveLimitedOffers } from '../redux/apis/LimitedOfferApi';
import { addToCart } from '../redux/apis/CartApi';
import Breadcrumb from '../components/common/Breadcrumb';
import ScrollToTop from '../components/common/ScrollToTop';
import OfferModal from '../components/common/OfferModal';
import { toast } from 'react-toastify';

// Individual Offer Card Component with its own timer
function OfferCard({ offer }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.AuthSlice);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showModal, setShowModal] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Store pending item and show login modal
      sessionStorage.setItem('pendingCartItem', JSON.stringify({
        productId: offer.product._id,
        quantity: 1
      }));
      window.openAuthModal?.();
      return;
    }

    try {
      const result = await dispatch(addToCart({ 
        productId: offer.product._id, 
        quantity: 1 
      }));
      
      if (result.payload?.success) {
        toast.success('Added to cart!');
      } else {
        toast.error(result.payload?.message || 'Failed to add to cart');
      }
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  useEffect(() => {
    const calculateTimeLeft = () => {
      const endDate = new Date(offer.endDate);
      const now = new Date();
      const difference = endDate - now;

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
  }, [offer.endDate]);

  return (
    <div
      className="card"
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        position: 'relative',
        height: '100%',
        border: '1px solid var(--sand-200)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(184, 134, 11, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
      }}
    >
      {/* Discount Badge */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
          color: 'white',
          padding: '8px',
          borderRadius: '50%',
          fontSize: '0.85rem',
          fontWeight: '800',
          zIndex: 10,
          width: '50px',
          height: '50px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(231, 76, 60, 0.4)'
        }}
      >
        <div style={{ fontSize: '1.1rem', lineHeight: '1' }}>{offer.discount}%</div>
        <div style={{ fontSize: '0.5rem', marginTop: '2px' }}>OFF</div>
      </div>

      {/* Category Badge */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: 'rgba(0,0,0,0.75)',
          color: 'white',
          padding: '4px 10px',
          borderRadius: '12px',
          fontSize: '0.7rem',
          fontWeight: '600',
          zIndex: 10,
          textTransform: 'uppercase'
        }}
      >
        {offer.product?.category || 'Perfume'}
      </div>

      {/* Product Image */}
      <div
        style={{
          width: '100%',
          paddingTop: '100%',
          position: 'relative',
          backgroundColor: 'var(--sand-100)',
          overflow: 'hidden'
        }}
      >
        <img
          src={offer.product?.mainImage}
          alt={offer.product?.name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          onError={(e) => {
            e.target.src = '/placeholder-perfume.png';
          }}
        />
        
        {/* Quick View Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowModal(true);
          }}
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '0.5rem 1.2rem',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: 'none',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: '700',
            color: 'var(--sand-900)',
            cursor: 'pointer',
            opacity: 0,
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 5
          }}
          className="quick-view-btn"
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'var(--sand-600)';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            e.target.style.color = 'var(--sand-900)';
          }}
        >
          Quick View
        </button>
      </div>

      {/* Product Info */}
      <div style={{ padding: '1rem' }}>
        <h3
          style={{
            fontSize: '1.1rem',
            fontWeight: '700',
            color: 'var(--sand-900)',
            marginBottom: '6px',
            lineHeight: '1.3',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {offer.product?.name}
        </h3>

        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--sand-700)',
            marginBottom: '10px',
            lineHeight: '1.4',
            height: '34px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {offer.description}
        </p>

        {/* Price Section */}
        <div style={{ marginBottom: '10px' }}>
          <div className="d-flex align-items-center gap-2">
            <span
              style={{
                fontSize: '1.5rem',
                fontWeight: '800',
                color: '#e74c3c'
              }}
            >
              ₹{offer.offerPrice?.toLocaleString()}
            </span>
            <span
              style={{
                fontSize: '1rem',
                color: 'var(--sand-600)',
                textDecoration: 'line-through'
              }}
            >
              ₹{offer.originalPrice?.toLocaleString()}
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#27ae60', fontWeight: '600' }}>
            Save ₹{(offer.originalPrice - offer.offerPrice)?.toLocaleString()}
          </div>
        </div>

        {/* Compact Timer */}
        <div
          style={{
            background: 'linear-gradient(135deg, #fff5e6 0%, #ffe8cc 100%)',
            borderRadius: '8px',
            padding: '8px',
            marginBottom: '10px',
            border: '1px solid #ffd699'
          }}
        >
          <div style={{ fontSize: '0.65rem', color: '#e67e22', fontWeight: '700', marginBottom: '6px', textAlign: 'center' }}>
            ⏰ ENDS IN
          </div>
          <div className="d-flex justify-content-center gap-1">
            {[
              { label: 'D', value: timeLeft.days },
              { label: 'H', value: timeLeft.hours },
              { label: 'M', value: timeLeft.minutes },
              { label: 'S', value: timeLeft.seconds }
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '6px',
                  padding: '4px',
                  minWidth: '38px',
                  textAlign: 'center',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ fontSize: '1rem', fontWeight: '800', color: '#e67e22', lineHeight: '1' }}>
                  {String(item.value).padStart(2, '0')}
                </div>
                <div style={{ fontSize: '0.55rem', color: '#95a5a6', marginTop: '2px', fontWeight: '600' }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          style={{
            width: '100%',
            padding: '10px',
            background: 'linear-gradient(135deg, var(--sand-600) 0%, var(--sand-700) 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(184, 134, 11, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, var(--sand-700) 0%, var(--sand-600) 100%)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, var(--sand-600) 0%, var(--sand-700) 100%)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          🛒 Add to Cart
        </button>
      </div>

      {/* Offer Modal */}
      <OfferModal 
        offer={offer}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />

      <style>{`
        .card:hover .quick-view-btn {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}

export default function Offers() {
  const dispatch = useDispatch();
  const { offers, loading } = useSelector((state) => state.LimitedOfferSlice);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    dispatch(GetActiveLimitedOffers());
  }, [dispatch]);

  // Calculate countdown timer based on first offer's end date (for hero section)
  useEffect(() => {
    if (offers.length === 0) return;

    const calculateTimeLeft = () => {
      const endDate = new Date(offers[0].endDate);
      const now = new Date();
      const difference = endDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000); // Update every second

    return () => clearInterval(timer);
  }, [offers]);

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
          <p className="mt-3">Loading offers...</p>
        </div>
      </div>
    );
  }

  if (!loading && offers.length === 0) {
    return (
      <div style={{ backgroundColor: 'var(--sand-100)', minHeight: '100vh', paddingTop: '90px' }}>
        <Breadcrumb items={[{ label: 'Special Offers', path: '/offers' }]} />
        <div className="container py-5 text-center">
          <h2>No Active Offers</h2>
          <p className="text-muted">Check back soon for exciting deals!</p>
        </div>
      </div>
    );
  }

  // Calculate highest discount from all offers
  const maxDiscount = offers.length > 0 
    ? Math.max(...offers.map(offer => offer.discount || 0))
    : 0;

  return (
    <div style={{ 
      background: 'linear-gradient(180deg, #faf8f3 0%, #f5f1e8 100%)',
      minHeight: '100vh', 
      paddingTop: '90px' 
    }}>
      <Breadcrumb items={[{ label: 'Special Offers', path: '/offers' }]} />
      
      {/* Compact Hero Section */}
      <section 
        style={{
          background: 'linear-gradient(135deg, var(--sand-600) 0%, var(--sand-700) 50%, var(--sand-600) 100%)',
          padding: '2.5rem 0',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        {/* Subtle Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%)',
          opacity: 0.6
        }} />

        {/* Minimal Decorative Elements */}
        {[
          { emoji: '✨', top: '20%', left: '8%', size: '1.5rem' },
          { emoji: '🎁', top: '25%', right: '10%', size: '1.5rem' },
          { emoji: '⭐', bottom: '20%', left: '12%', size: '1.3rem' },
          { emoji: '💫', bottom: '25%', right: '8%', size: '1.3rem' }
        ].map((item, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              ...item,
              fontSize: item.size,
              opacity: 0.3
            }}
          >
            {item.emoji}
          </div>
        ))}

        <div className="container text-center text-white position-relative" style={{ zIndex: 2 }}>
          <div 
            className="d-inline-block px-3 py-1 rounded-pill mb-2"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              fontSize: '0.75rem',
              fontWeight: '700',
              letterSpacing: '1px',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            ⚡ LIMITED TIME OFFER
          </div>

          <h1 
            className="fw-bold mb-2"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              lineHeight: '1.2',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
              fontFamily: "'Playfair Display', serif"
            }}
          >
            Get Up to {maxDiscount}% Off
          </h1>

          <p 
            style={{
              fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
              marginBottom: '1.5rem',
              maxWidth: '600px',
              margin: '0 auto 1.5rem',
              textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
            }}
          >
            Exclusive discount on selected luxury fragrances
          </p>

          {/* Compact Countdown Timer */}
          <div className="d-flex gap-2 justify-content-center flex-wrap">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Mins', value: timeLeft.minutes },
              { label: 'Secs', value: timeLeft.seconds }
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '10px',
                  padding: '0.8rem 0.7rem',
                  minWidth: '70px',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  border: '1px solid rgba(255,255,255,0.5)'
                }}
              >
                <div style={{
                  fontSize: '1.8rem',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, var(--sand-600) 0%, var(--sand-700) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: '1',
                  fontFamily: "'Courier New', monospace"
                }}>
                  {String(item.value).padStart(2, '0')}
                </div>
                <div style={{
                  fontSize: '0.7rem',
                  color: 'var(--sand-700)',
                  fontWeight: '600',
                  marginTop: '6px',
                  textTransform: 'uppercase'
                }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offers Grid */}
      <div className="container py-4">
        {/* Compact Section Header */}
        <div className="text-center mb-4">
          <h2 
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: '700',
              color: 'var(--sand-900)',
              marginBottom: '0.5rem'
            }}
          >
            🔥 Hot Deals
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--sand-700)' }}>
            Grab these amazing offers before they expire!
          </p>
        </div>

        <div className="row g-3">
          {offers.map((offer) => (
            <div key={offer._id} className="col-6 col-md-4 col-lg-3">
              <OfferCard offer={offer} />
            </div>
          ))}
        </div>

        {/* Compact Trust Badges */}
        <div className="row mt-4 pt-3 border-top g-3">
          <div className="col-6 col-md-3 text-center">
            <div style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>🚚</div>
            <h6 style={{ fontWeight: '700', color: 'var(--sand-900)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Free Delivery</h6>
            <p style={{ fontSize: '0.75rem', color: 'var(--sand-700)', margin: 0 }}>On orders above ₹999</p>
          </div>
          <div className="col-6 col-md-3 text-center">
            <div style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>✅</div>
            <h6 style={{ fontWeight: '700', color: 'var(--sand-900)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>100% Authentic</h6>
            <p style={{ fontSize: '0.75rem', color: 'var(--sand-700)', margin: 0 }}>Original products</p>
          </div>
          <div className="col-6 col-md-3 text-center">
            {/* 1. Plz remove the line perfume for men in all segments */}
            {/* <div style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>🔄</div>
            <h6 style={{ fontWeight: '700', color: 'var(--sand-900)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Easy Returns</h6>
            <p style={{ fontSize: '0.75rem', color: 'var(--sand-700)', margin: 0 }}>7 days policy</p> */}
          </div>
          <div className="col-6 col-md-3 text-center">
            <div style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>💳</div>
            <h6 style={{ fontWeight: '700', color: 'var(--sand-900)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Secure Payment</h6>
            <p style={{ fontSize: '0.75rem', color: 'var(--sand-700)', margin: 0 }}>Safe & encrypted</p>
          </div>
        </div>
      </div>

      <ScrollToTop />
    </div>
  );
}
