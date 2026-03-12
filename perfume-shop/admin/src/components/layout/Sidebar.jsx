import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faBox,
  faShoppingCart,
  faUsers,
  faTicket,
  faTags,
  faBolt,
  faFileAlt,
  faCog
} from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { getSiteSettings } from '../../APIS/apis/SiteSettingsApi';

export default function Sidebar({ collapsed, mobileOpen, onLinkClick }) {
  const location = useLocation();
  const [siteSettings, setSiteSettings] = useState(null);

  // Fetch site settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSiteSettings();
        setSiteSettings(data.data);
      } catch (error) {
        console.error('Failed to load site settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const menuItems = [
    { path: '/dashboard', icon: faTachometerAlt, label: 'Dashboard' },
    { path: '/products', icon: faBox, label: 'Products' },
    { path: '/orders', icon: faShoppingCart, label: 'Orders' },
    { path: '/users', icon: faUsers, label: 'Users' },
    { path: '/coupons', icon: faTicket, label: 'Coupons' },
    { path: '/sales', icon: faTags, label: 'Sales' },
    { path: '/limited-offers', icon: faBolt, label: 'Limited Offers' },
    { path: '/content', icon: faFileAlt, label: 'Content' },
    { path: '/settings', icon: faCog, label: 'Settings' }
  ];

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      {/* Logo */}
      <div className="text-center py-3 py-md-4 border-bottom border-secondary border-opacity-25">
        <img
          src={siteSettings?.logo ? `http://localhost:5000${siteSettings.logo}` : '/logo1.png'}
          alt={siteSettings?.siteName || 'Vamana'}
          className="img-fluid"
          style={{
            height: collapsed ? '40px' : '60px',
            width: 'auto',
            objectFit: 'contain',
            borderRadius: '10px',
            transition: 'all 0.3s ease'
          }}
        />
        {!collapsed && (
          <h5 className="text-white mt-3 mb-0" style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.2rem'
          }}>
            {siteSettings?.siteName || 'Vamana'} Admin
          </h5>
        )}
      </div>

      {/* Menu Items */}
      <nav className="py-3">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onLinkClick}
            className={`d-flex align-items-center text-decoration-none ${
              collapsed ? 'justify-content-center' : ''
            }`}
            style={{
              padding: collapsed ? '1rem 0' : '1rem 1.5rem',
              color: location.pathname === item.path ? 'white' : 'rgba(255, 255, 255, 0.7)',
              backgroundColor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              borderLeft: location.pathname === item.path ? '4px solid var(--sand-400)' : '4px solid transparent',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== item.path) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.color = 'white';
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== item.path) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
              }
            }}
          >
            <FontAwesomeIcon 
              icon={item.icon} 
              className={collapsed ? '' : 'me-3'}
              style={{ 
                fontSize: '1.2rem',
                width: '20px'
              }} 
            />
            {!collapsed && (
              <span style={{ 
                fontSize: '0.95rem',
                fontWeight: location.pathname === item.path ? '600' : '400'
              }}>
                {item.label}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
}
