import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser, faSearch, faSignOutAlt, faBox } from '@fortawesome/free-solid-svg-icons';
import { GetActiveSales } from '../../redux/apis/SaleApi';
import { logoutUser } from '../../redux/apis/AuthApi';
import { toast } from 'react-toastify';
import axios from 'axios';
import { baseUrl } from '../../redux/apis/config';

export default function Header({ onOpenAuth }) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [siteSettings, setSiteSettings] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownBtnRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sales } = useSelector((state) => state.SaleSlice);
  const { user } = useSelector((state) => state.AuthSlice);
  const { items } = useSelector((state) => state.CartSlice);

  // Fetch site settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${baseUrl}site-settings`);
        setSiteSettings(response.data.data);
      } catch (error) {
        console.error('Failed to load site settings:', error);
      }
    };
    fetchSettings();
  }, []);

  // Fetch active sales on component mount
  useEffect(() => {
    dispatch(GetActiveSales());
  }, [dispatch]);

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

  const handleAccountClick = (e) => {
    e.preventDefault();
    if (user) {
      // Navigate to account page
      toast.info('Account page coming soon!');
    } else {
      onOpenAuth();
    }
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    await dispatch(logoutUser());
    toast.success('Logged out successfully');
    navigate('/');
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('#user-dropdown-wrapper')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) {
      setSearchQuery('');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Calculate total cart items
  const cartItemCount = items?.reduce((total, item) => total + item.quantity, 0) || 0;

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
            src={siteSettings?.logo || '/logo3.png'}
            alt={siteSettings?.siteName || 'Vamana'}
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

        <div className="collapse navbar-collapse" id="navbarNav" style={{ overflow: 'visible' }}>
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

            {/* Sale Link - Only show if there are active sales */}
            {sales && sales.length > 0 && (
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
            )}
            
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
                <div style={{ position: 'relative' }}>
                  <FontAwesomeIcon icon={faShoppingCart} />
                  {cartItemCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-10px',
                      backgroundColor: '#e74c3c',
                      color: 'white',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.65rem',
                      fontWeight: '700'
                    }}>
                      {cartItemCount}
                    </span>
                  )}
                </div>
                Cart
              </Link>
            </li>
            
            {/* User Account */}
            <li className="nav-item">
              {user ? (
                <div id="user-dropdown-wrapper" style={{ position: 'relative' }}>
                  <button
                    ref={dropdownBtnRef}
                    onClick={() => {
                      if (!dropdownOpen && dropdownBtnRef.current) {
                        const rect = dropdownBtnRef.current.getBoundingClientRect();
                        setDropdownPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
                      }
                      setDropdownOpen(prev => !prev);
                    }}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--sand-900)', fontWeight: '600', fontSize: '0.95rem',
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      padding: '0.5rem 1rem', borderRadius: '8px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--sand-600)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--sand-900)'}
                  >
                    <FontAwesomeIcon icon={faUser} />
                    {user.name?.split(' ')[0] || 'Account'}
                    <span style={{ fontSize: '0.7rem', display: 'inline-block', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                  </button>

                  {dropdownOpen && (
                    <div style={{
                      position: 'fixed', top: dropdownPos.top, right: dropdownPos.right,
                      backgroundColor: 'white', border: '1px solid var(--sand-200)',
                      borderRadius: '12px', padding: '0.5rem',
                      minWidth: '190px', zIndex: 99999,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                      animation: 'fadeInDown 0.15s ease'
                    }}>
                      <div style={{ padding: '0.5rem 1rem 0.75rem', borderBottom: '1px solid var(--sand-100)', marginBottom: '0.25rem' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--sand-500)' }}>Signed in as</div>
                        <div style={{ fontWeight: '700', color: 'var(--sand-900)', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user.name}
                        </div>
                      </div>
                      <Link to="/my-orders" onClick={() => setDropdownOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1rem', borderRadius: '8px', color: 'var(--sand-900)', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--sand-50)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <FontAwesomeIcon icon={faBox} style={{ color: 'var(--sand-600)', width: '16px' }} />
                        My Orders
                      </Link>
                      <Link to="/profile" onClick={() => setDropdownOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 1rem', borderRadius: '8px', color: 'var(--sand-900)', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--sand-50)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <FontAwesomeIcon icon={faUser} style={{ color: 'var(--sand-600)', width: '16px' }} />
                        Profile
                      </Link>
                      <div style={{ borderTop: '1px solid var(--sand-100)', marginTop: '0.25rem', paddingTop: '0.25rem' }}>
                        <button onClick={handleLogout}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%', padding: '0.6rem 1rem', borderRadius: '8px', color: '#dc3545', fontWeight: '600', fontSize: '0.9rem', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fff5f5'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <FontAwesomeIcon icon={faSignOutAlt} style={{ width: '16px' }} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <a href="#" onClick={handleAccountClick}
                  className="nav-link px-4 py-2 d-inline-flex align-items-center gap-2"
                  style={{ color: 'var(--sand-900)', fontWeight: '600', fontSize: '0.95rem', transition: 'all 0.3s ease', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--sand-600)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--sand-900)'}
                >
                  <FontAwesomeIcon icon={faUser} />
                  Login
                </a>
              )}
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

            {/* Animated Search Bar */}
            <li className="nav-item">
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                {/* Search Input - Expands from left to right */}
                <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    style={{
                      width: searchOpen ? '250px' : '0px',
                      padding: searchOpen ? '0.6rem 1rem' : '0',
                      paddingRight: searchOpen ? '3rem' : '0',
                      border: searchOpen ? '2px solid var(--sand-400)' : 'none',
                      borderRadius: '25px',
                      backgroundColor: 'var(--sand-100)',
                      color: 'var(--sand-900)',
                      fontSize: '0.95rem',
                      outline: 'none',
                      transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                      opacity: searchOpen ? 1 : 0,
                      marginRight: searchOpen ? '0.5rem' : '0',
                      fontFamily: "'Roboto', sans-serif"
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--sand-600)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--sand-400)'}
                  />
                  
                  {/* Search Icon Button */}
                  <button
                    type={searchOpen ? 'submit' : 'button'}
                    onClick={!searchOpen ? handleSearchToggle : undefined}
                    className="btn rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '42px',
                      height: '42px',
                      backgroundColor: searchOpen ? 'var(--sand-600)' : 'var(--sand-300)',
                      border: 'none',
                      color: searchOpen ? 'white' : 'var(--sand-800)',
                      transition: 'all 0.3s ease',
                      fontSize: '1rem',
                      flexShrink: 0,
                      position: 'relative',
                      zIndex: 10
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--sand-600)';
                      e.target.style.color = 'white';
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = searchOpen ? 'var(--sand-600)' : 'var(--sand-300)';
                      e.target.style.color = searchOpen ? 'white' : 'var(--sand-800)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    <FontAwesomeIcon icon={faSearch} />
                  </button>
                </form>

                {/* Close button when search is open */}
                {searchOpen && (
                  <button
                    onClick={handleSearchToggle}
                    className="btn rounded-circle d-flex align-items-center justify-content-center ms-2"
                    style={{
                      width: '36px',
                      height: '36px',
                      backgroundColor: 'transparent',
                      border: '2px solid var(--sand-400)',
                      color: 'var(--sand-800)',
                      transition: 'all 0.3s ease',
                      fontSize: '0.9rem',
                      animation: 'fadeIn 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--sand-300)';
                      e.target.style.borderColor = 'var(--sand-600)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.borderColor = 'var(--sand-400)';
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        #navbarNav {
          overflow: visible !important;
        }
        #user-dropdown-wrapper {
          position: relative;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </nav>
  );
}