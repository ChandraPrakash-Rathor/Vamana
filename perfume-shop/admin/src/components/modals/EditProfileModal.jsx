import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUser, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { updateProfile } from '../../APIS/apis/Authapi';
import { toast } from 'react-toastify';

export default function EditProfileModal({ show, onClose, currentUser, onSuccess }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || ''
      });
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await dispatch(updateProfile(formData));
      if (res.payload?.success) {
        toast.success('Profile updated successfully');
        onSuccess();
        onClose();
      } else {
        toast.error(res.payload?.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
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
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '500px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        animation: 'slideUp 0.3s ease-out'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '2px solid var(--sand-200)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h4 style={{
            margin: 0,
            color: 'var(--sand-900)',
            fontWeight: '700',
            fontSize: '1.3rem'
          }}>
            <FontAwesomeIcon icon={faUser} style={{ marginRight: '0.5rem' }} />
            Edit Profile
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
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '2rem' }}>
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
          </div>

          {/* Footer */}
          <div style={{
            padding: '1.5rem 2rem',
            borderTop: '2px solid var(--sand-200)',
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={onClose}
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
              {loading ? 'Updating...' : 'Update Profile'}
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
