export default function PerfumeLoader({ message = "Loading..." }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(249, 246, 237, 0.95)',
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
          background: 'linear-gradient(135deg, rgba(179, 135, 63, 0.2) 0%, rgba(179, 135, 63, 0.4) 100%)',
          borderRadius: '0 0 15px 15px',
          position: 'relative',
          border: '3px solid var(--sand-600)',
          boxShadow: '0 10px 30px rgba(179, 135, 63, 0.3)',
          animation: 'bottleFloat 3s ease-in-out infinite'
        }}>
          {/* Liquid */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '70%',
            background: 'linear-gradient(180deg, var(--sand-400) 0%, var(--sand-600) 100%)',
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
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 100%)',
            borderRadius: '10px',
            animation: 'shine 2s ease-in-out infinite'
          }} />
        </div>

        {/* Cap */}
        <div style={{
          width: '60px',
          height: '30px',
          background: 'linear-gradient(135deg, var(--sand-700) 0%, var(--sand-800) 100%)',
          borderRadius: '8px 8px 0 0',
          position: 'absolute',
          top: '-30px',
          left: '10px',
          border: '3px solid var(--sand-900)',
          boxShadow: '0 -5px 15px rgba(0, 0, 0, 0.2)',
          animation: 'bottleFloat 3s ease-in-out infinite'
        }}>
          {/* Cap top */}
          <div style={{
            width: '40px',
            height: '15px',
            background: 'linear-gradient(135deg, var(--sand-800) 0%, var(--sand-900) 100%)',
            borderRadius: '5px',
            position: 'absolute',
            top: '-12px',
            left: '7px',
            border: '2px solid var(--sand-950)'
          }} />
        </div>

        {/* Spray nozzle */}
        <div style={{
          width: '30px',
          height: '20px',
          background: 'var(--sand-800)',
          borderRadius: '5px',
          position: 'absolute',
          top: '-25px',
          right: '-35px',
          border: '2px solid var(--sand-900)',
          animation: 'nozzlePump 1.5s ease-in-out infinite'
        }}>
          {/* Nozzle tube */}
          <div style={{
            width: '3px',
            height: '15px',
            background: 'var(--sand-900)',
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
                background: `rgba(179, 135, 63, ${0.6 - i * 0.07})`,
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
          background: 'radial-gradient(circle, rgba(179, 135, 63, 0.3) 0%, rgba(179, 135, 63, 0) 70%)',
          borderRadius: '50%',
          animation: 'mistExpand 1.5s ease-out infinite'
        }} />
      </div>

      {/* Loading Text */}
      <div style={{
        color: 'var(--sand-900)',
        fontSize: '1.2rem',
        fontWeight: '600',
        fontFamily: "'Playfair Display', serif",
        marginBottom: '1rem',
        animation: 'textPulse 1.5s ease-in-out infinite'
      }}>
        {message}
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
              background: 'var(--sand-600)',
              animation: `dotBounce 1.4s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes bottleFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes liquidWave {
          0%, 100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(0.95);
          }
        }

        @keyframes shine {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes nozzlePump {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes sprayParticle0 {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(30px, -20px) scale(1.5);
          }
        }

        @keyframes sprayParticle1 {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(35px, -15px) scale(1.5);
          }
        }

        @keyframes sprayParticle2 {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(40px, -10px) scale(1.5);
          }
        }

        @keyframes sprayParticle3 {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(45px, -5px) scale(1.5);
          }
        }

        @keyframes sprayParticle4 {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(50px, 0px) scale(1.5);
          }
        }

        @keyframes sprayParticle5 {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(45px, 5px) scale(1.5);
          }
        }

        @keyframes sprayParticle6 {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(40px, 10px) scale(1.5);
          }
        }

        @keyframes sprayParticle7 {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(35px, 15px) scale(1.5);
          }
        }

        @keyframes mistExpand {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            opacity: 0.6;
          }
          100% {
            opacity: 0;
            transform: scale(1.5);
          }
        }

        @keyframes textPulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes dotBounce {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-15px);
          }
        }
      `}</style>
    </div>
  );
}
