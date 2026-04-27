import { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, faImage, faTrash, faCloudUploadAlt, faCrop, faCheck 
} from '@fortawesome/free-solid-svg-icons';
import SprayLoader from '../common/SprayLoader';
import { insertProduct, GetProduct } from '../../APIS/apis/ProductApi';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from "react-toastify";

export default function AddProductModal({ isOpen, onClose }) {
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [subImages, setSubImages] = useState([]);
  const [subImagePreviews, setSubImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actualPrice, setActualPrice] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const dispatch = useDispatch();
  const navgate = useDispatch();
 
  const [isCropping, setIsCropping] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [crop, setCrop] = useState({ unit: '%', width: 90, aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [cropType, setCropType] = useState(null); 
  const [cropIndex, setCropIndex] = useState(null);
  const imgRef = useRef(null);

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

 
  const watchActualPrice = watch('actualPrice', 0);
  const watchDiscount = watch('discount', 0);

 
  useEffect(() => {
    const price = parseFloat(watchActualPrice) || 0;
    const discount = parseFloat(watchDiscount) || 0;
    
    setActualPrice(price);
    setDiscountPercent(discount);
    
    if (discount > 0 && discount <= 100) {
      const discountAmount = (price * discount) / 100;
      const final = price - discountAmount;
      setFinalPrice(final);
    } else {
      setFinalPrice(price);
    }
  }, [watchActualPrice, watchDiscount]);

  // Reset volume when category changes so wrong options don't carry over
  const watchCategory = watch('category');
  useEffect(() => {
    setValue('volume', '');
  }, [watchCategory?.value]);

  // Custom styles for react-select
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

  // Handle main image upload
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

  // Handle sub images upload
  const handleSubImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + subImages.length > 5) {
      alert('You can upload maximum 5 sub images');
      return;
    }

    // For sub images, add them directly without cropping
    // Or you can enable cropping for each by modifying this
    setSubImages([...subImages, ...files]);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSubImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Open crop modal for main image
  const openCropModal = () => {
    if (mainImagePreview) {
      setCropImageSrc(mainImagePreview);
      setCropType('main');
      setCrop({ unit: '%', width: 50, height: 50, x: 25, y: 25 }); // Reset crop
      setIsCropping(true);
    }
  };

  // Open crop modal for sub image
  const openSubImageCrop = (index) => {
    setCropImageSrc(subImagePreviews[index]);
    setCropType('sub');
    setCropIndex(index);
    setCrop({ unit: '%', width: 50, height: 50, x: 25, y: 25 }); // Reset crop
    setIsCropping(true);
  };

  // Generate cropped image
  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }
        blob.name = 'cropped.jpg';
        resolve(blob);
      }, 'image/jpeg', 1);
    });
  };

  // Apply crop
  const handleCropComplete = async () => {
    if (!completedCrop || !imgRef.current) {
      return;
    }

    const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
    const croppedFile = new File([croppedBlob], 'cropped-image.jpg', { type: 'image/jpeg' });

    if (cropType === 'main') {
      setMainImage(croppedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
      };
      reader.readAsDataURL(croppedFile);
    } else if (cropType === 'sub' && cropIndex !== null) {
      // Update sub image
      const newSubImages = [...subImages];
      newSubImages[cropIndex] = croppedFile;
      setSubImages(newSubImages);

      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...subImagePreviews];
        newPreviews[cropIndex] = reader.result;
        setSubImagePreviews(newPreviews);
      };
      reader.readAsDataURL(croppedFile);
    }

    // Reset crop state
    setIsCropping(false);
    setCropImageSrc(null);
    setCropType(null);
    setCropIndex(null);
    setCompletedCrop(null);
  };

  // Cancel crop
  const handleCropCancel = () => {
    setIsCropping(false);
    setCropImageSrc(null);
    setCropType(null);
    setCropIndex(null);
    setCompletedCrop(null);
  };

  // Remove sub image
  const removeSubImage = (index) => {
    setSubImages(subImages.filter((_, i) => i !== index));
    setSubImagePreviews(subImagePreviews.filter((_, i) => i !== index));
  };

  // Remove main image
  const removeMainImage = () => {
    setMainImage(null);
    setMainImagePreview(null);
    // Reset the file input so user can select the same file again
    const fileInput = document.getElementById('mainImageInput');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Form submit
  const onSubmit = async (data) => {
    if (!mainImage) {
      alert('Please upload a main product image');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData
      const formData = new FormData();
      
      // Add text fields
      formData.append('name', data.name);
      formData.append('sku', data.sku);
      formData.append('category', data.category.value);
      formData.append('actualPrice', data.actualPrice);
      formData.append('discount', data.discount || 0);
      formData.append('finalPrice', finalPrice);
      formData.append('stock', data.stock);
      formData.append('volume', data.volume);
      formData.append('description', data.description);
      formData.append('subLine', data.subLine || '');
      
      // Add main image
      formData.append('mainImage', mainImage);
      
      // Add sub images
      subImages.forEach((image, index) => {
        formData.append(`subImages`, image); 
      });

      const res = await dispatch(insertProduct(formData));
      if (res?.payload?.status === 'success') {
        toast.success('Product added successfully!');
        dispatch(GetProduct());
        setIsSubmitting(false);
        handleClose();
      } else {
        // Don't close modal on error — let user fix and retry
        const errMsg = res?.payload?.message || res?.error?.message || 'Something went wrong. Please try again.';
        toast.error(errMsg);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to add product. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Close modal and reset
  const handleClose = () => {
    reset();
    setMainImage(null);
    setMainImagePreview(null);
    setSubImages([]);
    setSubImagePreviews([]);
    setActualPrice(0);
    setDiscountPercent(0);
    setFinalPrice(0);
    
    // Reset file inputs
    const mainInput = document.getElementById('mainImageInput');
    const subInput = document.getElementById('subImagesInput');
    if (mainInput) mainInput.value = '';
    if (subInput) subInput.value = '';
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {isSubmitting && <SprayLoader />}
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

      {/* Crop Modal */}
      {isCropping && (
        <>
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              zIndex: 10000,
              backdropFilter: 'blur(8px)'
            }}
            onClick={handleCropCancel}
          />
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '2rem',
            zIndex: 10001,
            maxWidth: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              <h4 style={{
                margin: 0,
                color: 'var(--sand-900)',
                fontFamily: "'Playfair Display', serif",
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '0.5rem'
              }}>
                <FontAwesomeIcon icon={faCrop} className="me-2" style={{ color: 'var(--sand-600)' }} />
                Crop Image
              </h4>
              <p style={{ margin: 0, color: 'var(--sand-600)', fontSize: '0.9rem' }}>
                Drag to adjust the crop area
              </p>
            </div>

            <div style={{ 
              maxWidth: '600px', 
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
              >
                <img
                  ref={imgRef}
                  src={cropImageSrc}
                  alt="Crop preview"
                  style={{ maxWidth: '100%', maxHeight: '60vh' }}
                />
              </ReactCrop>
            </div>

            <div style={{
              marginTop: '1.5rem',
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center'
            }}>
              <button
                type="button"
                onClick={handleCropCancel}
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
                type="button"
                onClick={handleCropComplete}
                style={{
                  padding: '0.75rem 2rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, var(--sand-600) 0%, var(--sand-700) 100%)',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(179, 135, 63, 0.3)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(179, 135, 63, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(179, 135, 63, 0.3)';
                }}
              >
                <FontAwesomeIcon icon={faCheck} />
                Apply Crop
              </button>
            </div>
          </div>
        </>
      )}

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
            fontWeight: '700'
          }}>
            Add New Product
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
            {/* Product Name */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Product Name <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., Eternal Rose"
                {...register('name', { 
                  required: 'Product name is required',
                  minLength: { value: 3, message: 'Name must be at least 3 characters' }
                })}
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: `2px solid ${errors.name ? '#dc3545' : 'var(--sand-300)'}`,
                  fontSize: '0.95rem'
                }}
              />
              {errors.name && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
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
                placeholder="e.g., PRF-001"
                {...register('sku', { 
                  required: 'SKU is required',
                  pattern: { value: /^[A-Z0-9-]+$/, message: 'SKU must contain only uppercase letters, numbers, and hyphens' }
                })}
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: `2px solid ${errors.sku ? '#dc3545' : 'var(--sand-300)'}`,
                  fontSize: '0.95rem'
                }}
              />
              {errors.sku && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                  {errors.sku.message}
                </small>
              )}
            </div>

            {/* Category */}
            <div className="col-12 col-md-4">
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
                    placeholder="Select Category"
                    styles={customSelectStyles}
                    isClearable
                  />
                )}
              />
              {errors.category && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                  {errors.category.message}
                </small>
              )}
            </div>

            {/* Price */}
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Actual Price (₹) <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="2499"
                {...register('actualPrice', { 
                  required: 'Actual price is required',
                  min: { value: 1, message: 'Price must be greater than 0' }
                })}
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: `2px solid ${errors.actualPrice ? '#dc3545' : 'var(--sand-300)'}`,
                  fontSize: '0.95rem'
                }}
              />
              {errors.actualPrice && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
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
                className="form-control"
                placeholder="0"
                {...register('discount', { 
                  min: { value: 0, message: 'Discount cannot be negative' },
                  max: { value: 100, message: 'Discount cannot exceed 100%' }
                })}
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: `2px solid ${errors.discount ? '#dc3545' : 'var(--sand-300)'}`,
                  fontSize: '0.95rem'
                }}
              />
              {errors.discount && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                  {errors.discount.message}
                </small>
              )}
            </div>

            {/* Final Price (Calculated) */}
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Final Price (₹)
              </label>
              <div style={{
                padding: '0.75rem',
                borderRadius: '10px',
                border: '2px solid var(--sand-400)',
                backgroundColor: 'var(--sand-100)',
                fontSize: '0.95rem',
                fontWeight: '700',
                color: 'var(--sand-900)',
                display: 'flex',
                alignItems: 'center',
                height: '50px'
              }}>
                ₹{finalPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                {discountPercent > 0 && (
                  <span style={{
                    marginLeft: 'auto',
                    fontSize: '0.8rem',
                    color: '#28a745',
                    fontWeight: '600',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '6px'
                  }}>
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
              {discountPercent > 0 && (
                <small style={{ color: 'var(--sand-600)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                  You save: ₹{(actualPrice - finalPrice).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </small>
              )}
            </div>

            {/* Stock */}
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Stock Quantity <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="50"
                {...register('stock', { 
                  required: 'Stock quantity is required',
                  min: { value: 0, message: 'Stock cannot be negative' }
                })}
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: `2px solid ${errors.stock ? '#dc3545' : 'var(--sand-300)'}`,
                  fontSize: '0.95rem'
                }}
              />
              {errors.stock && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                  {errors.stock.message}
                </small>
              )}
            </div>

            {/* Volume Selection — options depend on category */}
            <div className="col-12">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Available Volumes <span style={{ color: '#dc3545' }}>*</span>
              </label>
              {(() => {
                const selectedCategory = watchActualPrice !== undefined && watch('category')?.value;
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
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {volumes.map(({ value, label }) => (
                      <label
                        key={value}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.75rem 1.5rem',
                          borderRadius: '10px',
                          border: `2px solid ${errors.volume ? '#dc3545' : 'var(--sand-300)'}`,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          backgroundColor: 'white'
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
                          {...register('volume', { required: 'Please select a volume' })}
                          style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--sand-600)' }}
                          onChange={(e) => {
                            if (e.target.checked) {
                              e.target.parentElement.style.borderColor = 'var(--sand-600)';
                              e.target.parentElement.style.backgroundColor = 'var(--sand-100)';
                              e.target.parentElement.style.fontWeight = '700';
                            }
                          }}
                        />
                        <span style={{ fontSize: '0.95rem', color: 'var(--sand-900)' }}>{label}</span>
                      </label>
                    ))}
                  </div>
                );
              })()}
              {!watch('category') && (
                <small style={{ color: 'var(--sand-600)', fontSize: '0.85rem', marginTop: '0.4rem', display: 'block' }}>
                  Select a category first to see volume options
                </small>
              )}
              {errors.volume && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                  {errors.volume.message}
                </small>
              )}
            </div>

            {/* Description */}
            <div className="col-12">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Description <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Enter product description..."
                {...register('description', { 
                  required: 'Description is required',
                  minLength: { value: 20, message: 'Description must be at least 20 characters' }
                })}
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: `2px solid ${errors.description ? '#dc3545' : 'var(--sand-300)'}`,
                  fontSize: '0.95rem',
                  resize: 'vertical'
                }}
              />
              {errors.description && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
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
                placeholder="e.g. Perfume for Men / For Women / Unisex"
                {...register('subLine')}
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: '2px solid var(--sand-300)',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            {/* Main Image Upload */}
            <div className="col-12">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Main Product Image <span style={{ color: '#dc3545' }}>*</span>
              </label>
              
              {!mainImagePreview ? (
                <div
                  onClick={() => document.getElementById('mainImageInput').click()}
                  style={{
                    border: '2px dashed var(--sand-400)',
                    borderRadius: '12px',
                    padding: '2rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: 'var(--sand-100)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--sand-600)';
                    e.currentTarget.style.backgroundColor = 'var(--sand-200)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--sand-400)';
                    e.currentTarget.style.backgroundColor = 'var(--sand-100)';
                  }}
                >
                  <FontAwesomeIcon icon={faCloudUploadAlt} style={{ fontSize: '3rem', color: 'var(--sand-600)', marginBottom: '1rem' }} />
                  <p style={{ margin: 0, color: 'var(--sand-700)', fontWeight: '500' }}>
                    Click to upload main image
                  </p>
                  <small style={{ color: 'var(--sand-600)' }}>PNG, JPG up to 5MB</small>
                </div>
              ) : (
                <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                  <img 
                    src={mainImagePreview} 
                    alt="Main preview" 
                    style={{
                      width: '100%',
                      maxHeight: '300px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      border: '2px solid var(--sand-300)'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap'
                  }}>
                    <button
                      type="button"
                      onClick={() => document.getElementById('mainImageInput').click()}
                      style={{
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.5rem 0.75rem',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <FontAwesomeIcon icon={faImage} />
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={openCropModal}
                      style={{
                        background: 'var(--sand-600)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.5rem 0.75rem',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <FontAwesomeIcon icon={faCrop} />
                      Crop
                    </button>
                    <button
                      type="button"
                      onClick={removeMainImage}
                      style={{
                        background: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.5rem 0.75rem',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} className="me-1" />
                      Remove
                    </button>
                  </div>
                </div>
              )}
              
              <input
                id="mainImageInput"
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                style={{ display: 'none' }}
              />
            </div>

            {/* Sub Images Upload */}
            <div className="col-12">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Additional Images (Max 5)
              </label>
              
              <div
                onClick={() => document.getElementById('subImagesInput').click()}
                style={{
                  border: '2px dashed var(--sand-400)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: 'var(--sand-100)',
                  transition: 'all 0.3s ease',
                  marginBottom: '1rem'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--sand-600)';
                  e.currentTarget.style.backgroundColor = 'var(--sand-200)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--sand-400)';
                  e.currentTarget.style.backgroundColor = 'var(--sand-100)';
                }}
              >
                <FontAwesomeIcon icon={faImage} style={{ fontSize: '2rem', color: 'var(--sand-600)', marginBottom: '0.5rem' }} />
                <p style={{ margin: 0, color: 'var(--sand-700)', fontWeight: '500', fontSize: '0.95rem' }}>
                  Click to upload additional images
                </p>
                <small style={{ color: 'var(--sand-600)' }}>
                  {subImages.length}/5 images uploaded
                </small>
              </div>

              <input
                id="subImagesInput"
                type="file"
                accept="image/*"
                multiple
                onChange={handleSubImagesChange}
                style={{ display: 'none' }}
              />

              {/* Sub Images Preview */}
              {subImagePreviews.length > 0 && (
                <div className="row g-3">
                  {subImagePreviews.map((preview, index) => (
                    <div key={index} className="col-6 col-md-4 col-lg-3">
                      <div style={{ position: 'relative' }}>
                        <img 
                          src={preview} 
                          alt={`Sub ${index + 1}`} 
                          style={{
                            width: '100%',
                            height: '150px',
                            objectFit: 'cover',
                            borderRadius: '10px',
                            border: '2px solid var(--sand-300)'
                          }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: '5px',
                          right: '5px',
                          display: 'flex',
                          gap: '0.3rem'
                        }}>
                          <button
                            type="button"
                            onClick={() => openSubImageCrop(index)}
                            style={{
                              background: 'var(--sand-600)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '0.3rem 0.5rem',
                              cursor: 'pointer',
                              fontSize: '0.8rem'
                            }}
                          >
                            <FontAwesomeIcon icon={faCrop} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeSubImage(index)}
                            style={{
                              background: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '0.3rem 0.5rem',
                              cursor: 'pointer',
                              fontSize: '0.8rem'
                            }}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                background: isSubmitting 
                  ? 'var(--sand-400)' 
                  : 'linear-gradient(135deg, var(--sand-600) 0%, var(--sand-700) 100%)',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(179, 135, 63, 0.3)',
                transition: 'all 0.3s ease'
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
                  <span className="ms-2">Adding Product...</span>
                </>
              ) : (
                'Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
