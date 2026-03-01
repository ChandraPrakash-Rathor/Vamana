import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUser, faEnvelope, faPhone, faCalendar, faShoppingBag, faRupeeSign } from '@fortawesome/free-solid-svg-icons';

export default function ViewMemberModal({ show, onClose, member }) {
  if (!show || !member) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      onClick={handleBackdropClick}
      style={{
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
        padding: '1rem'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          animation: 'slideUp 0.3s ease-out'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '2px solid var(--sand-200)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0
        }}>
          <h4 style={{
            margin: 0,
            color: 'var(--sand-900)',
            fontWeight: '700',
            fontSize: '1.3rem'
          }}>
            <FontAwesomeIcon icon={faUser} style={{ marginRight: '0.5rem' }} />
            Member Details
          </h4>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              color: 'var(--sand-600)',
              cursor: 'pointer',
              padding: '0.25rem',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--sand-900)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--sand-600)'}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Body */}
        <div style={{ 
          padding: '2rem',
          overflowY: 'auto',
          flex: 1
        }}>
          {/* User Avatar & Name */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--sand-600), var(--sand-700))',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '700',
              fontSize: '2.5rem',
              marginBottom: '1rem',
              boxShadow: '0 8px 20px rgba(179, 135, 63, 0.3)'
            }}>
              {member.name.charAt(0)}
            </div>
            <h3 style={{
              color: 'var(--sand-900)',
              fontWeight: '700',
              marginBottom: '0.5rem'
            }}>
              {member.name}
            </h3>
            <span style={{
              padding: '0.4rem 1rem',
              backgroundColor: member.status === 'Active' ? '#d4edda' : member.status === 'Inactive' ? '#fff3cd' : '#f8d7da',
              color: member.status === 'Active' ? '#155724' : member.status === 'Inactive' ? '#856404' : '#721c24',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}>
              {member.status}
            </span>
          </div>

          {/* Details Grid */}
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Email */}
            <div>
              <label style={{
                display: 'block',
                color: 'var(--sand-700)',
                fontSize: '0.85rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '0.5rem', color: 'var(--sand-600)' }} />
                Email
              </label>
              <div style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--sand-100)',
                borderRadius: '10px',
                color: 'var(--sand-900)',
                fontSize: '1rem',
                fontWeight: '500'
              }}>
                {member.email}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label style={{
                display: 'block',
                color: 'var(--sand-700)',
                fontSize: '0.85rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                <FontAwesomeIcon icon={faPhone} style={{ marginRight: '0.5rem', color: 'var(--sand-600)' }} />
                Phone
              </label>
              <div style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--sand-100)',
                borderRadius: '10px',
                color: 'var(--sand-900)',
                fontSize: '1rem',
                fontWeight: '500'
              }}>
                {member.phone}
              </div>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              {/* Join Date */}
              <div style={{
                padding: '1rem',
                backgroundColor: 'var(--sand-100)',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <FontAwesomeIcon icon={faCalendar} style={{ 
                  fontSize: '1.5rem', 
                  color: 'var(--sand-600)',
                  marginBottom: '0.5rem'
                }} />
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--sand-700)',
                  fontWeight: '600',
                  marginBottom: '0.25rem'
                }}>
                  JOINED
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: 'var(--sand-900)',
                  fontWeight: '700'
                }}>
                  {member.joinDate}
                </div>
              </div>

              {/* Orders */}
              <div style={{
                padding: '1rem',
                backgroundColor: 'var(--sand-100)',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <FontAwesomeIcon icon={faShoppingBag} style={{ 
                  fontSize: '1.5rem', 
                  color: 'var(--sand-600)',
                  marginBottom: '0.5rem'
                }} />
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--sand-700)',
                  fontWeight: '600',
                  marginBottom: '0.25rem'
                }}>
                  ORDERS
                </div>
                <div style={{
                  fontSize: '1.2rem',
                  color: 'var(--sand-900)',
                  fontWeight: '700'
                }}>
                  {member.orders}
                </div>
              </div>

              {/* Total Spent */}
              <div style={{
                padding: '1rem',
                backgroundColor: 'var(--sand-100)',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <FontAwesomeIcon icon={faRupeeSign} style={{ 
                  fontSize: '1.5rem', 
                  color: 'var(--sand-600)',
                  marginBottom: '0.5rem'
                }} />
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--sand-700)',
                  fontWeight: '600',
                  marginBottom: '0.25rem'
                }}>
                  SPENT
                </div>
                <div style={{
                  fontSize: '1.2rem',
                  color: '#28a745',
                  fontWeight: '700'
                }}>
                  ₹{member.totalSpent.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Role */}
            <div>
              <label style={{
                display: 'block',
                color: 'var(--sand-700)',
                fontSize: '0.85rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Role
              </label>
              <div style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--sand-100)',
                borderRadius: '10px',
                color: 'var(--sand-900)',
                fontSize: '1rem',
                fontWeight: '600'
              }}>
                {member.role}
              </div>
            </div>
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
