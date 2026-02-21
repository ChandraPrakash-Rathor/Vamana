import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faHome } from '@fortawesome/free-solid-svg-icons';

export default function Breadcrumb({ items }) {
  return (
    <nav 
      style={{ 
        backgroundColor: 'var(--sand-200)', 
        padding: '1rem 0',
        borderBottom: '1px solid var(--sand-300)',
        position: 'relative',
        zIndex: 1
      }}
    >
      <div className="container">
        <ol 
          className="breadcrumb mb-0" 
          style={{ 
            backgroundColor: 'transparent',
            padding: 0,
            margin: 0
          }}
        >
          <li className="breadcrumb-item">
            <Link 
              to="/" 
              style={{ 
                color: 'var(--sand-600)', 
                textDecoration: 'none', 
                fontSize: '0.9rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--sand-900)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--sand-600)'}
            >
              <FontAwesomeIcon icon={faHome} style={{ fontSize: '0.85rem' }} />
              Home
            </Link>
          </li>
          {items.map((item, index) => (
            <li 
              key={index} 
              className={`breadcrumb-item ${index === items.length - 1 ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <FontAwesomeIcon 
                icon={faChevronRight} 
                style={{ 
                  fontSize: '0.7rem', 
                  color: 'var(--sand-500)',
                  margin: '0 0.5rem'
                }} 
              />
              {index === items.length - 1 ? (
                <span style={{ 
                  color: 'var(--sand-900)', 
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  {item.label}
                </span>
              ) : (
                <Link 
                  to={item.path} 
                  style={{ 
                    color: 'var(--sand-600)', 
                    textDecoration: 'none', 
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--sand-900)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--sand-600)'}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
