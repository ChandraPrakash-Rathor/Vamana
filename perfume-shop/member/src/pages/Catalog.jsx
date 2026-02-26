import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetProducts, GetProductsByCategory } from '../redux/apis/ProductApi';
import ProductCard from '../components/common/ProductCard';
import ScrollToTop from '../components/common/ScrollToTop';
import Breadcrumb from '../components/common/Breadcrumb';

export default function Catalog() {
  const dispatch = useDispatch();
  const [activeCategory, setActiveCategory] = useState('all');
  const { products, categoryProducts, loading } = useSelector((state) => state.ProductSlice);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);

  // Fetch all products on component mount
  useEffect(() => {
    dispatch(GetProducts());
  }, [dispatch]);

  // Determine which categories have products
  useEffect(() => {
    if (products.length > 0) {
      const categories = [...new Set(products.map(p => p.category))];
      setAvailableCategories(categories);
    }
  }, [products]);

  // Update filtered products when category changes
  useEffect(() => {
    if (activeCategory === 'all') {
      // Fetch all products
      dispatch(GetProducts());
    } else {
      // Fetch products by specific category (perfume, attar, or combo)
      dispatch(GetProductsByCategory(activeCategory));
    }
  }, [dispatch, activeCategory]);

  // Set filtered products based on active category
  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredProducts(products);
    } else {
      // Use category products from Redux (includes combo category)
      setFilteredProducts(categoryProducts);
    }
  }, [activeCategory, products, categoryProducts]);

  return (
    <div style={{ backgroundColor: 'var(--sand-100)', minHeight: '100vh', paddingTop: '90px' }}>
      <Breadcrumb items={[{ label: 'Catalog', path: '/catalog' }]} />
      
      <div className="container py-4">
        <div className="text-center mb-4">
          <h1 style={{ color: 'var(--sand-900)', fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 2.5rem)', marginBottom: '1rem' }}>
            Our Collection
          </h1>
          <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
            {/* Always show "All Products" if there are any products */}
            {products.length > 0 && (
              <button 
                key="all" 
                onClick={() => setActiveCategory('all')}
                style={{ 
                  padding: '0.8rem 1.5rem', 
                  border: 'none', 
                  borderRadius: '25px', 
                  backgroundColor: activeCategory === 'all' ? 'var(--sand-600)' : 'var(--sand-200)', 
                  color: activeCategory === 'all' ? 'white' : 'var(--sand-800)', 
                  fontSize: '1rem', 
                  fontWeight: '700', 
                  cursor: 'pointer', 
                  transition: 'all 0.3s ease',
                  boxShadow: activeCategory === 'all' ? '0 4px 15px rgba(200, 164, 93, 0.4)' : 'none' 
                }}
                onMouseEnter={(e) => {
                  if (activeCategory !== 'all') {
                    e.target.style.backgroundColor = 'var(--sand-300)';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeCategory !== 'all') {
                    e.target.style.backgroundColor = 'var(--sand-200)';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                All Products
              </button>
            )}
            
            {/* Show category buttons only if products exist in that category */}
            {availableCategories.includes('perfume') && (
              <button 
                key="perfume" 
                onClick={() => setActiveCategory('perfume')}
                style={{ 
                  padding: '0.8rem 1.5rem', 
                  border: 'none', 
                  borderRadius: '25px', 
                  backgroundColor: activeCategory === 'perfume' ? 'var(--sand-600)' : 'var(--sand-200)', 
                  color: activeCategory === 'perfume' ? 'white' : 'var(--sand-800)', 
                  fontSize: '1rem', 
                  fontWeight: '700', 
                  cursor: 'pointer', 
                  transition: 'all 0.3s ease',
                  boxShadow: activeCategory === 'perfume' ? '0 4px 15px rgba(200, 164, 93, 0.4)' : 'none' 
                }}
                onMouseEnter={(e) => {
                  if (activeCategory !== 'perfume') {
                    e.target.style.backgroundColor = 'var(--sand-300)';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeCategory !== 'perfume') {
                    e.target.style.backgroundColor = 'var(--sand-200)';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                Perfumes
              </button>
            )}
            
            {availableCategories.includes('attar') && (
              <button 
                key="attar" 
                onClick={() => setActiveCategory('attar')}
                style={{ 
                  padding: '0.8rem 1.5rem', 
                  border: 'none', 
                  borderRadius: '25px', 
                  backgroundColor: activeCategory === 'attar' ? 'var(--sand-600)' : 'var(--sand-200)', 
                  color: activeCategory === 'attar' ? 'white' : 'var(--sand-800)', 
                  fontSize: '1rem', 
                  fontWeight: '700', 
                  cursor: 'pointer', 
                  transition: 'all 0.3s ease',
                  boxShadow: activeCategory === 'attar' ? '0 4px 15px rgba(200, 164, 93, 0.4)' : 'none' 
                }}
                onMouseEnter={(e) => {
                  if (activeCategory !== 'attar') {
                    e.target.style.backgroundColor = 'var(--sand-300)';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeCategory !== 'attar') {
                    e.target.style.backgroundColor = 'var(--sand-200)';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                Attars
              </button>
            )}
            
            {availableCategories.includes('combo') && (
              <button 
                key="combo" 
                onClick={() => setActiveCategory('combo')}
                style={{ 
                  padding: '0.8rem 1.5rem', 
                  border: 'none', 
                  borderRadius: '25px', 
                  backgroundColor: activeCategory === 'combo' ? 'var(--sand-600)' : 'var(--sand-200)', 
                  color: activeCategory === 'combo' ? 'white' : 'var(--sand-800)', 
                  fontSize: '1rem', 
                  fontWeight: '700', 
                  cursor: 'pointer', 
                  transition: 'all 0.3s ease',
                  boxShadow: activeCategory === 'combo' ? '0 4px 15px rgba(200, 164, 93, 0.4)' : 'none' 
                }}
                onMouseEnter={(e) => {
                  if (activeCategory !== 'combo') {
                    e.target.style.backgroundColor = 'var(--sand-300)';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeCategory !== 'combo') {
                    e.target.style.backgroundColor = 'var(--sand-200)';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                Combo
              </button>
            )}
          </div>
          <p style={{ color: 'var(--sand-700)', fontSize: '1rem' }}>
            {filteredProducts.length} Products Found
          </p>
        </div>

        <div className="row g-3">
          {loading ? (
            <div className="col-12 text-center py-5">
              <div className="spinner-border" style={{ color: 'var(--sand-600)', width: '3rem', height: '3rem' }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3" style={{ color: 'var(--sand-700)', fontSize: '1.1rem' }}>Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="col-12 text-center py-5">
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
              <h3 style={{ color: 'var(--sand-800)', marginBottom: '0.5rem' }}>No Products Found</h3>
              <p style={{ color: 'var(--sand-600)' }}>
                {activeCategory === 'all' 
                  ? 'No products available at the moment.' 
                  : `No ${activeCategory} products available.`}
              </p>
            </div>
          ) : (
            filteredProducts.map(product => (
              <div key={product._id} className="col-6 col-md-3">
                <ProductCard product={product} showAddToCart={true} />
              </div>
            ))
          )}
        </div>
      </div>
      <ScrollToTop />
    </div>
  );
}
