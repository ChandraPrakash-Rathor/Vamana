import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUserPlus, faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { createNewAdmin } from '../../APIS/apis/Authapi';
import { toast } from 'react-toastify';

export default function AddAdminModal({ show, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const loginState = useSelector((state) => state.AuthSlice);
  const loading = loginState?.loading || false;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    try {
      const res = await dispatch(createNewAdmin(formData));
      
      // Check if request was rejected
      if (res.type.includes('rejected')) {
        const errorMsg = res.error?.message || res.payload?.message || 'Failed to create admin';
        toast.error(errorMsg);
        return;
      }
      
      if (res.payload?.success) {
        toast.success(res.payload?.message || 'Admin created successfully');
        setFormData({ name: '', email: '', password: '' });
        onSuccess();
        onClose();
      } else {
        toast.error(res.payload?.message || 'Failed to create admin');
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Failed to create admin';
      toast.error(errorMsg);
    }
  };

  if (!show) return null;

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
            <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: '0.5rem' }} />
            Add New Admin
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
        <form onSubmit={handleSubmit} style={{ 
          display: 'flex', 
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden'
        }}>
          <div style={{ 
            padding: '2rem',
            overflowY: 'auto',
            flex: 1
          }}>
            <div className="mb-4">
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: 'var(--sand-800)',
                fontSize: '0.95rem'
              }}>
                <FontAwesomeIcon icon={faUser} style={{ marginRight: '0.5rem' }} />
                Name
              </label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Enter admin name"
                style={{
                  padding: '0.75rem 1rem',
                  border: '2px solid var(--sand-300)',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--sand-600)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--sand-300)'}
              />
            </div>

            <div className="mb-4">
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: 'var(--sand-800)',
                fontSize: '0.95rem'
              }}>
                <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '0.5rem' }} />
                Email
              </label>
              <input
                type="email"
                className="form-control"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="Enter admin email"
                style={{
                  padding: '0.75rem 1rem',
                  border: '2px solid var(--sand-300)',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--sand-600)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--sand-300)'}
              />
            </div>

            <div className="mb-4">
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: 'var(--sand-800)',
                fontSize: '0.95rem'
              }}>
                <FontAwesomeIcon icon={faLock} style={{ marginRight: '0.5rem' }} />
                Password
              </label>
              <input
                type="password"
                className="form-control"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
                placeholder="Enter password (min 6 characters)"
                style={{
                  padding: '0.75rem 1rem',
                  border: '2px solid var(--sand-300)',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--sand-600)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--sand-300)'}
              />
              <small style={{ color: 'var(--sand-600)', fontSize: '0.85rem' }}>
                Minimum 6 characters required
              </small>
            </div>

            <div style={{
              padding: '1rem',
              backgroundColor: 'var(--sand-100)',
              borderRadius: '10px',
              borderLeft: '4px solid var(--sand-600)'
            }}>
              <p style={{ 
                margin: 0,
                fontSize: '0.85rem',
                color: 'var(--sand-700)'
              }}>
                <strong>Note:</strong> The new admin will have full access to the admin panel. Make sure to share the credentials securely.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            padding: '1.5rem 2rem',
            borderTop: '2px solid var(--sand-200)',
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
            flexShrink: 0
          }}>
            <button
              type="button"
              onClick={() => {
                onClose();
                setFormData({ name: '', email: '', password: '' });
              }}
              className="btn"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--sand-200)',
                color: 'var(--sand-900)',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--sand-300)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--sand-200)'}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--sand-600)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = 'var(--sand-700)')}
              onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = 'var(--sand-600)')}
            >
              {loading ? 'Creating...' : 'Create Admin'}
            </button>
          </div>
        </form>
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
