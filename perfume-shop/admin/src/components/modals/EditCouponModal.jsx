import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import SprayLoader from '../common/SprayLoader';
import { UpdateCoupon, GetCoupons } from '../../APIS/apis/CouponApi';
import { GetProduct } from '../../APIS/apis/ProductApi';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "react-toastify";

export default function EditCouponModal({ isOpen, onClose, coupon }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationType, setApplicationType] = useState('all');
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue
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

  const discountTypeOptions = [
    { value: 'percentage', label: 'Percentage (%)' },
    { value: 'fixed', label: 'Fixed Amount (₹)' }
  ];

  const applicationTypeOptions = [
    { value: 'all', label: 'All Products' },
    { value: 'specific', label: 'Specific Products' },
    { value: 'category', label: 'Product Category' }
  ];

  const categoryOptions = [
    { value: 'perfume', label: 'Perfume' },
    { value: 'attar', label: 'Attar' },
    { value: 'combo', label: 'Combo' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'expired', label: 'Expired' }
  ];

  // Prefill form when coupon changes
  useEffect(() => {
    if (coupon && isOpen && productData && productData.length > 0) {
      console.log('EditCouponModal - Prefilling with coupon:', {
        rawApplicableProducts: coupon.rawApplicableProducts,
        rawApplicableCategories: coupon.rawApplicableCategories,
        productOptions: productOptions.length
      });

      // Map the display data back to API format
      const discountType = coupon.type === 'Percentage' ? 'percentage' : 'fixed';
      const status = coupon.status.toLowerCase();
      
      setValue('code', coupon.code);
      setValue('description', coupon.description || '');
      setValue('discountType', discountTypeOptions.find(opt => opt.value === discountType));
      setValue('discountValue', coupon.value);
      setValue('minOrderValue', coupon.minOrder);
      setValue('maxDiscount', coupon.maxDiscount || '');
      setValue('usageLimit', coupon.usageLimit === 'Unlimited' ? '' : coupon.usageLimit);
      setValue('status', statusOptions.find(opt => opt.value === status));
      
      // Convert date strings back to YYYY-MM-DD format
      const parseDate = (dateStr) => {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
      setValue('validFrom', parseDate(coupon.validFrom));
      setValue('validTo', parseDate(coupon.validTo));

      // Determine application type and set selected products/categories
      if (coupon.rawApplicableProducts && coupon.rawApplicableProducts.length > 0) {
        // Has specific products selected
        console.log('Setting specific products:', coupon.rawApplicableProducts);
        setApplicationType('specific');
        setValue('applicationType', applicationTypeOptions.find(opt => opt.value === 'specific'));
        
        // Pre-select products - match by ID
        const selectedProducts = productOptions.filter(product => 
          coupon.rawApplicableProducts.includes(product.value)
        );
        console.log('Matched products:', selectedProducts);
        setValue('specificProducts', selectedProducts);
      } else if (coupon.rawApplicableCategories && !coupon.rawApplicableCategories.includes('all')) {
        // Has category selected
        console.log('Setting category:', coupon.rawApplicableCategories);
        setApplicationType('category');
        setValue('applicationType', applicationTypeOptions.find(opt => opt.value === 'category'));
        setValue('category', categoryOptions.find(opt => coupon.rawApplicableCategories.includes(opt.value)));
      } else {
        // All products
        console.log('Setting all products');
        setApplicationType('all');
        setValue('applicationType', applicationTypeOptions.find(opt => opt.value === 'all'));
      }
    }
  }, [coupon, isOpen, productData, setValue]);

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: '10px',
      border: `2px solid ${errors.discountType || errors.status ? '#dc3545' : 'var(--sand-300)'}`,
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

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
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
        status: data.status.value,
        applicableCategories: ['all']
      };

      // Handle application type
      if (data.applicationType.value === 'category' && data.category) {
        couponData.applicableCategories = [data.category.value];
        couponData.applicableProducts = [];
      } else if (data.applicationType.value === 'specific' && data.specificProducts) {
        couponData.applicableProducts = data.specificProducts.map(p => p.value);
        couponData.applicableCategories = [];
      } else {
        couponData.applicableCategories = ['all'];
        couponData.applicableProducts = [];
      }

      const res = await dispatch(UpdateCoupon({ id: coupon.id, data: couponData }));
      
      if (res?.payload?.status === "success") {
        toast.success("Coupon updated successfully!");
        dispatch(GetCoupons());
        setIsSubmitting(false);
        handleClose();
      } else {
        toast.error(res?.payload?.message || "Something went wrong!");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error updating coupon:', error);
      toast.error('Failed to update coupon');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen || !coupon) return null;

  return (
    <>
      {isSubmitting && <SprayLoader />}
      
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

      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        borderRadius: '16px',
        width: '90%',
        maxWidth: '900px',
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
          <div>
            <h3 style={{
              margin: 0,
              color: 'var(--sand-900)',
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.8rem',
              fontWeight: '700'
            }}>
              Edit Coupon
            </h3>
            <p style={{ margin: '0.25rem 0 0 0', color: 'var(--sand-600)', fontSize: '0.9rem' }}>
              Update coupon information
            </p>
          </div>
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
                className="form-control"
                {...register('code', { required: 'Coupon code is required' })}
                placeholder="SAVE20"
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: `2px solid ${errors.code ? '#dc3545' : 'var(--sand-300)'}`,
                  fontSize: '0.95rem',
                  textTransform: 'uppercase'
                }}
              />
              {errors.code && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem' }}>
                  {errors.code.message}
                </small>
              )}
            </div>

            {/* Status */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Status <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <Controller
                name="status"
                control={control}
                rules={{ required: 'Status is required' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={statusOptions}
                    placeholder="Select status"
                    styles={customSelectStyles}
                  />
                )}
              />
              {errors.status && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem' }}>
                  {errors.status.message}
                </small>
              )}
            </div>

            {/* Description */}
            <div className="col-12">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Description
              </label>
              <textarea
                className="form-control"
                {...register('description')}
                rows="2"
                placeholder="Enter coupon description"
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: '2px solid var(--sand-300)',
                  fontSize: '0.95rem',
                  resize: 'vertical'
                }}
              />
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
                    placeholder="Select type"
                    styles={customSelectStyles}
                  />
                )}
              />
              {errors.discountType && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem' }}>
                  {errors.discountType.message}
                </small>
              )}
            </div>

            {/* Discount Value */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Discount Value <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                {...register('discountValue', { 
                  required: 'Discount value is required',
                  min: { value: 0, message: 'Value cannot be negative' }
                })}
                placeholder="20"
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: `2px solid ${errors.discountValue ? '#dc3545' : 'var(--sand-300)'}`,
                  fontSize: '0.95rem'
                }}
              />
              {errors.discountValue && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem' }}>
                  {errors.discountValue.message}
                </small>
              )}
            </div>

            {/* Min Order Value */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Minimum Order Value (₹) <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="number"
                className="form-control"
                {...register('minOrderValue', { 
                  required: 'Minimum order value is required',
                  min: { value: 0, message: 'Value cannot be negative' }
                })}
                placeholder="1000"
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: `2px solid ${errors.minOrderValue ? '#dc3545' : 'var(--sand-300)'}`,
                  fontSize: '0.95rem'
                }}
              />
              {errors.minOrderValue && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem' }}>
                  {errors.minOrderValue.message}
                </small>
              )}
            </div>

            {/* Max Discount */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Maximum Discount (₹)
              </label>
              <input
                type="number"
                className="form-control"
                {...register('maxDiscount')}
                placeholder="500"
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: '2px solid var(--sand-300)',
                  fontSize: '0.95rem'
                }}
              />
              <small style={{ color: 'var(--sand-600)', fontSize: '0.8rem' }}>
                Leave empty for no limit
              </small>
            </div>

            {/* Usage Limit */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Usage Limit
              </label>
              <input
                type="number"
                className="form-control"
                {...register('usageLimit')}
                placeholder="100"
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: '2px solid var(--sand-300)',
                  fontSize: '0.95rem'
                }}
              />
              <small style={{ color: 'var(--sand-600)', fontSize: '0.8rem' }}>
                Leave empty for unlimited
              </small>
            </div>

            {/* Valid From */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Valid From <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="date"
                className="form-control"
                {...register('validFrom', { required: 'Start date is required' })}
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: `2px solid ${errors.validFrom ? '#dc3545' : 'var(--sand-300)'}`,
                  fontSize: '0.95rem'
                }}
              />
              {errors.validFrom && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem' }}>
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
                {...register('validTo', { required: 'End date is required' })}
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: `2px solid ${errors.validTo ? '#dc3545' : 'var(--sand-300)'}`,
                  fontSize: '0.95rem'
                }}
              />
              {errors.validTo && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem' }}>
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
                background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 123, 255, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.3)';
              }}
            >
              {isSubmitting ? 'Updating...' : 'Update Coupon'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
