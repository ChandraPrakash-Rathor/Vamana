import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEdit, faUser, faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { updateProfile, changePassword } from '../../APIS/apis/Authapi';
import { toast } from 'react-toastify';

export default function EditAdminModal({ show, onClose, admin, currentUser, onSuccess }) {
  const dispatch = useDispatch();
  const loginState = useSelector((state) => state.AuthSlice);
  const loading = loginState?.loading || false;
  
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({ name: '', email: '' });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const isCurrentUser = currentUser?._id === admin?._id;

  useEffect(() => {
    if (admin) {
      setProfileData({
        name: admin.name || '',
        email: admin.email || ''
      });
    }
  }, [admin]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    try {
      const res = await dispatch(updateProfile(profileData));
      
      // Check if request was rejected
      if (res.type.includes('rejected')) {
        const errorMsg = res.error?.message || res.payload?.message || 'Failed to update profile';
        toast.error(errorMsg);
        return;
      }
      
      if (res.payload?.success) {
        toast.success(res.payload?.message || 'Profile updated successfully');
        onSuccess();
        onClose();
      } else {
        toast.error(res.payload?.message || 'Failed to update profile');
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Failed to update profile';
      toast.error(errorMsg);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    try {
      const res = await dispatch(changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }));
      
      // Check if request was rejected
      if (res.type.includes('rejected')) {
        const errorMsg = res.error?.message || res.payload?.message || 'Failed to change password';
        toast.error(errorMsg);
        return;
      }
      
      if (res.payload?.success) {
        toast.success(res.payload?.message || 'Password changed successfully');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        onClose();
      } else {
        toast.error(res.payload?.message || 'Failed to change password');
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Failed to change password';
      toast.error(errorMsg);
    }
  };

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
        maxWidth: '550px',
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
            <FontAwesomeIcon icon={faEdit} style={{ marginRight: '0.5rem' }} />
            Edit Admin
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

        {/* Tabs */}
        {isCurrentUser && (
          <div style={{
            display: 'flex',
            borderBottom: '2px solid var(--sand-200)',
            padding: '0 2rem',
            flexShrink: 0
          }}>
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                flex: 1,
                padding: '1rem',
                border: 'none',
                backgroundColor: 'transparent',
                color: activeTab === 'profile' ? 'var(--sand-600)' : 'var(--sand-700)',
                fontWeight: '600',
                borderBottom: activeTab === 'profile' ? '3px solid var(--sand-600)' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('password')}
              style={{
                flex: 1,
                padding: '1rem',
                border: 'none',
                backgroundColor: 'transparent',
                color: activeTab === 'password' ? 'var(--sand-600)' : 'var(--sand-700)',
                fontWeight: '600',
                borderBottom: activeTab === 'password' ? '3px solid var(--sand-600)' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              Password
            </button>
          </div>
        )}

        {/* Body */}
        <div style={{ 
          padding: '2rem',
          overflowY: 'auto',
          flex: 1
        }}>
          {activeTab === 'profile' ? (
            <form onSubmit={handleUpdateProfile}>
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
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  required
                  disabled={!isCurrentUser}
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
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  required
                  disabled={!isCurrentUser}
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

              {!isCurrentUser && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#fff3cd',
                  borderRadius: '10px',
                  borderLeft: '4px solid #ffc107',
                  marginBottom: '1rem'
                }}>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#856404' }}>
                    You can only edit your own profile. Contact another admin to modify this account.
                  </p>
                </div>
              )}

              <div className="d-flex gap-2 justify-content-end">
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
                {isCurrentUser && (
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
                )}
              </div>
            </form>
          ) : (
            <form onSubmit={handleChangePassword}>
              <div className="mb-3">
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
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                    style={{
                      padding: '0.75rem 3rem 0.75rem 1rem',
                      border: '2px solid var(--sand-300)',
                      borderRadius: '10px',
                      fontSize: '1rem'
                    }}
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
                      cursor: 'pointer'
                    }}
                  >
                    <FontAwesomeIcon icon={showPasswords.current ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>

              <div className="mb-3">
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
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    minLength={6}
                    style={{
                      padding: '0.75rem 3rem 0.75rem 1rem',
                      border: '2px solid var(--sand-300)',
                      borderRadius: '10px',
                      fontSize: '1rem'
                    }}
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
                      cursor: 'pointer'
                    }}
                  >
                    <FontAwesomeIcon icon={showPasswords.new ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>

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
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    minLength={6}
                    style={{
                      padding: '0.75rem 3rem 0.75rem 1rem',
                      border: '2px solid var(--sand-300)',
                      borderRadius: '10px',
                      fontSize: '1rem'
                    }}
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
                      cursor: 'pointer'
                    }}
                  >
                    <FontAwesomeIcon icon={showPasswords.confirm ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>

              <div className="d-flex gap-2 justify-content-end">
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
                    fontWeight: '600'
                  }}
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
                    fontWeight: '600'
                  }}
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          )}
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
