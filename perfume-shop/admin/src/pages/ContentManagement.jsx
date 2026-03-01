import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faImage, faStar, faEdit, faPlus, faSave, faTimes, faTrash, faEye
} from '@fortawesome/free-solid-svg-icons';
import { AddReviewModal, EditReviewModal, ViewReviewModal, DeleteReviewModal } from '../components/modals/ReviewModals';
import EditBannerModal from '../components/modals/EditBannerModal';
import { fetchReviews, addReview, updateReview, deleteReview } from '../APIS/apis/ReviewApi';
import { clearError, clearSuccess } from '../APIS/slice/ReviewSlice';
import { fetchBanners, updateBanner } from '../APIS/apis/BannerApi';
import { clearError as clearBannerError, clearSuccess as clearBannerSuccess } from '../APIS/slice/BannerSlice';
import { toast } from 'react-toastify';
import { api } from '../APIS/apis/Authapi'; // Import authenticated api instance

export default function ContentManagement() {
  const dispatch = useDispatch();
  const { reviews: reviewsFromRedux, loading, error, success } = useSelector(state => state.ReviewSlice);
  const { banners: bannersFromRedux, loading: bannerLoading, error: bannerError, success: bannerSuccess } = useSelector(state => state.BannerSlice);
  
  const [activeTab, setActiveTab] = useState('banners');
  const [editingBanner, setEditingBanner] = useState(null);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [showEditReviewModal, setShowEditReviewModal] = useState(false);
  const [showViewReviewModal, setShowViewReviewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [products, setProducts] = useState([]);

  // Fetch products, reviews, and banners on component mount
  useEffect(() => {
    fetchProducts();
    dispatch(fetchReviews());
    dispatch(fetchBanners());
  }, [dispatch]);

  // Handle success/error messages with toast for reviews
  useEffect(() => {
    if (success) {
      toast.success('✅ Review operation completed successfully!');
      dispatch(clearSuccess());
    }
    if (error) {
      toast.error(`⚠️ Error: ${error}`);
      dispatch(clearError());
    }
  }, [success, error, dispatch]);

  // Handle success/error messages with toast for banners
  useEffect(() => {
    if (bannerSuccess) {
      toast.success('✅ Banner updated successfully!');
      dispatch(clearBannerSuccess());
    }
    if (bannerError) {
      toast.error(`⚠️ Error: ${bannerError}`);
      dispatch(clearBannerError());
    }
  }, [bannerSuccess, bannerError, dispatch]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('GetProducts');
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      if (error.response?.data?.message) {
        toast.error(`⚠️ Error: ${error.response.data.message}`);
      }
    }
  };

  // Use banners from Redux
  const banners = bannersFromRedux;

  // Reviews Data - Use from Redux
  const reviews = reviewsFromRedux;

  // Handle Banner Edit
  const handleBannerEdit = (banner) => {
    setEditingBanner({ ...banner });
  };

  // Handle Banner Save
  const handleBannerSave = async (formData) => {
    const bannerId = formData.get('id');
    
    dispatch(updateBanner({ id: bannerId, formData }))
      .unwrap()
      .then(() => {
        setEditingBanner(null);
        dispatch(fetchBanners()); // Refresh banners
      })
      .catch((err) => console.error('Update failed:', err));
  };

  // Handle Review Edit
  const handleReviewEdit = (review) => {
    setSelectedReview(review);
    setShowEditReviewModal(true);
  };

  // Handle Review Save (Edit)
  const handleReviewSave = (formData) => {
    dispatch(updateReview({ id: selectedReview._id, formData }))
      .unwrap()
      .then(() => {
        setShowEditReviewModal(false);
        setSelectedReview(null);
      })
      .catch((err) => console.error('Update failed:', err));
  };

  // Handle Review Delete
  const handleReviewDelete = (review) => {
    setSelectedReview(review);
    setShowDeleteModal(true);
  };

  // Confirm Delete
  const confirmDelete = () => {
    dispatch(deleteReview(selectedReview._id))
      .unwrap()
      .then(() => {
        setShowDeleteModal(false);
        setSelectedReview(null);
      })
      .catch((err) => console.error('Delete failed:', err));
  };

  // Handle Add Review
  const handleAddReview = () => {
    setShowAddReviewModal(true);
  };

  // Handle Save New Review
  const handleSaveNewReview = (formData) => {
    dispatch(addReview(formData))
      .unwrap()
      .then(() => {
        setShowAddReviewModal(false);
      })
      .catch((err) => console.error('Add failed:', err));
  };

  // Handle View Review
  const handleViewReview = (review) => {
    setSelectedReview(review);
    setShowViewReviewModal(true);
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
          Content Management
        </h2>
        <p className="mb-0" style={{ 
          color: 'var(--sand-700)', 
          fontSize: 'clamp(0.9rem, 2vw, 1rem)',
          fontWeight: '500'
        }}>
          Manage hero banners and customer reviews for member site
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-4">
        <div className="d-flex gap-2 flex-wrap align-items-center justify-content-between">
          <div className="d-flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('banners')}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'banners' 
                  ? 'linear-gradient(135deg, var(--sand-600) 0%, var(--sand-700) 100%)'
                  : 'var(--sand-200)',
                color: activeTab === 'banners' ? 'white' : 'var(--sand-900)',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: activeTab === 'banners' ? '0 4px 12px rgba(179, 135, 63, 0.3)' : 'none'
              }}
            >
              <FontAwesomeIcon icon={faImage} className="me-2" />
              Hero Banners ({banners.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'reviews' 
                  ? 'linear-gradient(135deg, var(--sand-600) 0%, var(--sand-700) 100%)'
                  : 'var(--sand-200)',
                color: activeTab === 'reviews' ? 'white' : 'var(--sand-900)',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: activeTab === 'reviews' ? '0 4px 12px rgba(179, 135, 63, 0.3)' : 'none'
              }}
            >
              <FontAwesomeIcon icon={faStar} className="me-2" />
              Customer Reviews ({reviews.length})
            </button>
          </div>

          {/* Add New Button - Only for Reviews */}
          {activeTab === 'reviews' && (
            <button
              onClick={handleAddReview}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Add New Review
            </button>
          )}
        </div>
      </div>

      {/* Banners Tab */}
      {activeTab === 'banners' && (
        <div className="row g-4">
          {banners.map((banner) => (
            <div key={banner._id} className="col-md-6">
              <div className="card border-0 shadow-sm h-100" style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}>
                {/* Card Header */}
                <div style={{
                  background: 'linear-gradient(135deg, var(--sand-200) 0%, var(--sand-300) 100%)',
                  padding: '1.5rem',
                  borderBottom: '3px solid var(--sand-400)'
                }}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h4 style={{
                      color: 'var(--sand-900)',
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      marginBottom: '0',
                      fontFamily: "'Playfair Display', serif"
                    }}>
                      {banner.type === 'circle' ? '🔵 Banner 1' : '🏛️ Banner 2'}
                    </h4>
                    <span style={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      padding: '0.375rem 0.875rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '700'
                    }}>
                      ✓ Active
                    </span>
                  </div>
                  <p style={{
                    color: 'var(--sand-700)',
                    fontSize: '0.875rem',
                    marginBottom: '0'
                  }}>
                    {banner.type === 'circle' ? 'Circle Design' : 'Arch Design'}
                  </p>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <div className="mb-3">
                    <div className="d-flex align-items-start gap-2 mb-2">
                      <span style={{ fontSize: '1.25rem' }}>📌</span>
                      <div style={{ flex: 1 }}>
                        <small className="text-muted d-block mb-1">Top Badge</small>
                        <p className="mb-0" style={{ fontWeight: '500', color: 'var(--sand-900)' }}>
                          {banner.topBadge}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex align-items-start gap-2 mb-2">
                      <span style={{ fontSize: '1.25rem' }}>✨</span>
                      <div style={{ flex: 1 }}>
                        <small className="text-muted d-block mb-1">Main Title</small>
                        <p className="mb-0" style={{ fontWeight: '600', color: 'var(--sand-900)', fontSize: '1.05rem' }}>
                          {banner.title}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex align-items-start gap-2 mb-2">
                      <span style={{ fontSize: '1.25rem' }}>📝</span>
                      <div style={{ flex: 1 }}>
                        <small className="text-muted d-block mb-1">Subtitle</small>
                        <p className="mb-0" style={{ color: 'var(--sand-700)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                          {banner.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>

                  {banner.type === 'circle' && banner.bottomBadge && (
                    <div className="mb-3">
                      <div className="d-flex align-items-start gap-2 mb-2">
                        <span style={{ fontSize: '1.25rem' }}>🏷️</span>
                        <div style={{ flex: 1 }}>
                          <small className="text-muted d-block mb-1">Bottom Badge</small>
                          <p className="mb-0" style={{ fontWeight: '500', color: 'var(--sand-900)' }}>
                            {banner.bottomBadge}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {banner.type === 'arch' && banner.bottomText && (
                    <div className="mb-3">
                      <div className="d-flex align-items-start gap-2 mb-2">
                        <span style={{ fontSize: '1.25rem' }}>📄</span>
                        <div style={{ flex: 1 }}>
                          <small className="text-muted d-block mb-1">Bottom Text</small>
                          <p className="mb-0" style={{ fontWeight: '500', color: 'var(--sand-900)' }}>
                            {banner.bottomText}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mb-3">
                    <div className="d-flex align-items-start gap-2 mb-2">
                      <span style={{ fontSize: '1.25rem' }}>🌐</span>
                      <div style={{ flex: 1 }}>
                        <small className="text-muted d-block mb-1">Website URL</small>
                        <p className="mb-0" style={{ fontWeight: '500', color: 'var(--sand-600)' }}>
                          {banner.websiteUrl}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Edit Button */}
                  <button
                    onClick={() => handleBannerEdit(banner)}
                    className="btn w-100 mt-3"
                    style={{
                      background: 'linear-gradient(135deg, var(--sand-600) 0%, var(--sand-700) 100%)',
                      color: 'white',
                      fontWeight: '600',
                      padding: '0.75rem',
                      borderRadius: '10px',
                      border: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    <FontAwesomeIcon icon={faEdit} className="me-2" />
                    Edit Banner
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <>
          {/* Reviews Table */}
          <div className="card border-0 shadow-sm" style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            overflow: 'hidden'
          }}>
            {/* Table Header */}
            <div style={{
              background: 'linear-gradient(135deg, var(--sand-200) 0%, var(--sand-300) 100%)',
              padding: '1.5rem',
              borderBottom: '3px solid var(--sand-400)'
            }}>
              <h4 style={{
                color: 'var(--sand-900)',
                fontSize: '1.3rem',
                fontWeight: '700',
                marginBottom: '0',
                fontFamily: "'Playfair Display', serif"
              }}>
                ⭐ Customer Reviews ({reviews.length})
              </h4>
            </div>

            {/* Table Content */}
            <div className="table-responsive">
              <table className="table table-hover mb-0" style={{ fontSize: '0.95rem' }}>
                <thead style={{ backgroundColor: 'var(--sand-100)', borderBottom: '2px solid var(--sand-300)' }}>
                  <tr>
                    <th style={{ padding: '1rem', fontWeight: '700', color: 'var(--sand-900)' }}>Customer</th>
                    <th style={{ padding: '1rem', fontWeight: '700', color: 'var(--sand-900)' }}>Product</th>
                    <th style={{ padding: '1rem', fontWeight: '700', color: 'var(--sand-900)' }}>Rating</th>
                    <th style={{ padding: '1rem', fontWeight: '700', color: 'var(--sand-900)' }}>Review</th>
                    <th style={{ padding: '1rem', fontWeight: '700', color: 'var(--sand-900)', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review._id} style={{ borderBottom: '1px solid var(--sand-200)' }}>
                      {/* Customer Info */}
                      <td style={{ padding: '1rem' }}>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={review.image}
                            alt={review.name}
                            style={{
                              width: '50px',
                              height: '50px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '2px solid var(--sand-300)'
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: '700', color: 'var(--sand-900)', marginBottom: '0.25rem' }}>
                              {review.name}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--sand-600)' }}>
                              {review.role}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--sand-500)' }}>
                              📍 {review.location}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Product */}
                      <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                        <div style={{ fontWeight: '600', color: 'var(--sand-900)' }}>
                          {review.product}
                        </div>
                        {review.verified && (
                          <span style={{
                            backgroundColor: '#10b981',
                            color: 'white',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '12px',
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            display: 'inline-block',
                            marginTop: '0.25rem'
                          }}>
                            ✓ Verified
                          </span>
                        )}
                      </td>

                      {/* Rating */}
                      <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                        <div>
                          {[...Array(5)].map((_, i) => (
                            <span key={i} style={{ 
                              color: i < review.rating ? '#FFD700' : '#ddd', 
                              fontSize: '1.1rem',
                              marginRight: '2px'
                            }}>★</span>
                          ))}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--sand-600)', marginTop: '0.25rem' }}>
                          {review.rating}/5
                        </div>
                      </td>

                      {/* Review Text */}
                      <td style={{ padding: '1rem', verticalAlign: 'middle', maxWidth: '300px' }}>
                        <div style={{ 
                          color: 'var(--sand-700)', 
                          fontSize: '0.9rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {review.review}
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                        <div className="d-flex gap-2 justify-content-center flex-wrap">
                          <button
                            onClick={() => handleViewReview(review)}
                            style={{
                              padding: '0.6rem 0.9rem',
                              borderRadius: '8px',
                              border: 'none',
                              backgroundColor: '#3b82f6',
                              color: 'white',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              minWidth: '38px'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = '#2563eb';
                              e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = '#3b82f6';
                              e.target.style.transform = 'translateY(0)';
                            }}
                            title="View Details"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                          <button
                            onClick={() => handleReviewEdit(review)}
                            style={{
                              padding: '0.6rem 0.9rem',
                              borderRadius: '8px',
                              border: 'none',
                              backgroundColor: 'var(--sand-600)',
                              color: 'white',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              minWidth: '38px'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = 'var(--sand-700)';
                              e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = 'var(--sand-600)';
                              e.target.style.transform = 'translateY(0)';
                            }}
                            title="Edit Review"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            onClick={() => handleReviewDelete(review)}
                            style={{
                              padding: '0.6rem 0.9rem',
                              borderRadius: '8px',
                              border: 'none',
                              backgroundColor: '#ef4444',
                              color: 'white',
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              minWidth: '38px'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = '#dc2626';
                              e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = '#ef4444';
                              e.target.style.transform = 'translateY(0)';
                            }}
                            title="Delete Review"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {reviews.length === 0 && (
              <div className="text-center py-5">
                <FontAwesomeIcon icon={faStar} style={{ fontSize: '4rem', color: 'var(--sand-400)', marginBottom: '1rem' }} />
                <h4 style={{ color: 'var(--sand-700)', marginBottom: '0.5rem' }}>No Reviews Yet</h4>
                <p style={{ color: 'var(--sand-600)' }}>Add your first customer review to get started</p>
              </div>
            )}
          </div>
        </>
      )}


      {/* Modals */}
      <EditBannerModal
        isOpen={editingBanner !== null}
        onClose={() => setEditingBanner(null)}
        banner={editingBanner}
        onSave={handleBannerSave}
      />

      <AddReviewModal
        show={showAddReviewModal}
        onClose={() => setShowAddReviewModal(false)}
        onSave={handleSaveNewReview}
        products={products}
      />

      <EditReviewModal
        show={showEditReviewModal}
        onClose={() => setShowEditReviewModal(false)}
        review={selectedReview}
        onSave={handleReviewSave}
        products={products}
      />

      <ViewReviewModal
        show={showViewReviewModal}
        onClose={() => setShowViewReviewModal(false)}
        review={selectedReview}
      />

      <DeleteReviewModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        review={selectedReview}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
