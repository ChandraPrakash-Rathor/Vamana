import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { GetActiveLimitedOffers } from '../../redux/apis/LimitedOfferApi';

export default function DiscountSection() {
  const dispatch = useDispatch();
  const { offers, loading } = useSelector((state) => state.LimitedOfferSlice);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    dispatch(GetActiveLimitedOffers());
  }, [dispatch]);

  // Calculate countdown timer based on first offer's end date
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

  // Don't show section if no active offers
  if (!loading && offers.length === 0) {
    return null;
  }

  // Calculate highest discount from all offers
  const maxDiscount = offers.length > 0 
    ? Math.max(...offers.map(offer => offer.discount || 0))
    : 0;

  // Show first 2 offers only
  const displayOffers = offers.slice(0, 2);

  return (
    <section 
      className="py-3 py-md-4 position-relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, var(--sand-600) 0%, var(--sand-700) 100%)`,
        zIndex: 1
      }}
    >
      {/* Animated Confetti/Celebration Elements */}
      <div className="position-absolute w-100 h-100 top-0 start-0" style={{ pointerEvents: 'none', zIndex: 1 }}>
        {/* Sparkles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="position-absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `sparkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          >
            ✨
          </div>
        ))}
        
        {/* Confetti */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`confetti-${i}`}
            className="position-absolute"
            style={{
              top: '-10%',
              left: `${Math.random() * 100}%`,
              width: '10px',
              height: '10px',
              backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181'][Math.floor(Math.random() * 5)],
              borderRadius: Math.random() > 0.5 ? '50%' : '0',
              animation: `fall ${3 + Math.random() * 2}s linear infinite`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: 0.7
            }}
          />
        ))}

        {/* Floating Emojis */}
        {['🎉', '🎊', '🎁', '⭐', '💫'].map((emoji, i) => (
          <div
            key={`emoji-${i}`}
            className="position-absolute d-none d-md-block"
            style={{
              top: `${20 + i * 15}%`,
              left: i % 2 === 0 ? '5%' : '90%',
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              animation: `float ${3 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
              opacity: 0.6
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      <div className="container py-3 py-md-4 position-relative" style={{ zIndex: 2 }}>
        <div className="row align-items-center g-3 g-md-4">
          {/* Left Side - Text Content */}
          <div className="col-lg-6 text-white mb-3 mb-lg-0 px-3 px-md-4">
            <div 
              className="d-inline-block px-3 py-1 rounded-pill mb-2 mb-md-3"
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)',
                fontWeight: '600',
                letterSpacing: '0.5px',
                animation: 'pulse 2s ease-in-out infinite'
              }}
            >
              🎁 LIMITED TIME OFFER
            </div>
            
            <h2 
              className="fw-bold mb-2 mb-md-3"
              style={{
                fontFamily: "'Playfair Display', serif",
                lineHeight: '1.2',
                fontSize: 'clamp(1.8rem, 4.5vw, 3rem)'
              }}
            >
              Get Up to {maxDiscount}% Off
            </h2>
            
            <p className="mb-2 mb-md-3" style={{ 
              lineHeight: '1.5', 
              opacity: '0.95',
              fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)'
            }}>
              Exclusive discount on selected luxury fragrances. Limited stock available!
            </p>

            <div className="d-flex gap-2 mb-2 mb-md-3 flex-wrap">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Min', value: timeLeft.minutes },
                { label: 'Sec', value: timeLeft.seconds }
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className="text-center px-2 px-md-3 py-2 rounded"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    minWidth: 'clamp(50px, 11vw, 65px)'
                  }}
                >
                  <div className="fw-bold" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)' }}>
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: 'clamp(0.6rem, 1.2vw, 0.7rem)', opacity: '0.9' }}>
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/offers"
              className="btn px-3 py-1 rounded-pill"
              style={{
                backgroundColor: 'white',
                border: 'none',
                color: 'var(--sand-800)',
                fontWeight: '700',
                fontSize: 'clamp(0.8rem, 1.6vw, 0.95rem)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--sand-100)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 15px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Shop Now →
            </Link>
          </div>

          {/* Right Side - Discount Products */}
          <div className="col-lg-6 px-3 px-md-4">
            <div className="row g-2 g-md-3">
              {displayOffers.map((offer, index) => (
                <div key={offer._id} className="col-6">
                  <div 
                    className="card border-0 h-100 overflow-hidden position-relative"
                    style={{
                      backgroundColor: 'white',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Discount Badge */}
                    <div 
                      className="position-absolute top-0 end-0 m-2 rounded-circle"
                      style={{
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        fontSize: 'clamp(0.7rem, 1.4vw, 0.85rem)',
                        fontWeight: '700',
                        zIndex: 10,
                        width: 'clamp(40px, 9vw, 55px)',
                        height: 'clamp(40px, 9vw, 55px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'bounce 2s ease-in-out infinite'
                      }}
                    >
                      -{offer.discount}%
                    </div>

                    <div style={{ height: 'clamp(130px, 22vw, 180px)', overflow: 'hidden' }}>
                      <img
                        src={`http://localhost:5000/uploads/${offer.product?.mainImage}`}
                        alt={offer.product?.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.target.src = '/product4.jpg';
                        }}
                      />
                    </div>
                    
                    <div className="card-body p-2 text-center">
                      <h6 
                        className="mb-1"
                        style={{
                          color: 'var(--sand-900)',
                          fontWeight: '700',
                          fontSize: 'clamp(0.8rem, 1.6vw, 0.95rem)'
                        }}
                      >
                        {offer.product?.name}
                      </h6>
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <span 
                          className="fw-bold"
                          style={{ 
                            color: 'var(--sand-700)', 
                            fontSize: 'clamp(0.9rem, 1.8vw, 1.05rem)' 
                          }}
                        >
                          ₹{offer.offerPrice?.toLocaleString()}
                        </span>
                        <span 
                          className="text-decoration-line-through text-muted"
                          style={{ fontSize: 'clamp(0.7rem, 1.4vw, 0.8rem)' }}
                        >
                          ₹{offer.originalPrice?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </section>
  );
}
