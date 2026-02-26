import { useState, useEffect } from 'react';

export default function LimitedOffers() {
  const [timeLeft, setTimeLeft] = useState({ days: 5, hours: 12, minutes: 35 });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes } = prev;
        
        minutes--;
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 23;
          days--;
        }
        if (days < 0) {
          days = 0;
          hours = 0;
          minutes = 0;
        }
        
        return { days, hours, minutes };
      });
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const offers = [
    {
      id: 1,
      name: "Lavender Dreams",
      price: "₹1,999",
      originalPrice: "₹2,999",
      discount: "30%",
      image: "/placeholder-perfume.png"
    },
    {
      id: 2,
      name: "Sandalwood Essence",
      price: "₹2,299",
      originalPrice: "₹3,199",
      discount: "28%",
      image: "/placeholder-perfume.png"
    }
  ];

  return (
    <section 
      style={{
        background: 'linear-gradient(135deg, #b8860b 0%, #cd9a3a 50%, #b8860b 100%)',
        padding: '3rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative Elements */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '5%',
        fontSize: '3rem',
        opacity: 0.3,
        animation: 'float 6s ease-in-out infinite'
      }}>
        🎉
      </div>
      <div style={{
        position: 'absolute',
        top: '15%',
        right: '8%',
        fontSize: '2rem',
        opacity: 0.3,
        animation: 'float 5s ease-in-out infinite 1s'
      }}>
        ✨
      </div>
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '10%',
        fontSize: '2.5rem',
        opacity: 0.3,
        animation: 'float 7s ease-in-out infinite 2s'
      }}>
        🎁
      </div>
      <div style={{
        position: 'absolute',
        bottom: '25%',
        right: '5%',
        fontSize: '3rem',
        opacity: 0.3,
        animation: 'float 6s ease-in-out infinite 1.5s'
      }}>
        ⭐
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }
            50% {
              transform: translateY(-20px) rotate(10deg);
            }
          }
        `}
      </style>

      <div className="container">
        <div className="row align-items-center">
          {/* Left Side - Text and Timer */}
          <div className="col-12 col-lg-5 mb-4 mb-lg-0">
            {/* Badge */}
            <div 
              className="d-inline-block px-3 py-1 rounded mb-3"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: '600',
                letterSpacing: '1px',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              ⚡ LIMITED TIME OFFER
            </div>

            {/* Heading */}
            <h2 
              className="fw-bold mb-3"
              style={{
                color: 'white',
                fontSize: '2.5rem',
                lineHeight: '1.2',
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              Get Up to 30% Off
            </h2>

            {/* Description */}
            <p 
              style={{
                color: 'rgba(255, 255, 255, 0.95)',
                fontSize: '1rem',
                marginBottom: '2rem',
                lineHeight: '1.6'
              }}
            >
              Exclusive discount on selected luxury fragrances. Limited stock available!
            </p>

            {/* Countdown Timer */}
            <div className="d-flex gap-3 mb-4">
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                padding: '1rem',
                minWidth: '70px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#b8860b',
                  lineHeight: '1'
                }}>
                  {String(timeLeft.days).padStart(2, '0')}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#666',
                  fontWeight: '600',
                  marginTop: '4px'
                }}>
                  Days
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                padding: '1rem',
                minWidth: '70px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#b8860b',
                  lineHeight: '1'
                }}>
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#666',
                  fontWeight: '600',
                  marginTop: '4px'
                }}>
                  Hours
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                padding: '1rem',
                minWidth: '70px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#b8860b',
                  lineHeight: '1'
                }}>
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#666',
                  fontWeight: '600',
                  marginTop: '4px'
                }}>
                  Min
                </div>
              </div>
            </div>

            {/* Shop Now Button */}
            <button
              style={{
                backgroundColor: 'white',
                color: '#b8860b',
                border: 'none',
                padding: '0.75rem 2rem',
                borderRadius: '25px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
              }}
            >
              Shop Now
            </button>
          </div>

          {/* Right Side - Product Cards */}
          <div className="col-12 col-lg-7">
            <div className="row g-3">
              {offers.map((offer) => (
                <div key={offer.id} className="col-6">
                  <div
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.25)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
                    }}
                  >
                    {/* Discount Badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        padding: '8px',
                        borderRadius: '50%',
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        zIndex: 2,
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(231, 76, 60, 0.4)'
                      }}
                    >
                      -{offer.discount}
                    </div>

                    {/* Product Image */}
                    <div
                      style={{
                        width: '100%',
                        paddingTop: '100%',
                        position: 'relative',
                        backgroundColor: '#f8f9fa'
                      }}
                    >
                      <img
                        src={offer.image}
                        alt={offer.name}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div style={{ padding: '1.25rem', textAlign: 'center' }}>
                      <h3
                        style={{
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          color: '#333',
                          marginBottom: '8px'
                        }}
                      >
                        {offer.name}
                      </h3>

                      <div>
                        <span
                          style={{
                            fontSize: '1.3rem',
                            fontWeight: '700',
                            color: '#e74c3c',
                            marginRight: '8px'
                          }}
                        >
                          {offer.price}
                        </span>
                        <span
                          style={{
                            fontSize: '1rem',
                            color: '#999',
                            textDecoration: 'line-through'
                          }}
                        >
                          {offer.originalPrice}
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
    </section>
  );
}
