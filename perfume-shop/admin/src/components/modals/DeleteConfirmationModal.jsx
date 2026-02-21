import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExclamationTriangle, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Delete",
  message = "Are you sure you want to delete this item?",
  itemName = "",
  isDeleting = false
}) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 10000,
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        borderRadius: '16px',
        width: '90%',
        maxWidth: '500px',
        zIndex: 10001,
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
        animation: 'slideIn 0.3s ease-out'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '2px solid var(--sand-200)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              color: 'white'
            }}>
              <FontAwesomeIcon icon={faExclamationTriangle} />
            </div>
            <h3 style={{
              margin: 0,
              color: 'white',
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.5rem',
              fontWeight: '700'
            }}>
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              color: 'white',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              opacity: isDeleting ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (!isDeleting) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '2rem' }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#dc354520',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '2.5rem',
              color: '#dc3545',
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              <FontAwesomeIcon icon={faTrash} />
            </div>
            
            <p style={{
              margin: '0 0 1rem 0',
              color: 'var(--sand-900)',
              fontSize: '1.1rem',
              lineHeight: '1.6',
              fontWeight: '500'
            }}>
              {message}
            </p>

            {itemName && (
              <div style={{
                padding: '1rem',
                borderRadius: '10px',
                backgroundColor: 'var(--sand-100)',
                border: '2px solid var(--sand-300)',
                marginTop: '1rem'
              }}>
                <p style={{
                  margin: 0,
                  color: 'var(--sand-700)',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}>
                  Item to delete:
                </p>
                <p style={{
                  margin: '0.5rem 0 0 0',
                  color: 'var(--sand-900)',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  fontFamily: 'monospace',
                  letterSpacing: '0.5px'
                }}>
                  {itemName}
                </p>
              </div>
            )}

            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              borderRadius: '10px',
              backgroundColor: '#fff3cd',
              border: '2px solid #ffc107'
            }}>
              <p style={{
                margin: 0,
                color: '#856404',
                fontSize: '0.9rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                <FontAwesomeIcon icon={faExclamationTriangle} />
                This action cannot be undone!
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '1.5rem 2rem',
          borderTop: '2px solid var(--sand-200)',
          display: 'flex',
          gap: '1rem',
          justifyContent: 'flex-end',
          borderBottomLeftRadius: '16px',
          borderBottomRightRadius: '16px',
          backgroundColor: 'var(--sand-50)'
        }}>
          <button
            onClick={onClose}
            disabled={isDeleting}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              border: '2px solid var(--sand-300)',
              backgroundColor: 'white',
              color: 'var(--sand-900)',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: isDeleting ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (!isDeleting) {
                e.currentTarget.style.backgroundColor = 'var(--sand-200)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '10px',
              border: 'none',
              background: isDeleting 
                ? 'var(--sand-400)' 
                : 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(220, 53, 69, 0.3)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              if (!isDeleting) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(220, 53, 69, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isDeleting) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.3)';
              }
            }}
          >
            {isDeleting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faTrash} />
                <span>Yes, Delete</span>
              </>
            )}
          </button>
        </div>
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

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -45%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
    </>
  );
}
