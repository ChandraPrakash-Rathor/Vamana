import React from 'react';
import { Link } from 'react-router-dom';
import { perfumes } from '../../data/perfumes';
import ProductCard from '../common/ProductCard';

export default function BestSellers() {
  // Get best seller products (those with isBestSeller flag)
  const bestSellers = perfumes.filter(p => p.isBestSeller).slice(0, 4);

  return (
    <section 
      className="py-3"
      style={{
        backgroundColor: 'var(--sand-100)',
        position: 'relative',
        zIndex: 1
      }}
    >
      <div className="container py-2">
        {/* Section Header */}
        <div className="text-center mb-3 px-3">
          <div 
            className="d-inline-block px-3 py-1 rounded-pill mb-2"
            style={{
              backgroundColor: 'var(--sand-600)',
              color: 'white',
              fontSize: 'clamp(0.65rem, 1.3vw, 0.8rem)',
              fontWeight: '600',
              letterSpacing: '0.5px'
            }}
          >
            ⭐ BEST SELLERS
          </div>
          <h2 
            className="fw-bold mb-2"
            style={{
              color: 'var(--sand-900)',
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)'
            }}
          >
            Most Loved Fragrances
          </h2>
          <p 
            style={{
              color: 'var(--sand-700)',
              maxWidth: '600px',
              margin: '0 auto',
              fontSize: 'clamp(0.85rem, 1.6vw, 1rem)'
            }}
          >
            Vamana's most cherished fragrances loved by thousands
          </p>
        </div>

        {/* Products Grid - 4 per row */}
        <div className="row g-2 g-md-3">
          {bestSellers.map((product) => (
            <div key={product.id} className="col-6 col-md-3">
              <ProductCard product={product} showAddToCart={true} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
