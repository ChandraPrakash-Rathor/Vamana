import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser, faSearch } from '@fortawesome/free-solid-svg-icons';
import LoginModal from './LoginModal';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check login status
    const loggedIn = localStorage.getItem('userLoggedIn');
    setIsLoggedIn(!!loggedIn);
  }, []);

  const handleAccountClick = (e) => {
    e.preventDefault();
    const loggedIn = localStorage.getItem('userLoggedIn');
    if (loggedIn) {
      // Navigate to account page or show account menu
      alert('Account page coming soon!');
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLoginClose = () => {
    setShowLoginModal(false);
    // Refresh login status
    const loggedIn = localStorage.getItem('userLoggedIn');
    setIsLoggedIn(!!loggedIn);
  };

  return (
    <nav
      className={`navbar navbar-expand-lg fixed-top transition-all duration-500 ease-in-out ${
        scrolled ? 'py-2' : 'py-3'
      }`}
      style={{
        backgroundColor: scrolled ? 'rgba(249, 246, 237, 0.98)' : 'rgba(249, 246, 237, 0.95)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        borderBottom: scrolled ? `1px solid var(--sand-400)` : `1px solid var(--sand-300)`,
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.08)' : '0 2px 10px rgba(0,0,0,0.04)',
        zIndex: 1030,
        transition: 'all 0.4s ease'
      }}
    >
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand p-0 m-0" to="/">
          <img
            src="/logo1.png"
            alt="Vamana"
            style={{
              height: scrolled ? '50px' : '65px',
              width: 'auto',
              objectFit: 'contain',
              borderRadius: '10px',
              transition: 'all 0.4s ease',
              filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.1))',
            }}
          />
        </Link>

        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          style={{
            color: 'var(--sand-900)',
            outline: 'none'
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center gap-1">
            <li className="nav-item">
              <Link 
                className="nav-link px-4 py-2 position-relative d-inline-block" 
                to="/" 
                style={{ 
                  color: location.pathname === '/' ? 'var(--sand-600)' : 'var(--sand-900)',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  letterSpacing: '0.3px',
                  transition: 'all 0.3s ease',
                  fontFamily: "'Roboto', sans-serif",
                  borderBottom: location.pathname === '/' ? '2px solid var(--sand-600)' : 'none'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--sand-600)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = location.pathname === '/' ? 'var(--sand-600)' : 'var(--sand-900)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className="nav-link px-4 py-2 position-relative d-inline-block" 
                to="/catalog" 
                style={{ 
                  color: location.pathname === '/catalog' ? 'var(--sand-600)' : 'var(--sand-900)',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  letterSpacing: '0.3px',
                  transition: 'all 0.3s ease',
                  fontFamily: "'Roboto', sans-serif",
                  borderBottom: location.pathname === '/catalog' ? '2px solid var(--sand-600)' : 'none'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--sand-600)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = location.pathname === '/catalog' ? 'var(--sand-600)' : 'var(--sand-900)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Catalog
              </Link>
            </li>

            {/* Sale Link */}
            <li className="nav-item">
              <Link 
                className="nav-link px-4 py-2 position-relative d-inline-block" 
                to="/sale" 
                style={{ 
                  color: location.pathname === '/sale' ? '#ff4444' : 'var(--sand-900)',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  letterSpacing: '0.3px',
                  transition: 'all 0.3s ease',
                  fontFamily: "'Roboto', sans-serif",
                  borderBottom: location.pathname === '/sale' ? '2px solid #ff4444' : 'none'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#ff4444';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = location.pathname === '/sale' ? '#ff4444' : 'var(--sand-900)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                🔥 Sale
              </Link>
            </li>
            
            {/* Cart with Badge */}
            <li className="nav-item">
              <Link 
                className="nav-link px-4 py-2 position-relative d-inline-flex align-items-center gap-2" 
                to="/cart" 
                style={{ 
                  color: location.pathname === '/cart' ? 'var(--sand-600)' : 'var(--sand-900)',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  letterSpacing: '0.3px',
                  transition: 'all 0.3s ease',
                  fontFamily: "'Roboto', sans-serif",
                  borderBottom: location.pathname === '/cart' ? '2px solid var(--sand-600)' : 'none'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--sand-600)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = location.pathname === '/cart' ? 'var(--sand-600)' : 'var(--sand-900)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <FontAwesomeIcon icon={faShoppingCart} />
                Cart
              </Link>
            </li>
            
            <li className="nav-item">
              <a
                href="#"
                className="nav-link px-4 py-2 position-relative d-inline-flex align-items-center gap-2" 
                onClick={handleAccountClick}
                style={{ 
                  color: 'var(--sand-900)',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  letterSpacing: '0.3px',
                  transition: 'all 0.3s ease',
                  fontFamily: "'Roboto', sans-serif",
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = 'var(--sand-600)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = 'var(--sand-900)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <FontAwesomeIcon icon={faUser} />
                {isLoggedIn ? 'My Account' : 'Login'}
              </a>
            </li>

            {/* Divider */}
            <li className="nav-item ms-2 me-2">
              <div 
                style={{
                  width: '1px',
                  height: '30px',
                  backgroundColor: 'var(--sand-400)'
                }}
              />
            </li>

            {/* Search Icon Button */}
            <li className="nav-item">
              <button
                className="btn rounded-circle d-flex align-items-center justify-content-center"
                type="button"
                style={{
                  width: '42px',
                  height: '42px',
                  backgroundColor: 'var(--sand-300)',
                  border: 'none',
                  color: 'var(--sand-800)',
                  transition: 'all 0.3s ease',
                  fontSize: '1rem'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--sand-600)';
                  e.target.style.color = 'white';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--sand-300)';
                  e.target.style.color = 'var(--sand-800)';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal 
        show={showLoginModal} 
        onClose={handleLoginClose} 
      />
    </nav>
  );
}