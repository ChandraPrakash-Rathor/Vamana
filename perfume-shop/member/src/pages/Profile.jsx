import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseUrl } from '../redux/apis/config';
import { getCurrentUser } from '../redux/apis/AuthApi';

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.AuthSlice);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
    }
  });

  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  const onSave = async (data) => {
    try {
      setSaving(true);
      const token = localStorage.getItem('memberToken');
      await axios.put(`${baseUrl}auth/profile`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await dispatch(getCurrentUser());
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div style={{ backgroundColor: 'var(--sand-50)', minHeight: '100vh', paddingTop: '100px', paddingBottom: '3rem' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="d-flex align-items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'none', border: 'none', color: 'var(--sand-600)', fontSize: '1.5rem', cursor: 'pointer' }}
          >
            ←
          </button>
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--sand-900)', margin: 0, fontSize: '2rem' }}>
            My Profile
          </h2>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          {/* Avatar */}
          <div className="text-center mb-4">
            <div style={{
              width: '90px', height: '90px', borderRadius: '50%',
              backgroundColor: 'var(--sand-600)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', fontWeight: '700', margin: '0 auto 1rem'
            }}>
              {initials}
            </div>
            <h4 style={{ color: 'var(--sand-900)', fontWeight: '700', marginBottom: '0.25rem' }}>{user?.name}</h4>
            <p style={{ color: 'var(--sand-600)', margin: 0, fontSize: '0.9rem' }}>{user?.email}</p>
          </div>

          {!editing ? (
            <>
              {/* View Mode */}
              <div className="d-flex flex-column gap-3 mb-4">
                {[
                  { label: 'Full Name', value: user?.name },
                  { label: 'Email', value: user?.email },
                  { label: 'Phone', value: user?.phone || 'Not set' },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    padding: '0.75rem 1rem', backgroundColor: 'var(--sand-50)',
                    borderRadius: '10px', border: '1px solid var(--sand-200)'
                  }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--sand-600)', marginBottom: '0.2rem' }}>{label}</div>
                    <div style={{ fontWeight: '600', color: 'var(--sand-900)' }}>{value}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setEditing(true)}
                style={{
                  width: '100%', padding: '0.85rem', backgroundColor: 'var(--sand-600)',
                  color: 'white', border: 'none', borderRadius: '10px',
                  fontWeight: '700', fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s'
                }}
                onMouseEnter={e => e.target.style.backgroundColor = 'var(--sand-700)'}
                onMouseLeave={e => e.target.style.backgroundColor = 'var(--sand-600)'}
              >
                Edit Profile
              </button>
            </>
          ) : (
            /* Edit Mode */
            <form onSubmit={handleSubmit(onSave)}>
              <div className="d-flex flex-column gap-3 mb-4">
                <div>
                  <label style={{ fontWeight: '600', color: 'var(--sand-800)', marginBottom: '0.4rem', display: 'block', fontSize: '0.9rem' }}>
                    Full Name
                  </label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    style={{
                      width: '100%', padding: '0.75rem', borderRadius: '10px',
                      border: `2px solid ${errors.name ? '#dc3545' : 'var(--sand-300)'}`,
                      fontSize: '0.95rem', outline: 'none'
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--sand-600)'}
                    onBlur={e => e.target.style.borderColor = errors.name ? '#dc3545' : 'var(--sand-300)'}
                  />
                  {errors.name && <small style={{ color: '#dc3545' }}>{errors.name.message}</small>}
                </div>

                <div>
                  <label style={{ fontWeight: '600', color: 'var(--sand-800)', marginBottom: '0.4rem', display: 'block', fontSize: '0.9rem' }}>
                    Email
                  </label>
                  <input
                    value={user?.email}
                    disabled
                    style={{
                      width: '100%', padding: '0.75rem', borderRadius: '10px',
                      border: '2px solid var(--sand-200)', fontSize: '0.95rem',
                      backgroundColor: 'var(--sand-100)', color: 'var(--sand-600)', cursor: 'not-allowed'
                    }}
                  />
                  <small style={{ color: 'var(--sand-500)', fontSize: '0.8rem' }}>Email cannot be changed</small>
                </div>

                <div>
                  <label style={{ fontWeight: '600', color: 'var(--sand-800)', marginBottom: '0.4rem', display: 'block', fontSize: '0.9rem' }}>
                    Phone
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    style={{
                      width: '100%', padding: '0.75rem', borderRadius: '10px',
                      border: '2px solid var(--sand-300)', fontSize: '0.95rem', outline: 'none'
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--sand-600)'}
                    onBlur={e => e.target.style.borderColor = 'var(--sand-300)'}
                  />
                </div>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  style={{
                    flex: 1, padding: '0.85rem', backgroundColor: 'white',
                    color: 'var(--sand-700)', border: '2px solid var(--sand-300)',
                    borderRadius: '10px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    flex: 1, padding: '0.85rem',
                    backgroundColor: saving ? 'var(--sand-400)' : 'var(--sand-600)',
                    color: 'white', border: 'none', borderRadius: '10px',
                    fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer', transition: 'all 0.3s'
                  }}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
