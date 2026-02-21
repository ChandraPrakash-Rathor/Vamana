import { useState } from 'react';
import PerfumeLoader from '../components/common/PerfumeLoader';
import SprayLoader from '../components/common/SprayLoader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function LoaderDemo() {
  const [showFullScreenLoader, setShowFullScreenLoader] = useState(false);
  const [showDarkLoader, setShowDarkLoader] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const handleFullScreenDemo = () => {
    setShowFullScreenLoader(true);
    setTimeout(() => {
      setShowFullScreenLoader(false);
    }, 5000); // Show for 5 seconds
  };

  const handleDarkOverlayDemo = () => {
    setShowDarkLoader(true);
    setTimeout(() => {
      setShowDarkLoader(false);
    }, 5000); // Show for 5 seconds
  };

  const handleButtonDemo = () => {
    setIsButtonLoading(true);
    setTimeout(() => {
      setIsButtonLoading(false);
    }, 3000); // Show for 3 seconds
  };

  return (
    <div style={{ padding: '2rem' }}>
      {/* Page Header */}
      <div className="mb-5">
        <h2 className="mb-2" style={{
          color: 'var(--sand-900)',
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
          fontWeight: '700'
        }}>
          Loader Demonstrations
        </h2>
        <p className="mb-0" style={{ 
          color: 'var(--sand-700)', 
          fontSize: 'clamp(0.9rem, 2vw, 1rem)',
          fontWeight: '500'
        }}>
          Click the buttons below to see different loader styles
        </p>
      </div>

      {/* Demo Cards */}
      <div className="row g-4">
        {/* Full Screen Loader Demo */}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm h-100" style={{
            borderRadius: '16px',
            padding: '2rem',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
          }}>
            <div className="text-center mb-4">
              <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 1rem',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                color: 'white'
              }}>
                🧴
              </div>
              <h4 style={{
                fontFamily: "'Playfair Display', serif",
                color: 'var(--sand-900)',
                marginBottom: '0.5rem'
              }}>
                Full Screen Loader
              </h4>
              <p style={{ color: 'var(--sand-700)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Light background with perfume bottle animation
              </p>
            </div>
            <button
              onClick={handleFullScreenDemo}
              className="btn w-100"
              style={{
                padding: '0.75rem',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <FontAwesomeIcon icon={faPlay} />
              Show Loader (5s)
            </button>
          </div>
        </div>

        {/* Dark Overlay Loader Demo */}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm h-100" style={{
            borderRadius: '16px',
            padding: '2rem',
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.1) 100%)'
          }}>
            <div className="text-center mb-4">
              <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 1rem',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                color: 'white'
              }}>
                🌙
              </div>
              <h4 style={{
                fontFamily: "'Playfair Display', serif",
                color: 'var(--sand-900)',
                marginBottom: '0.5rem'
              }}>
                Dark Overlay Loader
              </h4>
              <p style={{ color: 'var(--sand-700)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Dark background with perfume bottle animation
              </p>
            </div>
            <button
              onClick={handleDarkOverlayDemo}
              className="btn w-100"
              style={{
                padding: '0.75rem',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                border: 'none',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(44, 62, 80, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <FontAwesomeIcon icon={faPlay} />
              Show Loader (5s)
            </button>
          </div>
        </div>

        {/* Button Loader Demo */}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm h-100" style={{
            borderRadius: '16px',
            padding: '2rem',
            background: 'linear-gradient(135deg, rgba(40, 167, 69, 0.1) 0%, rgba(32, 201, 151, 0.1) 100%)'
          }}>
            <div className="text-center mb-4">
              <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 1rem',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                color: 'white'
              }}>
                💨
              </div>
              <h4 style={{
                fontFamily: "'Playfair Display', serif",
                color: 'var(--sand-900)',
                marginBottom: '0.5rem'
              }}>
                Button Loader
              </h4>
              <p style={{ color: 'var(--sand-700)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Small inline loader for buttons and forms
              </p>
            </div>
            <button
              onClick={handleButtonDemo}
              disabled={isButtonLoading}
              className="btn w-100"
              style={{
                padding: '0.75rem',
                borderRadius: '10px',
                background: isButtonLoading 
                  ? 'var(--sand-400)' 
                  : 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                border: 'none',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: isButtonLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!isButtonLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(40, 167, 69, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isButtonLoading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              {isButtonLoading ? (
                <>
                  <SprayLoader size="small" color="white" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSpinner} />
                  <span>Click to Load (3s)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-5">
        <div className="card border-0 shadow-sm" style={{
          borderRadius: '16px',
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(179, 135, 63, 0.05) 0%, rgba(179, 135, 63, 0.1) 100%)'
        }}>
          <h5 style={{
            fontFamily: "'Playfair Display', serif",
            color: 'var(--sand-900)',
            marginBottom: '1rem'
          }}>
            📝 Usage Instructions
          </h5>
          <ul style={{ color: 'var(--sand-800)', lineHeight: '1.8' }}>
            <li><strong>Full Screen Loader:</strong> Light background, perfect for page loads and data fetching</li>
            <li><strong>Dark Overlay Loader:</strong> Dark semi-transparent background, great for modal operations</li>
            <li><strong>Button Loader:</strong> Inline loader for buttons, forms, and small loading states</li>
          </ul>
          <div className="mt-3 p-3" style={{
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            borderLeft: '4px solid #ffc107',
            borderRadius: '8px'
          }}>
            <p style={{ margin: 0, color: 'var(--sand-900)', fontSize: '0.9rem' }}>
              <strong>💡 Tip:</strong> Each loader will automatically disappear after the specified time. 
              The full screen loaders cover the entire viewport with beautiful perfume bottle animations!
            </p>
          </div>
        </div>
      </div>

      {/* Full Screen Loader (Light) */}
      {showFullScreenLoader && (
        <PerfumeLoader message="Loading your perfumes..." />
      )}

      {/* Dark Overlay Loader */}
      {showDarkLoader && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          animation: 'fadeIn 0.3s ease-out'
        }}>
          {/* Perfume Bottle */}
          <div style={{ position: 'relative', marginBottom: '2rem' }}>
            {/* Bottle */}
            <div style={{
              width: '80px',
              height: '120px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.2) 100%)',
              borderRadius: '0 0 15px 15px',
              position: 'relative',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
              animation: 'bottleFloat 3s ease-in-out infinite'
            }}>
              {/* Liquid */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '70%',
                background: 'linear-gradient(180deg, rgba(179, 135, 63, 0.6) 0%, rgba(179, 135, 63, 0.8) 100%)',
                borderRadius: '0 0 12px 12px',
                animation: 'liquidWave 2s ease-in-out infinite'
              }} />
              
              {/* Shine effect */}
              <div style={{
                position: 'absolute',
                top: '20%',
                left: '15%',
                width: '20px',
                height: '40px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 100%)',
                borderRadius: '10px',
                animation: 'shine 2s ease-in-out infinite'
              }} />
            </div>

            {/* Cap */}
            <div style={{
              width: '60px',
              height: '30px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.3) 100%)',
              borderRadius: '8px 8px 0 0',
              position: 'absolute',
              top: '-30px',
              left: '10px',
              border: '3px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 -5px 15px rgba(0, 0, 0, 0.3)',
              animation: 'bottleFloat 3s ease-in-out infinite'
            }}>
              <div style={{
                width: '40px',
                height: '15px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.4) 100%)',
                borderRadius: '5px',
                position: 'absolute',
                top: '-12px',
                left: '7px',
                border: '2px solid rgba(255, 255, 255, 0.5)'
              }} />
            </div>

            {/* Spray nozzle */}
            <div style={{
              width: '30px',
              height: '20px',
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '5px',
              position: 'absolute',
              top: '-25px',
              right: '-35px',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              animation: 'nozzlePump 1.5s ease-in-out infinite'
            }}>
              <div style={{
                width: '3px',
                height: '15px',
                background: 'rgba(255, 255, 255, 0.5)',
                position: 'absolute',
                bottom: '-15px',
                left: '13px'
              }} />
            </div>

            {/* Spray particles */}
            <div style={{
              position: 'absolute',
              top: '-30px',
              right: '-80px',
              width: '100px',
              height: '100px'
            }}>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    width: `${4 + i * 2}px`,
                    height: `${4 + i * 2}px`,
                    borderRadius: '50%',
                    background: `rgba(255, 255, 255, ${0.8 - i * 0.08})`,
                    top: `${10 + i * 8}px`,
                    left: `${i * 10}px`,
                    animation: `sprayParticle${i} 1.5s ease-out infinite`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>

            {/* Mist effect */}
            <div style={{
              position: 'absolute',
              top: '-40px',
              right: '-100px',
              width: '120px',
              height: '120px',
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 70%)',
              borderRadius: '50%',
              animation: 'mistExpand 1.5s ease-out infinite'
            }} />
          </div>

          {/* Loading Text */}
          <div style={{
            color: 'white',
            fontSize: '1.2rem',
            fontWeight: '600',
            fontFamily: "'Playfair Display', serif",
            marginBottom: '1rem',
            animation: 'textPulse 1.5s ease-in-out infinite',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
          }}>
            Processing your request...
          </div>

          {/* Loading dots */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: 'white',
                  animation: `dotBounce 1.4s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                  boxShadow: '0 2px 8px rgba(255, 255, 255, 0.5)'
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
