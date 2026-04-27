import { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, faImage, faTrash, faCloudUploadAlt
} from '@fortawesome/free-solid-svg-icons';
import SprayLoader from '../common/SprayLoader';
import { GetProduct, UpdateProduct } from '../../APIS/apis/ProductApi';
import { useDispatch } from 'react-redux';
import { toast } from "react-toastify";

export default function EditProductModal({ isOpen, onClose, product }) {
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [subImages, setSubImages] = useState([]);
  const [subImagePreviews, setSubImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finalPrice, setFinalPrice] = useState(0);
  const originalCategory = useRef(null); // store product's original category
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    setValue
  } = useForm();

  const categoryOptions = [
    { value: 'perfume', label: 'Perfume' },
    { value: 'attar', label: 'Attar' },
    { value: 'combo', label: 'Combo' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'out-of-stock', label: 'Out of Stock' }
  ];

  const watchActualPrice = watch('actualPrice', 0);
  const watchDiscount = watch('discount', 0);

  // Calculate final price
  useEffect(() => {
    const price = parseFloat(watchActualPrice) || 0;
    const discount = parseFloat(watchDiscount) || 0;
    
    if (discount > 0 && discount <= 100) {
      const discountAmount = (price * discount) / 100;
      const final = price - discountAmount;
      setFinalPrice(final);
    } else {
      setFinalPrice(price);
    }
  }, [watchActualPrice, watchDiscount]);

  // Prefill form when product changes
  useEffect(() => {
    if (product && isOpen) {
      originalCategory.current = product.category; // remember original category
      setValue('name', product.name);
      setValue('sku', `PRF-${String(product.id).padStart(4, '0')}`);
      setValue('category', categoryOptions.find(opt => opt.value === product.category));
      setValue('actualPrice', product.actualPrice);
      setValue('discount', product.discount || 0);
      setValue('stock', product.stock);
      setValue('volume', product.volume || '');
      setValue('description', product.description || '');
      setValue('subLine', product.subLine || '');
      setValue('status', statusOptions.find(opt => opt.value === product.status));

      setMainImagePreview(product.image);
      setSubImagePreviews(product.subImages || []);
      setFinalPrice(product.price);
    }
  }, [product, isOpen, setValue]);

  // Reset volume only when admin manually changes to a DIFFERENT category
  const watchCategory = watch('category');
  useEffect(() => {
    if (!watchCategory?.value) return;
    // If it matches the original product category, it's just the prefill — don't reset
    if (watchCategory.value === originalCategory.current) return;
    setValue('volume', '');
  }, [watchCategory?.value]);

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: '10px',
      border: `2px solid ${errors.category ? '#dc3545' : 'var(--sand-300)'}`,
      padding: '0.3rem',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(179, 135, 63, 0.1)' : 'none',
      borderColor: state.isFocused ? 'var(--sand-600)' : errors.category ? '#dc3545' : 'var(--sand-300)',
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

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + subImages.length > 5) {
      alert('You can upload maximum 5 sub images');
      return;
    }

    setSubImages([...subImages, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSubImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeSubImage = (index) => {
    setSubImages(subImages.filter((_, i) => i !== index));
    setSubImagePreviews(subImagePreviews.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      // Check if we have new images to upload
      const hasNewImages = mainImage || subImages.length > 0;
      
      let requestData;
      
      if (hasNewImages) {
        // Use FormData if we have new images
        const formData = new FormData();
        
        // Create data object
        const productData = {
          name: data.name,
          sku: data.sku,
          category: data.category.value,
          actualPrice: data.actualPrice,
          discount: data.discount || 0,
          finalPrice: finalPrice,
          stock: data.stock,
          volume: data.volume,
          description: data.description,
          subLine: data.subLine || '',
          status: data.status.value
        };

        formData.append('data', JSON.stringify(productData));
        
        // Add main image if new one selected
        if (mainImage) {
          formData.append('mainImage', mainImage);
        }
        
        // Add sub images if new ones selected
        subImages.forEach((image) => {
          formData.append(`subImages`, image);
        });
        
        requestData = formData;
      } else {
        // Use JSON if no new images
        requestData = {
          name: data.name,
          sku: data.sku,
          category: data.category.value,
          actualPrice: data.actualPrice,
          discount: data.discount || 0,
          finalPrice: finalPrice,
          stock: data.stock,
          volume: data.volume,
          description: data.description,
          subLine: data.subLine || '',
          status: data.status.value
        };
      }

      const res = await dispatch(UpdateProduct({ id: product.id, data: requestData }));
      
      if (res?.payload?.success === true) {
        toast.success("Product updated successfully!");
        dispatch(GetProduct());
        handleClose();
      } else {
        toast.error(res?.payload?.message || 'Failed to update product');
      }
      
      setIsSubmitting(false);

    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setMainImage(null);
    setMainImagePreview(null);
    setSubImages([]);
    setSubImagePreviews([]);
    setFinalPrice(0);
    onClose();
  };

  if (!isOpen || !product) return null;

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
        maxWidth: '1200px',
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
              Edit Product
            </h3>
            <p style={{ margin: '0.25rem 0 0 0', color: 'var(--sand-600)', fontSize: '0.9rem' }}>
              Update product information
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
            {/* Product Name */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Product Name <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                {...register('name', { required: 'Product name is required' })}
                placeholder="Enter product name"
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: `2px solid ${errors.name ? '#dc3545' : 'var(--sand-300)'}`,
                  fontSize: '0.95rem'
                }}
              />
              {errors.name && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem' }}>
                  {errors.name.message}
                </small>
              )}
            </div>

            {/* SKU */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                SKU <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                {...register('sku', { required: 'SKU is required' })}
                placeholder="PRF-0001"
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: `2px solid ${errors.sku ? '#dc3545' : 'var(--sand-300)'}`,
                  fontSize: '0.95rem',
                  fontFamily: 'monospace'
                }}
              />
              {errors.sku && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem' }}>
                  {errors.sku.message}
                </small>
              )}
            </div>

            {/* Category */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Category <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <Controller
                name="category"
                control={control}
                rules={{ required: 'Category is required' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={categoryOptions}
                    placeholder="Select category"
                    styles={customSelectStyles}
                  />
                )}
              />
              {errors.category && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem' }}>
                  {errors.category.message}
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

            {/* Stock */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Stock Quantity <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="number"
                className="form-control"
                {...register('stock', { 
                  required: 'Stock is required',
                  min: { value: 0, message: 'Stock cannot be negative' }
                })}
                placeholder="0"
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: `2px solid ${errors.stock ? '#dc3545' : 'var(--sand-300)'}`,
                  fontSize: '0.95rem'
                }}
              />
              {errors.stock && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem' }}>
                  {errors.stock.message}
                </small>
              )}
            </div>

            {/* Actual Price */}
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Actual Price (₹) <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                {...register('actualPrice', { 
                  required: 'Price is required',
                  min: { value: 0, message: 'Price cannot be negative' }
                })}
                placeholder="0.00"
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: `2px solid ${errors.actualPrice ? '#dc3545' : 'var(--sand-300)'}`,
                  fontSize: '0.95rem'
                }}
              />
              {errors.actualPrice && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem' }}>
                  {errors.actualPrice.message}
                </small>
              )}
            </div>

            {/* Discount */}
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Discount (%)
              </label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                {...register('discount', {
                  min: { value: 0, message: 'Discount cannot be negative' },
                  max: { value: 100, message: 'Discount cannot exceed 100%' }
                })}
                placeholder="0"
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: `2px solid ${errors.discount ? '#dc3545' : 'var(--sand-300)'}`,
                  fontSize: '0.95rem'
                }}
              />
              {errors.discount && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem' }}>
                  {errors.discount.message}
                </small>
              )}
            </div>

            {/* Final Price */}
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Final Price (₹)
              </label>
              <input
                type="text"
                className="form-control"
                value={`₹${finalPrice.toFixed(2)}`}
                readOnly
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: '2px solid var(--sand-300)',
                  fontSize: '0.95rem',
                  backgroundColor: 'var(--sand-100)',
                  fontWeight: '700',
                  color: '#28a745'
                }}
              />
            </div>

            {/* Volume — options depend on category */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Volume
              </label>
              {(() => {
                const isAttar = watch('category')?.value === 'attar';
                const volumes = isAttar
                  ? [
                      { value: '6ml',        label: '6ml' },
                      { value: '12ml',       label: '12ml' },
                      { value: '6ml & 12ml', label: 'Both (6ml & 12ml)' }
                    ]
                  : [
                      { value: '50ml',         label: '50ml' },
                      { value: '100ml',        label: '100ml' },
                      { value: '50ml & 100ml', label: 'Both (50ml & 100ml)' }
                    ];
                return (
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {volumes.map(({ value, label }) => (
                      <label
                        key={value}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.6rem 1.2rem',
                          borderRadius: '10px',
                          border: '2px solid var(--sand-300)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          backgroundColor: 'white',
                          fontSize: '0.9rem'
                        }}
                        onMouseEnter={(e) => {
                          if (!e.currentTarget.querySelector('input').checked) {
                            e.currentTarget.style.borderColor = 'var(--sand-600)';
                            e.currentTarget.style.backgroundColor = 'var(--sand-100)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!e.currentTarget.querySelector('input').checked) {
                            e.currentTarget.style.borderColor = 'var(--sand-300)';
                            e.currentTarget.style.backgroundColor = 'white';
                          }
                        }}
                      >
                        <input
                          type="radio"
                          value={value}
                          {...register('volume')}
                          style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--sand-600)' }}
                        />
                        <span style={{ color: 'var(--sand-900)' }}>{label}</span>
                      </label>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Description */}
            <div className="col-12">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Description <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <textarea
                className="form-control"
                {...register('description', { required: 'Description is required' })}
                rows="4"
                placeholder="Enter product description"
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: `2px solid ${errors.description ? '#dc3545' : 'var(--sand-300)'}`,
                  fontSize: '0.95rem',
                  resize: 'vertical'
                }}
              />
              {errors.description && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem' }}>
                  {errors.description.message}
                </small>
              )}
            </div>

            {/* Sub Line (e.g. Perfume for Men / Women / Unisex) */}
            <div className="col-12">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Sub Line <span style={{ color: 'var(--sand-600)', fontWeight: '400', fontSize: '0.85rem' }}>(e.g. Perfume for Men, For Women, Unisex)</span>
              </label>
              <input
                type="text"
                className="form-control"
                {...register('subLine')}
                placeholder="e.g. Perfume for Men / For Women / Unisex"
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: '2px solid var(--sand-300)',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            {/* Main Image */}
            <div className="col-12">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Main Product Image
              </label>
              <div style={{
                border: '2px dashed var(--sand-300)',
                borderRadius: '12px',
                padding: '2rem',
                textAlign: 'center',
                backgroundColor: 'var(--sand-50)',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--sand-600)';
                e.currentTarget.style.backgroundColor = 'var(--sand-100)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--sand-300)';
                e.currentTarget.style.backgroundColor = 'var(--sand-50)';
              }}>
                {mainImagePreview ? (
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img
                      src={mainImagePreview}
                      alt="Main preview"
                      style={{
                        maxWidth: '200px',
                        maxHeight: '200px',
                        borderRadius: '8px',
                        objectFit: 'cover'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setMainImage(null);
                        setMainImagePreview(null);
                      }}
                      style={{
                        position: 'absolute',
                        top: '-10px',
                        right: '-10px',
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <div style={{ marginTop: '1rem' }}>
                      <label
                        htmlFor="mainImageInput"
                        style={{
                          display: 'inline-block',
                          padding: '0.5rem 1rem',
                          backgroundColor: 'var(--sand-600)',
                          color: 'white',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '0.9rem'
                        }}
                      >
                        Change Image
                      </label>
                    </div>
                  </div>
                ) : (
                  <label htmlFor="mainImageInput" style={{ cursor: 'pointer', display: 'block' }}>
                    <FontAwesomeIcon icon={faCloudUploadAlt} style={{ fontSize: '3rem', color: 'var(--sand-400)', marginBottom: '1rem' }} />
                    <p style={{ margin: 0, color: 'var(--sand-700)', fontWeight: '600' }}>
                      Click to upload or drag and drop
                    </p>
                    <small style={{ color: 'var(--sand-500)' }}>PNG, JPG up to 5MB</small>
                  </label>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  style={{ display: 'none' }}
                  id="mainImageInput"
                />
              </div>
            </div>

            {/* Sub Images */}
            <div className="col-12">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Additional Images (Max 5)
              </label>
              <div style={{
                border: '2px dashed var(--sand-300)',
                borderRadius: '12px',
                padding: '1.5rem',
                backgroundColor: 'var(--sand-50)'
              }}>
                <div className="row g-3 mb-3">
                  {subImagePreviews.map((preview, index) => (
                    <div key={index} className="col-4 col-md-2">
                      <div style={{ position: 'relative' }}>
                        <img
                          src={preview}
                          alt={`Sub ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '100px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeSubImage(index)}
                          style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                            fontSize: '0.7rem'
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleSubImagesChange}
                    style={{ display: 'none' }}
                    id="subImagesInput"
                  />
                  <label
                    htmlFor="subImagesInput"
                    style={{
                      display: 'inline-block',
                      padding: '0.75rem 1.5rem',
                      backgroundColor: 'var(--sand-600)',
                      color: 'white',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--sand-700)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--sand-600)';
                    }}
                  >
                    <FontAwesomeIcon icon={faImage} className="me-2" />
                    {subImagePreviews.length > 0 ? 'Change Images' : 'Add Images'}
                  </label>
                  {subImagePreviews.length > 0 && (
                    <p style={{ 
                      marginTop: '0.5rem', 
                      marginBottom: 0, 
                      fontSize: '0.85rem', 
                      color: 'var(--sand-600)' 
                    }}>
                      {subImagePreviews.length} image{subImagePreviews.length !== 1 ? 's' : ''} selected (Max 5)
                    </p>
                  )}
                </div>
              </div>
            </div>
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
              {isSubmitting ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
