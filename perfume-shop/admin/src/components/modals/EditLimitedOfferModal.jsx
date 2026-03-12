import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, faBolt, faPercent, faSave
} from '@fortawesome/free-solid-svg-icons';
import SprayLoader from '../common/SprayLoader';
import { UpdateLimitedOffer, GetLimitedOffers } from '../../APIS/apis/LimitedOfferApi';
import { GetProduct } from '../../APIS/apis/ProductApi';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "react-toastify";

export default function EditLimitedOfferModal({ isOpen, onClose, offer }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm();

  const originalPrice = watch('originalPrice');
  const offerPrice = watch('offerPrice');

  // Calculate discount percentage
  const calculatedDiscount = originalPrice && offerPrice && originalPrice > 0
    ? Math.round(((originalPrice - offerPrice) / originalPrice) * 100)
    : 0;

  // Fetch products from Redux store
  const { productData } = useSelector((state) => state?.ProductSlice);

  // Fetch products on component mount
  useEffect(() => {
    if (isOpen) {
      dispatch(GetProduct());
    }
  }, [isOpen, dispatch]);

  // Convert product data to react-select options
  const productOptions = productData?.map(product => ({
    value: product._id,
    label: `${product.name} - ₹${product.finalPrice || product.actualPrice}`,
    name: product.name
  })) || [];

  // Prefill form when offer changes
  useEffect(() => {
    if (offer && isOpen && productData && productData.length > 0) {
      // Convert date strings to YYYY-MM-DD format
      const parseDate = (dateStr) => {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
      reset({
        title: offer.title,
        description: offer.description,
        originalPrice: offer.originalPrice,
        offerPrice: offer.offerPrice,
        startDate: parseDate(offer.startDate),
        endDate: parseDate(offer.endDate),
        stockLimit: offer.stockLimit || '',
        featured: offer.featured || false
      });

      // Pre-select product - handle both array and object
      let productId = null;
      
      if (offer.product) {
        if (Array.isArray(offer.product)) {
          // If product is an array, get the first item
          productId = offer.product.length > 0 
            ? (typeof offer.product[0] === 'object' ? offer.product[0]._id : offer.product[0])
            : null;
        } else {
          // If product is a single value
          productId = typeof offer.product === 'object' ? offer.product._id : offer.product;
        }
      }
      
      const selectedProductOption = productId 
        ? productOptions.find(p => p.value === productId) 
        : null;
      
      setSelectedProduct(selectedProductOption || null);
    }
  }, [offer, isOpen, productData, reset]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedProduct(null);
      reset();
    }
  }, [isOpen, reset]);

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: '8px',
      border: `1px solid ${errors.product ? '#dc3545' : '#dee2e6'}`,
      padding: '0.25rem',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(179, 135, 63, 0.1)' : 'none',
      borderColor: state.isFocused ? 'var(--sand-600)' : errors.product ? '#dc3545' : '#dee2e6',
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
    }),
    placeholder: (base) => ({
      ...base,
      color: '#6c757d'
    })
  };

  const handleProductChange = (selected) => {
    setSelectedProduct(selected);
  };

  const onSubmit = async (data) => {
    if (!selectedProduct) {
      toast.error('Please select a product for the offer');
      return;
    }

    // Validate dates
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (endDate <= startDate) {
      toast.error('End date must be after start date');
      return;
    }

    // Validate prices
    if (Number(data.offerPrice) >= Number(data.originalPrice)) {
      toast.error('Offer price must be less than original price');
      return;
    }

    setIsSubmitting(true);

    try {
      const offerData = {
        title: data.title,
        description: data.description,
        product: selectedProduct.value,
        originalPrice: Number(data.originalPrice),
        offerPrice: Number(data.offerPrice),
        startDate: data.startDate,
        endDate: data.endDate,
        stockLimit: data.stockLimit ? Number(data.stockLimit) : null,
        featured: data.featured || false
      };

      const res = await dispatch(UpdateLimitedOffer({ id: offer._id, data: offerData }));
      
      if (res?.payload?.status === "success") {
        toast.success("Limited offer updated successfully!");
        dispatch(GetLimitedOffers());
        handleClose();
      } else {
        toast.error(res?.payload?.message || "Failed to update offer");
      }
    } catch (error) {
      console.error('Error updating offer:', error);
      toast.error('Failed to update offer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedProduct(null);
    onClose();
  };

  if (!isOpen || !offer) return null;

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

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
        maxWidth: '800px',
        maxHeight: '90vh',
        overflowY: 'auto',
        zIndex: 9999,
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid #e9ecef',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          zIndex: 10,
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px'
        }}>
          <div>
            <h3 style={{
              margin: 0,
              color: '#212529',
              fontSize: '1.25rem',
              fontWeight: '600'
            }}>
              <FontAwesomeIcon icon={faBolt} className="me-2" style={{ color: '#ff5722' }} />
              Edit Limited Offer
            </h3>
            <p style={{ margin: '0.25rem 0 0 0', color: '#6c757d', fontSize: '0.875rem' }}>
              Update offer details and settings
            </p>
          </div>
          <button
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
            onMouseEnter={(e) => e.currentTarget.style.color = '#212529'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6c757d'}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '2rem' }}>
          <div className="row g-3">
            {/* Title */}
            <div className="col-12">
              <label className="form-label" style={{ 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#495057' 
              }}>
                Offer Title <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., Flash Sale - Premium Perfume"
                {...register('title', { 
                  required: 'Title is required',
                  maxLength: { value: 100, message: 'Title cannot exceed 100 characters' }
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

            {/* Description */}
            <div className="col-12">
              <label className="form-label" style={{ 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#495057' 
              }}>
                Description <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Describe the offer details..."
                {...register('description', { 
                  required: 'Description is required',
                  maxLength: { value: 500, message: 'Description cannot exceed 500 characters' }
                })}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  border: `1px solid ${errors.description ? '#dc3545' : '#dee2e6'}`,
                  fontSize: '0.875rem',
                  resize: 'vertical'
                }}
              />
              {errors.description && (
                <small style={{ color: '#dc3545', fontSize: '0.75rem' }}>
                  {errors.description.message}
                </small>
              )}
            </div>

            {/* Product Selection */}
            <div className="col-12">
              <label className="form-label" style={{ 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#495057' 
              }}>
                Select Product <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <Select
                options={productOptions}
                value={selectedProduct}
                onChange={handleProductChange}
                placeholder={productOptions.length === 0 ? "Loading products..." : "Choose a product..."}
                styles={customSelectStyles}
                isLoading={productOptions.length === 0}
              />
              {!selectedProduct && errors.product && (
                <small style={{ color: '#dc3545', fontSize: '0.75rem' }}>
                  Product is required
                </small>
              )}
            </div>

            {/* Original Price */}
            <div className="col-12 col-md-6">
              <label className="form-label" style={{ 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#495057' 
              }}>
                Original Price (₹) <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="0"
                step="0.01"
                {...register('originalPrice', { 
                  required: 'Original price is required',
                  min: { value: 0, message: 'Price cannot be negative' }
                })}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  border: `1px solid ${errors.originalPrice ? '#dc3545' : '#dee2e6'}`,
                  fontSize: '0.875rem'
                }}
              />
              {errors.originalPrice && (
                <small style={{ color: '#dc3545', fontSize: '0.75rem' }}>
                  {errors.originalPrice.message}
                </small>
              )}
            </div>

            {/* Offer Price */}
            <div className="col-12 col-md-6">
              <label className="form-label" style={{ 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#495057' 
              }}>
                Offer Price (₹) <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="0"
                step="0.01"
                {...register('offerPrice', { 
                  required: 'Offer price is required',
                  min: { value: 0, message: 'Price cannot be negative' }
                })}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  border: `1px solid ${errors.offerPrice ? '#dc3545' : '#dee2e6'}`,
                  fontSize: '0.875rem'
                }}
              />
              {errors.offerPrice && (
                <small style={{ color: '#dc3545', fontSize: '0.75rem' }}>
                  {errors.offerPrice.message}
                </small>
              )}
            </div>

            {/* Calculated Discount */}
            {calculatedDiscount > 0 && (
              <div className="col-12">
                <div className="p-3" style={{
                  backgroundColor: '#ff572215',
                  borderRadius: '8px',
                  border: '1px solid #ff572230'
                }}>
                  <div className="d-flex align-items-center gap-2">
                    <FontAwesomeIcon icon={faPercent} style={{ color: '#ff5722' }} />
                    <span style={{ fontSize: '0.875rem', color: '#495057' }}>
                      Discount: <strong style={{ color: '#ff5722', fontSize: '1rem' }}>{calculatedDiscount}%</strong>
                    </span>
                    <span style={{ fontSize: '0.875rem', color: '#28a745', marginLeft: 'auto' }}>
                      Save ₹{(originalPrice - offerPrice).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Start Date */}
            <div className="col-12 col-md-6">
              <label className="form-label" style={{ 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#495057' 
              }}>
                Start Date <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="date"
                className="form-control"
                min={today}
                {...register('startDate', { 
                  required: 'Start date is required'
                })}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  border: `1px solid ${errors.startDate ? '#dc3545' : '#dee2e6'}`,
                  fontSize: '0.875rem'
                }}
              />
              {errors.startDate && (
                <small style={{ color: '#dc3545', fontSize: '0.75rem' }}>
                  {errors.startDate.message}
                </small>
              )}
            </div>

            {/* End Date */}
            <div className="col-12 col-md-6">
              <label className="form-label" style={{ 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#495057' 
              }}>
                End Date <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="date"
                className="form-control"
                min={today}
                {...register('endDate', { 
                  required: 'End date is required'
                })}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  border: `1px solid ${errors.endDate ? '#dc3545' : '#dee2e6'}`,
                  fontSize: '0.875rem'
                }}
              />
              {errors.endDate && (
                <small style={{ color: '#dc3545', fontSize: '0.75rem' }}>
                  {errors.endDate.message}
                </small>
              )}
            </div>

            {/* Stock Limit */}
            <div className="col-12 col-md-6">
              <label className="form-label" style={{ 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#495057' 
              }}>
                Stock Limit (Optional)
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="Leave empty for unlimited"
                {...register('stockLimit', { 
                  min: { value: 1, message: 'Stock limit must be at least 1' }
                })}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  border: `1px solid ${errors.stockLimit ? '#dc3545' : '#dee2e6'}`,
                  fontSize: '0.875rem'
                }}
              />
              {errors.stockLimit && (
                <small style={{ color: '#dc3545', fontSize: '0.75rem' }}>
                  {errors.stockLimit.message}
                </small>
              )}
            </div>

            {/* Featured */}
            <div className="col-12 col-md-6">
              <label className="form-label" style={{ 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#495057' 
              }}>
                Featured Offer
              </label>
              <div className="form-check" style={{ paddingTop: '0.5rem' }}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="featured"
                  {...register('featured')}
                  style={{ cursor: 'pointer' }}
                />
                <label className="form-check-label" htmlFor="featured" style={{ 
                  fontSize: '0.875rem', 
                  color: '#495057',
                  cursor: 'pointer'
                }}>
                  Mark as featured offer
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-4 d-flex gap-2 justify-content-end">
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
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
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
                backgroundColor: isSubmitting ? '#6c757d' : '#ff5722',
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
                  Updating...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} />
                  Update Offer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
