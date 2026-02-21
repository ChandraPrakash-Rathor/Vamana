import React, { useState } from 'react';

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Fashion Blogger',
      location: 'New York, USA',
      image: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      review: 'Absolutely love the Velvet Rose! The scent lasts all day and I receive compliments everywhere I go. The packaging is luxurious and the quality is exceptional. Best perfume purchase ever!',
      product: 'Velvet Rose',
      verified: true
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Business Executive',
      location: 'London, UK',
      image: 'https://i.pravatar.cc/150?img=12',
      rating: 5,
      review: 'The Mystic Oud is sophisticated and elegant. Perfect for business meetings and special occasions. The longevity is impressive and the scent evolves beautifully throughout the day.',
      product: 'Mystic Oud',
      verified: true
    },
    {
      id: 3,
      name: 'Emma Williams',
      role: 'Makeup Artist',
      location: 'Paris, France',
      image: 'https://i.pravatar.cc/150?img=5',
      rating: 5,
      review: 'Ocean Breeze is my go-to summer fragrance. Fresh, light, and absolutely divine. The quality is outstanding and it never feels overwhelming. I get so many compliments!',
      product: 'Ocean Breeze',
      verified: true
    },
    {
      id: 4,
      name: 'David Martinez',
      role: 'Photographer',
      location: 'Dubai, UAE',
      image: 'https://i.pravatar.cc/150?img=13',
      rating: 5,
      review: 'Exceptional quality and unique scents. The packaging is luxurious and makes for perfect gifts. Fast shipping and excellent customer service. Will definitely order again!',
      product: 'Golden Amber',
      verified: true
    }
  ];

  return (
    <section 
      className="py-3 position-relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, var(--sand-100) 0%, var(--sand-200) 100%)`,
        zIndex: 1
      }}
    >
      {/* Decorative Background Elements */}
      <div className="position-absolute" style={{ top: '10%', right: '5%', opacity: 0.1, fontSize: '8rem', color: 'var(--sand-600)' }}>❝</div>
      <div className="position-absolute" style={{ bottom: '10%', left: '5%', opacity: 0.1, fontSize: '8rem', color: 'var(--sand-600)' }}>❞</div>

      <div className="container py-2 position-relative" style={{ zIndex: 2 }}>
        {/* Section Header */}
        <div className="text-center mb-3 px-3">
          <div 
            className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-2"
            style={{
              background: 'linear-gradient(135deg, var(--sand-600), var(--sand-700))',
              color: 'white',
              fontSize: 'clamp(0.65rem, 1.3vw, 0.8rem)',
              fontWeight: '600',
              letterSpacing: '0.5px',
              boxShadow: '0 4px 15px rgba(200, 164, 93, 0.3)'
            }}
          >
            <span>⭐</span>
            <span>4.9 RATING</span>
            <span>•</span>
            <span>2,547 REVIEWS</span>
          </div>
          <h2 
            className="fw-bold mb-2"
            style={{
              color: 'var(--sand-900)',
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)'
            }}
          >
            Loved by Thousands
          </h2>
          <p 
            style={{
              color: 'var(--sand-700)',
              maxWidth: '600px',
              margin: '0 auto',
              fontSize: 'clamp(0.85rem, 1.6vw, 1rem)'
            }}
          >
            Real stories from our delighted customers
          </p>
        </div>

        {/* Featured Testimonial - Large Card */}
        <div className="row mb-3">
          <div className="col-12">
            <div 
              className="card border-0 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, var(--sand-300), var(--sand-200))',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                transition: 'all 0.3s ease'
              }}
            >
              <div className="row g-0">
                <div className="col-md-4 d-flex align-items-center justify-content-center p-3 p-md-4" style={{ backgroundColor: 'var(--sand-400)' }}>
                  <div className="text-center">
                    <img
                      src={testimonials[activeIndex].image}
                      alt={testimonials[activeIndex].name}
                      style={{
                        width: 'clamp(80px, 15vw, 120px)',
                        height: 'clamp(80px, 15vw, 120px)',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: `4px solid white`,
                        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                        marginBottom: '1rem'
                      }}
                    />
                    <h5 
                      className="mb-1"
                      style={{
                        color: 'var(--sand-900)',
                        fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                        fontWeight: '700'
                      }}
                    >
                      {testimonials[activeIndex].name}
                    </h5>
                    <p 
                      className="mb-1"
                      style={{
                        color: 'var(--sand-700)',
                        fontSize: 'clamp(0.75rem, 1.4vw, 0.9rem)'
                      }}
                    >
                      {testimonials[activeIndex].role}
                    </p>
                    <p 
                      className="mb-0"
                      style={{
                        color: 'var(--sand-600)',
                        fontSize: 'clamp(0.7rem, 1.3vw, 0.85rem)'
                      }}
                    >
                      📍 {testimonials[activeIndex].location}
                    </p>
                    {testimonials[activeIndex].verified && (
                      <div 
                        className="d-inline-block mt-2 px-2 py-1 rounded-pill"
                        style={{
                          backgroundColor: '#10b981',
                          color: 'white',
                          fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)',
                          fontWeight: '600'
                        }}
                      >
                        ✓ Verified Buyer
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-8 p-3 p-md-4">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div>
                      {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                        <span key={i} style={{ color: '#FFD700', fontSize: 'clamp(1rem, 2vw, 1.3rem)' }}>★</span>
                      ))}
                    </div>
                    <div 
                      className="px-2 py-1 rounded"
                      style={{
                        backgroundColor: 'var(--sand-400)',
                        fontSize: 'clamp(0.7rem, 1.3vw, 0.85rem)',
                        fontWeight: '600',
                        color: 'var(--sand-900)'
                      }}
                    >
                      {testimonials[activeIndex].product}
                    </div>
                  </div>
                  <div style={{ fontSize: 'clamp(3rem, 6vw, 4rem)', color: 'var(--sand-500)', lineHeight: '0.5', marginBottom: '0.5rem' }}>❝</div>
                  <p 
                    style={{
                      color: 'var(--sand-800)',
                      fontSize: 'clamp(0.9rem, 1.7vw, 1.1rem)',
                      lineHeight: '1.7',
                      fontStyle: 'italic',
                      marginBottom: '1rem'
                    }}
                  >
                    {testimonials[activeIndex].review}
                  </p>
                  <div className="d-flex gap-2 flex-wrap">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        style={{
                          width: 'clamp(8px, 2vw, 12px)',
                          height: 'clamp(8px, 2vw, 12px)',
                          borderRadius: '50%',
                          border: 'none',
                          backgroundColor: activeIndex === index ? 'var(--sand-700)' : 'var(--sand-400)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          padding: 0
                        }}
                        onMouseEnter={(e) => {
                          if (activeIndex !== index) e.target.style.backgroundColor = 'var(--sand-600)';
                        }}
                        onMouseLeave={(e) => {
                          if (activeIndex !== index) e.target.style.backgroundColor = 'var(--sand-400)';
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Small Testimonial Cards Grid */}
        <div className="row g-2">
          {testimonials.map((testimonial, index) => (
            <div key={testimonial.id} className="col-6 col-md-3">
              <div 
                className="card border-0 h-100"
                style={{
                  backgroundColor: index === activeIndex ? 'var(--sand-300)' : 'var(--sand-100)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  border: index === activeIndex ? `2px solid var(--sand-600)` : 'none'
                }}
                onClick={() => setActiveIndex(index)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                }}
              >
                <div className="card-body p-2 text-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    style={{
                      width: 'clamp(40px, 10vw, 60px)',
                      height: 'clamp(40px, 10vw, 60px)',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: `3px solid ${index === activeIndex ? 'var(--sand-600)' : 'var(--sand-400)'}`,
                      marginBottom: '0.5rem'
                    }}
                  />
                  <h6 
                    className="mb-0"
                    style={{
                      color: 'var(--sand-900)',
                      fontSize: 'clamp(0.75rem, 1.4vw, 0.9rem)',
                      fontWeight: '700'
                    }}
                  >
                    {testimonial.name}
                  </h6>
                  <p 
                    className="mb-1"
                    style={{
                      color: 'var(--sand-600)',
                      fontSize: 'clamp(0.65rem, 1.2vw, 0.75rem)'
                    }}
                  >
                    {testimonial.role}
                  </p>
                  <div>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} style={{ color: '#FFD700', fontSize: 'clamp(0.7rem, 1.3vw, 0.85rem)' }}>★</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="row g-2 mt-2">
          <div className="col-6 col-md-3 text-center">
            <div className="p-2" style={{ backgroundColor: 'var(--sand-200)', borderRadius: '8px' }}>
              <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '0.25rem' }}>🏆</div>
              <div style={{ fontSize: 'clamp(0.9rem, 1.7vw, 1.1rem)', fontWeight: '700', color: 'var(--sand-900)' }}>2,547+</div>
              <div style={{ fontSize: 'clamp(0.7rem, 1.3vw, 0.85rem)', color: 'var(--sand-700)' }}>Happy Customers</div>
            </div>
          </div>
          <div className="col-6 col-md-3 text-center">
            <div className="p-2" style={{ backgroundColor: 'var(--sand-200)', borderRadius: '8px' }}>
              <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '0.25rem' }}>⭐</div>
              <div style={{ fontSize: 'clamp(0.9rem, 1.7vw, 1.1rem)', fontWeight: '700', color: 'var(--sand-900)' }}>4.9/5</div>
              <div style={{ fontSize: 'clamp(0.7rem, 1.3vw, 0.85rem)', color: 'var(--sand-700)' }}>Average Rating</div>
            </div>
          </div>
          <div className="col-6 col-md-3 text-center">
            <div className="p-2" style={{ backgroundColor: 'var(--sand-200)', borderRadius: '8px' }}>
              <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '0.25rem' }}>✓</div>
              <div style={{ fontSize: 'clamp(0.9rem, 1.7vw, 1.1rem)', fontWeight: '700', color: 'var(--sand-900)' }}>100%</div>
              <div style={{ fontSize: 'clamp(0.7rem, 1.3vw, 0.85rem)', color: 'var(--sand-700)' }}>Verified Reviews</div>
            </div>
          </div>
          <div className="col-6 col-md-3 text-center">
            <div className="p-2" style={{ backgroundColor: 'var(--sand-200)', borderRadius: '8px' }}>
              <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '0.25rem' }}>💝</div>
              <div style={{ fontSize: 'clamp(0.9rem, 1.7vw, 1.1rem)', fontWeight: '700', color: 'var(--sand-900)' }}>98%</div>
              <div style={{ fontSize: 'clamp(0.7rem, 1.3vw, 0.85rem)', color: 'var(--sand-700)' }}>Would Recommend</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
