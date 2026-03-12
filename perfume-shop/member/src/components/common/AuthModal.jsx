import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUser, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { checkPhone, registerUser } from '../../redux/apis/AuthApi';
import { clearError, clearSuccess, clearPhoneCheck } from '../../redux/slices/AuthSlice';
import { getCart, addToCart } from '../../redux/apis/CartApi';
import { toast } from 'react-toastify';

export default function AuthModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { loading, error, success, phoneExists, pendingPhone, user } = useSelector(state => state.AuthSlice);
  
  const [step, setStep] = useState('phone'); // 'phone' or 'register'
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Registration form (only shown if phone doesn't exist)
  const [registerData, setRegisterData] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    if (success && user) {
      toast.success(success);
      
      // Verify token is in localStorage before proceeding
      const token = localStorage.getItem('memberToken');
      
      if (token) {
        // Fetch cart after successful login/registration
        dispatch(getCart()).then((result) => {
          
          // Check for pending cart item after cart is loaded
          const pendingItem = sessionStorage.getItem('pendingCartItem');
          if (pendingItem) {
            try {
              const { productId, quantity } = JSON.parse(pendingItem);
              // Add pending item to cart
              dispatch(addToCart({ productId, quantity })).then((addResult) => {
                if (addResult.payload?.success) {
                  toast.success(`Added ${quantity} item(s) to cart!`);
                }
                // Clear pending item after successful add
                sessionStorage.removeItem('pendingCartItem');
              }).catch((error) => {
                console.error('Error adding pending cart item:', error);
              });
            } catch (error) {
              console.error('Error parsing pending cart item:', error);
            }
          }
        });
      } else {
        console.error('Token not found in localStorage after login!');
      }
      
      // Close modal and reset form AFTER starting cart operations
      dispatch(clearSuccess());
      onClose();
      setStep('phone');
      setPhoneNumber('');
      setRegisterData({ name: '', email: '' });
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [success, error, dispatch, onClose, user]);

  // When phone check returns false (phone doesn't exist), show registration form
  useEffect(() => {
    if (phoneExists === false && pendingPhone) {
      setStep('register');
      setPhoneNumber(pendingPhone);
    }
  }, [phoneExists, pendingPhone]);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    
    // Validate phone number (10 digits starting with 6-9)
    if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    await dispatch(checkPhone({ phone: phoneNumber }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!registerData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!registerData.email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    // Email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(registerData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    await dispatch(registerUser({
      name: registerData.name,
      email: registerData.email,
      phone: phoneNumber
    }));
  };

  const handleClose = () => {
    dispatch(clearPhoneCheck());
    dispatch(clearError());
    dispatch(clearSuccess());
    setStep('phone');
    setPhoneNumber('');
    setRegisterData({ name: '', email: '' });
    onClose();
  };

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('phone');
      setPhoneNumber('');
      setRegisterData({ name: '', email: '' });
      dispatch(clearPhoneCheck());
      dispatch(clearError());
      dispatch(clearSuccess());
    }
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

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
      zIndex: 9999,
      padding: '1rem',
      overflowY: 'auto'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '450px',
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
            fontSize: '1.5rem',
            fontFamily: "'Playfair Display', serif"
          }}>
            {step === 'phone' ? 'Welcome to Vamana' : 'Complete Your Profile'}
          </h4>
          <button
            onClick={handleClose}
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
          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit}>
              <p style={{
                color: 'var(--sand-700)',
                fontSize: '0.95rem',
                marginBottom: '1.5rem',
                lineHeight: '1.6'
              }}>
                Enter your WhatsApp number to continue. We'll check if you're already registered.
              </p>

              <div className="mb-4">
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: 'var(--sand-800)',
                  fontSize: '0.95rem'
                }}>
                  <FontAwesomeIcon icon={faPhone} style={{ marginRight: '0.5rem' }} />
                  WhatsApp Number
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--sand-700)',
                    fontWeight: '600'
                  }}>
                    +91
                  </span>
                  <input
                    type="tel"
                    className="form-control"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    required
                    placeholder="9876543210"
                    maxLength={10}
                    style={{
                      padding: '0.75rem 1rem 0.75rem 3.5rem',
                      border: '2px solid var(--sand-300)',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      transition: 'all 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--sand-600)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--sand-300)'}
                  />
                </div>
                <small style={{ color: 'var(--sand-600)', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                  Please use the same number you use for WhatsApp
                </small>
              </div>

              <button
                type="submit"
                disabled={loading || phoneNumber.length !== 10}
                className="btn w-100"
                style={{
                  padding: '0.75rem',
                  backgroundColor: 'var(--sand-600)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '1rem',
                  transition: 'all 0.3s',
                  opacity: (loading || phoneNumber.length !== 10) ? 0.7 : 1,
                  cursor: (loading || phoneNumber.length !== 10) ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={(e) => !loading && phoneNumber.length === 10 && (e.target.style.backgroundColor = 'var(--sand-700)')}
                onMouseLeave={(e) => !loading && phoneNumber.length === 10 && (e.target.style.backgroundColor = 'var(--sand-600)')}
              >
                {loading ? 'Checking...' : 'Continue'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <p style={{
                color: 'var(--sand-700)',
                fontSize: '0.95rem',
                marginBottom: '1.5rem',
                lineHeight: '1.6'
              }}>
                Great! Let's create your account. Just need a few more details.
              </p>

              <div className="mb-3">
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: 'var(--sand-800)',
                  fontSize: '0.95rem'
                }}>
                  <FontAwesomeIcon icon={faPhone} style={{ marginRight: '0.5rem' }} />
                  Phone Number
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={`+91 ${phoneNumber}`}
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
              </div>

              <div className="mb-3">
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: 'var(--sand-800)',
                  fontSize: '0.95rem'
                }}>
                  <FontAwesomeIcon icon={faUser} style={{ marginRight: '0.5rem' }} />
                  Full Name <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  required
                  placeholder="Enter your full name"
                  style={{
                    padding: '0.75rem 1rem',
                    border: '2px solid var(--sand-300)',
                    borderRadius: '10px',
                    fontSize: '1rem'
                  }}
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
                  Email <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <input
                  type="email"
                  className="form-control"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                  placeholder="your.email@example.com"
                  style={{
                    padding: '0.75rem 1rem',
                    border: '2px solid var(--sand-300)',
                    borderRadius: '10px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    dispatch(clearPhoneCheck());
                  }}
                  className="btn"
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: 'var(--sand-200)',
                    color: 'var(--sand-900)',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: '600',
                    fontSize: '1rem',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--sand-300)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--sand-200)'}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn"
                  style={{
                    flex: 2,
                    padding: '0.75rem',
                    backgroundColor: 'var(--sand-600)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: '600',
                    fontSize: '1rem',
                    transition: 'all 0.3s',
                    opacity: loading ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = 'var(--sand-700)')}
                  onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = 'var(--sand-600)')}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
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
