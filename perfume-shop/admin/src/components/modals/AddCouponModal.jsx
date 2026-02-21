import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, faTicket, faPercent, faRupeeSign, faBoxes
} from '@fortawesome/free-solid-svg-icons';
import SprayLoader from '../common/SprayLoader';
import { insertCoupon, GetCoupons } from '../../APIS/apis/CouponApi';
import { GetProduct } from '../../APIS/apis/ProductApi';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "react-toastify";

export default function AddCouponModal({ isOpen, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discountType, setDiscountType] = useState('percentage');
  const [applicationType, setApplicationType] = useState('all');
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm();

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

  // Discount type options
  const discountTypeOptions = [
    { value: 'percentage', label: 'Percentage (%)' },
    { value: 'fixed', label: 'Fixed Amount (₹)' }
  ];

  // Application type options
  const applicationTypeOptions = [
    { value: 'all', label: 'All Products' },
    { value: 'specific', label: 'Specific Products' },
    { value: 'category', label: 'Product Category' },
    { value: 'bulk', label: 'Bulk Products' }
  ];

  // Category options
  const categoryOptions = [
    { value: 'perfume', label: 'Perfume' },
    { value: 'attar', label: 'Attar' },
    { value: 'combo', label: 'Combo' }
  ];

  // Custom styles for react-select
  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: '10px',
      border: `2px solid ${errors.discountType || errors.applicationType ? '#dc3545' : 'var(--sand-300)'}`,
      padding: '0.3rem',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(179, 135, 63, 0.1)' : 'none',
      borderColor: state.isFocused ? 'var(--sand-600)' : errors.discountType || errors.applicationType ? '#dc3545' : 'var(--sand-300)',
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
    }),
    placeholder: (base) => ({
      ...base,
      color: 'var(--sand-500)'
    })
  };

  // Form submit
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      // Prepare coupon data
      const couponData = {
        code: data.code.toUpperCase(),
        description: data.description || `${data.code} coupon`,
        discountType: data.discountType.value,
        discountValue: Number(data.discountValue),
        minPurchase: Number(data.minOrderValue) || 0,
        maxDiscount: data.maxDiscount ? Number(data.maxDiscount) : null,
        usageLimit: data.usageLimit ? Number(data.usageLimit) : null,
        startDate: data.validFrom,
        endDate: data.validTo,
        applicableCategories: ['all']
      };

      // Handle application type
      if (data.applicationType.value === 'category' && data.category) {
        couponData.applicableCategories = [data.category.value];
      } else if (data.applicationType.value === 'specific' && data.specificProducts) {
        couponData.applicableProducts = data.specificProducts.map(p => p.value);
      } else if (data.applicationType.value === 'bulk' && data.bulkProducts) {
        couponData.applicableProducts = data.bulkProducts.map(p => p.value);
      }

      const res = await dispatch(insertCoupon(couponData));
      
      if (res?.payload?.status === "success") {
        toast.success("Coupon created successfully!");
        // Refresh coupon list
        dispatch(GetCoupons());
        setIsSubmitting(false);
        handleClose();
      } else {
        toast.error(res?.payload?.message || "Something went wrong!");
        setIsSubmitting(false);
      }

      // const response = await fetch('/api/coupons', {
      //   method: 'POST',
      //   body: formData
      // });

    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to create coupon. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Close modal and reset
  const handleClose = () => {
    reset();
    setDiscountType('percentage');
    setApplicationType('all');
    onClose();
  };

  if (!isOpen) return null;

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
        borderRadius: '16px',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflowY: 'auto',
        zIndex: 9999,
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '2px solid var(--sand-200)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          zIndex: 10,
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px'
        }}>
          <h3 style={{
            margin: 0,
            color: 'var(--sand-900)',
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.8rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <FontAwesomeIcon icon={faTicket} style={{ color: 'var(--sand-600)' }} />
            Add New Coupon
          </h3>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              color: 'var(--sand-600)',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--sand-200)';
              e.currentTarget.style.color = 'var(--sand-900)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--sand-600)';
            }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '2rem' }}>
          <div className="row g-4">
            {/* Coupon Code */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Coupon Code <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="text"
                className="form-control text-uppercase"
                placeholder="e.g., WELCOME10"
                {...register('code', { 
                  required: 'Coupon code is required',
                  minLength: { value: 4, message: 'Code must be at least 4 characters' },
                  pattern: { value: /^[A-Z0-9]+$/, message: 'Only uppercase letters and numbers allowed' }
                })}
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: `2px solid ${errors.code ? '#dc3545' : 'var(--sand-300)'}`,
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  letterSpacing: '1px'
                }}
              />
              {errors.code && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                  {errors.code.message}
                </small>
              )}
            </div>

            {/* Discount Type */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Discount Type <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <Controller
                name="discountType"
                control={control}
                rules={{ required: 'Discount type is required' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={discountTypeOptions}
                    placeholder="Select Type"
                    styles={customSelectStyles}
                    onChange={(value) => {
                      field.onChange(value);
                      setDiscountType(value?.value || 'percentage');
                    }}
                  />
                )}
              />
              {errors.discountType && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                  {errors.discountType.message}
                </small>
              )}
            </div>

            {/* Discount Value */}
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Discount Value <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  className="form-control"
                  placeholder={discountType === 'percentage' ? '10' : '200'}
                  {...register('discountValue', { 
                    required: 'Discount value is required',
                    min: { value: 1, message: 'Value must be greater than 0' },
                    max: discountType === 'percentage' ? { value: 100, message: 'Percentage cannot exceed 100' } : undefined
                  })}
                  style={{
                    padding: '0.75rem',
                    paddingLeft: '2.5rem',
                    borderRadius: '10px',
                    border: `2px solid ${errors.discountValue ? '#dc3545' : 'var(--sand-300)'}`,
                    fontSize: '0.95rem'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--sand-600)',
                  fontWeight: '700'
                }}>
                  <FontAwesomeIcon icon={discountType === 'percentage' ? faPercent : faRupeeSign} />
                </span>
              </div>
              {errors.discountValue && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                  {errors.discountValue.message}
                </small>
              )}
            </div>

            {/* Min Order Value */}
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Min Order Value (₹) <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="1000"
                {...register('minOrderValue', { 
                  required: 'Minimum order value is required',
                  min: { value: 0, message: 'Value cannot be negative' }
                })}
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: `2px solid ${errors.minOrderValue ? '#dc3545' : 'var(--sand-300)'}`,
                  fontSize: '0.95rem'
                }}
              />
              {errors.minOrderValue && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                  {errors.minOrderValue.message}
                </small>
              )}
            </div>

            {/* Max Discount (for percentage type) */}
            {discountType === 'percentage' && (
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                  Max Discount (₹)
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="500"
                  {...register('maxDiscount', { 
                    min: { value: 0, message: 'Value cannot be negative' }
                  })}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: `2px solid ${errors.maxDiscount ? '#dc3545' : 'var(--sand-300)'}`,
                    fontSize: '0.95rem'
                  }}
                />
                {errors.maxDiscount && (
                  <small style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                    {errors.maxDiscount.message}
                  </small>
                )}
              </div>
            )}

            {/* Usage Limit */}
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Usage Limit <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="100"
                {...register('usageLimit', { 
                  required: 'Usage limit is required',
                  min: { value: 1, message: 'Limit must be at least 1' }
                })}
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: `2px solid ${errors.usageLimit ? '#dc3545' : 'var(--sand-300)'}`,
                  fontSize: '0.95rem'
                }}
              />
              {errors.usageLimit && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                  {errors.usageLimit.message}
                </small>
              )}
            </div>

            {/* Valid From */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Valid From <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="date"
                className="form-control"
                {...register('validFrom', { 
                  required: 'Start date is required'
                })}
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: `2px solid ${errors.validFrom ? '#dc3545' : 'var(--sand-300)'}`,
                  fontSize: '0.95rem'
                }}
              />
              {errors.validFrom && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                  {errors.validFrom.message}
                </small>
              )}
            </div>

            {/* Valid To */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Valid To <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="date"
                className="form-control"
                {...register('validTo', { 
                  required: 'End date is required'
                })}
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: `2px solid ${errors.validTo ? '#dc3545' : 'var(--sand-300)'}`,
                  fontSize: '0.95rem'
                }}
              />
              {errors.validTo && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                  {errors.validTo.message}
                </small>
              )}
            </div>

            {/* Application Type */}
            <div className="col-12">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Apply To <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <Controller
                name="applicationType"
                control={control}
                rules={{ required: 'Application type is required' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={applicationTypeOptions}
                    placeholder="Select Application Type"
                    styles={customSelectStyles}
                    onChange={(value) => {
                      field.onChange(value);
                      setApplicationType(value?.value || 'all');
                    }}
                  />
                )}
              />
              {errors.applicationType && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                  {errors.applicationType.message}
                </small>
              )}
              <small style={{ color: 'var(--sand-600)', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                Choose where this coupon can be applied
              </small>
            </div>

            {/* Conditional Fields Based on Application Type */}
            {applicationType === 'specific' && (
              <div className="col-12">
                <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                  Select Specific Products <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <Controller
                  name="specificProducts"
                  control={control}
                  rules={{ required: 'Please select at least one product' }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={productOptions}
                      placeholder={productOptions.length === 0 ? "Loading products..." : "Select Products"}
                      styles={customSelectStyles}
                      isMulti
                      isLoading={productOptions.length === 0}
                      isDisabled={productOptions.length === 0}
                    />
                  )}
                />
                {errors.specificProducts && (
                  <small style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                    {errors.specificProducts.message}
                  </small>
                )}
              </div>
            )}

            {applicationType === 'category' && (
              <div className="col-12">
                <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                  Select Category <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: 'Please select a category' }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={categoryOptions}
                      placeholder="Select Category"
                      styles={customSelectStyles}
                    />
                  )}
                />
                {errors.category && (
                  <small style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                    {errors.category.message}
                  </small>
                )}
              </div>
            )}

            {applicationType === 'bulk' && (
              <div className="col-12">
                <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                  Select Bulk Products <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <Controller
                  name="bulkProducts"
                  control={control}
                  rules={{ 
                    required: 'Please select at least 3 products for bulk discount',
                    validate: (value) => value?.length >= 3 || 'Bulk discount requires at least 3 products'
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={productOptions}
                      placeholder={productOptions.length === 0 ? "Loading products..." : "Select Multiple Products (Min 3)"}
                      styles={customSelectStyles}
                      isMulti
                      isLoading={productOptions.length === 0}
                      isDisabled={productOptions.length === 0}
                    />
                  )}
                />
                {errors.bulkProducts && (
                  <small style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                    {errors.bulkProducts.message}
                  </small>
                )}
                <small style={{ color: 'var(--sand-600)', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                  <FontAwesomeIcon icon={faBoxes} className="me-1" />
                  Bulk discount applies when customer purchases all selected products together
                </small>
              </div>
            )}

            {applicationType === 'all' && (
              <div className="col-12">
                <div style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  backgroundColor: 'var(--sand-100)',
                  border: '2px solid var(--sand-300)'
                }}>
                  <p style={{ 
                    margin: 0, 
                    color: 'var(--sand-800)', 
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}>
                    <FontAwesomeIcon icon={faTicket} className="me-2" style={{ color: 'var(--sand-600)' }} />
                    This coupon will be applicable to all products in your store
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div style={{
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '2px solid var(--sand-200)',
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                border: '2px solid var(--sand-300)',
                backgroundColor: 'white',
                color: 'var(--sand-900)',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--sand-200)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '0.75rem 2rem',
                borderRadius: '10px',
                border: 'none',
                background: isSubmitting 
                  ? 'var(--sand-400)' 
                  : 'linear-gradient(135deg, var(--sand-600) 0%, var(--sand-700) 100%)',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(179, 135, 63, 0.3)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(179, 135, 63, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(179, 135, 63, 0.3)';
                }
              }}
            >
              {isSubmitting ? (
                <>
                  <SprayLoader size="small" color="white" />
                  <span>Creating Coupon...</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faTicket} />
                  <span>Create Coupon</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
