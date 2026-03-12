import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFacebookF, 
  faInstagram, 
  faTwitter, 
  faYoutube, 
  faLinkedin,
  faCcVisa,
  faCcMastercard,
  faCcAmex,
  faCcPaypal
} from '@fortawesome/free-brands-svg-icons';
import { 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt, 
  faArrowRight,
  faHeart
} from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [siteSettings, setSiteSettings] = useState(null);

  // Fetch site settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/member/site-settings');
        setSiteSettings(response.data.data);
      } catch (error) {
        console.error('Failed to load site settings:', error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer style={{ backgroundColor: 'var(--sand-900)', color: 'white' }}>
      {/* Newsletter Section */}
      <div style={{
        background: 'linear-gradient(135deg, var(--sand-700) 0%, var(--sand-800) 100%)',
        padding: 'clamp(2rem, 4vw, 3rem) 0'
      }}>
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                marginBottom: '0.5rem',
                fontWeight: '600'
              }}>
                Subscribe to Our Newsletter
              </h3>
              <p style={{
                fontSize: 'clamp(0.9rem, 1.8vw, 1rem)',
                opacity: 0.9,
                marginBottom: 0
              }}>
                Get exclusive offers, new arrivals, and fragrance tips delivered to your inbox
              </p>
            </div>
            <div className="col-lg-6">
              <div className="d-flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  style={{
                    flex: 1,
                    padding: '0.9rem 1.2rem',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    backgroundColor: 'white',
                    color: 'var(--sand-900)'
                  }}
                />
                <button
                  style={{
                    padding: '0.9rem 1.8rem',
                    border: 'none',
                    borderRadius: '10px',
                    backgroundColor: 'var(--sand-600)',
                    color: 'white',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--sand-500)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'var(--sand-600)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Subscribe <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div style={{ padding: 'clamp(3rem, 6vw, 4rem) 0 clamp(2rem, 4vw, 3rem)' }}>
        <div className="container">
          <div className="row g-4">
            {/* Brand Section */}
            <div className="col-lg-4 col-md-6">
              <div style={{ marginBottom: '1.5rem' }}>
                <img
                  src={siteSettings?.logo ? `http://localhost:5000${siteSettings.logo}` : '/logo3.png'}
                  alt={siteSettings?.siteName || 'Vamana'}
                  style={{
                    height: '60px',
                    width: 'auto',
                    marginBottom: '1rem'
                  }}
                />
                <p style={{
                  fontSize: '0.95rem',
                  lineHeight: '1.7',
                  opacity: 0.85,
                  marginBottom: '1.5rem'
                }}>
                  {siteSettings?.footerAbout || 'Vamana brings you the finest collection of luxury perfumes and traditional attars. Experience timeless elegance with every fragrance.'}
                </p>
              </div>

              {/* Social Media */}
              <div>
                <h6 style={{
                  fontSize: '1rem',
                  fontWeight: '700',
                  marginBottom: '1rem',
                  letterSpacing: '0.5px'
                }}>
                  Follow Us
                </h6>
                <div className="d-flex gap-2">
                  {[
                    { icon: faFacebookF, link: siteSettings?.socialLinks?.facebook || '#', color: '#1877f2', show: siteSettings?.socialLinks?.facebook },
                    { icon: faInstagram, link: siteSettings?.socialLinks?.instagram || '#', color: '#e4405f', show: siteSettings?.socialLinks?.instagram },
                    { icon: faTwitter, link: siteSettings?.socialLinks?.twitter || '#', color: '#1da1f2', show: siteSettings?.socialLinks?.twitter },
                    { icon: faYoutube, link: siteSettings?.socialLinks?.youtube || '#', color: '#ff0000', show: siteSettings?.socialLinks?.youtube },
                    { icon: faLinkedin, link: siteSettings?.socialLinks?.linkedin || '#', color: '#0077b5', show: siteSettings?.socialLinks?.linkedin }
                  ].filter(social => social.show).map((social, index) => (
                    <a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        fontSize: '1rem'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = social.color;
                        e.target.style.transform = 'translateY(-3px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      <FontAwesomeIcon icon={social.icon} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-lg-2 col-md-6 col-6">
              <h6 style={{
                fontSize: '1rem',
                fontWeight: '700',
                marginBottom: '1rem',
                letterSpacing: '0.5px'
              }}>
                Quick Links
              </h6>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  { label: 'Home', path: '/' },
                  { label: 'Catalog', path: '/catalog' },
                  { label: 'About Us', path: '/about-us' },
                  { label: 'Contact', path: '/contact-us' },
                  { label: 'Sale', path: '/sale' }
                ].map((link, index) => (
                  <li key={index} style={{ marginBottom: '0.7rem' }}>
                    <Link
                      to={link.path}
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                        display: 'inline-block'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = 'white';
                        e.target.style.paddingLeft = '5px';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                        e.target.style.paddingLeft = '0';
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div className="col-lg-2 col-md-6 col-6">
              <h6 style={{
                fontSize: '1rem',
                fontWeight: '700',
                marginBottom: '1rem',
                letterSpacing: '0.5px'
              }}>
                Customer Service
              </h6>
              {/* <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  { label: 'Track Order', path: '/track-order' },
                  { label: 'Returns', path: '/returns' },
                  { label: 'Shipping Info', path: '/shipping-info' },
                  { label: 'FAQ', path: '#' },
                  { label: 'Size Guide', path: '#' }
                ].map((item, index) => (
                  <li key={index} style={{ marginBottom: '0.7rem' }}>
                    <Link
                      to={item.path}
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                        display: 'inline-block'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = 'white';
                        e.target.style.paddingLeft = '5px';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                        e.target.style.paddingLeft = '0';
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul> */}
            </div>

            {/* Contact Info */}
            <div className="col-lg-4 col-md-6">
              <h6 style={{
                fontSize: '1rem',
                fontWeight: '700',
                marginBottom: '1rem',
                letterSpacing: '0.5px'
              }}>
                Contact Us
              </h6>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'start',
                  gap: '0.8rem'
                }}>
                  <FontAwesomeIcon 
                    icon={faMapMarkerAlt} 
                    style={{ 
                      color: 'var(--sand-600)', 
                      fontSize: '1.1rem',
                      marginTop: '0.2rem'
                    }} 
                  />
                  <div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.85, lineHeight: '1.6' }}>
                      {siteSettings?.address || 'Mumbai, India'}
                    </div>
                  </div>
                </li>
                <li style={{
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem'
                }}>
                  <FontAwesomeIcon 
                    icon={faPhone} 
                    style={{ color: 'var(--sand-600)', fontSize: '1.1rem' }} 
                  />
                  <a
                    href={`tel:${siteSettings?.phone || '+911234567890'}`}
                    style={{
                      color: 'rgba(255, 255, 255, 0.85)',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'white'}
                    onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.85)'}
                  >
                    {siteSettings?.phone || '+91 123 456 7890'}
                  </a>
                </li>
                <li style={{
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem'
                }}>
                  <FontAwesomeIcon 
                    icon={faEnvelope} 
                    style={{ color: 'var(--sand-600)', fontSize: '1.1rem' }} 
                  />
                  <a
                    href={`mailto:${siteSettings?.email || 'info@vamana.com'}`}
                    style={{
                      color: 'rgba(255, 255, 255, 0.85)',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'white'}
                    onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.85)'}
                  >
                    {siteSettings?.email || 'info@vamana.com'}
                  </a>
                </li>
              </ul>

              {/* Business Hours */}
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
                borderLeft: '3px solid var(--sand-600)'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Business Hours
                </div>
                <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                  Mon - Sat: 9:00 AM - 8:00 PM<br />
                  Sunday: 10:00 AM - 6:00 PM
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '1.5rem 0'
      }}>
        <div className="container">
          <div className="row align-items-center g-3">
            <div className="col-md-6 text-center text-md-start">
              <p style={{
                fontSize: '0.9rem',
                opacity: 0.7,
                marginBottom: 0
              }}>
                {siteSettings?.footerCopyright || `© ${currentYear} Vamana. All rights reserved.`} Made with <FontAwesomeIcon icon={faHeart} style={{ color: '#e74c3c' }} /> in India
              </p>
            </div>
            <div className="col-md-6">
              <div className="d-flex justify-content-center justify-content-md-end align-items-center gap-3 flex-wrap">
                <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>We Accept:</span>
                <div className="d-flex gap-2">
                  {[faCcVisa, faCcMastercard, faCcAmex, faCcPaypal].map((icon, index) => (
                    <div
                      key={index}
                      style={{
                        width: '45px',
                        height: '30px',
                        backgroundColor: 'white',
                        borderRadius: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        color: 'var(--sand-900)'
                      }}
                    >
                      <FontAwesomeIcon icon={icon} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Legal Links */}
          <div className="text-center mt-3">
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Sitemap'].map((item, index) => (
                <a
                  key={index}
                  href="#"
                  style={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'white'}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
