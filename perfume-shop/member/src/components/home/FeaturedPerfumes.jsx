import { useState } from 'react';
import { Link } from 'react-router-dom';
import { perfumes as allPerfumes } from '../../data/perfumes';
import ProductCard from '../common/ProductCard';

export default function FeaturedPerfumes() {
  const [activeTab, setActiveTab] = useState('perfumes');

  // Get first 4 perfumes and first 4 attars
  const perfumes = allPerfumes.filter(p => p.category === 'perfume').slice(0, 4);
  const attars = allPerfumes.filter(p => p.category === 'attar').slice(0, 4);
  
  // Combo: 2 perfumes + 2 attars
  const combo = [
    ...allPerfumes.filter(p => p.category === 'perfume').slice(0, 2),
    ...allPerfumes.filter(p => p.category === 'attar').slice(0, 2)
  ];

  const products = activeTab === 'perfumes' ? perfumes : activeTab === 'attar' ? attars : combo;

  return (
    <section 
      className="py-3"
      style={{
        backgroundColor: 'var(--sand-200)',
        position: 'relative',
        zIndex: 1
      }}
    >
      <div className="container py-2">
        {/* Section Header */}
        <div className="text-center mb-3 px-3">
          <h2 
            className="fw-bold mb-2"
            style={{
              color: 'var(--sand-900)',
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)'
            }}
          >
            Signature Collection
          </h2>
          <p 
            style={{
              color: 'var(--sand-700)',
              maxWidth: '600px',
              margin: '0 auto 1rem',
              fontSize: 'clamp(0.85rem, 1.6vw, 1rem)'
            }}
          >
            Discover Vamana's handpicked selection of exquisite fragrances
          </p>

          {/* Tabs */}
          <div className="d-flex justify-content-center gap-2 mb-3">
            <button
              onClick={() => setActiveTab('perfumes')}
              style={{
                padding: 'clamp(0.4rem, 1vw, 0.6rem) clamp(1.5rem, 3vw, 2.5rem)',
                border: 'none',
                borderRadius: '25px',
                backgroundColor: activeTab === 'perfumes' ? 'var(--sand-600)' : 'var(--sand-300)',
                color: activeTab === 'perfumes' ? 'white' : 'var(--sand-800)',
                fontSize: 'clamp(0.85rem, 1.6vw, 1rem)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: activeTab === 'perfumes' ? '0 4px 15px rgba(200, 164, 93, 0.4)' : 'none',
                transform: activeTab === 'perfumes' ? 'translateY(-2px)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'perfumes') {
                  e.target.style.backgroundColor = 'var(--sand-400)';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'perfumes') {
                  e.target.style.backgroundColor = 'var(--sand-300)';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              Perfumes
            </button>
            <button
              onClick={() => setActiveTab('attar')}
              style={{
                padding: 'clamp(0.4rem, 1vw, 0.6rem) clamp(1.5rem, 3vw, 2.5rem)',
                border: 'none',
                borderRadius: '25px',
                backgroundColor: activeTab === 'attar' ? 'var(--sand-600)' : 'var(--sand-300)',
                color: activeTab === 'attar' ? 'white' : 'var(--sand-800)',
                fontSize: 'clamp(0.85rem, 1.6vw, 1rem)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: activeTab === 'attar' ? '0 4px 15px rgba(200, 164, 93, 0.4)' : 'none',
                transform: activeTab === 'attar' ? 'translateY(-2px)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'attar') {
                  e.target.style.backgroundColor = 'var(--sand-400)';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'attar') {
                  e.target.style.backgroundColor = 'var(--sand-300)';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              Attar
            </button>
            <button
              onClick={() => setActiveTab('combo')}
              style={{
                padding: 'clamp(0.4rem, 1vw, 0.6rem) clamp(1.5rem, 3vw, 2.5rem)',
                border: 'none',
                borderRadius: '25px',
                backgroundColor: activeTab === 'combo' ? 'var(--sand-600)' : 'var(--sand-300)',
                color: activeTab === 'combo' ? 'white' : 'var(--sand-800)',
                fontSize: 'clamp(0.85rem, 1.6vw, 1rem)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: activeTab === 'combo' ? '0 4px 15px rgba(200, 164, 93, 0.4)' : 'none',
                transform: activeTab === 'combo' ? 'translateY(-2px)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'combo') {
                  e.target.style.backgroundColor = 'var(--sand-400)';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'combo') {
                  e.target.style.backgroundColor = 'var(--sand-300)';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              Combo
            </button>
          </div>
        </div>

        {/* Products Grid - 4 per row */}
        <div className="row g-2 g-md-3">
          {products.map((product) => (
            <div key={product.id} className="col-6 col-md-3">
              <ProductCard product={product} showAddToCart={false} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-3">
          <Link
            to="/catalog"
            className="btn px-3 py-1 rounded-pill"
            style={{
              backgroundColor: 'transparent',
              border: `2px solid var(--sand-700)`,
              color: 'var(--sand-800)',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--sand-700)';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = 'var(--sand-800)';
            }}
          >
            View All Perfumes →
          </Link>
        </div>
      </div>
    </section>
  );
}
