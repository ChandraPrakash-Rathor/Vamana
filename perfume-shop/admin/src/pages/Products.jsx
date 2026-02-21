import { useState,useEffect } from 'react';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, faEdit, faTrash, faEye, faSearch, 
  faBoxes, faDollarSign, faExclamationTriangle, faLayerGroup, faFilter 
} from '@fortawesome/free-solid-svg-icons';
import AddProductModal from '../components/modals/AddProductModal';
import ViewProductModal from '../components/modals/ViewProductModal';
import EditProductModal from '../components/modals/EditProductModal';
import DeleteConfirmationModal from '../components/modals/DeleteConfirmationModal';
import { GetProduct, DeleteProduct } from '../APIS/apis/ProductApi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewProductModal, setViewProductModal] = useState({ isOpen: false, product: null });
  const [editProductModal, setEditProductModal] = useState({ isOpen: false, product: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, product: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const dispatch = useDispatch();
  const navigate = useNavigate();

useEffect(()=>{
  dispatch(GetProduct())
},[])

const {productData, loading} = useSelector((state)=>state?.ProductSlice)

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'perfume', label: 'Perfume' },
    { value: 'attar', label: 'Attar' },
    { value: 'combo', label: 'Combo' }
  ];

  // Use real product data from API
  const products = productData?.map((product, index) => ({
    id: product._id,
    serialNumber: index + 1,
    name: product.name,
    category: product.category,
    price: product.finalPrice || product.actualPrice,
    actualPrice: product.actualPrice,
    discount: product.discount,
    stock: product.stock || 0,
    image: product.mainImage || '/product1.jpg',
    subImages: product.subImages || [],
    status: product.status === 'out-of-stock' ? 'Out of Stock' : (product.stock || 0) < 20 ? 'Low Stock' : 'Active',
    sales: product.sales || 0,
    featured: product.featured,
    bestseller: product.bestseller,
    rating: product.rating || 0,
    reviews: product.reviews || 0,
    description: product.description
  })) || [];
  
  const totalProducts = products.length;
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const lowStockCount = products.filter(p => p.stock < 20).length;
  const categories = [...new Set(products.map(p => p.category))].length;

  // Handle delete
  const handleDeleteClick = (product) => {
    setDeleteModal({ isOpen: true, product });
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const res = await dispatch(DeleteProduct(deleteModal.product.id));
      if (res?.payload?.success === true) {
        toast.success('Product deleted successfully!');
        dispatch(GetProduct());
      } else {
        toast.error(res?.payload?.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsDeleting(false);
      setDeleteModal({ isOpen: false, product: null });
    }
  };
 
  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: '12px',
      border: '2px solid var(--sand-300)',
      padding: '0.3rem',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(179, 135, 63, 0.1)' : 'none',
      borderColor: state.isFocused ? 'var(--sand-600)' : 'var(--sand-300)',
      '&:hover': {
        borderColor: 'var(--sand-600)'
      }
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? 'var(--sand-600)' : state.isFocused ? 'var(--sand-200)' : 'white',
      color: state.isSelected ? 'white' : 'var(--sand-900)',
      cursor: 'pointer',
      padding: '0.8rem 1rem'
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    })
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const categoryMatch = !selectedCategory || selectedCategory.value === 'all' || product.category === selectedCategory.value;
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
    const searchMatch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && priceMatch && searchMatch;
  });
  
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // Handle string sorting
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort icon
  const getSortIcon = (field) => {
    if (sortField !== field) return '⇅';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-4">
        <h2 className="mb-2" style={{
          color: 'var(--sand-900)',
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
          fontWeight: '700'
        }}>
          Products Management
        </h2>
        <p className="mb-0" style={{ 
          color: 'var(--sand-700)', 
          fontSize: 'clamp(0.9rem, 2vw, 1rem)',
          fontWeight: '500'
        }}>
          Manage your perfume inventory and product catalog
        </p>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 g-md-4 mb-4">
        {/* Total Products */}
        <div className="col-6 col-lg-3">
          <div className="h-100" style={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            borderRadius: '16px',
            padding: 'clamp(1rem, 3vw, 1.8rem)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
          }}>
            {/* Decorative Circle */}
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              opacity: 0.1,
              animation: 'pulse 3s ease-in-out infinite'
            }} />
            
            <div className="d-flex justify-content-between align-items-start mb-3 position-relative">
              <div className="flex-grow-1">
                <p className="mb-2 text-uppercase" style={{
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)',
                  color: 'var(--sand-700)',
                  fontWeight: '600',
                  letterSpacing: '0.5px'
                }}>
                  Total Products
                </p>
                <h3 className="mb-0" style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {totalProducts}
                </h3>
              </div>
              <div className="d-none d-sm-flex align-items-center justify-content-center" style={{
                width: 'clamp(45px, 8vw, 60px)',
                height: 'clamp(45px, 8vw, 60px)',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                color: 'white',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                animation: 'float 3s ease-in-out infinite'
              }}>
                <FontAwesomeIcon icon={faBoxes} />
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 position-relative" style={{
              fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
              color: 'var(--sand-700)',
              fontWeight: '600'
            }}>
              Active inventory items
            </div>
          </div>
        </div>

        {/* Inventory Value */}
        <div className="col-6 col-lg-3">
          <div className="h-100" style={{
            background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.1) 100%)',
            borderRadius: '16px',
            padding: 'clamp(1rem, 3vw, 1.8rem)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              opacity: 0.1,
              animation: 'pulse 3s ease-in-out infinite'
            }} />
            
            <div className="d-flex justify-content-between align-items-start mb-3 position-relative">
              <div className="flex-grow-1">
                <p className="mb-2 text-uppercase" style={{
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)',
                  color: 'var(--sand-700)',
                  fontWeight: '600',
                  letterSpacing: '0.5px'
                }}>
                  Inventory Value
                </p>
                <h3 className="mb-0" style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  ₹{(totalInventoryValue / 1000).toFixed(0)}K
                </h3>
              </div>
              <div className="d-none d-sm-flex align-items-center justify-content-center" style={{
                width: 'clamp(45px, 8vw, 60px)',
                height: 'clamp(45px, 8vw, 60px)',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                color: 'white',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                animation: 'float 3s ease-in-out infinite'
              }}>
                <FontAwesomeIcon icon={faDollarSign} />
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 position-relative" style={{
              fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
              color: 'var(--sand-700)',
              fontWeight: '600'
            }}>
              Total stock worth
            </div>
          </div>
        </div>

        {/* Low Stock */}
        <div className="col-6 col-lg-3">
          <div className="h-100" style={{
            background: 'linear-gradient(135deg, rgba(250, 112, 154, 0.1) 0%, rgba(254, 225, 64, 0.1) 100%)',
            borderRadius: '16px',
            padding: 'clamp(1rem, 3vw, 1.8rem)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
              opacity: 0.1,
              animation: 'pulse 3s ease-in-out infinite'
            }} />
            
            <div className="d-flex justify-content-between align-items-start mb-3 position-relative">
              <div className="flex-grow-1">
                <p className="mb-2 text-uppercase" style={{
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)',
                  color: 'var(--sand-700)',
                  fontWeight: '600',
                  letterSpacing: '0.5px'
                }}>
                  Low Stock
                </p>
                <h3 className="mb-0" style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {lowStockCount}
                </h3>
              </div>
              <div className="d-none d-sm-flex align-items-center justify-content-center" style={{
                width: 'clamp(45px, 8vw, 60px)',
                height: 'clamp(45px, 8vw, 60px)',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                color: 'white',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                animation: 'float 3s ease-in-out infinite'
              }}>
                <FontAwesomeIcon icon={faExclamationTriangle} />
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 position-relative" style={{
              fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
              color: 'var(--sand-700)',
              fontWeight: '600'
            }}>
              Items need restock
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="col-6 col-lg-3">
          <div className="h-100" style={{
            background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%)',
            borderRadius: '16px',
            padding: 'clamp(1rem, 3vw, 1.8rem)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
          }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              opacity: 0.1,
              animation: 'pulse 3s ease-in-out infinite'
            }} />
            
            <div className="d-flex justify-content-between align-items-start mb-3 position-relative">
              <div className="flex-grow-1">
                <p className="mb-2 text-uppercase" style={{
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)',
                  color: 'var(--sand-700)',
                  fontWeight: '600',
                  letterSpacing: '0.5px'
                }}>
                  Categories
                </p>
                <h3 className="mb-0" style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {categories}
                </h3>
              </div>
              <div className="d-none d-sm-flex align-items-center justify-content-center" style={{
                width: 'clamp(45px, 8vw, 60px)',
                height: 'clamp(45px, 8vw, 60px)',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                color: 'white',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                animation: 'float 3s ease-in-out infinite'
              }}>
                <FontAwesomeIcon icon={faLayerGroup} />
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 position-relative" style={{
              fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
              color: 'var(--sand-700)',
              fontWeight: '600'
            }}>
              Product types
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="card border-0 shadow-sm" style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: 'clamp(1.5rem, 3vw, 2rem)'
      }}>
        {/* Filters Section */}
        <div className="mb-4 pb-4" style={{ borderBottom: '2px solid var(--sand-200)' }}>
          <div className="row g-3 g-md-4 align-items-end">
            {/* Search Bar */}
            <div className="col-12 col-lg-5">
              <label className="form-label fw-semibold mb-2" style={{ 
                color: 'var(--sand-900)', 
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FontAwesomeIcon icon={faSearch} style={{ color: 'var(--sand-600)' }} />
                Search Products
              </label>
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    paddingLeft: '1rem',
                    paddingRight: '1rem',
                    paddingTop: '0.75rem',
                    paddingBottom: '0.75rem',
                    borderRadius: '10px',
                    border: '2px solid var(--sand-300)',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--sand-600)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(179, 135, 63, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--sand-300)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="col-12 col-md-6 col-lg-3">
              <label className="form-label fw-semibold mb-2" style={{ 
                color: 'var(--sand-900)', 
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FontAwesomeIcon icon={faLayerGroup} style={{ color: 'var(--sand-600)' }} />
                Category
              </label>
              <Select
                options={categoryOptions}
                value={selectedCategory}
                onChange={setSelectedCategory}
                placeholder="All Categories"
                styles={customSelectStyles}
                isClearable
              />
            </div>

            {/* Add Product Button */}
            <div className="col-12 col-md-6 col-lg-4">
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="btn w-100 d-inline-flex align-items-center justify-content-center gap-2"
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, var(--sand-600) 0%, var(--sand-700) 100%)',
                  border: 'none',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  boxShadow: '0 4px 12px rgba(179, 135, 63, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(179, 135, 63, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(179, 135, 63, 0.3)';
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
                <span>Add New Product</span>
              </button>
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="row mt-4">
            <div className="col-12">
              <label className="form-label fw-semibold mb-3" style={{ 
                color: 'var(--sand-900)', 
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FontAwesomeIcon icon={faDollarSign} style={{ color: 'var(--sand-600)' }} />
                Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
              </label>
              <div className="px-2">
                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max="5000000"
                  step="10000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  style={{
                    height: '6px',
                    cursor: 'pointer'
                  }}
                />
                <div className="d-flex justify-content-between mt-2">
                  <small style={{ color: 'var(--sand-600)', fontWeight: '500' }}>₹0</small>
                  <small style={{ color: 'var(--sand-600)', fontWeight: '500' }}>₹50,00,000+</small>
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="row mt-3">
            <div className="col-12">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <span style={{ color: 'var(--sand-700)', fontSize: '0.95rem', fontWeight: '500' }}>
                  <FontAwesomeIcon icon={faFilter} className="me-2" style={{ color: 'var(--sand-600)' }} />
                  Showing {sortedProducts.length} of {products.length} products
                </span>
                {(searchQuery || selectedCategory || priceRange[1] < 5000000) && (
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory(null);
                      setPriceRange([0, 5000000]);
                    }}
                    style={{
                      padding: '0.4rem 1rem',
                      borderRadius: '8px',
                      backgroundColor: 'var(--sand-200)',
                      border: 'none',
                      color: 'var(--sand-900)',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--sand-300)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--sand-200)';
                    }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="row g-3 g-md-4">
          {/* Loading State */}
          {loading && (
            <div className="col-12 text-center py-5">
              <div className="spinner-border" style={{ 
                width: '3rem', 
                height: '3rem',
                color: 'var(--sand-600)'
              }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3" style={{ color: 'var(--sand-700)', fontWeight: '600' }}>
                Loading products...
              </p>
            </div>
          )}

          {/* Sort Controls */}
          {!loading && products.length > 0 && (
          <div className="col-12 mb-3">
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <span style={{ color: 'var(--sand-700)', fontWeight: '600', fontSize: '0.9rem' }}>
                Sort by:
              </span>
              <button
                onClick={() => handleSort('name')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: sortField === 'name' ? '2px solid var(--sand-600)' : '2px solid var(--sand-300)',
                  backgroundColor: sortField === 'name' ? 'var(--sand-100)' : 'white',
                  color: 'var(--sand-900)',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Name {getSortIcon('name')}
              </button>
              <button
                onClick={() => handleSort('price')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: sortField === 'price' ? '2px solid var(--sand-600)' : '2px solid var(--sand-300)',
                  backgroundColor: sortField === 'price' ? 'var(--sand-100)' : 'white',
                  color: 'var(--sand-900)',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Price {getSortIcon('price')}
              </button>
              <button
                onClick={() => handleSort('stock')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: sortField === 'stock' ? '2px solid var(--sand-600)' : '2px solid var(--sand-300)',
                  backgroundColor: sortField === 'stock' ? 'var(--sand-100)' : 'white',
                  color: 'var(--sand-900)',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Stock {getSortIcon('stock')}
              </button>
              <button
                onClick={() => handleSort('sales')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: sortField === 'sales' ? '2px solid var(--sand-600)' : '2px solid var(--sand-300)',
                  backgroundColor: sortField === 'sales' ? 'var(--sand-100)' : 'white',
                  color: 'var(--sand-900)',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Sales {getSortIcon('sales')}
              </button>
            </div>
          </div>
          )}

          {!loading && sortedProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="col-12 col-sm-6 col-lg-4 col-xl-3"
            >
              <div className="card h-100 border-0 shadow-sm" style={{
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
              }}>
                {/* Product Image */}
                <div style={{
                  position: 'relative',
                  paddingTop: '100%',
                  backgroundColor: 'var(--sand-100)',
                  overflow: 'hidden'
                }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  />
                  {/* Status Badge */}
                  <span className="position-absolute top-0 end-0 m-2 badge rounded-pill px-3 py-2" style={{
                    background: product.status === 'Active' 
                      ? 'linear-gradient(135deg, #28a745, #20c997)' 
                      : 'linear-gradient(135deg, #ffc107, #ff9800)',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                  }}>
                    {product.status}
                  </span>
                  {/* Category Badge */}
                  <span className="position-absolute top-0 start-0 m-2 badge rounded-pill px-3 py-2 text-uppercase" style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    color: 'var(--sand-900)',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    letterSpacing: '0.5px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}>
                    {product.category}
                  </span>
                </div>

                {/* Product Info */}
                <div className="card-body p-3">
                  <h5 className="card-title mb-2" style={{
                    color: 'var(--sand-900)',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    fontFamily: "'Playfair Display', serif",
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    minHeight: '2.6rem'
                  }}>
                    {product.name}
                  </h5>
                  
                  {/* Price Section */}
                  <div className="mb-2">
                    {product.discount > 0 ? (
                      // Show discounted price layout
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span className="fw-bold" style={{
                            color: '#28a745',
                            fontSize: '1.3rem'
                          }}>
                            ₹{product.price.toLocaleString()}
                          </span>
                          <span className="badge" style={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            fontSize: '0.7rem',
                            padding: '0.25rem 0.5rem'
                          }}>
                            {product.discount}% OFF
                          </span>
                        </div>
                        <div>
                          <span style={{
                            color: 'var(--sand-600)',
                            fontSize: '0.9rem',
                            textDecoration: 'line-through'
                          }}>
                            ₹{product.actualPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ) : (
                      // Show regular price
                      <span className="fw-bold" style={{
                        color: 'var(--sand-900)',
                        fontSize: '1.3rem'
                      }}>
                        ₹{product.price.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Stock Info */}
                  <div className="mb-3 pb-3" style={{ borderBottom: '1px solid var(--sand-200)' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <span style={{
                        color: product.stock < 20 ? '#dc3545' : 'var(--sand-700)',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}>
                        Stock: {product.stock}
                      </span>
                      <small style={{ color: 'var(--sand-600)', fontWeight: '500' }}>
                        {product.sales} sold
                      </small>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex gap-2">
                    <button 
                      onClick={() => setViewProductModal({ isOpen: true, product })}
                      className="btn btn-sm flex-fill" style={{
                      backgroundColor: 'var(--sand-200)',
                      border: 'none',
                      color: 'var(--sand-900)',
                      padding: '0.5rem',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--sand-300)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--sand-200)';
                    }}>
                      <FontAwesomeIcon icon={faEye} className="me-1" />
                      View
                    </button>
                    <button 
                      onClick={() => setEditProductModal({ isOpen: true, product })}
                      className="btn btn-sm flex-fill" style={{
                      background: 'linear-gradient(135deg, #007bff, #0056b3)',
                      border: 'none',
                      color: 'white',
                      padding: '0.5rem',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}>
                      <FontAwesomeIcon icon={faEdit} className="me-1" />
                      Edit
                    </button>
                    <button 
                      onClick={() => setDeleteModal({ isOpen: true, product })}
                      className="btn btn-sm" style={{
                      background: 'linear-gradient(135deg, #dc3545, #c82333)',
                      border: 'none',
                      color: 'white',
                      padding: '0.5rem 0.8rem',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {!loading && sortedProducts.length === 0 && (
          <div className="text-center py-5">
            <div className="mb-4" style={{ 
              fontSize: '5rem', 
              opacity: 0.2
            }}>
              📦
            </div>
            <h4 className="mb-2" style={{ 
              color: 'var(--sand-900)', 
              fontFamily: "'Playfair Display', serif",
              fontWeight: '700'
            }}>
              No products found
            </h4>
            <p className="mb-4" style={{ color: 'var(--sand-700)' }}>
              Try adjusting your filters or search query
            </p>
            <button
              className="btn"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
                setPriceRange([0, 5000000]);
              }}
              style={{
                padding: '0.8rem 2rem',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--sand-600) 0%, var(--sand-700) 100%)',
                border: 'none',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(179, 135, 63, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(179, 135, 63, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(179, 135, 63, 0.3)';
              }}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <AddProductModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      {/* View Product Modal */}
      <ViewProductModal 
        isOpen={viewProductModal.isOpen}
        onClose={() => setViewProductModal({ isOpen: false, product: null })}
        product={viewProductModal.product}
        onEdit={(product) => {
          setViewProductModal({ isOpen: false, product: null });
          setEditProductModal({ isOpen: true, product });
        }}
      />

      {/* Edit Product Modal */}
      <EditProductModal 
        isOpen={editProductModal.isOpen}
        onClose={() => setEditProductModal({ isOpen: false, product: null })}
        product={editProductModal.product}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, product: null })}
        onConfirm={handleDeleteConfirm}
        itemName={deleteModal.product?.name}
        isDeleting={isDeleting}
      />

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.15;
          }
        }

        /* Custom Range Slider Styling */
        .form-range {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
        }

        .form-range::-webkit-slider-track {
          height: 6px;
          background: linear-gradient(to right, 
            var(--sand-300) 0%, 
            var(--sand-600) 100%);
          border-radius: 10px;
        }

        .form-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: var(--sand-600);
          border: 3px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }

        .form-range::-webkit-slider-thumb:hover {
          background: var(--sand-700);
          transform: scale(1.1);
          box-shadow: 0 3px 12px rgba(179, 135, 63, 0.4);
        }

        .form-range::-moz-range-track {
          height: 6px;
          background: linear-gradient(to right, 
            var(--sand-300) 0%, 
            var(--sand-600) 100%);
          border-radius: 10px;
        }

        .form-range::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: var(--sand-600);
          border: 3px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }

        .form-range::-moz-range-thumb:hover {
          background: var(--sand-700);
          transform: scale(1.1);
          box-shadow: 0 3px 12px rgba(179, 135, 63, 0.4);
        }

        .form-range:focus {
          outline: none;
        }

        .form-range:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 4px rgba(179, 135, 63, 0.2);
        }

        .form-range:focus::-moz-range-thumb {
          box-shadow: 0 0 0 4px rgba(179, 135, 63, 0.2);
        }
      `}</style>
    </div>
  );
}
