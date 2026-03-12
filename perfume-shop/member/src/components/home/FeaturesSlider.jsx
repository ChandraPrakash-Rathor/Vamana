import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBan, 
  faPaw, 
  faStar, 
  faClock, 
  faCertificate, 
  faLeaf, 
  faCheckCircle 
} from '@fortawesome/free-solid-svg-icons';

export default function FeaturesSlider() {
  const sliderRef = useRef(null);

  const features = [
    { icon: faBan, title: 'Paraben Free', subtitle: 'Safe Formula', color: '#B3873F' },
    { icon: faPaw, title: 'Cruelty Free', subtitle: 'No Testing', color: '#C9965F' },
    { icon: faStar, title: 'Premium', subtitle: 'Luxury Quality', color: '#D4A574' },
    { icon: faClock, title: 'Long Lasting', subtitle: '8-12 Hours', color: '#B3873F' },
    { icon: faCertificate, title: 'Certified', subtitle: 'Quality Assured', color: '#C9965F' },
    { icon: faLeaf, title: 'Natural', subtitle: 'Eco Friendly', color: '#D4A574' },
    { icon: faCheckCircle, title: 'Authentic', subtitle: '100% Original', color: '#B3873F' }
  ];

  const duplicatedFeatures = [...features, ...features, ...features];

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let animationId;
    let position = 0;
    const speed = 1;

    const animate = () => {
      position -= speed;
      if (Math.abs(position) >= slider.scrollWidth / 3) {
        position = 0;
      }
      slider.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    const handleMouseEnter = () => cancelAnimationFrame(animationId);
    const handleMouseLeave = () => { animationId = requestAnimationFrame(animate); };

    slider.addEventListener('mouseenter', handleMouseEnter);
    slider.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      slider.removeEventListener('mouseenter', handleMouseEnter);
      slider.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #F0E9D1 0%, #E2D3A6 100%)',
      padding: 'clamp(3rem, 6vw, 5rem) 0',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Title Section */}
      <div className="text-center mb-5">
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: '700',
          color: '#3D2817',
          marginBottom: '0.5rem',
          textShadow: '2px 2px 4px rgba(0,0,0,0.05)'
        }}>
          Why Choose Vamana
        </h2>
        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
          color: '#6B5744',
          fontWeight: '500'
        }}>
          Premium Quality • Trusted Excellence
        </p>
      </div>

      {/* Slider */}
      <div style={{ overflow: 'hidden', position: 'relative' }}>
        {/* Fade Edges */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '120px',
          background: 'linear-gradient(to right, #E2D3A6, transparent)',
          zIndex: 2
        }} />
        <div style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '120px',
          background: 'linear-gradient(to left, #E2D3A6, transparent)',
          zIndex: 2
        }} />

        <div
          ref={sliderRef}
          style={{
            display: 'flex',
            gap: 'clamp(2rem, 4vw, 3rem)',
            width: 'fit-content',
            padding: '2rem 0'
          }}
        >
          {duplicatedFeatures.map((feature, index) => (
            <div
              key={index}
              style={{
                minWidth: 'clamp(140px, 20vw, 180px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              {/* Circle Badge */}
              <div
                style={{
                  width: 'clamp(110px, 16vw, 140px)',
                  height: 'clamp(110px, 16vw, 140px)',
                  borderRadius: '50%',
                  background: 'white',
                  border: '2px solid var(--sand-400)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)';
                  e.currentTarget.style.borderColor = feature.color;
                  e.currentTarget.style.borderWidth = '3px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.borderColor = 'var(--sand-400)';
                  e.currentTarget.style.borderWidth = '2px';
                }}
              >
                <FontAwesomeIcon 
                  icon={feature.icon} 
                  style={{ 
                    fontSize: 'clamp(2rem, 4vw, 2.5rem)', 
                    color: feature.color,
                    marginBottom: '0.5rem'
                  }} 
                />
                <div style={{
                  fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
                  fontWeight: '800',
                  color: '#3D2817',
                  textAlign: 'center',
                  letterSpacing: '0.5px'
                }}>
                  {feature.title}
                </div>
              </div>

              {/* Subtitle */}
              <div style={{
                fontSize: 'clamp(0.8rem, 1.6vw, 0.95rem)',
                fontWeight: '600',
                color: '#6B5744',
                textAlign: 'center',
                padding: '6px 14px',
                background: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '20px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                {feature.subtitle}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
