import { useState, useEffect } from 'react';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTicket, faPercent, faCalendarAlt, faCheckCircle,
  faSearch, faFilter, faEye, faEdit, faTrash, faPlus, faCopy
} from '@fortawesome/free-solid-svg-icons';
import AddCouponModal from '../components/modals/AddCouponModal';
import ViewCouponModal from '../components/modals/ViewCouponModal';
import EditCouponModal from '../components/modals/EditCouponModal';
import DeleteConfirmationModal from '../components/modals/DeleteConfirmationModal';
import { GetCoupons, DeleteCoupon } from '../APIS/apis/CouponApi';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "react-toastify";

export default function Coupons() {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewCouponModal, setViewCouponModal] = useState({ isOpen: false, coupon: null });
  const [editCouponModal, setEditCouponModal] = useState({ isOpen: false, coupon: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, coupon: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [sortField, setSortField] = useState('code');
  const [sortDirection, setSortDirection] = useState('asc');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetCoupons());
  }, [dispatch]);

  const { couponData } = useSelector((state) => state?.CouponSlice);

  // Map API data to display format
  const coupons = couponData?.map((coupon, index) => ({
    id: coupon._id,
    serialNumber: index + 1,
    code: coupon.code,
    type: coupon.discountType === 'percentage' ? 'Percentage' : 'Fixed',
    value: coupon.discountValue,
    minOrder: coupon.minPurchase,
    maxDiscount: coupon.maxDiscount || 0,
    usageLimit: coupon.usageLimit || 'Unlimited',
    usedCount: coupon.usedCount,
    validFrom: new Date(coupon.startDate).toLocaleDateString(),
    validTo: new Date(coupon.endDate).toLocaleDateString(),
    status: coupon.status === 'active' ? 'Active' : coupon.status === 'expired' ? 'Expired' : 'Inactive',
    applicableProducts: coupon.applicableCategories?.includes('all') ? 'All Products' : coupon.applicableCategories?.join(', '),
    description: coupon.description,
    // Keep raw data for editing and viewing
    rawApplicableProducts: coupon.applicableProducts?.map(p => typeof p === 'object' ? p._id : p) || [],
    rawApplicableProductsWithNames: coupon.applicableProducts || [],
    rawApplicableCategories: coupon.applicableCategories || ['all']
  })) || [];

  // Calculate stats
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter(c => c.status === 'Active').length;
  const totalUsage = coupons.reduce((sum, c) => sum + c.usedCount, 0);
  const scheduledCoupons = coupons.filter(c => c.status === 'Scheduled').length;

  // Handle delete coupon
  const handleDeleteClick = (coupon) => {
    setDeleteModal({ isOpen: true, coupon });
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const res = await dispatch(DeleteCoupon(deleteModal.coupon.id));
      if (res?.payload?.status === 'success' || res?.payload?.success === true) {
        toast.success('Coupon deleted successfully!');
        dispatch(GetCoupons());
      } else {
        toast.error(res?.payload?.message || 'Failed to delete coupon');
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsDeleting(false);
      setDeleteModal({ isOpen: false, coupon: null });
    }
  };

  // Handle copy coupon code
  const handleCopyCouponCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon code "${code}" copied to clipboard!`);
  };

  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'expired', label: 'Expired' },
    { value: 'scheduled', label: 'Scheduled' }
  ];

  // Type options
  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'percentage', label: 'Percentage' },
    { value: 'fixed', label: 'Fixed Amount' }
  ];

  // Custom styles for react-select
  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: '10px',
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
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: 9999
    })
  };

  // Filter coupons
  const filteredCoupons = coupons.filter(coupon => {
    const statusMatch = !selectedStatus || selectedStatus.value === 'all' || coupon.status.toLowerCase() === selectedStatus.value;
    const typeMatch = !selectedType || selectedType.value === 'all' || coupon.type.toLowerCase() === selectedType.value;
    const searchMatch = !searchQuery || 
      coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.applicableProducts.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && typeMatch && searchMatch;
  });

  // Sort coupons
  const sortedCoupons = [...filteredCoupons].sort((a, b) => {
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

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#28a745';
      case 'Expired': return '#dc3545';
      case 'Scheduled': return '#ffc107';
      default: return '#6c757d';
    }
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
          Coupons Management
        </h2>
        <p className="mb-0" style={{ 
          color: 'var(--sand-700)', 
          fontSize: 'clamp(0.9rem, 2vw, 1rem)',
          fontWeight: '500'
        }}>
          Create and manage discount coupons for products
        </p>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 g-md-4 mb-4">
        {/* Total Coupons */}
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
                  Total Coupons
                </p>
                <h3 className="mb-0" style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {totalCoupons}
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
                <FontAwesomeIcon icon={faTicket} />
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 position-relative" style={{
              fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
              color: 'var(--sand-700)',
              fontWeight: '600'
            }}>
              All coupon codes
            </div>
          </div>
        </div>

        {/* Active Coupons */}
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
                  Active Coupons
                </p>
                <h3 className="mb-0" style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {activeCoupons}
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
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 position-relative" style={{
              fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
              color: 'var(--sand-700)',
              fontWeight: '600'
            }}>
              Currently active
            </div>
          </div>
        </div>

        {/* Total Usage */}
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
                  Total Usage
                </p>
                <h3 className="mb-0" style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {totalUsage}
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
                <FontAwesomeIcon icon={faPercent} />
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 position-relative" style={{
              fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
              color: 'var(--sand-700)',
              fontWeight: '600'
            }}>
              Times used
            </div>
          </div>
        </div>

        {/* Scheduled Coupons */}
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
                  {scheduledCoupons}
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
              Upcoming coupons
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
            <div className="col-12 col-lg-4">
              <label className="form-label fw-semibold mb-2" style={{ 
                color: 'var(--sand-900)', 
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FontAwesomeIcon icon={faSearch} style={{ color: 'var(--sand-600)' }} />
                Search Coupons
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by code or product..."
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

            {/* Status Filter */}
            <div className="col-12 col-md-6 col-lg-3">
              <label className="form-label fw-semibold mb-2" style={{ 
                color: 'var(--sand-900)', 
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FontAwesomeIcon icon={faFilter} style={{ color: 'var(--sand-600)' }} />
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

            {/* Type Filter */}
            <div className="col-12 col-md-6 col-lg-2">
              <label className="form-label fw-semibold mb-2" style={{ 
                color: 'var(--sand-900)', 
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FontAwesomeIcon icon={faPercent} style={{ color: 'var(--sand-600)' }} />
                Type
              </label>
              <Select
                options={typeOptions}
                value={selectedType}
                onChange={setSelectedType}
                placeholder="All Types"
                styles={customSelectStyles}
                isClearable
              />
            </div>

            {/* Add Coupon Button */}
            <div className="col-12 col-lg-3">
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
                <span>Add New Coupon</span>
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="row mt-3">
            <div className="col-12">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <span style={{ color: 'var(--sand-700)', fontSize: '0.95rem', fontWeight: '500' }}>
                  <FontAwesomeIcon icon={faFilter} className="me-2" style={{ color: 'var(--sand-600)' }} />
                  Showing {sortedCoupons.length} of {coupons.length} coupons
                </span>
                {(searchQuery || selectedStatus || selectedType) && (
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedStatus(null);
                      setSelectedType(null);
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

        {/* Coupons Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr className="bg-light">
                <th 
                  className="px-3 py-3 text-uppercase fw-bold" 
                  style={{
                    color: 'var(--sand-800)',
                    fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                    letterSpacing: '0.5px',
                    borderRadius: '12px 0 0 12px',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                  onClick={() => handleSort('code')}
                >
                  Code {getSortIcon('code')}
                </th>
                <th 
                  className="px-3 py-3 text-uppercase fw-bold" 
                  style={{
                    color: 'var(--sand-800)',
                    fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                  onClick={() => handleSort('type')}
                >
                  Type {getSortIcon('type')}
                </th>
                <th 
                  className="px-3 py-3 text-uppercase fw-bold" 
                  style={{
                    color: 'var(--sand-800)',
                    fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                  onClick={() => handleSort('value')}
                >
                  Discount {getSortIcon('value')}
                </th>
                <th 
                  className="px-3 py-3 text-uppercase fw-bold d-none d-lg-table-cell" 
                  style={{
                    color: 'var(--sand-800)',
                    fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                  onClick={() => handleSort('minOrder')}
                >
                  Min Order {getSortIcon('minOrder')}
                </th>
                <th 
                  className="px-3 py-3 text-uppercase fw-bold d-none d-xl-table-cell" 
                  style={{
                    color: 'var(--sand-800)',
                    fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                  onClick={() => handleSort('usedCount')}
                >
                  Usage {getSortIcon('usedCount')}
                </th>
                <th 
                  className="px-3 py-3 text-uppercase fw-bold d-none d-md-table-cell" 
                  style={{
                    color: 'var(--sand-800)',
                    fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                  onClick={() => handleSort('validTo')}
                >
                  Valid Until {getSortIcon('validTo')}
                </th>
                <th 
                  className="px-3 py-3 text-uppercase fw-bold" 
                  style={{
                    color: 'var(--sand-800)',
                    fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                  onClick={() => handleSort('status')}
                >
                  Status {getSortIcon('status')}
                </th>
                <th className="px-3 py-3 text-uppercase fw-bold" style={{
                  color: 'var(--sand-800)',
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                  letterSpacing: '0.5px',
                  borderRadius: '0 12px 12px 0'
                }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedCoupons.map((coupon, index) => (
                <tr key={index} className="border-0" style={{
                  backgroundColor: 'var(--sand-100)',
                  cursor: 'pointer'
                }}>
                  <td className="px-3 py-3" style={{
                    borderRadius: '12px 0 0 12px'
                  }}>
                    <div className="d-flex align-items-center gap-2">
                      <span className="fw-bold font-monospace" style={{
                        color: 'var(--sand-900)',
                        fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
                        letterSpacing: '0.5px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '150px',
                        display: 'inline-block'
                      }}>
                        {coupon.code}
                      </span>
                      <button
                        onClick={() => handleCopyCouponCode(coupon.code)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--sand-600)',
                          cursor: 'pointer',
                          padding: '0.2rem',
                          fontSize: '0.9rem',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--sand-900)';
                          e.currentTarget.style.transform = 'scale(1.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--sand-600)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                        title="Copy code"
                      >
                        <FontAwesomeIcon icon={faCopy} />
                      </button>
                    </div>
                    <small style={{ color: 'var(--sand-600)', fontSize: '0.75rem' }}>
                      {coupon.applicableProducts}
                    </small>
                  </td>
                  <td className="px-3 py-3">
                    <span className="badge rounded-pill px-3 py-2" style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: coupon.type === 'Percentage' ? '#007bff20' : '#17a2b820',
                      color: coupon.type === 'Percentage' ? '#007bff' : '#17a2b8',
                      border: `2px solid ${coupon.type === 'Percentage' ? '#007bff40' : '#17a2b840'}`
                    }}>
                      {coupon.type}
                    </span>
                  </td>
                  <td className="px-3 py-3 fw-bold" style={{
                    color: '#28a745',
                    fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)'
                  }}>
                    {coupon.type === 'Percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                  </td>
                  <td className="px-3 py-3 d-none d-lg-table-cell" style={{
                    color: 'var(--sand-800)',
                    fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)',
                    fontWeight: '500'
                  }}>
                    ₹{coupon.minOrder.toLocaleString()}
                  </td>
                  <td className="px-3 py-3 d-none d-xl-table-cell" style={{
                    color: 'var(--sand-800)',
                    fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        flex: 1,
                        height: '6px',
                        backgroundColor: 'var(--sand-200)',
                        borderRadius: '10px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${(coupon.usedCount / coupon.usageLimit) * 100}%`,
                          height: '100%',
                          backgroundColor: coupon.usedCount >= coupon.usageLimit ? '#dc3545' : '#28a745',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: '600', minWidth: '60px' }}>
                        {coupon.usedCount}/{coupon.usageLimit}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 d-none d-md-table-cell" style={{
                    color: 'var(--sand-800)',
                    fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)',
                    fontWeight: '500'
                  }}>
                    {new Date(coupon.validTo).toLocaleDateString('en-IN', { 
                      day: '2-digit', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </td>
                  <td className="px-3 py-3">
                    <span className="badge rounded-pill px-3 py-2 text-uppercase fw-bold" style={{
                      fontSize: 'clamp(0.65rem, 1.2vw, 0.8rem)',
                      backgroundColor: `${getStatusColor(coupon.status)}20`,
                      color: getStatusColor(coupon.status),
                      letterSpacing: '0.5px',
                      border: `2px solid ${getStatusColor(coupon.status)}40`
                    }}>
                      {coupon.status}
                    </span>
                  </td>
                  <td className="px-3 py-3" style={{ borderRadius: '0 12px 12px 0' }}>
                    <div className="d-flex gap-2">
                      <button 
                        onClick={() => setViewCouponModal({ isOpen: true, coupon })}
                        className="btn btn-sm" style={{
                        backgroundColor: 'var(--sand-200)',
                        border: 'none',
                        color: 'var(--sand-900)',
                        padding: '0.4rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--sand-300)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--sand-200)';
                      }}>
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button 
                        onClick={() => setEditCouponModal({ isOpen: true, coupon })}
                        className="btn btn-sm d-none d-sm-inline" style={{
                        backgroundColor: '#007bff20',
                        border: 'none',
                        color: '#007bff',
                        padding: '0.4rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#007bff40';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#007bff20';
                      }}>
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(coupon)}
                        className="btn btn-sm d-none d-md-inline" style={{
                        backgroundColor: '#dc354520',
                        border: 'none',
                        color: '#dc3545',
                        padding: '0.4rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#dc354540';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#dc354520';
                      }}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* No Results */}
        {sortedCoupons.length === 0 && (
          <div className="text-center py-5">
            <div className="mb-4" style={{ fontSize: '5rem', opacity: 0.2 }}>🎟️</div>
            <h4 className="mb-2" style={{ 
              color: 'var(--sand-900)', 
              fontFamily: "'Playfair Display', serif",
              fontWeight: '700'
            }}>
              No coupons found
            </h4>
            <p className="mb-4" style={{ color: 'var(--sand-700)' }}>
              Try adjusting your filters or create a new coupon
            </p>
            <button 
              className="btn"
              onClick={() => setIsAddModalOpen(true)}
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
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Create New Coupon
            </button>
          </div>
        )}
      </div>

      {/* Add Coupon Modal */}
      <AddCouponModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      {/* Animations */}
      <style>{`
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
      `}</style>

      {/* Add Coupon Modal */}
      <AddCouponModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      {/* View Coupon Modal */}
      <ViewCouponModal 
        isOpen={viewCouponModal.isOpen}
        onClose={() => setViewCouponModal({ isOpen: false, coupon: null })}
        coupon={viewCouponModal.coupon}
        onEdit={(coupon) => {
          setViewCouponModal({ isOpen: false, coupon: null });
          setEditCouponModal({ isOpen: true, coupon });
        }}
      />

      {/* Edit Coupon Modal */}
      <EditCouponModal 
        isOpen={editCouponModal.isOpen}
        onClose={() => setEditCouponModal({ isOpen: false, coupon: null })}
        coupon={editCouponModal.coupon}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={deleteModal.isOpen}
        onClose={() => !isDeleting && setDeleteModal({ isOpen: false, coupon: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Coupon"
        message="Are you sure you want to delete this coupon? This will permanently remove it from the system."
        itemName={deleteModal.coupon?.code}
        isDeleting={isDeleting}
      />
    </div>
  );
}
