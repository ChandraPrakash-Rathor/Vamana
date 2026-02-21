export default function SprayLoader({ size = 'medium', color = 'var(--sand-600)' }) {
  const sizes = {
    small: { bottle: 30, cap: 20, spray: 40 },
    medium: { bottle: 40, cap: 25, spray: 50 },
    large: { bottle: 50, cap: 30, spray: 60 }
  };

  const s = sizes[size];

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      width: `${s.spray}px`,
      height: `${s.bottle}px`
    }}>
      {/* Mini Bottle */}
      <div style={{
        width: `${s.bottle}px`,
        height: `${s.bottle}px`,
        background: `linear-gradient(135deg, ${color}40 0%, ${color}60 100%)`,
        borderRadius: '0 0 8px 8px',
        position: 'relative',
        border: `2px solid ${color}`,
        animation: 'miniFloat 2s ease-in-out infinite'
      }}>
        {/* Cap */}
        <div style={{
          width: `${s.cap}px`,
          height: `${s.cap / 2}px`,
          background: color,
          borderRadius: '4px 4px 0 0',
          position: 'absolute',
          top: `-${s.cap / 2}px`,
          left: `${(s.bottle - s.cap) / 2}px`,
          border: `2px solid ${color}`
        }} />

        {/* Spray particles */}
        <div style={{
          position: 'absolute',
          top: `-${s.cap / 2}px`,
          right: `-${s.spray / 2}px`,
          width: `${s.spray}px`,
          height: `${s.spray}px`
        }}>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: `${3 + i}px`,
                height: `${3 + i}px`,
                borderRadius: '50%',
                background: color,
                opacity: 0.6,
                top: `${5 + i * 5}px`,
                left: `${i * 8}px`,
                animation: `miniSpray${i} 1s ease-out infinite`,
                animationDelay: `${i * 0.15}s`
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes miniFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes miniSpray0 {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0);
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 0;
            transform: translate(15px, -10px) scale(1.2);
          }
        }

        @keyframes miniSpray1 {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0);
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 0;
            transform: translate(18px, -5px) scale(1.2);
          }
        }

        @keyframes miniSpray2 {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0);
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 0;
            transform: translate(20px, 0px) scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}
