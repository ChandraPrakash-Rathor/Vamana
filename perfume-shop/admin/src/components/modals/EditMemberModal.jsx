import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEdit, faUser, faEnvelope, faPhone, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function EditMemberModal({ show, onClose, member, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'active'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        email: member.email || '',
        phone: member.phone || '',
        status: member.status === 'Active' ? 'active' : 'inactive'
      });
    }
  }, [member]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = Cookies.get('authToken');
      
      // Update member status
      await axios.put(
        `http://localhost:5000/api/admin/members/${member.id}/status`,
        { status: formData.status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success('Member updated successfully');
      onSuccess();
      onClose();
    } catch (error) {
      const errorMsg = error?.response?.data?.message || 'Failed to update member';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

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
          maxWidth: '550px',
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
            <FontAwesomeIcon icon={faEdit} style={{ marginRight: '0.5rem' }} />
            Edit Member
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
          padding: '2rem',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Name */}
          <div className="mb-4">
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: 'var(--sand-800)',
              fontSize: '0.95rem'
            }}>
              <FontAwesomeIcon icon={faUser} style={{ marginRight: '0.5rem', color: 'var(--sand-600)' }} />
              Name
            </label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled
              style={{
                padding: '0.75rem 1rem',
                border: '2px solid var(--sand-300)',
                borderRadius: '10px',
                fontSize: '1rem',
                backgroundColor: 'var(--sand-100)',
                color: 'var(--sand-700)'
              }}
            />
            <small style={{ color: 'var(--sand-600)', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
              Name cannot be edited
            </small>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: 'var(--sand-800)',
              fontSize: '0.95rem'
            }}>
              <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '0.5rem', color: 'var(--sand-600)' }} />
              Email
            </label>
            <input
              type="email"
              className="form-control"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled
              style={{
                padding: '0.75rem 1rem',
                border: '2px solid var(--sand-300)',
                borderRadius: '10px',
                fontSize: '1rem',
                backgroundColor: 'var(--sand-100)',
                color: 'var(--sand-700)'
              }}
            />
            <small style={{ color: 'var(--sand-600)', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
              Email cannot be edited
            </small>
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: 'var(--sand-800)',
              fontSize: '0.95rem'
            }}>
              <FontAwesomeIcon icon={faPhone} style={{ marginRight: '0.5rem', color: 'var(--sand-600)' }} />
              Phone
            </label>
            <input
              type="tel"
              className="form-control"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled
              style={{
                padding: '0.75rem 1rem',
                border: '2px solid var(--sand-300)',
                borderRadius: '10px',
                fontSize: '1rem',
                backgroundColor: 'var(--sand-100)',
                color: 'var(--sand-700)'
              }}
            />
            <small style={{ color: 'var(--sand-600)', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
              Phone cannot be edited
            </small>
          </div>

          {/* Status */}
          <div className="mb-4">
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: 'var(--sand-800)',
              fontSize: '0.95rem'
            }}>
              <FontAwesomeIcon 
                icon={formData.status === 'active' ? faToggleOn : faToggleOff} 
                style={{ marginRight: '0.5rem', color: 'var(--sand-600)' }} 
              />
              Status
            </label>
            <select
              className="form-control"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              style={{
                padding: '0.75rem 1rem',
                border: '2px solid var(--sand-300)',
                borderRadius: '10px',
                fontSize: '1rem',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--sand-600)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--sand-300)'}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Info Box */}
          <div style={{
            padding: '1rem',
            backgroundColor: '#d1ecf1',
            borderRadius: '10px',
            borderLeft: '4px solid #17a2b8',
            marginBottom: '1.5rem'
          }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#0c5460' }}>
              Only member status (Active/Inactive) can be modified. Name, email, and phone are read-only for security reasons.
            </p>
          </div>

          {/* Buttons */}
          <div className="d-flex gap-2 justify-content-end" style={{
            marginTop: 'auto',
            paddingTop: '1rem'
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
                transition: 'all 0.3s',
                opacity: loading ? 0.7 : 1
              }}
              onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = 'var(--sand-700)')}
              onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = 'var(--sand-600)')}
            >
              {loading ? 'Updating...' : 'Update Member'}
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
