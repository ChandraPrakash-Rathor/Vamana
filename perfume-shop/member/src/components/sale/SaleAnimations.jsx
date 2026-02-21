import { useEffect, useState } from 'react';

export default function SaleAnimations({ saleType }) {
  const [particles, setParticles] = useState([]);

  // Generate random particles on mount
  useEffect(() => {
    const particleCount = 30;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      size: 20 + Math.random() * 30
    }));
    setParticles(newParticles);
  }, [saleType]);

  // Animation configurations for different festivals
  const animations = {
    summer: {
      particles: ['☀️', '🌴', '🌊', '🍹', '🏖️', '🌺'],
      colors: ['#ff6b35', '#f7931e', '#ffd700'],
      background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)'
    },
    winter: {
      particles: ['❄️', '⛄', '🎿', '☃️', '🧊', '❄️'],
      colors: ['#4a90e2', '#357abd', '#b3d9ff'],
      background: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)'
    },
    christmas: {
      particles: ['🎄', '🎅', '🎁', '⭐', '🔔', '🦌', '🕯️', '🎀'],
      colors: ['#c41e3a', '#0c7c59', '#ffd700'],
      background: 'linear-gradient(135deg, #c41e3a 0%, #0c7c59 100%)'
    },
    diwali: {
      particles: ['🪔', '✨', '🎆', '🎇', '💫', '🌟', '🔥', '🏮'],
      colors: ['#ff6b35', '#ffd700', '#ff1493', '#9c27b0'],
      background: 'linear-gradient(135deg, #ff6b35 0%, #9c27b0 100%)'
    },
    spring: {
      particles: ['🌸', '🌺', '🌼', '🌷', '🦋', '🌻', '🐝', '🌹'],
      colors: ['#7cb342', '#558b2f', '#ffb6c1'],
      background: 'linear-gradient(135deg, #7cb342 0%, #558b2f 100%)'
    },
    halloween: {
      particles: ['🎃', '👻', '🦇', '🕷️', '🕸️', '💀', '🧙', '🍬'],
      colors: ['#ff6600', '#000000', '#9c27b0'],
      background: 'linear-gradient(135deg, #ff6600 0%, #000000 100%)'
    },
    newyear: {
      particles: ['🎉', '🎊', '🥳', '🍾', '🎆', '🎇', '✨', '💫'],
      colors: ['#ffd700', '#ff1493', '#00bfff'],
      background: 'linear-gradient(135deg, #ffd700 0%, #ff1493 100%)'
    },
    valentine: {
      particles: ['❤️', '💕', '💖', '💗', '💝', '🌹', '💐', '💘'],
      colors: ['#ff1493', '#ff69b4', '#ff0000'],
      background: 'linear-gradient(135deg, #ff1493 0%, #ff69b4 100%)'
    },
    eid: {
      particles: ['🌙', '⭐', '🕌', '🎊', '✨', '💫', '🌟', '🎁'],
      colors: ['#0c7c59', '#ffd700', '#4a90e2'],
      background: 'linear-gradient(135deg, #0c7c59 0%, #4a90e2 100%)'
    },
    holi: {
      particles: ['🎨', '🌈', '💜', '💚', '💛', '❤️', '💙', '🧡'],
      colors: ['#ff1493', '#ffd700', '#00bfff', '#7cb342', '#ff6600'],
      background: 'linear-gradient(135deg, #ff1493 0%, #ffd700 50%, #00bfff 100%)'
    },
    festive: {
      particles: ['🎁', '🎉', '🎊', '✨', '🎈', '🎀', '💫', '⭐'],
      colors: ['#e91e63', '#c2185b', '#ffd700'],
      background: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)'
    }
  };

  const config = animations[saleType] || animations.festive;

  return (
    <>
      {/* Falling Particles */}
      {particles.map((particle) => {
        const emoji = config.particles[particle.id % config.particles.length];
        return (
          <div
            key={particle.id}
            style={{
              position: 'absolute',
              left: `${particle.left}%`,
              top: '-50px',
              fontSize: `${particle.size}px`,
              animation: `fall ${particle.duration}s linear ${particle.delay}s infinite`,
              opacity: 0.8,
              pointerEvents: 'none',
              zIndex: 1
            }}
          >
            {emoji}
          </div>
        );
      })}

      {/* Floating Orbs */}
      {config.colors.map((color, index) => (
        <div
          key={`orb-${index}`}
          style={{
            position: 'absolute',
            width: `${100 + index * 50}px`,
            height: `${100 + index * 50}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color}40, transparent)`,
            top: `${20 + index * 25}%`,
            left: `${10 + index * 30}%`,
            animation: `float ${6 + index * 2}s ease-in-out infinite`,
            opacity: 0.3,
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
      ))}

      {/* Sparkles for special festivals */}
      {(saleType === 'diwali' || saleType === 'christmas' || saleType === 'newyear') && (
        <>
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`sparkle-${i}`}
              style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                backgroundColor: config.colors[i % config.colors.length],
                animation: `sparkle ${1 + Math.random() * 2}s ease-in-out ${Math.random() * 2}s infinite`,
                pointerEvents: 'none',
                zIndex: 2
              }}
            />
          ))}
        </>
      )}

      {/* Confetti for celebrations */}
      {(saleType === 'newyear' || saleType === 'festive' || saleType === 'holi') && (
        <>
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={`confetti-${i}`}
              style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: '-20px',
                width: `${5 + Math.random() * 10}px`,
                height: `${10 + Math.random() * 20}px`,
                backgroundColor: config.colors[i % config.colors.length],
                animation: `confetti ${3 + Math.random() * 3}s linear ${Math.random() * 3}s infinite`,
                opacity: 0.8,
                pointerEvents: 'none',
                zIndex: 1,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          ))}
        </>
      )}

      {/* Animations CSS */}
      <style>{`
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
            transform: translate(0, 0);
          }
          25% {
            transform: translate(20px, -20px);
          }
          50% {
            transform: translate(-20px, 20px);
          }
          75% {
            transform: translate(20px, 20px);
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }

        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
