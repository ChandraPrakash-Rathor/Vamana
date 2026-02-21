import { useState, useEffect } from 'react';
import { perfumes } from '../data/perfumes';
import ProductCard from '../components/common/ProductCard';
import ScrollToTop from '../components/common/ScrollToTop';
import Breadcrumb from '../components/common/Breadcrumb';

export default function Catalog() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState(perfumes);

  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredProducts(perfumes);
    } else if (activeCategory === 'combo') {
      // Combo: Mix of perfumes and attars
      const perfumeItems = perfumes.filter(p => p.category === 'perfume');
      const attarItems = perfumes.filter(p => p.category === 'attar');
      const comboItems = [];
      
      // Alternate between perfumes and attars
      const maxLength = Math.max(perfumeItems.length, attarItems.length);
      for (let i = 0; i < maxLength; i++) {
        if (i < perfumeItems.length) comboItems.push(perfumeItems[i]);
        if (i < attarItems.length) comboItems.push(attarItems[i]);
      }
      
      setFilteredProducts(comboItems);
    } else {
      setFilteredProducts(perfumes.filter(p => p.category === activeCategory));
    }
  }, [activeCategory]);

  return (
    <div style={{ backgroundColor: 'var(--sand-100)', minHeight: '100vh', paddingTop: '90px' }}>
      <Breadcrumb items={[{ label: 'Catalog', path: '/catalog' }]} />
      
      <div className="container py-4">
        <div className="text-center mb-4">
          <h1 style={{ color: 'var(--sand-900)', fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>
            Our Collection
          </h1>
          <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
            {[
              { key: 'all', label: 'All Products', icon: '' },
              { key: 'perfume', label: 'Perfumes', icon: '' },
              { key: 'attar', label: 'Attars', icon: '' },
              { key: 'combo', label: 'Combo', icon: '' }
            ].map(cat => (
              <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
                style={{ padding: '0.8rem 1.5rem', border: 'none', borderRadius: '25px', 
                  backgroundColor: activeCategory === cat.key ? 'var(--sand-600)' : 'var(--sand-200)', 
                  color: activeCategory === cat.key ? 'white' : 'var(--sand-800)', 
                  fontSize: '1rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s ease',
                  boxShadow: activeCategory === cat.key ? '0 4px 15px rgba(200, 164, 93, 0.4)' : 'none' }}
                onMouseEnter={(e) => {
                  if (activeCategory !== cat.key) {
                    e.target.style.backgroundColor = 'var(--sand-300)';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeCategory !== cat.key) {
                    e.target.style.backgroundColor = 'var(--sand-200)';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}>
                <span style={{ marginRight: '0.5rem' }}>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
          <p style={{ color: 'var(--sand-700)', fontSize: '1rem' }}>
            {filteredProducts.length} Products Found
          </p>
        </div>

        <div className="row g-3">
          {filteredProducts.map(product => (
            <div key={product.id} className="col-6 col-md-3">
              <ProductCard product={product} showAddToCart={true} />
            </div>
          ))}
        </div>
      </div>
      <ScrollToTop />
    </div>
  );
}
