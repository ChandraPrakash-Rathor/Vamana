import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faImage, faStar, faEdit, faPlus, faSave, faTimes, faTrash, faEye
} from '@fortawesome/free-solid-svg-icons';
import { AddReviewModal, EditReviewModal, ViewReviewModal, DeleteReviewModal } from '../components/modals/ReviewModals';
import { fetchReviews, addReview, updateReview, deleteReview } from '../APIS/apis/ReviewApi';
import { clearError, clearSuccess } from '../APIS/slice/ReviewSlice';
import axios from 'axios';

export default function ContentManagement() {
  const dispatch = useDispatch();
  const { reviews: reviewsFromRedux, loading, error, success } = useSelector(state => state.ReviewSlice);
  
  const [activeTab, setActiveTab] = useState('banners');
  const [editingBanner, setEditingBanner] = useState(null);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [showEditReviewModal, setShowEditReviewModal] = useState(false);
  const [showViewReviewModal, setShowViewReviewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [products, setProducts] = useState([]);

  // Fetch products and reviews on component mount
  useEffect(() => {
    fetchProducts();
    dispatch(fetchReviews());
  }, [dispatch]);

  // Handle success/error messages
  useEffect(() => {
    if (success) {
      alert('✅ Operation completed successfully!');
      dispatch(clearSuccess());
    }
    if (error) {
      alert(`⚠️ Error: ${error}`);
      dispatch(clearError());
    }
  }, [success, error, dispatch]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/GetProducts');
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Hero Banners Data - Matching HeroSlider.jsx structure
  const [banners, setBanners] = useState([
    {
      id: 1,
      type: 'circle',
      topBadge: 'Fragrance & Elegance Co',
      title: 'Vamana Signature Collection',
      subtitle: 'Innovating the Perfume Industry with Sustainable & Sensory-Driven Solutions',
      bottomBadge: 'Crafted by: Vamana',
      websiteUrl: 'www.vamana.com'
    },
    {
      id: 2,
      type: 'arch',
      topBadge: 'Vamana Fragrances',
      title: 'Exquisite Fragrances',
      subtitle: 'Awaken Your Senses, Embrace Timeless Elegance',
      websiteUrl: 'www.vamana.com',
      bottomText: 'Crafted with Excellence • Since 2024'
    }
  ]);

  // Reviews Data - Use from Redux
  const reviews = reviewsFromRedux;

  // Handle Banner Edit
  const handleBannerEdit = (banner) => {
    setEditingBanner({ ...banner });
  };

  // Handle Banner Save
  const handleBannerSave = () => {
    setBanners(banners.map(b => b.id === editingBanner.id ? editingBanner : b));
    setEditingBanner(null);
    alert('✅ Banner updated successfully! Changes will reflect on the home page.');
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
            <div key={banner.id} className="col-12">
              <div className="card border-0 shadow-sm" style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                overflow: 'hidden'
              }}>
                {/* Banner Header */}
                <div style={{
                  background: 'linear-gradient(135deg, var(--sand-200) 0%, var(--sand-300) 100%)',
                  padding: '1.5rem',
                  borderBottom: '3px solid var(--sand-400)'
                }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h4 style={{
                        color: 'var(--sand-900)',
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        marginBottom: '0.5rem',
                        fontFamily: "'Playfair Display', serif"
                      }}>
                        {banner.type === 'circle' ? '🔵 Banner 1 - Circle Design' : '🏛️ Banner 2 - Arch Design'}
                      </h4>
                      <p style={{
                        color: 'var(--sand-700)',
                        fontSize: '0.95rem',
                        marginBottom: '0'
                      }}>
                        {banner.type === 'circle' 
                          ? 'First slide with circular product display' 
                          : 'Second slide with arch-shaped product display'}
                      </p>
                    </div>
                    <div style={{
                      backgroundColor: editingBanner?.id === banner.id ? '#f59e0b' : '#10b981',
                      color: 'white',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }}>
                      {editingBanner?.id === banner.id ? '✏️ Editing' : '✓ Active'}
                    </div>
                  </div>
                </div>

                {/* Banner Form */}
                <div className="p-4">
                  <div className="row g-4">
                    {/* Left Column */}
                    <div className="col-md-6">
                      <div className="mb-4">
                        <label className="form-label fw-bold" style={{ 
                          color: 'var(--sand-900)', 
                          fontSize: '1rem',
                          marginBottom: '0.75rem'
                        }}>
                          📌 Top Badge Text
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingBanner?.id === banner.id ? editingBanner.topBadge : banner.topBadge}
                          onChange={(e) => setEditingBanner({ ...editingBanner, topBadge: e.target.value })}
                          disabled={editingBanner?.id !== banner.id}
                          placeholder="e.g., Fragrance & Elegance Co"
                          style={{
                            padding: '0.85rem',
                            borderRadius: '10px',
                            border: '2px solid var(--sand-300)',
                            fontSize: '1rem',
                            backgroundColor: editingBanner?.id === banner.id ? 'white' : 'var(--sand-100)'
                          }}
                        />
                        <small style={{ color: 'var(--sand-600)', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                          Small badge text shown at the top
                        </small>
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-bold" style={{ 
                          color: 'var(--sand-900)', 
                          fontSize: '1rem',
                          marginBottom: '0.75rem'
                        }}>
                          ✨ Main Title
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingBanner?.id === banner.id ? editingBanner.title : banner.title}
                          onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                          disabled={editingBanner?.id !== banner.id}
                          placeholder="e.g., Vamana Signature Collection"
                          style={{
                            padding: '0.85rem',
                            borderRadius: '10px',
                            border: '2px solid var(--sand-300)',
                            fontSize: '1rem',
                            fontWeight: '600',
                            backgroundColor: editingBanner?.id === banner.id ? 'white' : 'var(--sand-100)'
                          }}
                        />
                        <small style={{ color: 'var(--sand-600)', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                          Large heading text (supports line breaks with \n)
                        </small>
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-bold" style={{ 
                          color: 'var(--sand-900)', 
                          fontSize: '1rem',
                          marginBottom: '0.75rem'
                        }}>
                          📝 Subtitle / Description
                        </label>
                        <textarea
                          className="form-control"
                          rows="3"
                          value={editingBanner?.id === banner.id ? editingBanner.subtitle : banner.subtitle}
                          onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                          disabled={editingBanner?.id !== banner.id}
                          placeholder="Enter banner description..."
                          style={{
                            padding: '0.85rem',
                            borderRadius: '10px',
                            border: '2px solid var(--sand-300)',
                            fontSize: '0.95rem',
                            resize: 'vertical',
                            backgroundColor: editingBanner?.id === banner.id ? 'white' : 'var(--sand-100)'
                          }}
                        />
                        <small style={{ color: 'var(--sand-600)', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                          Descriptive text shown below the title
                        </small>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="col-md-6">
                      {banner.type === 'circle' && (
                        <div className="mb-4">
                          <label className="form-label fw-bold" style={{ 
                            color: 'var(--sand-900)', 
                            fontSize: '1rem',
                            marginBottom: '0.75rem'
                          }}>
                            🏷️ Bottom Badge Text
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={editingBanner?.id === banner.id ? editingBanner.bottomBadge : banner.bottomBadge}
                            onChange={(e) => setEditingBanner({ ...editingBanner, bottomBadge: e.target.value })}
                            disabled={editingBanner?.id !== banner.id}
                            placeholder="e.g., Crafted by: Vamana"
                            style={{
                              padding: '0.85rem',
                              borderRadius: '10px',
                              border: '2px solid var(--sand-300)',
                              fontSize: '1rem',
                              backgroundColor: editingBanner?.id === banner.id ? 'white' : 'var(--sand-100)'
                            }}
                          />
                          <small style={{ color: 'var(--sand-600)', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                            Badge text shown at the bottom (Circle design only)
                          </small>
                        </div>
                      )}

                      {banner.type === 'arch' && (
                        <div className="mb-4">
                          <label className="form-label fw-bold" style={{ 
                            color: 'var(--sand-900)', 
                            fontSize: '1rem',
                            marginBottom: '0.75rem'
                          }}>
                            📄 Bottom Text
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            value={editingBanner?.id === banner.id ? editingBanner.bottomText : banner.bottomText}
                            onChange={(e) => setEditingBanner({ ...editingBanner, bottomText: e.target.value })}
                            disabled={editingBanner?.id !== banner.id}
                            placeholder="e.g., Crafted with Excellence • Since 2024"
                            style={{
                              padding: '0.85rem',
                              borderRadius: '10px',
                              border: '2px solid var(--sand-300)',
                              fontSize: '1rem',
                              backgroundColor: editingBanner?.id === banner.id ? 'white' : 'var(--sand-100)'
                            }}
                          />
                          <small style={{ color: 'var(--sand-600)', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                            Additional info text (Arch design only)
                          </small>
                        </div>
                      )}

                      <div className="mb-4">
                        <label className="form-label fw-bold" style={{ 
                          color: 'var(--sand-900)', 
                          fontSize: '1rem',
                          marginBottom: '0.75rem'
                        }}>
                          🌐 Website URL
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingBanner?.id === banner.id ? editingBanner.websiteUrl : banner.websiteUrl}
                          onChange={(e) => setEditingBanner({ ...editingBanner, websiteUrl: e.target.value })}
                          disabled={editingBanner?.id !== banner.id}
                          placeholder="e.g., www.vamana.com"
                          style={{
                            padding: '0.85rem',
                            borderRadius: '10px',
                            border: '2px solid var(--sand-300)',
                            fontSize: '1rem',
                            backgroundColor: editingBanner?.id === banner.id ? 'white' : 'var(--sand-100)'
                          }}
                        />
                        <small style={{ color: 'var(--sand-600)', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                          Website URL displayed on the banner
                        </small>
                      </div>

                      {/* Info Box */}
                      <div style={{
                        backgroundColor: 'var(--sand-100)',
                        border: '2px solid var(--sand-400)',
                        borderRadius: '10px',
                        padding: '1rem',
                        marginTop: '1.5rem'
                      }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--sand-800)' }}>
                          <strong>ℹ️ Note:</strong> Images (PNG files) cannot be changed from here. 
                          Only text content is editable. Contact developer to update images.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex gap-3 mt-4 pt-3 border-top">
                    {editingBanner?.id === banner.id ? (
                      <>
                        <button
                          onClick={handleBannerSave}
                          style={{
                            flex: 1,
                            padding: '1rem',
                            borderRadius: '10px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                          }}
                          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                          <FontAwesomeIcon icon={faSave} className="me-2" />
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditingBanner(null)}
                          style={{
                            flex: 1,
                            padding: '1rem',
                            borderRadius: '10px',
                            border: '2px solid var(--sand-400)',
                            background: 'white',
                            color: 'var(--sand-900)',
                            fontSize: '1rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--sand-100)'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                        >
                          <FontAwesomeIcon icon={faTimes} className="me-2" />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleBannerEdit(banner)}
                        style={{
                          width: '100%',
                          padding: '1rem',
                          borderRadius: '10px',
                          border: 'none',
                          background: 'linear-gradient(135deg, var(--sand-600) 0%, var(--sand-700) 100%)',
                          color: 'white',
                          fontSize: '1rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 12px rgba(179, 135, 63, 0.3)'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                      >
                        <FontAwesomeIcon icon={faEdit} className="me-2" />
                        Edit Banner Content
                      </button>
                    )}
                  </div>
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
