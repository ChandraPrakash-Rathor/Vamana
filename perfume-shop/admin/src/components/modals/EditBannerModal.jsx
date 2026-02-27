import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, faImage, faSave
} from '@fortawesome/free-solid-svg-icons';
import SprayLoader from '../common/SprayLoader';

export default function EditBannerModal({ isOpen, onClose, banner, onSave }) {
  const [bannerImage, setBannerImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm();

  // Prefill form when banner changes
  useEffect(() => {
    if (banner && isOpen) {
      setValue('topBadge', banner.topBadge);
      setValue('title', banner.title);
      setValue('subtitle', banner.subtitle);
      setValue('websiteUrl', banner.websiteUrl);
      
      if (banner.type === 'circle') {
        setValue('bottomBadge', banner.bottomBadge);
      } else {
        setValue('bottomText', banner.bottomText);
      }

      // Set image preview if exists
      if (banner.image) {
        setImagePreview(banner.image);
      }
    }
  }, [banner, isOpen, setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('id', banner._id);
      formData.append('type', banner.type);
      formData.append('topBadge', data.topBadge);
      formData.append('title', data.title);
      formData.append('subtitle', data.subtitle);
      formData.append('websiteUrl', data.websiteUrl);
      
      if (banner.type === 'circle') {
        formData.append('bottomBadge', data.bottomBadge);
      } else {
        formData.append('bottomText', data.bottomText);
      }

      if (bannerImage) {
        formData.append('bannerImage', bannerImage);
      }

      await onSave(formData);
      handleClose();
    } catch (error) {
      console.error('Error updating banner:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setBannerImage(null);
    setImagePreview(null);
    onClose();
  };

  if (!isOpen || !banner) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
          backdropFilter: 'blur(4px)'
        }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '700px',
        maxHeight: '90vh',
        overflow: 'hidden',
        zIndex: 9999,
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <style>{`
          .modal-body-scroll::-webkit-scrollbar {
            width: 8px;
          }
          .modal-body-scroll::-webkit-scrollbar-track {
            background: #f3f4f6;
            border-radius: 4px;
          }
          .modal-body-scroll::-webkit-scrollbar-thumb {
            background: #9ca3af;
            border-radius: 4px;
          }
          .modal-body-scroll::-webkit-scrollbar-thumb:hover {
            background: #6b7280;
          }
        `}</style>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Modal Header */}
          <div style={{
            padding: '1.5rem 2rem',
            borderBottom: '1px solid #e9ecef',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0
          }}>
            <div>
              <h3 style={{
                margin: 0,
                color: '#212529',
                fontSize: '1.25rem',
                fontWeight: '600'
              }}>
                <FontAwesomeIcon icon={faImage} className="me-2" style={{ color: 'var(--sand-600)' }} />
                Edit Banner {banner.type === 'circle' ? '1' : '2'}
              </h3>
              <p style={{ margin: '0.25rem 0 0 0', color: '#6c757d', fontSize: '0.875rem' }}>
                {banner.type === 'circle' ? 'Circle Design Banner' : 'Arch Design Banner'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                color: '#6c757d',
                cursor: 'pointer',
                padding: '0.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                transition: 'color 0.2s'
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Modal Body */}
          <div style={{
            padding: '1.5rem 2rem',
            overflowY: 'auto',
            flex: '1 1 auto',
            minHeight: 0,
            maxHeight: 'calc(90vh - 180px)'
          }} className="modal-body-scroll">
            <div className="row g-3">
              {/* Banner Image */}
              <div className="col-12">
                <label className="form-label" style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#495057' 
                }}>
                  Banner Image
                </label>
                <div style={{
                  border: '2px dashed var(--sand-300)',
                  borderRadius: '10px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  backgroundColor: 'var(--sand-50)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--sand-600)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--sand-300)'}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    id="bannerImageInput"
                  />
                  <label htmlFor="bannerImageInput" style={{ cursor: 'pointer', width: '100%' }}>
                    {imagePreview ? (
                      <div>
                        <img 
                          src={imagePreview} 
                          alt="Banner preview" 
                          style={{
                            maxWidth: '100%',
                            maxHeight: '200px',
                            borderRadius: '8px',
                            marginBottom: '1rem'
                          }}
                        />
                        <p style={{ color: 'var(--sand-600)', fontSize: '0.875rem', margin: 0 }}>
                          Click to change image
                        </p>
                      </div>
                    ) : (
                      <div>
                        <FontAwesomeIcon icon={faImage} style={{ fontSize: '3rem', color: 'var(--sand-400)', marginBottom: '1rem' }} />
                        <p style={{ color: 'var(--sand-600)', fontSize: '0.875rem', margin: 0 }}>
                          Click to upload banner image
                        </p>
                      </div>
                    )}
                  </label>
                </div>
                <small style={{ color: '#6c757d', fontSize: '0.75rem' }}>
                  Recommended: PNG format, 1920x1080px
                </small>
              </div>

              {/* Top Badge */}
              <div className="col-12">
                <label className="form-label" style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#495057' 
                }}>
                  📌 Top Badge Text <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., Fragrance & Elegance Co"
                  {...register('topBadge', { 
                    required: 'Top badge is required'
                  })}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    border: `1px solid ${errors.topBadge ? '#dc3545' : '#dee2e6'}`,
                    fontSize: '0.875rem'
                  }}
                />
                {errors.topBadge && (
                  <small style={{ color: '#dc3545', fontSize: '0.75rem' }}>
                    {errors.topBadge.message}
                  </small>
                )}
              </div>

              {/* Title */}
              <div className="col-12">
                <label className="form-label" style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#495057' 
                }}>
                  ✨ Main Title <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., Vamana Signature Collection"
                  {...register('title', { 
                    required: 'Title is required'
                  })}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    border: `1px solid ${errors.title ? '#dc3545' : '#dee2e6'}`,
                    fontSize: '0.875rem'
                  }}
                />
                {errors.title && (
                  <small style={{ color: '#dc3545', fontSize: '0.75rem' }}>
                    {errors.title.message}
                  </small>
                )}
              </div>

              {/* Subtitle */}
              <div className="col-12">
                <label className="form-label" style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#495057' 
                }}>
                  📝 Subtitle / Description <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Enter banner description..."
                  {...register('subtitle', { 
                    required: 'Subtitle is required'
                  })}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    border: `1px solid ${errors.subtitle ? '#dc3545' : '#dee2e6'}`,
                    fontSize: '0.875rem',
                    resize: 'vertical'
                  }}
                />
                {errors.subtitle && (
                  <small style={{ color: '#dc3545', fontSize: '0.75rem' }}>
                    {errors.subtitle.message}
                  </small>
                )}
              </div>

              {/* Bottom Badge (Circle) or Bottom Text (Arch) */}
              {banner.type === 'circle' && (
                <div className="col-12">
                  <label className="form-label" style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: '#495057' 
                  }}>
                    🏷️ Bottom Badge Text
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Crafted by: Vamana"
                    {...register('bottomBadge')}
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #dee2e6',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
              )}

              {banner.type === 'arch' && (
                <div className="col-12">
                  <label className="form-label" style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: '#495057' 
                  }}>
                    📄 Bottom Text
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., Crafted with Excellence • Since 2024"
                    {...register('bottomText')}
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #dee2e6',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
              )}

              {/* Website URL */}
              <div className="col-12">
                <label className="form-label" style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#495057' 
                }}>
                  🌐 Website URL <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., www.vamana.com"
                  {...register('websiteUrl', { 
                    required: 'Website URL is required'
                  })}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    border: `1px solid ${errors.websiteUrl ? '#dc3545' : '#dee2e6'}`,
                    fontSize: '0.875rem'
                  }}
                />
                {errors.websiteUrl && (
                  <small style={{ color: '#dc3545', fontSize: '0.75rem' }}>
                    {errors.websiteUrl.message}
                  </small>
                )}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div style={{
            padding: '1rem 2rem',
            borderTop: '1px solid #e9ecef',
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'flex-end',
            flexShrink: 0,
            position: 'sticky',
            bottom: 0,
            backgroundColor: 'white',
            zIndex: 10
          }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '8px',
                border: '1px solid #dee2e6',
                backgroundColor: 'white',
                color: '#495057',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isSubmitting ? '#6c757d' : 'var(--sand-600)',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {isSubmitting ? (
                <>
                  <SprayLoader />
                  Saving...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
