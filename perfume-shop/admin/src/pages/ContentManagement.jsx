import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faImage, faStar, faEdit, faPlus, faSave, faTimes
} from '@fortawesome/free-solid-svg-icons';

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState('banners');
  const [editingBanner, setEditingBanner] = useState(null);
  const [editingReview, setEditingReview] = useState(null);

  // Hero Banners Data
  const [banners, setBanners] = useState([
    {
      id: 1,
      title: 'Vamana Signature Collection',
      subtitle: 'Innovating the Perfume Industry with Sustainable & Sensory-Driven Solutions',
      badge: 'Fragrance & Elegance Co',
      bottomText: 'Crafted by: Vamana',
      image: '/product1.jpg',
      type: 'circle'
    },
    {
      id: 2,
      title: 'Exquisite Fragrances',
      subtitle: 'Awaken Your Senses, Embrace Timeless Elegance',
      badge: 'Vamana Fragrances',
      bottomText: 'Crafted with Excellence • Since 2024',
      image: '/product2.jpg',
      type: 'arch'
    }
  ]);

  // Reviews Data
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Fashion Blogger',
      location: 'New York, USA',
      image: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      review: 'Absolutely love the Velvet Rose! The scent lasts all day and I receive compliments everywhere I go.',
      product: 'Velvet Rose',
      verified: true
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Business Executive',
      location: 'London, UK',
      image: 'https://i.pravatar.cc/150?img=12',
      rating: 5,
      review: 'The Mystic Oud is sophisticated and elegant. Perfect for business meetings and special occasions.',
      product: 'Mystic Oud',
      verified: true
    },
    {
      id: 3,
      name: 'Emma Williams',
      role: 'Makeup Artist',
      location: 'Paris, France',
      image: 'https://i.pravatar.cc/150?img=5',
      rating: 5,
      review: 'Ocean Breeze is my go-to summer fragrance. Fresh, light, and absolutely divine.',
      product: 'Ocean Breeze',
      verified: true
    },
    {
      id: 4,
      name: 'David Martinez',
      role: 'Photographer',
      location: 'Dubai, UAE',
      image: 'https://i.pravatar.cc/150?img=13',
      rating: 5,
      review: 'Exceptional quality and unique scents. The packaging is luxurious and makes for perfect gifts.',
      product: 'Golden Amber',
      verified: true
    }
  ]);

  // Handle Banner Edit
  const handleBannerEdit = (banner) => {
    setEditingBanner({ ...banner });
  };

  // Handle Banner Save
  const handleBannerSave = () => {
    setBanners(banners.map(b => b.id === editingBanner.id ? editingBanner : b));
    setEditingBanner(null);
    alert('Banner updated successfully!');
  };

  // Handle Review Edit
  const handleReviewEdit = (review) => {
    setEditingReview({ ...review });
  };

  // Handle Review Save
  const handleReviewSave = () => {
    setReviews(reviews.map(r => r.id === editingReview.id ? editingReview : r));
    setEditingReview(null);
    alert('Review updated successfully!');
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
            Hero Banners (2)
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
            Customer Reviews (4)
          </button>
        </div>
      </div>

      {/* Banners Tab */}
      {activeTab === 'banners' && (
        <div className="row g-4">
          {banners.map((banner) => (
            <div key={banner.id} className="col-12 col-lg-6">
              <div className="card border-0 shadow-sm" style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                overflow: 'hidden'
              }}>
                {/* Banner Preview */}
                <div style={{
                  height: '250px',
                  background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${banner.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <div className="text-center text-white p-3">
                    <div className="mb-2" style={{
                      fontSize: '0.8rem',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      display: 'inline-block'
                    }}>
                      {banner.badge}
                    </div>
                    <h3 style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '1.8rem',
                      fontWeight: '700',
                      marginBottom: '0.5rem'
                    }}>
                      {banner.title}
                    </h3>
                    <p style={{ fontSize: '0.9rem', marginBottom: '0' }}>
                      {banner.subtitle.substring(0, 50)}...
                    </p>
                  </div>
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: 'var(--sand-600)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: '600'
                  }}>
                    Banner {banner.id}
                  </div>
                </div>

                {/* Banner Info */}
                <div className="p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)', fontSize: '0.9rem' }}>
                      Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingBanner?.id === banner.id ? editingBanner.title : banner.title}
                      onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                      disabled={editingBanner?.id !== banner.id}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '10px',
                        border: '2px solid var(--sand-300)',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)', fontSize: '0.9rem' }}>
                      Subtitle
                    </label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={editingBanner?.id === banner.id ? editingBanner.subtitle : banner.subtitle}
                      onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                      disabled={editingBanner?.id !== banner.id}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '10px',
                        border: '2px solid var(--sand-300)',
                        fontSize: '0.95rem',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)', fontSize: '0.9rem' }}>
                      Badge Text
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingBanner?.id === banner.id ? editingBanner.badge : banner.badge}
                      onChange={(e) => setEditingBanner({ ...editingBanner, badge: e.target.value })}
                      disabled={editingBanner?.id !== banner.id}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '10px',
                        border: '2px solid var(--sand-300)',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)', fontSize: '0.9rem' }}>
                      Bottom Text
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingBanner?.id === banner.id ? editingBanner.bottomText : banner.bottomText}
                      onChange={(e) => setEditingBanner({ ...editingBanner, bottomText: e.target.value })}
                      disabled={editingBanner?.id !== banner.id}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '10px',
                        border: '2px solid var(--sand-300)',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)', fontSize: '0.9rem' }}>
                      Image URL
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingBanner?.id === banner.id ? editingBanner.image : banner.image}
                      onChange={(e) => setEditingBanner({ ...editingBanner, image: e.target.value })}
                      disabled={editingBanner?.id !== banner.id}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '10px',
                        border: '2px solid var(--sand-300)',
                        fontSize: '0.95rem'
                      }}
                    />
                    <small style={{ color: 'var(--sand-600)', fontSize: '0.85rem' }}>
                      Upload image or enter URL
                    </small>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex gap-2">
                    {editingBanner?.id === banner.id ? (
                      <>
                        <button
                          onClick={handleBannerSave}
                          style={{
                            flex: 1,
                            padding: '0.75rem',
                            borderRadius: '10px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                            color: 'white',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <FontAwesomeIcon icon={faSave} className="me-2" />
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditingBanner(null)}
                          style={{
                            flex: 1,
                            padding: '0.75rem',
                            borderRadius: '10px',
                            border: '2px solid var(--sand-300)',
                            background: 'white',
                            color: 'var(--sand-900)',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
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
                          padding: '0.75rem',
                          borderRadius: '10px',
                          border: 'none',
                          background: 'linear-gradient(135deg, var(--sand-600) 0%, var(--sand-700) 100%)',
                          color: 'white',
                          fontSize: '0.95rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 12px rgba(179, 135, 63, 0.3)'
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} className="me-2" />
                        Edit Banner
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
        <div className="row g-4">
          {reviews.map((review) => (
            <div key={review.id} className="col-12 col-md-6">
              <div className="card border-0 shadow-sm" style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                overflow: 'hidden'
              }}>
                {/* Review Header */}
                <div style={{
                  background: 'linear-gradient(135deg, var(--sand-200) 0%, var(--sand-300) 100%)',
                  padding: '1.5rem',
                  borderBottom: '2px solid var(--sand-400)'
                }}>
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={review.image}
                      alt={review.name}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '3px solid white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <div className="flex-grow-1">
                      <h5 style={{
                        color: 'var(--sand-900)',
                        fontSize: '1.2rem',
                        fontWeight: '700',
                        marginBottom: '0.25rem'
                      }}>
                        {review.name}
                      </h5>
                      <p style={{
                        color: 'var(--sand-700)',
                        fontSize: '0.9rem',
                        marginBottom: '0.25rem'
                      }}>
                        {review.role}
                      </p>
                      <p style={{
                        color: 'var(--sand-600)',
                        fontSize: '0.85rem',
                        marginBottom: '0'
                      }}>
                        📍 {review.location}
                      </p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mt-3">
                    <div>
                      {[...Array(5)].map((_, i) => (
                        <span key={i} style={{ 
                          color: i < review.rating ? '#FFD700' : '#ddd', 
                          fontSize: '1.2rem' 
                        }}>★</span>
                      ))}
                    </div>
                    {review.verified && (
                      <span style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        ✓ Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Review Form */}
                <div className="p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)', fontSize: '0.9rem' }}>
                      Customer Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingReview?.id === review.id ? editingReview.name : review.name}
                      onChange={(e) => setEditingReview({ ...editingReview, name: e.target.value })}
                      disabled={editingReview?.id !== review.id}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '10px',
                        border: '2px solid var(--sand-300)',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)', fontSize: '0.9rem' }}>
                        Role/Profession
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingReview?.id === review.id ? editingReview.role : review.role}
                        onChange={(e) => setEditingReview({ ...editingReview, role: e.target.value })}
                        disabled={editingReview?.id !== review.id}
                        style={{
                          padding: '0.75rem',
                          borderRadius: '10px',
                          border: '2px solid var(--sand-300)',
                          fontSize: '0.95rem'
                        }}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)', fontSize: '0.9rem' }}>
                        Location
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingReview?.id === review.id ? editingReview.location : review.location}
                        onChange={(e) => setEditingReview({ ...editingReview, location: e.target.value })}
                        disabled={editingReview?.id !== review.id}
                        style={{
                          padding: '0.75rem',
                          borderRadius: '10px',
                          border: '2px solid var(--sand-300)',
                          fontSize: '0.95rem'
                        }}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)', fontSize: '0.9rem' }}>
                      Product Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingReview?.id === review.id ? editingReview.product : review.product}
                      onChange={(e) => setEditingReview({ ...editingReview, product: e.target.value })}
                      disabled={editingReview?.id !== review.id}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '10px',
                        border: '2px solid var(--sand-300)',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)', fontSize: '0.9rem' }}>
                      Review Text
                    </label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={editingReview?.id === review.id ? editingReview.review : review.review}
                      onChange={(e) => setEditingReview({ ...editingReview, review: e.target.value })}
                      disabled={editingReview?.id !== review.id}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '10px',
                        border: '2px solid var(--sand-300)',
                        fontSize: '0.95rem',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-6">
                      <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)', fontSize: '0.9rem' }}>
                        Rating
                      </label>
                      <select
                        className="form-select"
                        value={editingReview?.id === review.id ? editingReview.rating : review.rating}
                        onChange={(e) => setEditingReview({ ...editingReview, rating: parseInt(e.target.value) })}
                        disabled={editingReview?.id !== review.id}
                        style={{
                          padding: '0.75rem',
                          borderRadius: '10px',
                          border: '2px solid var(--sand-300)',
                          fontSize: '0.95rem'
                        }}
                      >
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)', fontSize: '0.9rem' }}>
                        Profile Image URL
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingReview?.id === review.id ? editingReview.image : review.image}
                        onChange={(e) => setEditingReview({ ...editingReview, image: e.target.value })}
                        disabled={editingReview?.id !== review.id}
                        style={{
                          padding: '0.75rem',
                          borderRadius: '10px',
                          border: '2px solid var(--sand-300)',
                          fontSize: '0.95rem'
                        }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex gap-2">
                    {editingReview?.id === review.id ? (
                      <>
                        <button
                          onClick={handleReviewSave}
                          style={{
                            flex: 1,
                            padding: '0.75rem',
                            borderRadius: '10px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                            color: 'white',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <FontAwesomeIcon icon={faSave} className="me-2" />
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditingReview(null)}
                          style={{
                            flex: 1,
                            padding: '0.75rem',
                            borderRadius: '10px',
                            border: '2px solid var(--sand-300)',
                            background: 'white',
                            color: 'var(--sand-900)',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <FontAwesomeIcon icon={faTimes} className="me-2" />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleReviewEdit(review)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '10px',
                          border: 'none',
                          background: 'linear-gradient(135deg, var(--sand-600) 0%, var(--sand-700) 100%)',
                          color: 'white',
                          fontSize: '0.95rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 12px rgba(179, 135, 63, 0.3)'
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} className="me-2" />
                        Edit Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
