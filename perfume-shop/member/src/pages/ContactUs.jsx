import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';

export default function ContactUs() {
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings();
  }, []);

  const fetchSiteSettings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/member/site-settings');
      setSiteSettings(response.data.data);
    } catch (error) {
      console.error('Failed to load site settings:', error);
    }
  };

  return (
    <div style={{ background: 'var(--sand-50)', minHeight: '100vh', paddingTop: '100px', paddingBottom: '3rem' }}>
      <div className="container">
        {/* Hero Section */}
        <div className="text-center mb-5">
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            color: 'var(--sand-800)',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            marginBottom: '0.8rem',
            fontWeight: '700'
          }}>
            Get In Touch
          </h1>
          <p style={{
            color: 'var(--sand-600)',
            fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="row">
          {/* Contact Info Cards */}
          <div className="col-lg-4 mb-4">
            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '2rem',
              textAlign: 'center',
              height: '100%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--sand-500) 0%, var(--sand-600) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                color: 'white',
                fontSize: '1.8rem'
              }}>
                <FontAwesomeIcon icon={faPhone} />
              </div>
              <h3 style={{
                color: 'var(--sand-800)',
                fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)',
                marginBottom: '0.8rem',
                fontWeight: '600'
              }}>
                Phone
              </h3>
              <a href={`tel:${siteSettings?.phone || '+911234567890'}`} style={{
                color: 'var(--sand-600)',
                fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
                textDecoration: 'none',
                display: 'block',
                marginBottom: '0.5rem'
              }}>
                {siteSettings?.phone || '+91 1234567890'}
              </a>
              <p style={{ color: 'var(--sand-500)', fontSize: '0.85rem', margin: 0 }}>
                Mon-Sat, 9AM-7PM
              </p>
            </div>
          </div>

          <div className="col-lg-4 mb-4">
            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '2rem',
              textAlign: 'center',
              height: '100%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--sand-500) 0%, var(--sand-600) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                color: 'white',
                fontSize: '1.8rem'
              }}>
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <h3 style={{
                color: 'var(--sand-800)',
                fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)',
                marginBottom: '0.8rem',
                fontWeight: '600'
              }}>
                Email
              </h3>
              <a href={`mailto:${siteSettings?.email || 'contact@vamana.com'}`} style={{
                color: 'var(--sand-600)',
                fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
                textDecoration: 'none',
                display: 'block',
                marginBottom: '0.5rem',
                wordBreak: 'break-word'
              }}>
                {siteSettings?.email || 'contact@vamana.com'}
              </a>
              <p style={{ color: 'var(--sand-500)', fontSize: '0.85rem', margin: 0 }}>
                24/7 Support
              </p>
            </div>
          </div>

          <div className="col-lg-4 mb-4">
            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '2rem',
              textAlign: 'center',
              height: '100%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--sand-500) 0%, var(--sand-600) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                color: 'white',
                fontSize: '1.8rem'
              }}>
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </div>
              <h3 style={{
                color: 'var(--sand-800)',
                fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)',
                marginBottom: '0.8rem',
                fontWeight: '600'
              }}>
                Address
              </h3>
              <p style={{
                color: 'var(--sand-600)',
                fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
                marginBottom: '0.5rem',
                lineHeight: '1.6'
              }}>
                {siteSettings?.address || 'Mumbai, Maharashtra, India'}
              </p>
              <p style={{ color: 'var(--sand-500)', fontSize: '0.85rem', margin: 0 }}>
                Visit us anytime
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="row mt-5">
          <div className="col-12">
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: 'clamp(2rem, 5vw, 3rem)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                color: 'var(--sand-800)',
                fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
                marginBottom: '1.5rem',
                textAlign: 'center',
                fontWeight: '600'
              }}>
                Frequently Asked Questions
              </h2>

              <div className="row">
                <div className="col-md-6 mb-4">
                  <h4 style={{ color: 'var(--sand-800)', fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', marginBottom: '0.6rem' }}>
                    📦 What is your delivery time?
                  </h4>
                  <p style={{ color: 'var(--sand-600)', fontSize: 'clamp(0.9rem, 2vw, 0.95rem)', lineHeight: '1.6' }}>
                    We typically deliver within 3-5 business days. Express delivery options are also available.
                  </p>
                </div>

                <div className="col-md-6 mb-4">
                  <h4 style={{ color: 'var(--sand-800)', fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', marginBottom: '0.6rem' }}>
                    💳 What payment methods do you accept?
                  </h4>
                  <p style={{ color: 'var(--sand-600)', fontSize: 'clamp(0.9rem, 2vw, 0.95rem)', lineHeight: '1.6' }}>
                    We accept all major credit/debit cards, UPI, net banking, and Cash on Delivery (COD).
                  </p>
                </div>

                <div className="col-md-6 mb-4">
                  <h4 style={{ color: 'var(--sand-800)', fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', marginBottom: '0.6rem' }}>
                    ✅ Are your products authentic?
                  </h4>
                  <p style={{ color: 'var(--sand-600)', fontSize: 'clamp(0.9rem, 2vw, 0.95rem)', lineHeight: '1.6' }}>
                    Yes! We guarantee 100% authentic products sourced directly from authorized distributors.
                  </p>
                </div>

                <div className="col-md-6 mb-4">
                  <h4 style={{ color: 'var(--sand-800)', fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', marginBottom: '0.6rem' }}>
                    🔄 What is your return policy?
                  </h4>
                  <p style={{ color: 'var(--sand-600)', fontSize: 'clamp(0.9rem, 2vw, 0.95rem)', lineHeight: '1.6' }}>
                    We offer easy returns within 7 days if the product is unused and in original packaging.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-5" style={{
          background: 'linear-gradient(135deg, var(--sand-600) 0%, var(--sand-700) 100%)',
          borderRadius: '20px',
          padding: 'clamp(2rem, 5vw, 3rem)',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>💬</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
            marginBottom: '0.8rem',
            fontWeight: '600'
          }}>
            Still Have Questions?
          </h2>
          <p style={{
            fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
            marginBottom: '1.5rem',
            opacity: 0.9
          }}>
            Feel free to reach out to us anytime. We're here to help!
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <a
              href={`tel:${siteSettings?.phone || '+911234567890'}`}
              style={{
                display: 'inline-block',
                padding: '1rem 2rem',
                background: 'white',
                color: 'var(--sand-700)',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: 'clamp(1rem, 2vw, 1.1rem)',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <FontAwesomeIcon icon={faPhone} /> Call Us
            </a>
            <a
              href={`mailto:${siteSettings?.email || 'contact@vamana.com'}`}
              style={{
                display: 'inline-block',
                padding: '1rem 2rem',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '2px solid white',
                borderRadius: '10px',
                textDecoration: 'none',
                fontSize: 'clamp(1rem, 2vw, 1.1rem)',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'white';
                e.target.style.color = 'var(--sand-700)';
                e.target.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <FontAwesomeIcon icon={faEnvelope} /> Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
