import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, faUserCheck, faUserClock, faUserShield,
  faSearch, faFilter, faEye, faEdit, faBan, faEnvelope, faPhone
} from '@fortawesome/free-solid-svg-icons';
import { fetchMembers, updateMemberStatus, deleteMember, clearError, clearSuccess } from '../APIS/slice/MemberSlice';
import { toast } from 'react-toastify';
import ViewMemberModal from '../components/modals/ViewMemberModal';
import EditMemberModal from '../components/modals/EditMemberModal';

export default function Users() {
  const dispatch = useDispatch();
  const { members, loading, error, success } = useSelector(state => state.MemberSlice);
  
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch members on component mount
  useEffect(() => {
    dispatch(fetchMembers());
  }, [dispatch]);

  // Show success/error messages
  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearSuccess());
      dispatch(fetchMembers()); // Refresh data
    }
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [success, error, dispatch]);

  // Map members to users format — guard against null/undefined
  const users = (Array.isArray(members) ? members : []).map(member => ({
    id: member._id,
    name: member.name,
    email: member.email,
    phone: member.phone,
    role: member.role,
    status: member.status === 'active' ? 'Active' : 'Inactive',
    orders: member.orders,
    totalSpent: member.totalSpent,
    joinDate: new Date(member.joinDate).toISOString().split('T')[0],
    lastActive: new Date(member.lastActive).toISOString().split('T')[0]
  }));

  // Calculate stats
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'Active').length;
  const newUsers = users.filter(u => new Date(u.joinDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length; // Last 30 days
  const adminUsers = users.filter(u => u.role === 'Admin').length;

  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  // Role options
  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'customer', label: 'Customer' },
    { value: 'admin', label: 'Admin' }
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

  // Filter users
  const filteredUsers = users.filter(user => {
    const statusMatch = !selectedStatus || selectedStatus.value === 'all' || user.status.toLowerCase() === selectedStatus.value;
    const roleMatch = !selectedRole || selectedRole.value === 'all' || user.role.toLowerCase() === selectedRole.value;
    const searchMatch = !searchQuery || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);
    return statusMatch && roleMatch && searchMatch;
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
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
      case 'Inactive': return '#ffc107';
      default: return '#6c757d';
    }
  };

  // Get role color
  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin': return '#007bff';
      case 'Customer': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  // Handle view user
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  // Handle toggle user status
  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'inactive' : 'active';
    const action = currentStatus === 'Active' ? 'deactivate' : 'activate';
    
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        await dispatch(updateMemberStatus({ id: userId, status: newStatus }));
      } catch (error) {
        toast.error(`Failed to ${action} user`);
      }
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
          Users Management
        </h2>
        <p className="mb-0" style={{ 
          color: 'var(--sand-700)', 
          fontSize: 'clamp(0.9rem, 2vw, 1rem)',
          fontWeight: '500'
        }}>
          Manage and monitor all registered users
        </p>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 g-md-4 mb-4">
        {/* Total Users */}
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
                  Total Users
                </p>
                <h3 className="mb-0" style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {totalUsers}
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
                <FontAwesomeIcon icon={faUsers} />
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 position-relative" style={{
              fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
              color: 'var(--sand-700)',
              fontWeight: '600'
            }}>
              Registered users
            </div>
          </div>
        </div>

        {/* Active Users */}
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
                  Active Users
                </p>
                <h3 className="mb-0" style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {activeUsers}
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
                <FontAwesomeIcon icon={faUserCheck} />
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

        {/* New Users */}
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
                  New Users
                </p>
                <h3 className="mb-0" style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {newUsers}
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
                <FontAwesomeIcon icon={faUserClock} />
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 position-relative" style={{
              fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
              color: 'var(--sand-700)',
              fontWeight: '600'
            }}>
              This month
            </div>
          </div>
        </div>

        {/* Admin Users */}
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
                  Admins
                </p>
                <h3 className="mb-0" style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {adminUsers}
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
                <FontAwesomeIcon icon={faUserShield} />
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 position-relative" style={{
              fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
              color: 'var(--sand-700)',
              fontWeight: '600'
            }}>
              Admin accounts
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
          <div className="row g-3 align-items-end">
            {/* Search Bar */}
            <div className="col-12 col-md-5">
              <label className="form-label fw-semibold mb-2" style={{ 
                color: 'var(--sand-900)', 
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FontAwesomeIcon icon={faSearch} style={{ color: 'var(--sand-600)' }} />
                Search Users
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, email, or phone..."
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
            <div className="col-12 col-md-3">
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

            {/* Role Filter */}
            <div className="col-12 col-md-2">
              <label className="form-label fw-semibold mb-2" style={{ 
                color: 'var(--sand-900)', 
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <FontAwesomeIcon icon={faUserShield} style={{ color: 'var(--sand-600)' }} />
                Role
              </label>
              <Select
                options={roleOptions}
                value={selectedRole}
                onChange={setSelectedRole}
                placeholder="All Roles"
                styles={customSelectStyles}
                isClearable
              />
            </div>

            {/* Results Count */}
            <div className="col-12 col-md-2">
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <span style={{ color: 'var(--sand-700)', fontSize: '0.9rem', fontWeight: '500' }}>
                  {sortedUsers.length} of {users.length}
                </span>
                {(searchQuery || selectedStatus || selectedRole) && (
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedStatus(null);
                      setSelectedRole(null);
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
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
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
                  onClick={() => handleSort('name')}
                >
                  User {getSortIcon('name')}
                </th>
                <th className="px-3 py-3 text-uppercase fw-bold d-none d-lg-table-cell" style={{
                  color: 'var(--sand-800)',
                  fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                  letterSpacing: '0.5px'
                }}>Contact</th>
                <th 
                  className="px-3 py-3 text-uppercase fw-bold" 
                  style={{
                    color: 'var(--sand-800)',
                    fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
                    letterSpacing: '0.5px',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                  onClick={() => handleSort('role')}
                >
                  Role {getSortIcon('role')}
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
                  onClick={() => handleSort('orders')}
                >
                  Orders {getSortIcon('orders')}
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
                  onClick={() => handleSort('totalSpent')}
                >
                  Total Spent {getSortIcon('totalSpent')}
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
              {sortedUsers.map((user, index) => (
                <tr key={index} className="border-0" style={{
                  backgroundColor: 'var(--sand-100)',
                  cursor: 'pointer'
                }}>
                  <td className="px-3 py-3" style={{
                    borderRadius: '12px 0 0 12px'
                  }}>
                    <div className="d-flex align-items-center gap-3">
                      <div style={{
                        width: '45px',
                        height: '45px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--sand-600), var(--sand-700))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '700',
                        fontSize: '1.1rem'
                      }}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{
                          color: 'var(--sand-900)',
                          fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
                          fontWeight: '600'
                        }}>{user.name}</div>
                        <small style={{ color: 'var(--sand-600)' }} className="d-lg-none">{user.email}</small>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 d-none d-lg-table-cell" style={{
                    color: 'var(--sand-800)',
                    fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)'
                  }}>
                    <div>
                      <FontAwesomeIcon icon={faEnvelope} className="me-2" style={{ color: 'var(--sand-600)' }} />
                      {user.email}
                    </div>
                    <div className="mt-1">
                      <FontAwesomeIcon icon={faPhone} className="me-2" style={{ color: 'var(--sand-600)' }} />
                      {user.phone}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className="badge rounded-pill px-3 py-2 text-uppercase fw-bold" style={{
                      fontSize: 'clamp(0.7rem, 1.2vw, 0.8rem)',
                      backgroundColor: `${getRoleColor(user.role)}20`,
                      color: getRoleColor(user.role),
                      letterSpacing: '0.5px',
                      border: `2px solid ${getRoleColor(user.role)}40`
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-3 py-3 d-none d-md-table-cell" style={{
                    color: 'var(--sand-800)',
                    fontSize: 'clamp(0.85rem, 1.5vw, 0.95rem)',
                    fontWeight: '600'
                  }}>{user.orders}</td>
                  <td className="px-3 py-3 d-none d-xl-table-cell fw-bold" style={{
                    color: '#28a745',
                    fontSize: 'clamp(0.85rem, 1.5vw, 1rem)'
                  }}>₹{user.totalSpent.toLocaleString()}</td>
                  <td className="px-3 py-3">
                    <span className="badge rounded-pill px-3 py-2 text-uppercase fw-bold" style={{
                      fontSize: 'clamp(0.65rem, 1.2vw, 0.8rem)',
                      backgroundColor: `${getStatusColor(user.status)}20`,
                      color: getStatusColor(user.status),
                      letterSpacing: '0.5px',
                      border: `2px solid ${getStatusColor(user.status)}40`
                    }}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-3 py-3" style={{ borderRadius: '0 12px 12px 0' }}>
                    <div className="d-flex gap-2">
                      <button 
                        onClick={() => handleViewUser(user)}
                        className="btn btn-sm" 
                        title="View Details"
                        style={{
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
                        }}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="btn btn-sm d-none d-sm-inline" 
                        title="Edit User"
                        style={{
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
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(user.id, user.status)}
                        className="btn btn-sm d-none d-md-inline" 
                        title={user.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                        style={{
                          backgroundColor: user.status === 'Active' ? '#ffc10720' : '#28a74520',
                          border: 'none',
                          color: user.status === 'Active' ? '#ffc107' : '#28a745',
                          padding: '0.4rem 0.6rem',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = user.status === 'Active' ? '#ffc10740' : '#28a74540';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = user.status === 'Active' ? '#ffc10720' : '#28a74520';
                        }}
                      >
                        <FontAwesomeIcon icon={faBan} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* No Results */}
        {sortedUsers.length === 0 && (
          <div className="text-center py-5">
            <div className="mb-4" style={{ fontSize: '5rem', opacity: 0.2 }}>👥</div>
            <h4 className="mb-2" style={{ 
              color: 'var(--sand-900)', 
              fontFamily: "'Playfair Display', serif",
              fontWeight: '700'
            }}>
              No users found
            </h4>
            <p className="mb-4" style={{ color: 'var(--sand-700)' }}>
              Try adjusting your filters or search query
            </p>
            <button 
              className="btn"
              onClick={() => {
                setSearchQuery('');
                setSelectedStatus(null);
                setSelectedRole(null);
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

      {/* View Member Modal */}
      <ViewMemberModal 
        show={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedUser(null);
        }}
        member={selectedUser}
      />

      {/* Edit Member Modal */}
      <EditMemberModal 
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        member={selectedUser}
        onSuccess={() => {
          dispatch(fetchMembers());
        }}
      />
    </div>
  );
}
