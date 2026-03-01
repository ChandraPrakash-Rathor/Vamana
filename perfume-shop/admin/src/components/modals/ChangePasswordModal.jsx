import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { changePassword } from '../../APIS/apis/Authapi';
import { toast } from 'react-toastify';

export default function ChangePasswordModal({ show, onClose }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);

  // Cleanup body overflow when modal opens/closes
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await dispatch(changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      }));
      
      if (res.payload?.success) {
        toast.success('Password changed successfully');
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        onClose();
      } else {
        toast.error(res.payload?.message || 'Failed to change password');
      }
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  const handleBackdropClick = (e) => {
    // Close modal only if backdrop is clicked, not the modal content
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
            <FontAwesomeIcon icon={faLock} style={{ marginRight: '0.5rem' }} />
            Change Password
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
            {/* Current Password */}
            <div className="mb-4">
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: 'var(--sand-800)',
                fontSize: '0.95rem'
              }}>
                Current Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  className="form-control"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  required
                  style={{
                    padding: '0.75rem 3rem 0.75rem 1rem',
                    border: '2px solid var(--sand-300)',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    transition: 'all 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--sand-600)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--sand-300)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--sand-600)',
                    cursor: 'pointer',
                    fontSize: '1.1rem'
                  }}
                >
                  <FontAwesomeIcon icon={showPasswords.current ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="mb-4">
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: 'var(--sand-800)',
                fontSize: '0.95rem'
              }}>
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  className="form-control"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  required
                  minLength={6}
                  style={{
                    padding: '0.75rem 3rem 0.75rem 1rem',
                    border: '2px solid var(--sand-300)',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    transition: 'all 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--sand-600)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--sand-300)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--sand-600)',
                    cursor: 'pointer',
                    fontSize: '1.1rem'
                  }}
                >
                  <FontAwesomeIcon icon={showPasswords.new ? faEyeSlash : faEye} />
                </button>
              </div>
              <small style={{ color: 'var(--sand-600)', fontSize: '0.85rem' }}>
                Minimum 6 characters
              </small>
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '600',
                color: 'var(--sand-800)',
                fontSize: '0.95rem'
              }}>
                Confirm New Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  className="form-control"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  minLength={6}
                  style={{
                    padding: '0.75rem 3rem 0.75rem 1rem',
                    border: '2px solid var(--sand-300)',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    transition: 'all 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--sand-600)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--sand-300)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--sand-600)',
                    cursor: 'pointer',
                    fontSize: '1.1rem'
                  }}
                >
                  <FontAwesomeIcon icon={showPasswords.confirm ? faEyeSlash : faEye} />
                </button>
              </div>
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
              {loading ? 'Changing...' : 'Change Password'}
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
