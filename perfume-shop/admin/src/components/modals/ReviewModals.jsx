import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faEye, faSave, faTimes, faTrash, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import { useState, useEffect } from 'react';

// Shared Modal Wrapper Style
const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.75)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '1rem',
    animation: 'fadeIn 0.2s ease'
  },
  container: {
    backgroundColor: 'white',
    borderRadius: '12px',
    maxWidth: '900px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    animation: 'slideUp 0.2s ease',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb',
    padding: '1.5rem 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0
  },
  body: {
    padding: '1.5rem 2rem',
    overflowY: 'auto',
    flex: '1 1 auto',
    minHeight: 0
  },
  footer: {
    padding: '1rem 2rem',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end',
    flexShrink: 0,
    position: 'sticky',
    bottom: 0,
    zIndex: 10
  }
};

// Add Review Modal
export function AddReviewModal({ show, onClose, onSave, products = [] }) {
  const { register, handleSubmit, control, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      name: '',
      role: '',
      location: '',
      rating: 5,
      review: '',
      product: '',
      verified: true,
      image: ''
    }
  });

  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);

  if (!show) return null;

  // Convert products to react-select options
  const productOptions = products.map(product => ({
    value: product.name,
    label: product.name,
    category: product.category
  }));

  // Rating options
  const ratingOptions = [
    { value: 5, label: '⭐⭐⭐⭐⭐ (5 Stars)' },
    { value: 4, label: '⭐⭐⭐⭐ (4 Stars)' },
    { value: 3, label: '⭐⭐⭐ (3 Stars)' },
    { value: 2, label: '⭐⭐ (2 Stars)' },
    { value: 1, label: '⭐ (1 Star)' }
  ];

  // Verified options
  const verifiedOptions = [
    { value: true, label: '✓ Verified' },
    { value: false, label: 'Not Verified' }
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('role', data.role);
    formData.append('location', data.location);
    formData.append('rating', data.rating);
    formData.append('review', data.review);
    formData.append('product', data.product);
    formData.append('verified', data.verified);
    
    if (imageFile) {
      formData.append('image', imageFile);
    } else if (data.image) {
      formData.append('image', data.image);
    }

    onSave(formData);
  };

  // Custom styles for react-select
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      padding: '0.125rem 0.375rem',
      borderRadius: '6px',
      border: state.isFocused ? '1px solid #3b82f6' : '1px solid #d1d5db',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(59,130,246,0.1)' : 'none',
      fontSize: '0.875rem',
      minHeight: '38px',
      '&:hover': {
        borderColor: '#3b82f6'
      }
    }),
    option: (base, state) => ({
      ...base,
      fontSize: '0.875rem',
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#f3f4f6' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      cursor: 'pointer',
      padding: '0.5rem 0.75rem'
    }),
    menu: (base) => ({
      ...base,
      zIndex: 10000
    }),
    singleValue: (base) => ({
      ...base,
      fontSize: '0.875rem'
    })
  };

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.container} onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <div style={modalStyles.header}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.375rem', fontWeight: '600', color: '#111827', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
                <FontAwesomeIcon icon={faPlus} />
              </span>
              Add New Review
            </h3>
            <p style={{ margin: '0.375rem 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>Create a new customer testimonial</p>
          </div>
          <button type="button" onClick={onClose} style={{ background: '#f3f4f6', border: 'none', color: '#6b7280', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', fontSize: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.target.style.background = '#e5e7eb'; e.target.style.color = '#111827'; }}
            onMouseLeave={(e) => { e.target.style.background = '#f3f4f6'; e.target.style.color = '#6b7280'; }}>×</button>
        </div>

        {/* Body */}
        <div style={modalStyles.body} className="modal-body-scroll">
          <div className="row g-2">
            <div className="col-md-6">
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: '#374151', marginBottom: '0.375rem' }}>Customer Name <span style={{ color: '#ef4444' }}>*</span></label>
              <input type="text" {...register('name', { required: 'Name is required' })} placeholder="Enter name" style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '6px', border: errors.name ? '1px solid #ef4444' : '1px solid #d1d5db', fontSize: '0.875rem', outline: 'none', transition: 'all 0.2s' }}
                onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = errors.name ? '#ef4444' : '#d1d5db'; e.target.style.boxShadow = 'none'; }} />
              {errors.name && <small style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.name.message}</small>}
            </div>
            <div className="col-md-6">
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: '#374151', marginBottom: '0.375rem' }}>Product Name</label>
              <Controller
                name="product"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={productOptions}
                    value={productOptions.find(opt => opt.value === field.value) || null}
                    onChange={(selected) => field.onChange(selected?.value || '')}
                    placeholder="Select product..."
                    isClearable
                    styles={selectStyles}
                    formatOptionLabel={(option) => (
                      <div>
                        <div style={{ fontWeight: '600' }}>{option.label}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{option.category}</div>
                      </div>
                    )}
                  />
                )}
              />
            </div>
            <div className="col-md-6">
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: '#374151', marginBottom: '0.375rem' }}>Role/Profession</label>
              <input type="text" {...register('role')} placeholder="e.g., Fashion Blogger" style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.875rem', outline: 'none', transition: 'all 0.2s' }}
                onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }} />
            </div>
            <div className="col-md-6">
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: '#374151', marginBottom: '0.375rem' }}>Location</label>
              <input type="text" {...register('location')} placeholder="e.g., New York, USA" style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.875rem', outline: 'none', transition: 'all 0.2s' }}
                onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }} />
            </div>
            <div className="col-md-6">
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: '#374151', marginBottom: '0.375rem' }}>Rating</label>
              <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={ratingOptions}
                    value={ratingOptions.find(opt => opt.value === field.value)}
                    onChange={(selected) => field.onChange(selected?.value || 5)}
                    styles={selectStyles}
                    isSearchable={false}
                  />
                )}
              />
            </div>
            <div className="col-md-6">
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: '#374151', marginBottom: '0.375rem' }}>Verified Purchase</label>
              <Controller
                name="verified"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={verifiedOptions}
                    value={verifiedOptions.find(opt => opt.value === field.value)}
                    onChange={(selected) => field.onChange(selected?.value ?? true)}
                    styles={selectStyles}
                    isSearchable={false}
                  />
                )}
              />
            </div>
            <div className="col-12">
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: '#374151', marginBottom: '0.375rem' }}>Review Text <span style={{ color: '#ef4444' }}>*</span></label>
              <textarea rows="3" {...register('review', { required: 'Review text is required' })} placeholder="Enter review..." style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '6px', border: errors.review ? '1px solid #ef4444' : '1px solid #d1d5db', fontSize: '0.875rem', resize: 'vertical', fontFamily: 'inherit', outline: 'none', transition: 'all 0.2s' }}
                onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = errors.review ? '#ef4444' : '#d1d5db'; e.target.style.boxShadow = 'none'; }} />
              {errors.review && <small style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.review.message}</small>}
            </div>
            <div className="col-12">
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: '#374151', marginBottom: '0.375rem' }}>Profile Image</label>
              <div className="d-flex gap-2 align-items-center">
                <input type="text" {...register('image')} placeholder="URL or upload..." style={{ flex: 1, padding: '0.625rem 0.875rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.875rem', outline: 'none' }} />
                <label style={{ padding: '0.625rem 1rem', borderRadius: '6px', backgroundColor: '#f3f4f6', color: '#374151', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600', border: '1px solid #d1d5db', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { e.target.style.backgroundColor = '#e5e7eb'; }}
                  onMouseLeave={(e) => { e.target.style.backgroundColor = '#f3f4f6'; }}>
                  📁 Browse
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                </label>
                {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #d1d5db' }} />}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={modalStyles.footer}>
          <button type="button" onClick={onClose} style={{ padding: '0.5rem 1.25rem', borderRadius: '6px', border: '1px solid #d1d5db', background: 'white', color: '#374151', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = '#f3f4f6'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = 'white'; }}>
            <FontAwesomeIcon icon={faTimes} className="me-2" />Cancel
          </button>
          <button type="submit" style={{ padding: '0.5rem 1.25rem', borderRadius: '6px', border: 'none', background: '#3b82f6', color: 'white', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = '#2563eb'; e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = '#3b82f6'; e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; }}>
            <FontAwesomeIcon icon={faSave} className="me-2" />Save Review
          </button>
        </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        
        /* Custom Scrollbar */
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
    </div>
  );
}

// Edit Review Modal - Same design as Add
export function EditReviewModal({ show, onClose, review, onSave, products = [] }) {
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);

  // Initialize form with useForm hook
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm();

  // Update form values when review changes
  useEffect(() => {
    if (review && show) {
      reset({
        name: review.name || '',
        role: review.role || '',
        location: review.location || '',
        rating: review.rating || 5,
        review: review.review || '',
        product: review.product || '',
        verified: review.verified ?? true,
        image: review.image || ''
      });
      setImagePreview(review.image || '');
      setImageFile(null);
    }
  }, [review, show, reset]);

  if (!show || !review) return null;
  
  // Convert products to react-select options
  const productOptions = products.map(product => ({
    value: product.name,
    label: product.name,
    category: product.category
  }));

  // Rating options
  const ratingOptions = [
    { value: 5, label: '⭐⭐⭐⭐⭐ (5 Stars)' },
    { value: 4, label: '⭐⭐⭐⭐ (4 Stars)' },
    { value: 3, label: '⭐⭐⭐ (3 Stars)' },
    { value: 2, label: '⭐⭐ (2 Stars)' },
    { value: 1, label: '⭐ (1 Star)' }
  ];

  // Verified options
  const verifiedOptions = [
    { value: true, label: '✓ Verified' },
    { value: false, label: 'Not Verified' }
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('role', data.role);
    formData.append('location', data.location);
    formData.append('rating', data.rating);
    formData.append('review', data.review);
    formData.append('product', data.product);
    formData.append('verified', data.verified);
    
    if (imageFile) {
      formData.append('image', imageFile);
    } else if (data.image) {
      formData.append('image', data.image);
    }

    onSave(formData);
  };

  // Custom styles for react-select
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      padding: '0.125rem 0.375rem',
      borderRadius: '6px',
      border: state.isFocused ? '1px solid #3b82f6' : '1px solid #d1d5db',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(59,130,246,0.1)' : 'none',
      fontSize: '0.875rem',
      minHeight: '38px',
      '&:hover': {
        borderColor: '#3b82f6'
      }
    }),
    option: (base, state) => ({
      ...base,
      fontSize: '0.875rem',
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#f3f4f6' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      cursor: 'pointer',
      padding: '0.5rem 0.75rem'
    }),
    menu: (base) => ({
      ...base,
      zIndex: 10000
    }),
    singleValue: (base) => ({
      ...base,
      fontSize: '0.875rem'
    })
  };
  
  // Reuse AddReviewModal but change header icon
  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.container} onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={modalStyles.header}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.375rem', fontWeight: '600', color: '#111827', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
                <FontAwesomeIcon icon={faEdit} />
              </span>
              Edit Review
            </h3>
            <p style={{ margin: '0.375rem 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>Update customer testimonial</p>
          </div>
          <button type="button" onClick={onClose} style={{ background: '#f3f4f6', border: 'none', color: '#6b7280', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', fontSize: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.target.style.background = '#e5e7eb'; e.target.style.color = '#111827'; }}
            onMouseLeave={(e) => { e.target.style.background = '#f3f4f6'; e.target.style.color = '#6b7280'; }}>×</button>
        </div>
        <div style={modalStyles.body} className="modal-body-scroll">
          <div className="row g-2">
            <div className="col-md-6">
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: '#374151', marginBottom: '0.375rem' }}>Customer Name <span style={{ color: '#ef4444' }}>*</span></label>
              <input type="text" {...register('name', { required: 'Name is required' })} style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '6px', border: errors.name ? '1px solid #ef4444' : '1px solid #d1d5db', fontSize: '0.875rem', outline: 'none', transition: 'all 0.2s' }}
                onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = errors.name ? '#ef4444' : '#d1d5db'; e.target.style.boxShadow = 'none'; }} />
              {errors.name && <small style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.name.message}</small>}
            </div>
            <div className="col-md-6">
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: '#374151', marginBottom: '0.375rem' }}>Product Name</label>
              <Controller
                name="product"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={productOptions}
                    value={productOptions.find(opt => opt.value === field.value) || null}
                    onChange={(selected) => field.onChange(selected?.value || '')}
                    placeholder="Select product..."
                    isClearable
                    styles={selectStyles}
                    formatOptionLabel={(option) => (
                      <div>
                        <div style={{ fontWeight: '600' }}>{option.label}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{option.category}</div>
                      </div>
                    )}
                  />
                )}
              />
            </div>
            <div className="col-md-6">
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: '#374151', marginBottom: '0.375rem' }}>Role/Profession</label>
              <input type="text" {...register('role')} style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.875rem', outline: 'none', transition: 'all 0.2s' }}
                onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }} />
            </div>
            <div className="col-md-6">
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: '#374151', marginBottom: '0.375rem' }}>Location</label>
              <input type="text" {...register('location')} style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.875rem', outline: 'none', transition: 'all 0.2s' }}
                onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }} />
            </div>
            <div className="col-md-6">
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: '#374151', marginBottom: '0.375rem' }}>Rating</label>
              <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={ratingOptions}
                    value={ratingOptions.find(opt => opt.value === field.value)}
                    onChange={(selected) => field.onChange(selected?.value || 5)}
                    styles={selectStyles}
                    isSearchable={false}
                  />
                )}
              />
            </div>
            <div className="col-md-6">
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: '#374151', marginBottom: '0.375rem' }}>Verified Purchase</label>
              <Controller
                name="verified"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={verifiedOptions}
                    value={verifiedOptions.find(opt => opt.value === field.value)}
                    onChange={(selected) => field.onChange(selected?.value ?? true)}
                    styles={selectStyles}
                    isSearchable={false}
                  />
                )}
              />
            </div>
            <div className="col-12">
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: '#374151', marginBottom: '0.375rem' }}>Review Text <span style={{ color: '#ef4444' }}>*</span></label>
              <textarea rows="3" {...register('review', { required: 'Review text is required' })} style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '6px', border: errors.review ? '1px solid #ef4444' : '1px solid #d1d5db', fontSize: '0.875rem', resize: 'vertical', fontFamily: 'inherit', outline: 'none', transition: 'all 0.2s' }}
                onFocus={(e) => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = errors.review ? '#ef4444' : '#d1d5db'; e.target.style.boxShadow = 'none'; }} />
              {errors.review && <small style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.review.message}</small>}
            </div>
            <div className="col-12">
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: '#374151', marginBottom: '0.375rem' }}>Profile Image</label>
              <div className="d-flex gap-2 align-items-center">
                <input type="text" {...register('image')} placeholder="URL or upload..." style={{ flex: 1, padding: '0.625rem 0.875rem', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '0.875rem', outline: 'none' }} />
                <label style={{ padding: '0.625rem 1rem', borderRadius: '6px', backgroundColor: '#f3f4f6', color: '#374151', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '600', border: '1px solid #d1d5db', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { e.target.style.backgroundColor = '#e5e7eb'; }}
                  onMouseLeave={(e) => { e.target.style.backgroundColor = '#f3f4f6'; }}>
                  📁 Browse
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                </label>
                {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #d1d5db' }} />}
              </div>
            </div>
          </div>
        </div>
        <div style={modalStyles.footer}>
          <button type="button" onClick={onClose} style={{ padding: '0.5rem 1.25rem', borderRadius: '6px', border: '1px solid #d1d5db', background: 'white', color: '#374151', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = '#f3f4f6'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = 'white'; }}>
            <FontAwesomeIcon icon={faTimes} className="me-2" />Cancel
          </button>
          <button type="submit" style={{ padding: '0.5rem 1.25rem', borderRadius: '6px', border: 'none', background: '#3b82f6', color: 'white', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = '#2563eb'; e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = '#3b82f6'; e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; }}>
            <FontAwesomeIcon icon={faSave} className="me-2" />Save Changes
          </button>
        </div>
        </form>
      </div>
    </div>
  );
}

// View Review Modal
export function ViewReviewModal({ show, onClose, review }) {
  if (!show || !review) return null;

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={{...modalStyles.container, maxWidth: '700px'}} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={modalStyles.header}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.375rem', fontWeight: '600', color: '#111827', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
                <FontAwesomeIcon icon={faEye} />
              </span>
              Review Details
            </h3>
            <p style={{ margin: '0.375rem 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>Customer testimonial information</p>
          </div>
          <button onClick={onClose} style={{ background: '#f3f4f6', border: 'none', color: '#6b7280', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', fontSize: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.target.style.background = '#e5e7eb'; e.target.style.color = '#111827'; }}
            onMouseLeave={(e) => { e.target.style.background = '#f3f4f6'; e.target.style.color = '#6b7280'; }}>×</button>
        </div>

        {/* Body */}
        <div style={{...modalStyles.body, padding: '2rem'}}>
          {/* Customer Info Card */}
          <div style={{ 
            backgroundColor: '#f9fafb', 
            border: '1px solid #e5e7eb', 
            borderRadius: '12px', 
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <div className="d-flex align-items-center gap-3 mb-3">
              <img 
                src={review.image} 
                alt={review.name} 
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  objectFit: 'cover', 
                  border: '3px solid white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }} 
              />
              <div style={{ flex: 1 }}>
                <h4 style={{ color: '#111827', fontWeight: '700', marginBottom: '0.25rem', fontSize: '1.25rem' }}>
                  {review.name}
                </h4>
                <p style={{ color: '#6b7280', marginBottom: '0.25rem', fontSize: '0.9375rem' }}>
                  {review.role}
                </p>
                <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0' }}>
                  📍 {review.location}
                </p>
              </div>
              {review.verified && (
                <span style={{ 
                  backgroundColor: '#10b981', 
                  color: 'white', 
                  padding: '0.375rem 0.875rem', 
                  borderRadius: '20px', 
                  fontSize: '0.8125rem', 
                  fontWeight: '700',
                  whiteSpace: 'nowrap'
                }}>
                  ✓ Verified
                </span>
              )}
            </div>
          </div>

          {/* Rating Section */}
          <div style={{ 
            marginBottom: '1.5rem', 
            paddingBottom: '1.5rem', 
            borderBottom: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div className="mb-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ 
                  color: i < review.rating ? '#FFD700' : '#e5e7eb', 
                  fontSize: '2rem', 
                  marginRight: '4px',
                  textShadow: i < review.rating ? '0 2px 4px rgba(255,215,0,0.3)' : 'none'
                }}>★</span>
              ))}
            </div>
            <div style={{ fontSize: '1rem', color: '#6b7280', fontWeight: '600' }}>
              {review.rating} out of 5 stars
            </div>
          </div>

          {/* Product Section */}
          <div style={{ 
            background: '#f9fafb', 
            padding: '1.25rem', 
            borderRadius: '12px', 
            marginBottom: '1.5rem', 
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '0.75rem', 
              color: '#9ca3af', 
              marginBottom: '0.5rem', 
              fontWeight: '600', 
              textTransform: 'uppercase', 
              letterSpacing: '0.5px' 
            }}>
              Product Reviewed
            </div>
            <div style={{ 
              fontSize: '1.125rem', 
              color: '#111827', 
              fontWeight: '700' 
            }}>
              {review.product}
            </div>
          </div>

          {/* Review Text */}
          <div style={{ 
            background: 'white', 
            border: '1px solid #e5e7eb', 
            padding: '1.5rem', 
            borderRadius: '12px',
            position: 'relative'
          }}>
            <div style={{
              fontSize: '0.75rem',
              color: '#9ca3af',
              marginBottom: '0.75rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Customer Review
            </div>
            <div style={{
              position: 'absolute',
              top: '1rem',
              right: '1.5rem',
              fontSize: '3rem',
              color: '#e5e7eb',
              lineHeight: '1',
              fontFamily: 'Georgia, serif'
            }}>"</div>
            <p style={{ 
              color: '#374151', 
              fontSize: '0.9375rem', 
              lineHeight: '1.7', 
              margin: 0,
              fontStyle: 'italic',
              position: 'relative',
              zIndex: 1
            }}>
              {review.review}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={modalStyles.footer}>
          <button 
            onClick={onClose} 
            style={{ 
              width: '100%', 
              padding: '0.625rem', 
              borderRadius: '6px', 
              border: 'none', 
              background: '#3b82f6', 
              color: 'white', 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              cursor: 'pointer', 
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)', 
              transition: 'all 0.2s' 
            }}
            onMouseEnter={(e) => { 
              e.target.style.backgroundColor = '#2563eb'; 
              e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => { 
              e.target.style.backgroundColor = '#3b82f6'; 
              e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Delete Confirmation Modal
export function DeleteReviewModal({ show, onClose, review, onConfirm }) {
  if (!show || !review) return null;

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={{...modalStyles.container, maxWidth: '500px'}} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{...modalStyles.header, flexDirection: 'column', textAlign: 'center', padding: '2rem'}}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '2rem', color: '#ef4444' }}>
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </div>
          <h3 style={{ margin: 0, fontSize: '1.375rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>Delete Review?</h3>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>This action cannot be undone</p>
        </div>

        {/* Body */}
        <div style={{...modalStyles.body, padding: '0 2rem 2rem'}}>
          <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #e5e7eb' }}>
            <div className="d-flex align-items-center gap-3 mb-2">
              <img src={review.image} alt={review.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid white' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '700', color: '#111827', fontSize: '0.9375rem' }}>{review.name}</div>
                <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>{review.role} • {review.location}</div>
              </div>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', fontStyle: 'italic', textAlign: 'left' }}>"{review.review.substring(0, 80)}{review.review.length > 80 ? '...' : ''}"</div>
          </div>

          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.875rem' }}>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: '#991b1b', fontWeight: '600', lineHeight: '1.5' }}>⚠️ Warning: This will permanently remove the review from your website. This action cannot be reversed.</p>
          </div>
        </div>

        {/* Footer */}
        <div style={modalStyles.footer}>
          <button onClick={onClose} style={{ flex: 1, padding: '0.625rem', borderRadius: '6px', border: '1px solid #d1d5db', background: 'white', color: '#374151', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = '#f3f4f6'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = 'white'; }}>
            <FontAwesomeIcon icon={faTimes} className="me-2" />Cancel
          </button>
          <button onClick={onConfirm} style={{ flex: 1, padding: '0.625rem', borderRadius: '6px', border: 'none', background: '#ef4444', color: 'white', fontSize: '0.875rem', fontWeight: '600', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.target.style.backgroundColor = '#dc2626'; e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; }}
            onMouseLeave={(e) => { e.target.style.backgroundColor = '#ef4444'; e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'; }}>
            <FontAwesomeIcon icon={faTrash} className="me-2" />Delete Review
          </button>
        </div>
      </div>
    </div>
  );
}
