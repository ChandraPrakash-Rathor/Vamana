import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { GetProducts, GetProductsByCategory } from '../../redux/apis/ProductApi';
import ProductCard from '../common/ProductCard';

export default function FeaturedPerfumes() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('perfumes');
  const { categoryProducts, products, loading } = useSelector((state) => state.ProductSlice);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Fetch all products on mount to determine available categories
  useEffect(() => {
    dispatch(GetProducts());
  }, [dispatch]);

  // Determine which categories have products
  useEffect(() => {
    if (products.length > 0) {
      const categories = [...new Set(products.map(p => p.category))];
      setAvailableCategories(categories);
      
      // Set default active tab to first available category
      if (categories.length > 0) {
        const tabMap = {
          'perfume': 'perfumes',
          'attar': 'attar',
          'combo': 'combo'
        };
        const firstCategory = tabMap[categories[0]] || 'perfumes';
        setActiveTab(firstCategory);
      }
    }
  }, [products]);

  useEffect(() => {
    // Start transition
    setIsTransitioning(true);
    
    // Fetch products based on active tab
    const categoryMap = {
      'perfumes': 'perfume',
      'attar': 'attar',
      'combo': 'combo'
    };
    
    const category = categoryMap[activeTab];
    dispatch(GetProductsByCategory(category));
    
    // End transition after a short delay
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [dispatch, activeTab]);

  // Get first 4 products from the fetched category
  const displayProducts = categoryProducts.slice(0, 4);

  // Define all possible tabs
  const allTabs = [
    { key: 'perfumes', label: 'Perfumes', category: 'perfume' },
    { key: 'attar', label: 'Attar', category: 'attar' },
    { key: 'combo', label: 'Combo', category: 'combo' }
  ];

  // Filter tabs to only show those with available products
  const visibleTabs = allTabs.filter(tab => availableCategories.includes(tab.category));

  // Don't render if no categories available
  if (!loading && visibleTabs.length === 0) {
    return null;
  }

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
            {visibleTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: 'clamp(0.4rem, 1vw, 0.6rem) clamp(1.5rem, 3vw, 2.5rem)',
                  border: 'none',
                  borderRadius: '25px',
                  backgroundColor: activeTab === tab.key ? 'var(--sand-600)' : 'var(--sand-300)',
                  color: activeTab === tab.key ? 'white' : 'var(--sand-800)',
                  fontSize: 'clamp(0.85rem, 1.6vw, 1rem)',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: activeTab === tab.key ? '0 4px 15px rgba(200, 164, 93, 0.4)' : 'none',
                  transform: activeTab === tab.key ? 'translateY(-2px)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.key) {
                    e.target.style.backgroundColor = 'var(--sand-400)';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.key) {
                    e.target.style.backgroundColor = 'var(--sand-300)';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid - 4 per row with smooth transitions */}
        <div 
          className="row g-2 g-md-3"
          style={{
            minHeight: '400px',
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
            transition: 'opacity 0.3s ease, transform 0.3s ease'
          }}
        >
          {loading ? (
            <div className="col-12 text-center py-5">
              <div className="spinner-border" style={{ color: 'var(--sand-600)' }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : displayProducts.length === 0 ? (
            <div className="col-12 text-center py-5">
              <p style={{ color: 'var(--sand-700)' }}>No products available</p>
            </div>
          ) : (
            displayProducts.map((product, index) => (
              <div 
                key={product._id} 
                className="col-6 col-md-3"
                style={{
                  opacity: isTransitioning ? 0 : 1,
                  transform: isTransitioning ? 'scale(0.95)' : 'scale(1)',
                  transition: `opacity 0.3s ease ${index * 0.05}s, transform 0.3s ease ${index * 0.05}s`
                }}
              >
                <ProductCard product={product} showAddToCart={false} />
              </div>
            ))
          )}
        </div>

        {/* View All Button - Dynamic text based on active tab */}
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
            View All {activeTab === 'perfumes' ? 'Perfumes' : activeTab === 'attar' ? 'Attars' : 'Combos'} →
          </Link>
        </div>
      </div>
    </section>
  );
}
