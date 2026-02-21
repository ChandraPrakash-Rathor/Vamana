import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPhone, faKey } from '@fortawesome/free-solid-svg-icons';

export default function LoginModal({ show, onClose }) {
  const [step, setStep] = useState('mobile'); // 'mobile' or 'otp'
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  
  const { register: registerMobile, handleSubmit: handleSubmitMobile, formState: { errors: mobileErrors } } = useForm();
  const { register: registerOtp, handleSubmit: handleSubmitOtp, formState: { errors: otpErrors } } = useForm();

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  const handleMobileSubmit = (data) => {
    const formData = new FormData();
    formData.append('mobile', data.mobile);
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setMobile(data.mobile);
      setStep('otp');
      console.log('Mobile Form Data:', Object.fromEntries(formData));
    }, 1000);
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleOtpSubmit = (data) => {
    const otpValue = otp.join('');
    const formData = new FormData();
    formData.append('mobile', mobile);
    formData.append('otp', otpValue);
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('userLoggedIn', 'true');
      localStorage.setItem('userMobile', mobile);
      console.log('OTP Form Data:', Object.fromEntries(formData));
      onClose();
    }, 1000);
  };

  const handleResendOtp = () => {
    setOtp(['', '', '', '', '', '']);
    // Simulate resend
    alert('OTP resent successfully!');
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          margin: '0 auto',
          maxWidth: '500px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="modal-content"
          style={{
            backgroundColor: 'var(--sand-100)',
            border: 'none',
            borderRadius: '20px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
          }}
        >
          {/* Header */}
          <div
            className="modal-header border-0 pb-0"
            style={{
              padding: '1.5rem 1.5rem 0'
            }}
          >
            <h5
              className="modal-title w-100 text-center"
              style={{
                color: 'var(--sand-900)',
                fontWeight: '700',
                fontSize: '1.5rem'
              }}
            >
              {step === 'mobile' ? 'Welcome Back!' : 'Verify OTP'}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              style={{
                position: 'absolute',
                right: '1.5rem',
                top: '1.5rem'
              }}
            />
          </div>

          {/* Body */}
          <div className="modal-body" style={{ padding: '2rem' }}>
            {step === 'mobile' ? (
              <form onSubmit={handleSubmitMobile(handleMobileSubmit)}>
                <div className="text-center mb-4">
                  <div
                    className="d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: '70px',
                      height: '70px',
                      backgroundColor: 'var(--sand-300)',
                      borderRadius: '50%'
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faPhone}
                      style={{
                        fontSize: '1.8rem',
                        color: 'var(--sand-700)'
                      }}
                    />
                  </div>
                  <p
                    style={{
                      color: 'var(--sand-700)',
                      fontSize: '0.95rem'
                    }}
                  >
                    Enter your mobile number to continue
                  </p>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="mobile"
                    className="form-label"
                    style={{
                      color: 'var(--sand-800)',
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}
                  >
                    Mobile Number
                  </label>
                  <div className="input-group">
                    <span
                      className="input-group-text"
                      style={{
                        backgroundColor: 'var(--sand-200)',
                        border: '2px solid var(--sand-300)',
                        borderRight: 'none',
                        color: 'var(--sand-800)',
                        fontWeight: '600'
                      }}
                    >
                      +91
                    </span>
                    <input
                      type="tel"
                      className="form-control"
                      id="mobile"
                      placeholder="Enter 10 digit mobile number"
                      {...registerMobile('mobile', {
                        required: 'Mobile number is required',
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: 'Please enter a valid 10 digit mobile number'
                        }
                      })}
                      style={{
                        backgroundColor: 'white',
                        border: '2px solid var(--sand-300)',
                        borderLeft: 'none',
                        padding: '0.75rem',
                        fontSize: '1rem',
                        color: 'var(--sand-900)'
                      }}
                    />
                  </div>
                  {mobileErrors.mobile && (
                    <small className="text-danger mt-1 d-block">
                      {mobileErrors.mobile.message}
                    </small>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn w-100"
                  disabled={loading}
                  style={{
                    backgroundColor: 'var(--sand-700)',
                    color: 'white',
                    padding: '0.75rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    border: 'none',
                    borderRadius: '10px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.backgroundColor = 'var(--sand-800)';
                      e.target.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'var(--sand-700)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmitOtp(handleOtpSubmit)}>
                <div className="text-center mb-4">
                  <div
                    className="d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: '70px',
                      height: '70px',
                      backgroundColor: 'var(--sand-300)',
                      borderRadius: '50%'
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faKey}
                      style={{
                        fontSize: '1.8rem',
                        color: 'var(--sand-700)'
                      }}
                    />
                  </div>
                  <p
                    style={{
                      color: 'var(--sand-700)',
                      fontSize: '0.95rem',
                      marginBottom: '0.5rem'
                    }}
                  >
                    Enter the 6-digit OTP sent to
                  </p>
                  <p
                    style={{
                      color: 'var(--sand-900)',
                      fontSize: '1rem',
                      fontWeight: '600'
                    }}
                  >
                    +91 {mobile}
                  </p>
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    onClick={() => {
                      setStep('mobile');
                      setOtp(['', '', '', '', '', '']);
                    }}
                    style={{
                      color: 'var(--sand-600)',
                      fontSize: '0.85rem',
                      textDecoration: 'none'
                    }}
                  >
                    Change Number
                  </button>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-center gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        className="form-control text-center"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        maxLength="1"
                        style={{
                          width: '50px',
                          height: '50px',
                          fontSize: '1.5rem',
                          fontWeight: '700',
                          backgroundColor: 'white',
                          border: '2px solid var(--sand-300)',
                          borderRadius: '10px',
                          color: 'var(--sand-900)'
                        }}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn w-100 mb-3"
                  disabled={otp.join('').length !== 6 || loading}
                  style={{
                    backgroundColor: 'var(--sand-700)',
                    color: 'white',
                    padding: '0.75rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    border: 'none',
                    borderRadius: '10px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading && otp.join('').length === 6) {
                      e.target.style.backgroundColor = 'var(--sand-800)';
                      e.target.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'var(--sand-700)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>

                <div className="text-center">
                  <span style={{ color: 'var(--sand-700)', fontSize: '0.9rem' }}>
                    Didn't receive OTP?{' '}
                  </span>
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    onClick={handleResendOtp}
                    style={{
                      color: 'var(--sand-700)',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      textDecoration: 'underline'
                    }}
                  >
                    Resend
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
