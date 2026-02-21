import { useState, useEffect } from 'react';

export default function SplashScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 800); // Wait for fade out animation
    }, 3500); // Increased from 2000 to 3500ms (3.5 seconds)

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, var(--sand-100) 0%, var(--sand-300) 50%, var(--sand-200) 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.8s ease-out',
        overflow: 'hidden'
      }}
    >
      <style>
        {`
          @keyframes bottleEntrance {
            0% {
              transform: translateY(-100vh) scale(0.5) rotate(-180deg);
              opacity: 0;
            }
            60% {
              transform: translateY(20px) scale(1.1) rotate(10deg);
              opacity: 1;
            }
            80% {
              transform: translateY(-10px) scale(0.95) rotate(-5deg);
            }
            100% {
              transform: translateY(0) scale(1) rotate(0deg);
              opacity: 1;
            }
          }

          @keyframes bottleFloat {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }
            25% {
              transform: translateY(-15px) rotate(2deg);
            }
            75% {
              transform: translateY(-10px) rotate(-2deg);
            }
          }

          @keyframes shimmer {
            0% {
              background-position: -1000px 0;
            }
            100% {
              background-position: 1000px 0;
            }
          }

          @keyframes sparkle {
            0%, 100% {
              opacity: 0;
              transform: scale(0) rotate(0deg);
            }
            50% {
              opacity: 1;
              transform: scale(1) rotate(180deg);
            }
          }

          @keyframes ripple {
            0% {
              transform: translate(-50%, -50%) scale(0.8);
              opacity: 0.8;
            }
            100% {
              transform: translate(-50%, -50%) scale(2.5);
              opacity: 0;
            }
          }

          @keyframes textSlideUp {
            0% {
              transform: translateY(50px);
              opacity: 0;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }

          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.8;
            }
          }

          @keyframes particleFloat {
            0% {
              transform: translateY(0) translateX(0) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateY(-100vh) translateX(50px) rotate(360deg);
              opacity: 0;
            }
          }

          .bottle-container {
            animation: bottleEntrance 1s ease-out forwards, bottleFloat 3s ease-in-out 1s infinite;
            position: relative;
            perspective: 1000px;
          }

          .bottle-glow {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 350px;
            height: 350px;
            background: radial-gradient(circle, rgba(200, 164, 93, 0.4) 0%, rgba(200, 164, 93, 0.1) 50%, transparent 70%);
            border-radius: 50%;
            animation: ripple 2s ease-out infinite;
          }

          .sparkle {
            position: absolute;
            width: 12px;
            height: 12px;
            background: linear-gradient(45deg, var(--sand-500), var(--sand-700));
            border-radius: 50%;
            box-shadow: 0 0 10px var(--sand-600);
            animation: sparkle 2s ease-in-out infinite;
          }

          .particle {
            position: absolute;
            width: 6px;
            height: 6px;
            background: var(--sand-600);
            border-radius: 50%;
            opacity: 0;
          }

          .brand-text {
            background: linear-gradient(
              90deg,
              var(--sand-700) 0%,
              var(--sand-500) 50%,
              var(--sand-700) 100%
            );
            background-size: 1000px 100%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: shimmer 3s linear infinite, textSlideUp 0.8s ease-out 0.5s backwards;
          }

          .tagline {
            animation: textSlideUp 0.8s ease-out 0.7s backwards;
          }

          .loading-dots {
            animation: textSlideUp 0.8s ease-out 0.9s backwards;
          }
        `}
      </style>

      {/* Animated Background Circles */}
      <div className="bottle-glow" />
      <div className="bottle-glow" style={{ animationDelay: '0.5s', width: '300px', height: '300px' }} />
      <div className="bottle-glow" style={{ animationDelay: '1s', width: '400px', height: '400px' }} />

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: '-10px',
            animation: `particleFloat ${3 + Math.random() * 2}s ease-in ${Math.random() * 2}s infinite`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}

      {/* Sparkles */}
      <div className="sparkle" style={{ top: '15%', left: '25%', animationDelay: '0s' }} />
      <div className="sparkle" style={{ top: '25%', right: '20%', animationDelay: '0.3s' }} />
      <div className="sparkle" style={{ bottom: '20%', left: '20%', animationDelay: '0.6s' }} />
      <div className="sparkle" style={{ bottom: '25%', right: '25%', animationDelay: '0.9s' }} />
      <div className="sparkle" style={{ top: '45%', left: '10%', animationDelay: '1.2s' }} />
      <div className="sparkle" style={{ top: '45%', right: '10%', animationDelay: '1.5s' }} />
      <div className="sparkle" style={{ top: '35%', left: '50%', animationDelay: '0.4s' }} />
      <div className="sparkle" style={{ bottom: '35%', left: '50%', animationDelay: '1s' }} />

      {/* Perfume Bottle Video */}
      <div className="bottle-container">
        <div
          style={{
            position: 'relative',
            padding: '20px',
            borderRadius: '30px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.1))',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15), inset 0 0 20px rgba(255,255,255,0.3)',
            overflow: 'hidden'
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: 'clamp(150px, 25vw, 250px)',
              height: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.25))',
              borderRadius: '20px',
              display: 'block'
            }}
          >
            <source src="/video1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      {/* Brand Name */}
      <h1
        className="brand-text"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          fontWeight: '700',
          letterSpacing: '5px',
          marginTop: '2.5rem',
          textShadow: '0 2px 10px rgba(200, 164, 93, 0.3)'
        }}
      >
        VAMANA
      </h1>

      {/* Tagline */}
      <p
        className="tagline"
        style={{
          color: 'var(--sand-700)',
          fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
          fontWeight: '500',
          letterSpacing: '3px',
          marginTop: '0.5rem',
          fontFamily: "'Roboto', sans-serif",
          textTransform: 'uppercase'
        }}
      >
        Timeless Elegance
      </p>

      {/* Loading Dots */}
      <div
        className="loading-dots d-flex gap-2"
        style={{
          marginTop: '2rem'
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--sand-600), var(--sand-700))',
              animation: `pulse 1.2s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
              boxShadow: '0 2px 8px rgba(200, 164, 93, 0.4)'
            }}
          />
        ))}
      </div>
    </div>
  );
}
