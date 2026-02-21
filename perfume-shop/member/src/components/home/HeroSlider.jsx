import { useState, useEffect } from 'react';

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 2;

  // Auto-slide every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <div 
      className="position-relative"
      style={{
        backgroundColor: 'var(--sand-100)',
        minHeight: '80vh',
        overflow: 'hidden'
      }}
    >
      {/* Slides Container */}
      <div 
        className="d-flex"
        style={{
          width: '200%',
          transform: `translateX(-${currentSlide * 50}%)`,
          transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
          minHeight: '80vh'
        }}
      >
        {/* Slide 1 - Circle Design */}
        <div
          style={{
            width: '50%',
            minHeight: '80vh',
            paddingTop: '80px',
            flexShrink: 0
          }}
        >
          <div style={{ minHeight: '80vh' }} className="d-flex align-items-center position-relative">
            <div className="container px-2 px-sm-3">
              <div className="row align-items-center">
                {/* Left Side - Text Content */}
                <div className="col-lg-6 mb-5 mb-lg-0 px-2 px-sm-3 px-md-4 px-lg-3">
                  {/* Brand Badge */}
                  <div className="mb-3 mb-md-4">
                    <span 
                      className="px-2 px-sm-3 py-2 rounded-pill d-inline-block"
                      style={{
                        border: `2px solid var(--sand-700)`,
                        color: 'var(--sand-800)',
                        fontSize: 'clamp(0.65rem, 1.8vw, 0.85rem)',
                        fontWeight: '500',
                        maxWidth: '95%',
                        textAlign: 'center'
                      }}
                    >
                      Fragrance & Elegance Co
                    </span>
                  </div>

                  {/* Main Heading */}
                  <h1 
                    className="fw-bold mb-3 mb-md-4"
                    style={{
                      color: 'var(--sand-900)',
                      fontFamily: "'Playfair Display', serif",
                      lineHeight: '1.2',
                      fontSize: 'clamp(1.8rem, 6vw, 3.5rem)'
                    }}
                  >
                    Vamana
                    <br />
                    Signature Collection
                  </h1>

                  {/* Subtitle */}
                  <p 
                    style={{
                      color: 'var(--sand-700)',
                      maxWidth: '480px',
                      lineHeight: '1.6',
                      fontSize: 'clamp(0.85rem, 2.5vw, 1.25rem)'
                    }}
                    className="mb-3 mb-md-4 mb-lg-5"
                  >
                    Innovating the Perfume Industry with Sustainable & Sensory-Driven Solutions
                  </p>

                  {/* Brand Badge */}
                  <div>
                    <span 
                      className="px-2 px-sm-3 py-2 rounded-pill d-inline-block"
                      style={{
                        border: `2px solid var(--sand-700)`,
                        color: 'var(--sand-800)',
                        fontSize: 'clamp(0.65rem, 1.8vw, 0.85rem)',
                        maxWidth: '95%',
                        textAlign: 'center'
                      }}
                    >
                      Crafted by: <span style={{ fontWeight: '600', color: 'var(--sand-900)' }}>Vamana</span>
                    </span>
                  </div>
                </div>

                {/* Right Side - Circular Product Display */}
                <div className="col-lg-6 position-relative">
                  <div className="position-relative d-flex justify-content-center" style={{ minHeight: '500px' }}>
                    {/* Arrow Icon - Top Right */}
                    <div 
                      className="position-absolute d-none d-lg-block"
                      style={{
                        top: '0',
                        right: '10%',
                        fontSize: 'clamp(2rem, 3vw, 3rem)',
                        color: 'var(--sand-900)',
                        transform: 'rotate(45deg)'
                      }}
                    >
                      →
                    </div>

                    {/* Main Circle with Products */}
                    <div 
                      className="position-relative"
                      style={{
                        width: 'min(450px, 90vw)',
                        height: 'min(450px, 90vw)',
                        maxWidth: '500px',
                        maxHeight: '500px'
                      }}
                    >
                      {/* Double Circle Border */}
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          border: `3px solid var(--sand-700)`,
                          position: 'absolute',
                          top: '0',
                          left: '0'
                        }}
                      />
                      <div
                        style={{
                          width: '96%',
                          height: '96%',
                          borderRadius: '50%',
                          border: `2px solid var(--sand-600)`,
                          position: 'absolute',
                          top: '2%',
                          left: '2%'
                        }}
                      />

                      {/* Inner Circle Background with Image Fill */}
                      <div
                        style={{
                          width: '90%',
                          height: '90%',
                          borderRadius: '50%',
                          position: 'absolute',
                          top: '5%',
                          left: '5%',
                          overflow: 'hidden',
                          background: 'linear-gradient(135deg, rgba(240, 233, 209, 0.3), rgba(226, 211, 166, 0.5))'
                        }}
                      >
                        <div 
                          className="d-flex align-items-center justify-content-center h-100 w-100"
                          style={{
                            position: 'relative'
                          }}
                        >
                          <img
                            src="/product1.jpg"
                            alt="Perfume Collection"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: 'center'
                            }}
                          />
                        </div>
                      </div>

                      {/* Decorative Leaves - Right Side of Circle */}
                      <img
                        src="/leaf.png"
                        alt="Leaf"
                        className="position-absolute d-none d-md-block"
                        style={{
                          top: '15%',
                          right: '-15%',
                          width: 'clamp(80px, 15vw, 150px)',
                          height: 'auto',
                          objectFit: 'contain',
                          transform: 'rotate(25deg)',
                          opacity: '0.85',
                          zIndex: 5
                        }}
                      />
                      <img
                        src="/leaf.png"
                        alt="Leaf"
                        className="position-absolute d-none d-md-block"
                        style={{
                          top: '50%',
                          right: '-18%',
                          transform: 'translateY(-50%) rotate(-15deg)',
                          width: 'clamp(70px, 13vw, 130px)',
                          height: 'auto',
                          objectFit: 'contain',
                          opacity: '0.8',
                          zIndex: 5
                        }}
                      />
                      <img
                        src="/leaf.png"
                        alt="Leaf"
                        className="position-absolute d-none d-md-block"
                        style={{
                          bottom: '20%',
                          right: '-14%',
                          width: 'clamp(75px, 14vw, 140px)',
                          height: 'auto',
                          objectFit: 'contain',
                          transform: 'rotate(40deg)',
                          opacity: '0.88',
                          zIndex: 5
                        }}
                      />
                    </div>

                    {/* Website URL - Bottom Right */}
                    <div
                      className="position-absolute d-none d-lg-block"
                      style={{
                        bottom: '20px',
                        right: '10%',
                        fontSize: '0.85rem',
                        color: 'var(--sand-800)',
                        fontWeight: '500'
                      }}
                    >
                      www.vamana.com
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide 2 - Arch Design */}
        <div
          style={{
            width: '50%',
            minHeight: '80vh',
            paddingTop: '80px',
            flexShrink: 0
          }}
        >
          <div style={{ minHeight: '80vh' }} className="d-flex align-items-center position-relative">
            <div className="container px-2 px-sm-3">
              <div className="row align-items-center">
                {/* Left Side - Arch Shape with Product */}
                <div className="col-lg-6 mb-5 mb-lg-0">
                  <div className="position-relative d-flex justify-content-center" style={{ minHeight: '500px' }}>
                    {/* Dotted Circle Decoration - Top Left */}
                    <div
                      className="d-none d-lg-block"
                      style={{
                        position: 'absolute',
                        top: '-20px',
                        left: '5%',
                        width: 'clamp(120px, 15vw, 180px)',
                        height: 'clamp(120px, 15vw, 180px)',
                        borderRadius: '50%',
                        border: '3px dotted var(--sand-700)',
                        zIndex: 0
                      }}
                    >
                      {/* Yellow Flower Inside Dotted Circle */}
                      <img
                        src="/yellowflow.png"
                        alt="Yellow Flower"
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '70%',
                          height: '70%',
                          objectFit: 'contain',
                          zIndex: 1
                        }}
                      />
                    </div>

                    {/* Arch Shape Container */}
                    <div
                      className="position-relative"
                      style={{
                        width: 'min(400px, 85vw)',
                        height: 'min(500px, 100vw)',
                        marginTop: '40px'
                      }}
                    >
                      {/* Arch Background */}
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50% 50% 0 0',
                          background: 'linear-gradient(135deg, rgba(226, 211, 166, 0.4), rgba(209, 181, 115, 0.5))',
                          border: `3px solid var(--sand-700)`,
                          overflow: 'hidden',
                          position: 'relative'
                        }}
                      >
                        {/* Product Image Inside Arch */}
                        <img
                          src="/product2.jpg"
                          alt="Perfume Product"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center'
                          }}
                        />
                      </div>

                      {/* Decorative Flower at Bottom */}
                      <img
                        src="/flower.jpg"
                        alt="Flower"
                        className="d-none d-md-block"
                        style={{
                          position: 'absolute',
                          bottom: '-30px',
                          left: '20px',
                          width: 'clamp(80px, 12vw, 120px)',
                          height: 'clamp(80px, 12vw, 120px)',
                          objectFit: 'contain',
                          zIndex: 10
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Side - Text Content */}
                <div className="col-lg-6 text-center text-lg-start position-relative px-2 px-sm-3 px-md-4 px-lg-3">
                  {/* Top Badge */}
                  <div className="mb-3 mb-md-4">
                    <div
                      className="d-inline-block px-2 px-sm-3 py-2 rounded-pill"
                      style={{
                        backgroundColor: 'var(--sand-400)',
                        color: 'var(--sand-900)',
                        fontSize: 'clamp(0.65rem, 1.8vw, 0.85rem)',
                        fontWeight: '600'
                      }}
                    >
                      Vamana Fragrances
                    </div>
                  </div>

                  {/* Main Heading */}
                  <h1 
                    className="fw-bold mb-3 mb-md-4"
                    style={{
                      color: 'var(--sand-900)',
                      fontFamily: "'Playfair Display', serif",
                      lineHeight: '1.2',
                      fontSize: 'clamp(1.8rem, 6vw, 3.5rem)'
                    }}
                  >
                    Exquisite
                    <br />
                    Fragrances
                  </h1>

                  {/* Subtitle */}
                  <p 
                    className="mb-3 mb-md-4 mb-lg-5"
                    style={{
                      color: 'var(--sand-800)',
                      fontWeight: '600',
                      maxWidth: '500px',
                      margin: '0 auto 2rem',
                      textAlign: 'inherit',
                      fontSize: 'clamp(0.85rem, 2.5vw, 1.25rem)'
                    }}
                  >
                    Awaken Your Senses, Embrace Timeless Elegance
                  </p>

                  {/* Bottom Info */}
                  <div className="mb-3 mb-md-4">
                    <p style={{ color: 'var(--sand-700)', fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)', marginBottom: '0.5rem' }}>
                      www.vamana.com
                    </p>
                    <p style={{ color: 'var(--sand-800)', fontSize: 'clamp(0.7rem, 1.8vw, 0.9rem)' }}>
                      Crafted with Excellence • <span style={{ fontWeight: '600', color: 'var(--sand-900)' }}>Since 2024</span>
                    </p>
                  </div>

                  {/* Decorative Lines - Bottom Right */}
                  <div 
                    className="position-absolute d-none d-xl-block"
                    style={{
                      bottom: '-50px',
                      right: '50px',
                      width: '200px',
                      height: '100px'
                    }}
                  >
                    {/* Horizontal Lines */}
                    <div style={{ borderTop: `2px solid var(--sand-700)`, marginBottom: '15px' }} />
                    <div style={{ borderTop: `2px solid var(--sand-700)`, marginBottom: '15px' }} />
                    <div style={{ borderTop: `2px solid var(--sand-700)`, marginBottom: '15px' }} />
                    
                    {/* Fan Lines */}
                    <div style={{ position: 'relative', height: '60px', marginTop: '20px' }}>
                      {[0, 15, 30, 45, 60, 75, 90].map((angle, i) => (
                        <div
                          key={i}
                          style={{
                            position: 'absolute',
                            bottom: '0',
                            left: '50%',
                            width: '2px',
                            height: '50px',
                            backgroundColor: 'var(--sand-700)',
                            transformOrigin: 'bottom',
                            transform: `rotate(${angle - 45}deg)`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="position-fixed btn btn-lg rounded-circle shadow d-none d-md-flex"
        style={{
          left: 'clamp(10px, 2vw, 30px)',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'var(--sand-600)',
          border: 'none',
          color: 'white',
          width: 'clamp(40px, 5vw, 50px)',
          height: 'clamp(40px, 5vw, 50px)',
          zIndex: 1000,
          transition: 'all 0.3s ease',
          fontSize: '1.5rem',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'var(--sand-700)';
          e.target.style.transform = 'translateY(-50%) scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'var(--sand-600)';
          e.target.style.transform = 'translateY(-50%) scale(1)';
        }}
      >
        ‹
      </button>

      <button
        onClick={nextSlide}
        className="position-fixed btn btn-lg rounded-circle shadow d-none d-md-flex"
        style={{
          right: 'clamp(10px, 2vw, 30px)',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: 'var(--sand-600)',
          border: 'none',
          color: 'white',
          width: 'clamp(40px, 5vw, 50px)',
          height: 'clamp(40px, 5vw, 50px)',
          zIndex: 1000,
          transition: 'all 0.3s ease',
          fontSize: '1.5rem',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = 'var(--sand-700)';
          e.target.style.transform = 'translateY(-50%) scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'var(--sand-600)';
          e.target.style.transform = 'translateY(-50%) scale(1)';
        }}
      >
        ›
      </button>
    </div>
  );
}
