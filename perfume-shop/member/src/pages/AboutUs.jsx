import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../redux/apis/config';

export default function AboutUs() {
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSiteSettings();
  }, []);

  const fetchSiteSettings = async () => {
    try {
      const response = await axios.get(`${baseUrl}site-settings`);
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
            About {siteSettings?.siteName || 'Vamana Perfumes'}
          </h1>
          <p style={{
            color: 'var(--sand-600)',
            fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            {siteSettings?.tagline || 'Discover the essence of luxury fragrances'}
          </p>
        </div>

        {/* Story Section */}
        <div className="row mb-5 align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div style={{
              background: 'linear-gradient(135deg, var(--sand-200) 0%, var(--sand-300) 100%)',
              borderRadius: '20px',
              padding: '3rem',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8rem'
            }}>
              🧴
            </div>
          </div>
          <div className="col-lg-6">
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              color: 'var(--sand-800)',
              fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
              marginBottom: '1.2rem',
              fontWeight: '600'
            }}>
              Our Story
            </h2>
            <p style={{
              color: 'var(--sand-700)',
              fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
              lineHeight: '1.7',
              marginBottom: '1rem'
            }}>
              Welcome to {siteSettings?.siteName || 'Vamana Perfumes'}, where luxury meets affordability. 
              We believe that everyone deserves to experience the magic of premium fragrances.
            </p>
            <p style={{
              color: 'var(--sand-700)',
              fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
              lineHeight: '1.7'
            }}>
              Our carefully curated collection features the finest perfumes from around the world, 
              each bottle telling its own unique story of elegance and sophistication.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="row mb-5">
          <div className="col-12 text-center mb-4">
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              color: 'var(--sand-800)',
              fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
              fontWeight: '600'
            }}>
              Why Choose Us
            </h2>
          </div>
          
          <div className="col-md-4 mb-4">
            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '2rem',
              textAlign: 'center',
              height: '100%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
              <h3 style={{
                color: 'var(--sand-800)',
                fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
                marginBottom: '0.8rem',
                fontWeight: '600'
              }}>
                Premium Quality
              </h3>
              <p style={{ color: 'var(--sand-600)', fontSize: 'clamp(0.9rem, 2vw, 0.95rem)', lineHeight: '1.6' }}>
                Only authentic, high-quality perfumes from trusted brands worldwide
              </p>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '2rem',
              textAlign: 'center',
              height: '100%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚚</div>
              <h3 style={{
                color: 'var(--sand-800)',
                fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
                marginBottom: '0.8rem',
                fontWeight: '600'
              }}>
                Fast Delivery
              </h3>
              <p style={{ color: 'var(--sand-600)', fontSize: 'clamp(0.9rem, 2vw, 0.95rem)', lineHeight: '1.6' }}>
                Quick and secure delivery to your doorstep with careful packaging
              </p>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '2rem',
              textAlign: 'center',
              height: '100%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💝</div>
              <h3 style={{
                color: 'var(--sand-800)',
                fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
                marginBottom: '0.8rem',
                fontWeight: '600'
              }}>
                Best Prices
              </h3>
              <p style={{ color: 'var(--sand-600)', fontSize: 'clamp(0.9rem, 2vw, 0.95rem)', lineHeight: '1.6' }}>
                Competitive pricing with regular offers and discounts for our customers
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div style={{
          background: 'linear-gradient(135deg, var(--sand-600) 0%, var(--sand-700) 100%)',
          borderRadius: '20px',
          padding: 'clamp(2rem, 5vw, 4rem)',
          textAlign: 'center',
          color: 'white'
        }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
            marginBottom: '0.8rem',
            fontWeight: '600'
          }}>
            Experience Luxury Today
          </h2>
          <p style={{
            fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
            marginBottom: '1.5rem',
            opacity: 0.9
          }}>
            Browse our exclusive collection and find your signature scent
          </p>
          <a
            href="/products"
            style={{
              display: 'inline-block',
              padding: '1rem 3rem',
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
            Shop Now
          </a>
        </div>
      </div>
    </div>
  );
}
