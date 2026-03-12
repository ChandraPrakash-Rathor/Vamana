import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserPlus, faEye, faEdit, faTrash, faShieldAlt, faUserSlash, faPalette, faCheck, faCog 
} from '@fortawesome/free-solid-svg-icons';
import { 
  getMe, getAllAdmins, deleteAdmin 
} from '../APIS/apis/Authapi';
import { getAllThemes, activateTheme } from '../APIS/apis/ThemeApi';
import { getSiteSettings, updateSiteSettings } from '../APIS/apis/SiteSettingsApi';
import { toast } from 'react-toastify';
import ViewAdminModal from '../components/modals/ViewAdminModal';
import EditAdminModal from '../components/modals/EditAdminModal';
import AddAdminModal from '../components/modals/AddAdminModal';

export default function Settings() {
  const dispatch = useDispatch();
  
  // Get data from Redux store with safe defaults
  const loginState = useSelector((state) => state.AuthSlice);
  const currentUser = loginState?.currentUser || null;
  const admins = loginState?.admins || [];
  const adminsLoading = loginState?.adminsLoading || false;
  
  const themeState = useSelector((state) => state.ThemeSlice);
  const themes = themeState?.themes || [];
  const activeTheme = themeState?.activeTheme;
  const themesLoading = themeState?.loading || false;
  
  // Tab state
  const [activeTab, setActiveTab] = useState('admins');
  
  // Modal states
  const [showViewAdmin, setShowViewAdmin] = useState(false);
  const [showEditAdmin, setShowEditAdmin] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  // Site Settings state
  const [siteSettings, setSiteSettings] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
    fetchAllAdmins();
    fetchAllThemes();
    fetchSiteSettings();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const res = await dispatch(getMe());
      if (res.type.includes('rejected')) {
        const errorMsg = res.error?.message || res.payload?.message || 'Failed to load user data';
        toast.error(errorMsg);
      } else if (!res.payload?.success) {
        toast.error(res.payload?.message || 'Failed to load user data');
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Failed to load user data';
      toast.error(errorMsg);
    }
  };

  const fetchAllAdmins = async () => {
    try {
      const res = await dispatch(getAllAdmins());
      if (res.type.includes('rejected')) {
        const errorMsg = res.error?.message || res.payload?.message || 'Failed to load admins';
        toast.error(errorMsg);
      } else if (!res.payload?.success) {
        toast.error(res.payload?.message || 'Failed to load admins');
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Failed to load admins';
      toast.error(errorMsg);
    }
  };

  const fetchAllThemes = async () => {
    try {
      const res = await dispatch(getAllThemes());
      if (res.type.includes('rejected')) {
        const errorMsg = res.error?.message || res.payload?.message || 'Failed to load themes';
        toast.error(errorMsg);
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Failed to load themes';
      toast.error(errorMsg);
    }
  };

  const fetchSiteSettings = async () => {
    try {
      const data = await getSiteSettings();
      setSiteSettings(data.data);
      setLogoPreview(`http://localhost:5000${data.data.logo}`);
    } catch (error) {
      toast.error('Failed to load site settings');
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSettingsLoading(true);
      const formData = new FormData();
      if (logoFile) formData.append('logo', logoFile);
      formData.append('siteName', siteSettings.siteName);
      formData.append('tagline', siteSettings.tagline);
      formData.append('email', siteSettings.email);
      formData.append('phone', siteSettings.phone);
      formData.append('address', siteSettings.address);
      formData.append('socialLinks', JSON.stringify(siteSettings.socialLinks));
      formData.append('footerAbout', siteSettings.footerAbout);
      formData.append('footerCopyright', siteSettings.footerCopyright);
      
      await updateSiteSettings(formData);
      toast.success('Settings updated successfully!');
      fetchSiteSettings();
      setLogoFile(null);
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleActivateTheme = async (themeId, themeName) => {
    try {
      const res = await dispatch(activateTheme(themeId));
      
      if (res.type.includes('rejected')) {
        const errorMsg = res.error?.message || res.payload?.message || 'Failed to activate theme';
        toast.error(errorMsg);
        return;
      }
      
      if (res.payload?.success) {
        toast.success(`${themeName} activated successfully!`);
        // Reload page to apply new theme
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error(res.payload?.message || 'Failed to activate theme');
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Failed to activate theme';
      toast.error(errorMsg);
    }
  };

  const handleViewAdmin = (admin) => {
    setSelectedAdmin(admin);
    setShowViewAdmin(true);
  };

  const handleEditAdmin = (admin) => {
    setSelectedAdmin(admin);
    setShowEditAdmin(true);
  };

  const handleDeleteAdmin = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete admin "${name}"?`)) {
      return;
    }
    
    try {
      const res = await dispatch(deleteAdmin(id));
      
      // Check if request was rejected
      if (res.type.includes('rejected')) {
        const errorMsg = res.error?.message || res.payload?.message || 'Failed to delete admin';
        toast.error(errorMsg);
        return;
      }
      
      if (res.payload?.success) {
        toast.success(res.payload?.message || 'Admin deleted successfully');
        fetchAllAdmins();
      } else {
        toast.error(res.payload?.message || 'Failed to delete admin');
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.message || error?.message || 'Failed to delete admin';
      toast.error(errorMsg);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-4">
        <h2 style={{
          color: 'var(--sand-900)',
          fontFamily: "'Playfair Display', serif",
          fontSize: '2rem',
          marginBottom: '0.5rem',
          fontWeight: '700'
        }}>
          <FontAwesomeIcon icon={faShieldAlt} style={{ marginRight: '0.75rem' }} />
          Settings
        </h2>
        <p style={{ color: 'var(--sand-700)', fontSize: '1rem', marginBottom: 0 }}>
          Manage admin users and customize theme
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="card mb-4" style={{
        border: 'none',
        borderRadius: '16px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          borderBottom: '2px solid var(--sand-200)'
        }}>
          <button
            onClick={() => setActiveTab('admins')}
            style={{
              flex: 1,
              padding: '1.2rem 2rem',
              backgroundColor: activeTab === 'admins' ? 'var(--sand-100)' : 'white',
              border: 'none',
              borderBottom: activeTab === 'admins' ? '3px solid var(--sand-600)' : '3px solid transparent',
              color: activeTab === 'admins' ? 'var(--sand-900)' : 'var(--sand-600)',
              fontWeight: activeTab === 'admins' ? '700' : '600',
              fontSize: '1.05rem',
              cursor: 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'admins') {
                e.target.style.backgroundColor = 'var(--sand-50)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'admins') {
                e.target.style.backgroundColor = 'white';
              }
            }}
          >
            <FontAwesomeIcon icon={faShieldAlt} />
            Admin Users
          </button>
          
          <button
            onClick={() => setActiveTab('themes')}
            style={{
              flex: 1,
              padding: '1.2rem 2rem',
              backgroundColor: activeTab === 'themes' ? 'var(--sand-100)' : 'white',
              border: 'none',
              borderBottom: activeTab === 'themes' ? '3px solid var(--sand-600)' : '3px solid transparent',
              color: activeTab === 'themes' ? 'var(--sand-900)' : 'var(--sand-600)',
              fontWeight: activeTab === 'themes' ? '700' : '600',
              fontSize: '1.05rem',
              cursor: 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'themes') {
                e.target.style.backgroundColor = 'var(--sand-50)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'themes') {
                e.target.style.backgroundColor = 'white';
              }
            }}
          >
            <FontAwesomeIcon icon={faPalette} />
            Theme Management
          </button>

          <button
            onClick={() => setActiveTab('site')}
            style={{
              flex: 1,
              padding: '1.2rem 2rem',
              backgroundColor: activeTab === 'site' ? 'var(--sand-100)' : 'white',
              border: 'none',
              borderBottom: activeTab === 'site' ? '3px solid var(--sand-600)' : '3px solid transparent',
              color: activeTab === 'site' ? 'var(--sand-900)' : 'var(--sand-600)',
              fontWeight: activeTab === 'site' ? '700' : '600',
              fontSize: '1.05rem',
              cursor: 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== 'site') {
                e.target.style.backgroundColor = 'var(--sand-50)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== 'site') {
                e.target.style.backgroundColor = 'white';
              }
            }}
          >
            <FontAwesomeIcon icon={faCog} />
            Site Settings
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'admins' && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{
          color: 'var(--sand-900)',
          fontFamily: "'Playfair Display', serif",
          fontSize: '2rem',
          marginBottom: 0,
          fontWeight: '700'
        }}>
          Admin Users Management
        </h2>
        
        <button
          onClick={() => setShowAddAdmin(true)}
          className="btn"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--sand-600)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontWeight: '600',
            fontSize: '1rem',
            transition: 'all 0.3s',
            boxShadow: '0 4px 12px rgba(179, 135, 63, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'var(--sand-700)';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 16px rgba(179, 135, 63, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'var(--sand-600)';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(179, 135, 63, 0.3)';
          }}
        >
          <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: '0.5rem' }} />
          Add New Admin
        </button>
      </div>

      {/* Admin Table */}
      <div className="card" style={{
        border: 'none',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden'
      }}>
        <div style={{ padding: '2rem' }}>
          {adminsLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ color: 'var(--sand-600)' }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p style={{ marginTop: '1rem', color: 'var(--sand-600)' }}>Loading admins...</p>
            </div>
          ) : admins.length === 0 ? (
            <div className="text-center py-5">
              <FontAwesomeIcon 
                icon={faUserSlash} 
                style={{ 
                  fontSize: '4rem', 
                  color: 'var(--sand-400)',
                  marginBottom: '1rem'
                }} 
              />
              <h5 style={{ 
                color: 'var(--sand-700)', 
                marginBottom: '0.5rem',
                fontWeight: '600'
              }}>
                No Admins Found
              </h5>
              <p style={{ 
                color: 'var(--sand-600)', 
                fontSize: '1rem',
                marginBottom: '1.5rem'
              }}>
                There are no admin users in the system yet.
              </p>
              <button
                onClick={() => setShowAddAdmin(true)}
                className="btn"
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'var(--sand-600)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '1rem',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 12px rgba(179, 135, 63, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--sand-700)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--sand-600)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: '0.5rem' }} />
                Add Your First Admin
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover" style={{ marginBottom: 0 }}>
                <thead>
                  <tr style={{ 
                    borderBottom: '2px solid var(--sand-300)',
                    backgroundColor: 'var(--sand-100)'
                  }}>
                    <th style={{ 
                      padding: '1rem 1.5rem',
                      fontWeight: '700',
                      color: 'var(--sand-900)',
                      fontSize: '0.95rem',
                      borderTop: 'none'
                    }}>
                      Admin
                    </th>
                    <th style={{ 
                      padding: '1rem 1.5rem',
                      fontWeight: '700',
                      color: 'var(--sand-900)',
                      fontSize: '0.95rem',
                      borderTop: 'none'
                    }}>
                      Email
                    </th>
                    <th style={{ 
                      padding: '1rem 1.5rem',
                      fontWeight: '700',
                      color: 'var(--sand-900)',
                      fontSize: '0.95rem',
                      borderTop: 'none'
                    }}>
                      Role
                    </th>
                    <th style={{ 
                      padding: '1rem 1.5rem',
                      fontWeight: '700',
                      color: 'var(--sand-900)',
                      fontSize: '0.95rem',
                      borderTop: 'none'
                    }}>
                      Status
                    </th>
                    <th style={{ 
                      padding: '1rem 1.5rem',
                      fontWeight: '700',
                      color: 'var(--sand-900)',
                      fontSize: '0.95rem',
                      textAlign: 'center',
                      borderTop: 'none'
                    }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr 
                      key={admin._id}
                      style={{
                        borderBottom: '1px solid var(--sand-200)',
                        backgroundColor: currentUser?._id === admin._id ? 'rgba(179, 135, 63, 0.05)' : 'white',
                        transition: 'all 0.3s'
                      }}
                    >
                      <td style={{ padding: '1.25rem 1.5rem', verticalAlign: 'middle' }}>
                        <div className="d-flex align-items-center gap-3">
                          <div style={{
                            width: '45px',
                            height: '45px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--sand-600)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: '1.1rem',
                            flexShrink: 0
                          }}>
                            {admin.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ 
                              fontWeight: '700',
                              color: 'var(--sand-900)',
                              fontSize: '1rem',
                              marginBottom: '0.2rem'
                            }}>
                              {admin.name}
                              {currentUser?._id === admin._id && (
                                <span style={{
                                  marginLeft: '0.5rem',
                                  padding: '0.2rem 0.6rem',
                                  backgroundColor: 'var(--sand-600)',
                                  color: 'white',
                                  borderRadius: '6px',
                                  fontSize: '0.7rem',
                                  fontWeight: '600'
                                }}>
                                  YOU
                                </span>
                              )}
                            </div>
                            <div style={{ 
                              fontSize: '0.8rem',
                              color: 'var(--sand-600)'
                            }}>
                              ID: {admin._id.slice(-8)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ 
                        padding: '1.25rem 1.5rem',
                        color: 'var(--sand-800)',
                        fontSize: '0.95rem',
                        verticalAlign: 'middle'
                      }}>
                        {admin.email}
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem', verticalAlign: 'middle' }}>
                        <span style={{
                          padding: '0.4rem 1rem',
                          backgroundColor: 'var(--sand-200)',
                          color: 'var(--sand-900)',
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          textTransform: 'capitalize'
                        }}>
                          {admin.role}
                        </span>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem', verticalAlign: 'middle' }}>
                        <span style={{
                          padding: '0.4rem 1rem',
                          backgroundColor: admin.status ? '#d4edda' : '#f8d7da',
                          color: admin.status ? '#155724' : '#721c24',
                          borderRadius: '20px',
                          fontSize: '0.85rem',
                          fontWeight: '600'
                        }}>
                          {admin.status ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ 
                        padding: '1.25rem 1.5rem',
                        textAlign: 'center',
                        verticalAlign: 'middle'
                      }}>
                        <div className="d-flex gap-2 justify-content-center">
                          <button
                            onClick={() => handleViewAdmin(admin)}
                            className="btn btn-sm"
                            title="View Details"
                            style={{
                              padding: '0.5rem 0.75rem',
                              backgroundColor: '#17a2b8',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#138496'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#17a2b8'}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                          
                          <button
                            onClick={() => handleEditAdmin(admin)}
                            className="btn btn-sm"
                            title="Edit Admin"
                            style={{
                              padding: '0.5rem 0.75rem',
                              backgroundColor: '#ffc107',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#e0a800'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#ffc107'}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          
                          {currentUser?._id !== admin._id && (
                            <button
                              onClick={() => handleDeleteAdmin(admin._id, admin.name)}
                              className="btn btn-sm"
                              title="Delete Admin"
                              style={{
                                padding: '0.5rem 0.75rem',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                transition: 'all 0.3s'
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ViewAdminModal 
        show={showViewAdmin}
        onClose={() => setShowViewAdmin(false)}
        admin={selectedAdmin}
      />
      
      <EditAdminModal 
        show={showEditAdmin}
        onClose={() => setShowEditAdmin(false)}
        admin={selectedAdmin}
        currentUser={currentUser}
        onSuccess={fetchAllAdmins}
      />
      
      <AddAdminModal 
        show={showAddAdmin}
        onClose={() => setShowAddAdmin(false)}
        onSuccess={fetchAllAdmins}
      />
        </>
      )}

      {/* Themes Tab Content */}
      {activeTab === 'themes' && (
        <div className="card" style={{
          border: 'none',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '2rem' }}>
            {themesLoading ? (
              <div className="text-center py-5">
                <div className="spinner-border" style={{ color: 'var(--sand-600)' }} role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p style={{ marginTop: '1rem', color: 'var(--sand-600)' }}>Loading themes...</p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{
                    color: 'var(--sand-900)',
                    fontWeight: '700',
                    marginBottom: '0.5rem'
                  }}>
                    Choose Your Theme
                  </h4>
                  <p style={{ color: 'var(--sand-700)', marginBottom: 0 }}>
                    Select a theme to customize the look and feel of both admin and member sites
                  </p>
                </div>
                
                <div className="row g-4">
                  {themes.map((theme) => (
                    <div key={theme._id} className="col-lg-4 col-md-6">
                      <div 
                        style={{
                          border: theme.isActive ? '3px solid var(--sand-600)' : '2px solid var(--sand-300)',
                          borderRadius: '16px',
                          padding: '1.5rem',
                          backgroundColor: theme.isActive ? 'rgba(179, 135, 63, 0.05)' : 'white',
                          transition: 'all 0.3s',
                          cursor: theme.isActive ? 'default' : 'pointer',
                          position: 'relative',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          minHeight: '280px'
                        }}
                        onClick={() => !theme.isActive && handleActivateTheme(theme._id, theme.name)}
                        onMouseEnter={(e) => {
                          if (!theme.isActive) {
                            e.currentTarget.style.transform = 'translateY(-4px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!theme.isActive) {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }
                        }}
                      >
                        {theme.isActive && (
                          <div style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            backgroundColor: 'var(--sand-600)',
                            color: 'white',
                            padding: '0.4rem 0.9rem',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            boxShadow: '0 2px 8px rgba(179, 135, 63, 0.3)'
                          }}>
                            <FontAwesomeIcon icon={faCheck} />
                            ACTIVE
                          </div>
                        )}
                        
                        <div style={{ flex: 1 }}>
                          <h5 style={{
                            color: 'var(--sand-900)',
                            fontWeight: '700',
                            marginBottom: '1.2rem',
                            fontSize: '1.3rem',
                            paddingRight: theme.isActive ? '80px' : '0'
                          }}>
                            {theme.name}
                          </h5>
                          
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(11, 1fr)',
                            gap: '0.4rem',
                            marginBottom: '1rem'
                          }}>
                            {Object.entries(theme.colors).map(([shade, color]) => (
                              <div
                                key={shade}
                                style={{
                                  width: '100%',
                                  paddingBottom: '100%',
                                  backgroundColor: color,
                                  borderRadius: '6px',
                                  border: '2px solid white',
                                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                                  position: 'relative'
                                }}
                                title={`${shade}: ${color}`}
                              />
                            ))}
                          </div>
                          
                          <div style={{
                            fontSize: '0.85rem',
                            color: 'var(--sand-700)',
                            fontWeight: '500',
                            marginTop: '0.5rem'
                          }}>
                            11 color shades • {theme.isActive ? 'Currently applied' : 'Click to activate'}
                          </div>
                        </div>
                        
                        {!theme.isActive && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActivateTheme(theme._id, theme.name);
                            }}
                            className="btn mt-3"
                            style={{
                              padding: '0.7rem',
                              backgroundColor: 'var(--sand-600)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '10px',
                              fontWeight: '600',
                              fontSize: '0.95rem',
                              transition: 'all 0.3s',
                              width: '100%'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = 'var(--sand-700)';
                              e.target.style.transform = 'scale(1.02)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = 'var(--sand-600)';
                              e.target.style.transform = 'scale(1)';
                            }}
                          >
                            <FontAwesomeIcon icon={faPalette} style={{ marginRight: '0.5rem' }} />
                            Activate This Theme
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Site Settings Tab Content */}
      {activeTab === 'site' && (
        <div className="card" style={{
          border: 'none',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '2rem' }}>
            {!siteSettings ? (
              <div className="text-center py-5">
                <div className="spinner-border" style={{ color: 'var(--sand-600)' }} role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p style={{ marginTop: '1rem', color: 'var(--sand-600)' }}>Loading settings...</p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{
                    color: 'var(--sand-900)',
                    fontWeight: '700',
                    marginBottom: '0.5rem'
                  }}>
                    Site Settings
                  </h4>
                  <p style={{ color: 'var(--sand-700)', marginBottom: 0 }}>
                    Manage your site logo, contact information, and footer content
                  </p>
                </div>

                <div className="row g-4">
                  {/* Logo Upload */}
                  <div className="col-12">
                    <div style={{
                      padding: '1.5rem',
                      backgroundColor: 'var(--sand-50)',
                      borderRadius: '12px',
                      border: '2px dashed var(--sand-300)'
                    }}>
                      <label style={{
                        display: 'block',
                        fontWeight: '700',
                        color: 'var(--sand-900)',
                        marginBottom: '1rem',
                        fontSize: '1rem'
                      }}>
                        Site Logo
                      </label>
                      {logoPreview && (
                        <div style={{ marginBottom: '1rem' }}>
                          <img 
                            src={logoPreview} 
                            alt="Logo Preview" 
                            style={{
                              maxWidth: '200px',
                              maxHeight: '100px',
                              objectFit: 'contain',
                              backgroundColor: 'white',
                              padding: '0.5rem',
                              borderRadius: '8px',
                              border: '1px solid var(--sand-300)'
                            }}
                          />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setLogoFile(file);
                            setLogoPreview(URL.createObjectURL(file));
                          }
                        }}
                        style={{
                          padding: '0.75rem',
                          border: '1px solid var(--sand-300)',
                          borderRadius: '8px',
                          width: '100%',
                          backgroundColor: 'white'
                        }}
                      />
                    </div>
                  </div>

                  {/* Site Name */}
                  <div className="col-md-6">
                    <label style={{
                      display: 'block',
                      fontWeight: '700',
                      color: 'var(--sand-900)',
                      marginBottom: '0.5rem',
                      fontSize: '0.95rem'
                    }}>
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={siteSettings.siteName}
                      onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--sand-300)',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  {/* Tagline */}
                  <div className="col-md-6">
                    <label style={{
                      display: 'block',
                      fontWeight: '700',
                      color: 'var(--sand-900)',
                      marginBottom: '0.5rem',
                      fontSize: '0.95rem'
                    }}>
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={siteSettings.tagline}
                      onChange={(e) => setSiteSettings({...siteSettings, tagline: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--sand-300)',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  {/* Email */}
                  <div className="col-md-6">
                    <label style={{
                      display: 'block',
                      fontWeight: '700',
                      color: 'var(--sand-900)',
                      marginBottom: '0.5rem',
                      fontSize: '0.95rem'
                    }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={siteSettings.email}
                      onChange={(e) => setSiteSettings({...siteSettings, email: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--sand-300)',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  {/* Phone */}
                  <div className="col-md-6">
                    <label style={{
                      display: 'block',
                      fontWeight: '700',
                      color: 'var(--sand-900)',
                      marginBottom: '0.5rem',
                      fontSize: '0.95rem'
                    }}>
                      Phone
                    </label>
                    <input
                      type="text"
                      value={siteSettings.phone}
                      onChange={(e) => setSiteSettings({...siteSettings, phone: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--sand-300)',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  {/* Address */}
                  <div className="col-12">
                    <label style={{
                      display: 'block',
                      fontWeight: '700',
                      color: 'var(--sand-900)',
                      marginBottom: '0.5rem',
                      fontSize: '0.95rem'
                    }}>
                      Address
                    </label>
                    <input
                      type="text"
                      value={siteSettings.address}
                      onChange={(e) => setSiteSettings({...siteSettings, address: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--sand-300)',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  {/* Social Links */}
                  <div className="col-12">
                    <h5 style={{
                      color: 'var(--sand-900)',
                      fontWeight: '700',
                      marginBottom: '1rem',
                      marginTop: '1rem'
                    }}>
                      Social Media Links
                    </h5>
                  </div>

                  <div className="col-md-6">
                    <label style={{
                      display: 'block',
                      fontWeight: '700',
                      color: 'var(--sand-900)',
                      marginBottom: '0.5rem',
                      fontSize: '0.95rem'
                    }}>
                      Facebook
                    </label>
                    <input
                      type="url"
                      value={siteSettings.socialLinks.facebook}
                      onChange={(e) => setSiteSettings({
                        ...siteSettings, 
                        socialLinks: {...siteSettings.socialLinks, facebook: e.target.value}
                      })}
                      placeholder="https://facebook.com/yourpage"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--sand-300)',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label style={{
                      display: 'block',
                      fontWeight: '700',
                      color: 'var(--sand-900)',
                      marginBottom: '0.5rem',
                      fontSize: '0.95rem'
                    }}>
                      Instagram
                    </label>
                    <input
                      type="url"
                      value={siteSettings.socialLinks.instagram}
                      onChange={(e) => setSiteSettings({
                        ...siteSettings, 
                        socialLinks: {...siteSettings.socialLinks, instagram: e.target.value}
                      })}
                      placeholder="https://instagram.com/yourpage"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--sand-300)',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label style={{
                      display: 'block',
                      fontWeight: '700',
                      color: 'var(--sand-900)',
                      marginBottom: '0.5rem',
                      fontSize: '0.95rem'
                    }}>
                      Twitter
                    </label>
                    <input
                      type="url"
                      value={siteSettings.socialLinks.twitter}
                      onChange={(e) => setSiteSettings({
                        ...siteSettings, 
                        socialLinks: {...siteSettings.socialLinks, twitter: e.target.value}
                      })}
                      placeholder="https://twitter.com/yourpage"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--sand-300)',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label style={{
                      display: 'block',
                      fontWeight: '700',
                      color: 'var(--sand-900)',
                      marginBottom: '0.5rem',
                      fontSize: '0.95rem'
                    }}>
                      YouTube
                    </label>
                    <input
                      type="url"
                      value={siteSettings.socialLinks.youtube}
                      onChange={(e) => setSiteSettings({
                        ...siteSettings, 
                        socialLinks: {...siteSettings.socialLinks, youtube: e.target.value}
                      })}
                      placeholder="https://youtube.com/yourchannel"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--sand-300)',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label style={{
                      display: 'block',
                      fontWeight: '700',
                      color: 'var(--sand-900)',
                      marginBottom: '0.5rem',
                      fontSize: '0.95rem'
                    }}>
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={siteSettings.socialLinks.linkedin}
                      onChange={(e) => setSiteSettings({
                        ...siteSettings, 
                        socialLinks: {...siteSettings.socialLinks, linkedin: e.target.value}
                      })}
                      placeholder="https://linkedin.com/company/yourcompany"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--sand-300)',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  {/* Footer Content */}
                  <div className="col-12">
                    <h5 style={{
                      color: 'var(--sand-900)',
                      fontWeight: '700',
                      marginBottom: '1rem',
                      marginTop: '1rem'
                    }}>
                      Footer Content
                    </h5>
                  </div>

                  <div className="col-12">
                    <label style={{
                      display: 'block',
                      fontWeight: '700',
                      color: 'var(--sand-900)',
                      marginBottom: '0.5rem',
                      fontSize: '0.95rem'
                    }}>
                      About Text
                    </label>
                    <textarea
                      value={siteSettings.footerAbout}
                      onChange={(e) => setSiteSettings({...siteSettings, footerAbout: e.target.value})}
                      rows="3"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--sand-300)',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div className="col-12">
                    <label style={{
                      display: 'block',
                      fontWeight: '700',
                      color: 'var(--sand-900)',
                      marginBottom: '0.5rem',
                      fontSize: '0.95rem'
                    }}>
                      Copyright Text
                    </label>
                    <input
                      type="text"
                      value={siteSettings.footerCopyright}
                      onChange={(e) => setSiteSettings({...siteSettings, footerCopyright: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid var(--sand-300)',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  {/* Save Button */}
                  <div className="col-12">
                    <button
                      onClick={handleSaveSettings}
                      disabled={settingsLoading}
                      className="btn"
                      style={{
                        padding: '1rem 2rem',
                        backgroundColor: 'var(--sand-600)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: '700',
                        fontSize: '1.1rem',
                        transition: 'all 0.3s',
                        boxShadow: '0 4px 12px rgba(179, 135, 63, 0.3)',
                        marginTop: '1rem'
                      }}
                      onMouseEnter={(e) => {
                        if (!settingsLoading) {
                          e.target.style.backgroundColor = 'var(--sand-700)';
                          e.target.style.transform = 'translateY(-2px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!settingsLoading) {
                          e.target.style.backgroundColor = 'var(--sand-600)';
                          e.target.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      {settingsLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faCheck} style={{ marginRight: '0.5rem' }} />
                          Save Settings
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
