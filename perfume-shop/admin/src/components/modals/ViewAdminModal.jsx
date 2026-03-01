import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUser, faEnvelope, faShieldAlt, faCalendar, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

export default function ViewAdminModal({ show, onClose, admin }) {
  if (!show || !admin) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1050,
      padding: '1rem',
      overflowY: 'auto'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        animation: 'slideUp 0.3s ease-out',
        margin: 'auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--sand-600) 0%, var(--sand-700) 100%)',
          padding: '2rem',
          borderRadius: '20px 20px 0 0',
          color: 'white',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '35px',
              height: '35px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1.2rem',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
          
          <div className="text-center">
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: '700',
              margin: '0 auto 1rem',
              border: '3px solid rgba(255,255,255,0.3)'
            }}>
              {admin.name.charAt(0).toUpperCase()}
            </div>
            <h4 style={{ marginBottom: '0.5rem', fontWeight: '700' }}>
              {admin.name}
            </h4>
            <p style={{ marginBottom: 0, opacity: 0.9 }}>
              Admin Details
            </p>
          </div>
        </div>

        {/* Body */}
        <div style={{ 
          padding: '2rem',
          overflowY: 'auto',
          flex: 1
        }}>
          <div className="d-flex flex-column gap-3">
            {/* Email */}
            <div style={{
              padding: '1rem',
              backgroundColor: 'var(--sand-100)',
              borderRadius: '12px',
              borderLeft: '4px solid var(--sand-600)'
            }}>
              <div style={{ 
                fontSize: '0.8rem',
                color: 'var(--sand-600)',
                marginBottom: '0.25rem',
                fontWeight: '600'
              }}>
                <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '0.5rem' }} />
                Email Address
              </div>
              <div style={{ 
                fontSize: '1rem',
                color: 'var(--sand-900)',
                fontWeight: '600'
              }}>
                {admin.email}
              </div>
            </div>

            {/* Role */}
            <div style={{
              padding: '1rem',
              backgroundColor: 'var(--sand-100)',
              borderRadius: '12px',
              borderLeft: '4px solid var(--sand-600)'
            }}>
              <div style={{ 
                fontSize: '0.8rem',
                color: 'var(--sand-600)',
                marginBottom: '0.25rem',
                fontWeight: '600'
              }}>
                <FontAwesomeIcon icon={faShieldAlt} style={{ marginRight: '0.5rem' }} />
                Role
              </div>
              <div>
                <span style={{
                  padding: '0.4rem 1rem',
                  backgroundColor: 'var(--sand-600)',
                  color: 'white',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  textTransform: 'capitalize'
                }}>
                  {admin.role}
                </span>
              </div>
            </div>

            {/* Status */}
            <div style={{
              padding: '1rem',
              backgroundColor: 'var(--sand-100)',
              borderRadius: '12px',
              borderLeft: '4px solid var(--sand-600)'
            }}>
              <div style={{ 
                fontSize: '0.8rem',
                color: 'var(--sand-600)',
                marginBottom: '0.25rem',
                fontWeight: '600'
              }}>
                <FontAwesomeIcon icon={admin.status ? faCheckCircle : faTimesCircle} style={{ marginRight: '0.5rem' }} />
                Account Status
              </div>
              <div>
                <span style={{
                  padding: '0.4rem 1rem',
                  backgroundColor: admin.status ? '#d4edda' : '#f8d7da',
                  color: admin.status ? '#155724' : '#721c24',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  {admin.status ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Admin ID */}
            <div style={{
              padding: '1rem',
              backgroundColor: 'var(--sand-100)',
              borderRadius: '12px',
              borderLeft: '4px solid var(--sand-600)'
            }}>
              <div style={{ 
                fontSize: '0.8rem',
                color: 'var(--sand-600)',
                marginBottom: '0.25rem',
                fontWeight: '600'
              }}>
                <FontAwesomeIcon icon={faUser} style={{ marginRight: '0.5rem' }} />
                Admin ID
              </div>
              <div style={{ 
                fontSize: '0.9rem',
                color: 'var(--sand-800)',
                fontFamily: 'monospace'
              }}>
                {admin._id}
              </div>
            </div>

            {/* Created Date */}
            {admin.createdAt && (
              <div style={{
                padding: '1rem',
                backgroundColor: 'var(--sand-100)',
                borderRadius: '12px',
                borderLeft: '4px solid var(--sand-600)'
              }}>
                <div style={{ 
                  fontSize: '0.8rem',
                  color: 'var(--sand-600)',
                  marginBottom: '0.25rem',
                  fontWeight: '600'
                }}>
                  <FontAwesomeIcon icon={faCalendar} style={{ marginRight: '0.5rem' }} />
                  Created Date
                </div>
                <div style={{ 
                  fontSize: '0.95rem',
                  color: 'var(--sand-800)'
                }}>
                  {new Date(admin.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1.5rem 2rem',
          borderTop: '2px solid var(--sand-200)',
          display: 'flex',
          justifyContent: 'flex-end',
          flexShrink: 0
        }}>
          <button
            onClick={onClose}
            className="btn"
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: 'var(--sand-600)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--sand-700)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--sand-600)'}
          >
            Close
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
