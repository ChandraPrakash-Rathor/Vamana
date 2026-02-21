import { useState, useEffect } from 'react';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTags, faFire, faCalendarAlt, faPercent,
  faSearch, faFilter, faEye, faEdit, faTrash, faPlus
} from '@fortawesome/free-solid-svg-icons';
import AddSaleModal from '../components/modals/AddSaleModal';
import ViewSaleModal from '../components/modals/ViewSaleModal';
import EditSaleModal from '../components/modals/EditSaleModal';
import DeleteConfirmationModal from '../components/modals/DeleteConfirmationModal';
import { GetSales, DeleteSale } from '../APIS/apis/SaleApi';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "react-toastify";

export default function Sales() {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewModal, setViewModal] = useState({ isOpen: false, sale: null });
  const [editModal, setEditModal] = useState({ isOpen: false, sale: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, sale: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetSales());
  }, [dispatch]);

  const { saleData } = useSelector((state) => state?.SaleSlice);

  // Map API data to display format
  const sales = saleData?.map((sale, index) => ({
    id: sale._id,
    serialNumber: index + 1,
    name: sale.name,
    description: sale.description,
    discount: sale.discount,
    startDate: sale.startDate,
    endDate: sale.endDate,
    status: sale.status.charAt(0).toUpperCase() + sale.status.slice(1),
    productsCount: sale.productsCount || 0,
    totalRevenue: sale.totalRevenue || 0,
    banner: sale.banner || '',
    // Keep raw data for editing and viewing
    rawApplicableProducts: sale.applicableProducts?.map(p => typeof p === 'object' ? p._id : p) || [],
    rawApplicableProductsWithNames: sale.applicableProducts || []
  })) || [];

  // Calculate stats
  const totalSales = sales.length;
  const activeSales = sales.filter(s => s.status === 'Active').length;
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalRevenue, 0);
  const scheduledSales = sales.filter(s => s.status === 'Scheduled').length;

  // Handle view
  const handleViewClick = (sale) => {
    setViewModal({ isOpen: true, sale });
  };

  // Handle edit
  const handleEditClick = (sale) => {
    setEditModal({ isOpen: true, sale });
  };

  // Handle delete
  const handleDeleteClick = (sale) => {
    setDeleteModal({ isOpen: true, sale });
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const res = await dispatch(DeleteSale(deleteModal.sale.id));
      if (res?.payload?.status === 'success' || res?.payload?.success === true) {
        toast.success('Sale deleted successfully!');
        dispatch(GetSales());
      } else {
        toast.error(res?.payload?.message || 'Failed to delete sale');
      }
    } catch (error) {
      console.error('Error deleting sale:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsDeleting(false);
      setDeleteModal({ isOpen: false, sale: null });
    }
  };

  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'expired', label: 'Expired' }
  ];

  // Custom styles for react-select
  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: '8px',
      border: '1px solid #dee2e6',
      padding: '0.25rem',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(179, 135, 63, 0.1)' : 'none',
      borderColor: state.isFocused ? 'var(--sand-600)' : '#dee2e6',
      '&:hover': {
        borderColor: 'var(--sand-600)'
      }
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? 'var(--sand-600)' : state.isFocused ? 'var(--sand-200)' : 'white',
      color: state.isSelected ? 'white' : 'var(--sand-900)',
      cursor: 'pointer',
      padding: '0.5rem 1rem'
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: 9999
    })
  };

  // Filter sales
  const filteredSales = sales.filter(sale => {
    const statusMatch = !selectedStatus || selectedStatus.value === 'all' || sale.status.toLowerCase() === selectedStatus.value;
    const searchMatch = !searchQuery || 
      sale.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.description.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  });

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#28a745';
      case 'Scheduled': return '#ffc107';
      case 'Expired': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-4">
        <h2 className="mb-2" style={{
          color: '#212529',
          fontSize: '1.5rem',
          fontWeight: '600'
        }}>
          Sales Management
        </h2>
        <p className="mb-0" style={{ 
          color: '#6c757d', 
          fontSize: '0.875rem'
        }}>
          Create and manage seasonal sales and promotional events
        </p>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 g-md-4 mb-4">
        {/* Total Sales */}
        <div className="col-6 col-lg-3">
          <div className="h-100" style={{
            background: 'linear-gradient(135deg, rgba(255, 87, 34, 0.1) 0%, rgba(244, 67, 54, 0.1) 100%)',
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
              background: 'linear-gradient(135deg, #ff5722 0%, #f44336 100%)',
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
                  Total Sales
                </p>
                <h3 className="mb-0" style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #ff5722 0%, #f44336 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {totalSales}
                </h3>
              </div>
              <div className="d-none d-sm-flex align-items-center justify-content-center" style={{
                width: 'clamp(45px, 8vw, 60px)',
                height: 'clamp(45px, 8vw, 60px)',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #ff5722 0%, #f44336 100%)',
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                color: 'white',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                animation: 'float 3s ease-in-out infinite'
              }}>
                <FontAwesomeIcon icon={faTags} />
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 position-relative" style={{
              fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
              color: 'var(--sand-700)',
              fontWeight: '600'
            }}>
              All sales events
            </div>
          </div>
        </div>

        {/* Active Sales */}
        <div className="col-6 col-lg-3">
          <div className="h-100" style={{
            background: 'linear-gradient(135deg, rgba(40, 167, 69, 0.1) 0%, rgba(32, 201, 151, 0.1) 100%)',
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
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
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
                  Active
                </p>
                <h3 className="mb-0" style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {activeSales}
                </h3>
              </div>
              <div className="d-none d-sm-flex align-items-center justify-content-center" style={{
                width: 'clamp(45px, 8vw, 60px)',
                height: 'clamp(45px, 8vw, 60px)',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                color: 'white',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                animation: 'float 3s ease-in-out infinite'
              }}>
                <FontAwesomeIcon icon={faFire} />
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 position-relative" style={{
              fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
              color: 'var(--sand-700)',
              fontWeight: '600'
            }}>
              Currently running
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="col-6 col-lg-3">
          <div className="h-100" style={{
            background: 'linear-gradient(135deg, rgba(0, 123, 255, 0.1) 0%, rgba(0, 86, 179, 0.1) 100%)',
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
              background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
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
                  Total Revenue
                </p>
                <h3 className="mb-0" style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  ₹{(totalRevenue / 100000).toFixed(1)}L
                </h3>
              </div>
              <div className="d-none d-sm-flex align-items-center justify-content-center" style={{
                width: 'clamp(45px, 8vw, 60px)',
                height: 'clamp(45px, 8vw, 60px)',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                color: 'white',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                animation: 'float 3s ease-in-out infinite'
              }}>
                <FontAwesomeIcon icon={faPercent} />
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 position-relative" style={{
              fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
              color: 'var(--sand-700)',
              fontWeight: '600'
            }}>
              From all sales
            </div>
          </div>
        </div>

        {/* Scheduled Sales */}
        <div className="col-6 col-lg-3">
          <div className="h-100" style={{
            background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 152, 0, 0.1) 100%)',
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
              background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
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
                  Scheduled
                </p>
                <h3 className="mb-0" style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {scheduledSales}
                </h3>
              </div>
              <div className="d-none d-sm-flex align-items-center justify-content-center" style={{
                width: 'clamp(45px, 8vw, 60px)',
                height: 'clamp(45px, 8vw, 60px)',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                color: 'white',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                animation: 'float 3s ease-in-out infinite'
              }}>
                <FontAwesomeIcon icon={faCalendarAlt} />
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 position-relative" style={{
              fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
              color: 'var(--sand-700)',
              fontWeight: '600'
            }}>
              Upcoming sales
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="card border-0 shadow-sm" style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '1.5rem'
      }}>
        {/* Filters Section */}
        <div className="mb-4 pb-3" style={{ borderBottom: '1px solid #e9ecef' }}>
          <div className="row g-3 align-items-end">
            {/* Search Bar */}
            <div className="col-12 col-lg-5">
              <label className="form-label mb-2" style={{ 
                color: '#495057', 
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                <FontAwesomeIcon icon={faSearch} style={{ marginRight: '0.5rem', color: '#6c757d' }} />
                Search Sales
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #dee2e6',
                  fontSize: '0.875rem'
                }}
              />
            </div>

            {/* Status Filter */}
            <div className="col-12 col-md-6 col-lg-3">
              <label className="form-label mb-2" style={{ 
                color: '#495057', 
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                <FontAwesomeIcon icon={faFilter} style={{ marginRight: '0.5rem', color: '#6c757d' }} />
                Status
              </label>
              <Select
                options={statusOptions}
                value={selectedStatus}
                onChange={setSelectedStatus}
                placeholder="All Status"
                styles={customSelectStyles}
                isClearable
              />
            </div>

            {/* Add Sale Button */}
            <div className="col-12 col-md-6 col-lg-4">
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="btn w-100"
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  backgroundColor: 'var(--sand-600)',
                  border: 'none',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--sand-700)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--sand-600)';
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
                Create New Sale
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="row mt-3">
            <div className="col-12">
              <span style={{ color: '#6c757d', fontSize: '0.875rem' }}>
                Showing {filteredSales.length} of {sales.length} sales
              </span>
            </div>
          </div>
        </div>

        {/* Sales Grid - 4 cards per row */}
        <div className="row g-3">
          {filteredSales.map((sale) => (
            <div key={sale.id} className="col-12 col-md-6 col-lg-3">
              <div className="card h-100 border-0" style={{
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'all 0.2s',
                border: '1px solid #dee2e6'
              }}>
                {/* Sale Banner/Image */}
                <div style={{
                  position: 'relative',
                  paddingTop: '56.25%',
                  backgroundColor: '#f8f9fa',
                  background: `linear-gradient(135deg, ${getStatusColor(sale.status)}15 0%, ${getStatusColor(sale.status)}25 100%)`
                }}>
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem'
                  }}>
                    🎉
                  </div>
                  
                  {/* Status Badge */}
                  <span className="position-absolute top-0 end-0 m-2" style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    backgroundColor: `${getStatusColor(sale.status)}15`,
                    color: getStatusColor(sale.status),
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {sale.status}
                  </span>

                  {/* Discount Badge */}
                  <div className="position-absolute top-0 start-0 m-2" style={{
                    backgroundColor: 'white',
                    borderRadius: '6px',
                    padding: '0.375rem 0.625rem',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}>
                    <div style={{
                      fontSize: '1rem',
                      fontWeight: '700',
                      color: '#ff5722',
                      lineHeight: '1'
                    }}>
                      {sale.discount}%
                    </div>
                    <div style={{
                      fontSize: '0.625rem',
                      color: '#6c757d',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}>
                      OFF
                    </div>
                  </div>
                </div>

                {/* Sale Info */}
                <div className="card-body p-3">
                  <h5 className="card-title mb-2" style={{
                    color: '#212529',
                    fontSize: '0.9375rem',
                    fontWeight: '600',
                    lineHeight: '1.3',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    minHeight: '2.44rem'
                  }}>
                    {sale.name}
                  </h5>
                  
                  <p className="mb-2" style={{
                    color: '#6c757d',
                    fontSize: '0.8125rem',
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {sale.description}
                  </p>

                  {/* Date Range */}
                  <div className="d-flex align-items-center gap-1 mb-2" style={{
                    fontSize: '0.75rem',
                    color: '#6c757d'
                  }}>
                    <FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: '0.7rem' }} />
                    <span>
                      {new Date(sale.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} - {new Date(sale.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  {/* Products Count */}
                  <div className="d-flex align-items-center gap-1 mb-2" style={{
                    fontSize: '0.75rem',
                    color: '#6c757d'
                  }}>
                    <FontAwesomeIcon icon={faTags} style={{ fontSize: '0.7rem' }} />
                    <span>{sale.productsCount} products</span>
                  </div>

                  {/* Revenue */}
                  {sale.status !== 'Scheduled' && sale.totalRevenue > 0 && (
                    <div className="mb-2 pb-2" style={{ borderBottom: '1px solid #e9ecef' }}>
                      <div style={{
                        fontSize: '0.7rem',
                        color: '#6c757d',
                        textTransform: 'uppercase',
                        fontWeight: '500',
                        marginBottom: '0.25rem'
                      }}>
                        Revenue
                      </div>
                      <div style={{
                        fontSize: '0.9375rem',
                        fontWeight: '600',
                        color: '#28a745'
                      }}>
                        ₹{sale.totalRevenue.toLocaleString('en-IN')}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="d-flex gap-2">
                    <button 
                      onClick={() => handleViewClick(sale)}
                      className="btn btn-sm flex-fill" style={{
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #dee2e6',
                      color: '#495057',
                      padding: '0.375rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button 
                      onClick={() => handleEditClick(sale)}
                      className="btn btn-sm flex-fill" style={{
                      backgroundColor: 'var(--sand-600)',
                      border: 'none',
                      color: 'white',
                      padding: '0.375rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(sale)}
                      className="btn btn-sm" style={{
                      backgroundColor: '#dc354515',
                      border: '1px solid #dc354530',
                      color: '#dc3545',
                      padding: '0.375rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
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
        {filteredSales.length === 0 && (
          <div className="text-center py-5">
            <div className="mb-3" style={{ fontSize: '3rem', opacity: 0.3 }}>🎉</div>
            <h4 className="mb-2" style={{ 
              color: '#212529', 
              fontSize: '1.125rem',
              fontWeight: '600'
            }}>
              No sales found
            </h4>
            <p className="mb-3" style={{ color: '#6c757d', fontSize: '0.875rem' }}>
              Try adjusting your filters or create a new sale
            </p>
            <button 
              className="btn"
              onClick={() => setIsAddModalOpen(true)}
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '6px',
                backgroundColor: 'var(--sand-600)',
                border: 'none',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}
            >
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Create New Sale
            </button>
          </div>
        )}
      </div>

      {/* Add Sale Modal */}
      <AddSaleModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      {/* View Sale Modal */}
      <ViewSaleModal 
        isOpen={viewModal.isOpen}
        onClose={() => setViewModal({ isOpen: false, sale: null })}
        sale={viewModal.sale}
        onEdit={(sale) => {
          setViewModal({ isOpen: false, sale: null });
          setEditModal({ isOpen: true, sale });
        }}
      />

      {/* Edit Sale Modal */}
      <EditSaleModal 
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, sale: null })}
        sale={editModal.sale}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={deleteModal.isOpen}
        onClose={() => !isDeleting && setDeleteModal({ isOpen: false, sale: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Sale"
        message="Are you sure you want to delete this sale? This will permanently remove it from the system."
        itemName={deleteModal.sale?.name}
        isDeleting={isDeleting}
      />
    </div>
  );
}
