import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { loginUser } from '../APIS/apis/Authapi';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from "react-toastify";
import Cookies from "js-cookie";

export default function Login({ onLogin }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate  = useNavigate();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Reset any stuck states
      document.body.style.overflow = 'auto';
      document.body.style.pointerEvents = 'auto';
    };
  }, []);

  const onSubmit = async(data) => {
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append('email', data.username);
    formData.append('password', data.password);
    
    try {
      const res = await dispatch(loginUser(formData));

      if(res?.payload?.success){
        toast.success("Login Successful!");
        // Store token in cookie
        Cookies.set("authToken", res?.payload?.token, { expires: 7 });
        Cookies.set("isAuthenticate", true, { expires: 7 });
        
        // Use window.location for clean page reload (fixes stuck overlay issue)
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 500);
      } else {
        toast.error(res?.payload?.message || "Invalid credentials");
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f9f6ed 0%, #e2d3a6 50%, #d1b573 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(179, 135, 63, 0.15) 0%, transparent 70%)',
        animation: 'float 6s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '-5%',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200, 164, 93, 0.15) 0%, transparent 70%)',
        animation: 'float 8s ease-in-out infinite reverse'
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(154, 107, 52, 0.08) 0%, transparent 70%)',
        animation: 'pulse 10s ease-in-out infinite'
      }} />

      <div style={{
        width: '100%',
        maxWidth: '480px',
        padding: '2rem',
        position: 'relative',
        zIndex: 1,
        animation: 'slideUp 0.8s ease-out'
      }}>
        {/* Logo and Title */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '2.5rem',
          animation: 'fadeIn 1s ease-out'
        }}>
          <div style={{
            display: 'inline-block',
            padding: '1.5rem',
            backgroundColor: 'white',
            borderRadius: '20px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            marginBottom: '1.5rem',
            animation: 'scaleIn 0.6s ease-out'
          }}>
            <img
              src="/logo1.png"
              alt="Vamana"
              style={{
                height: '80px',
                width: 'auto',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </div>
          <h2 style={{
            color: 'var(--sand-900)',
            fontFamily: "'Playfair Display', serif",
            fontSize: '2.5rem',
            marginBottom: '0.5rem',
            fontWeight: '700',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            Admin Panel
          </h2>
          <p style={{
            color: 'var(--sand-800)',
            fontSize: '1rem',
            fontWeight: '500'
          }}>
            Welcome back! Please sign in to continue
          </p>
        </div>

        {/* Login Form */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          padding: '3rem',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          animation: 'slideUp 0.8s ease-out 0.2s backwards'
        }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Username */}
            <div style={{ marginBottom: '1.8rem' }}>
              <label style={{
                display: 'block',
                color: 'var(--sand-800)',
                fontSize: '0.95rem',
                fontWeight: '600',
                marginBottom: '0.7rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FontAwesomeIcon icon={faUser} style={{ color: 'var(--sand-600)' }} />
                Username
              </label>
              <input
                type="text"
                {...register('username', { required: 'Username is required' })}
                placeholder="Enter your username"
                style={{
                  width: '100%',
                  padding: '1rem 1.2rem',
                  border: errors.username ? '2px solid #dc3545' : '2px solid var(--sand-300)',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  backgroundColor: 'var(--sand-100)',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--sand-600)';
                  e.target.style.backgroundColor = 'white';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(179, 135, 63, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.username ? '#dc3545' : 'var(--sand-300)';
                  e.target.style.backgroundColor = 'var(--sand-100)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {errors.username && (
                <small style={{ 
                  color: '#dc3545', 
                  marginTop: '0.5rem', 
                  display: 'block',
                  fontSize: '0.85rem',
                  animation: 'shake 0.3s ease'
                }}>
                  {errors.username.message}
                </small>
              )}
            </div>

            {/* Password */}
            <div style={{ marginBottom: '2.5rem' }}>
              <label style={{
                display: 'block',
                color: 'var(--sand-800)',
                fontSize: '0.95rem',
                fontWeight: '600',
                marginBottom: '0.7rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FontAwesomeIcon icon={faLock} style={{ color: 'var(--sand-600)' }} />
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required' })}
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    padding: '1rem 3rem 1rem 1.2rem',
                    border: errors.password ? '2px solid #dc3545' : '2px solid var(--sand-300)',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    backgroundColor: 'var(--sand-100)',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--sand-600)';
                    e.target.style.backgroundColor = 'white';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(179, 135, 63, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.password ? '#dc3545' : 'var(--sand-300)';
                    e.target.style.backgroundColor = 'var(--sand-100)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--sand-600)',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    padding: '0.5rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--sand-700)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--sand-600)'}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {errors.password && (
                <small style={{ 
                  color: '#dc3545', 
                  marginTop: '0.5rem', 
                  display: 'block',
                  fontSize: '0.85rem',
                  animation: 'shake 0.3s ease'
                }}>
                  {errors.password.message}
                </small>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '1.1rem',
                border: 'none',
                borderRadius: '12px',
                background: isLoading 
                  ? 'linear-gradient(135deg, var(--sand-500) 0%, var(--sand-600) 100%)'
                  : 'linear-gradient(135deg, var(--sand-600) 0%, var(--sand-700) 100%)',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(179, 135, 63, 0.3)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(179, 135, 63, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(179, 135, 63, 0.3)';
                }
              }}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
                  <span style={{
                    width: '20px',
                    height: '20px',
                    border: '3px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '3px solid white',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
         
        </div>
      </div>

      {/* Animations */}
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

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.5;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.3;
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }
      `}</style>
    </div>
  );
}
