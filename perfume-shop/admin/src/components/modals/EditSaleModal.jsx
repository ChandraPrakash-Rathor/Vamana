import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, faTags, faPercent
} from '@fortawesome/free-solid-svg-icons';
import SprayLoader from '../common/SprayLoader';
import { UpdateSale, GetSales } from '../../APIS/apis/SaleApi';
import { GetProduct } from '../../APIS/apis/ProductApi';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from "react-toastify";

export default function EditSaleModal({ isOpen, onClose, sale }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const hasInitialized = useRef(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
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
    price: product.finalPrice || product.actualPrice,
    name: product.name
  })) || [];

  // Prefill form when sale changes
  useEffect(() => {
    if (sale && isOpen && productData && productData.length > 0 && !hasInitialized.current) {
      // Convert date strings to YYYY-MM-DD format
      const parseDate = (dateStr) => {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
      reset({
        name: sale.name,
        description: sale.description,
        discount: sale.discount,
        startDate: parseDate(sale.startDate),
        endDate: parseDate(sale.endDate)
      });

      // Pre-select products
      if (sale.rawApplicableProducts && sale.rawApplicableProducts.length > 0) {
        const selectedProducts = productOptions.filter(product => 
          sale.rawApplicableProducts.includes(product.value)
        );
        setSelectedProducts(selectedProducts);
      } else {
        setSelectedProducts([]);
      }
      
      hasInitialized.current = true;
    }
  }, [sale, isOpen, productData, reset]);

  // Reset initialization flag when modal closes
  useEffect(() => {
    if (!isOpen) {
      hasInitialized.current = false;
    }
  }, [isOpen]);

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: '10px',
      border: `2px solid ${errors.products ? '#dc3545' : 'var(--sand-300)'}`,
      padding: '0.3rem',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(179, 135, 63, 0.1)' : 'none',
      borderColor: state.isFocused ? 'var(--sand-600)' : errors.products ? '#dc3545' : 'var(--sand-300)',
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

  const handleProductsChange = (selected) => {
    setSelectedProducts(selected || []);
  };

  const onSubmit = async (data) => {
    if (selectedProducts.length === 0) {
      toast.error('Please select at least one product for the sale');
      return;
    }

    setIsSubmitting(true);

    try {
      const saleData = {
        name: data.name,
        description: data.description,
        discount: Number(data.discount),
        startDate: data.startDate,
        endDate: data.endDate,
        applicableProducts: selectedProducts.map(p => p.value),
        productsCount: selectedProducts.length
      };

      const res = await dispatch(UpdateSale({ id: sale.id, data: saleData }));
      
      if (res?.payload?.status === "success") {
        toast.success("Sale updated successfully!");
        dispatch(GetSales());
        handleClose();
      } else {
        toast.error(res?.payload?.message || "Failed to update sale");
      }
    } catch (error) {
      console.error('Error updating sale:', error);
      toast.error('Failed to update sale. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedProducts([]);
    onClose();
  };

  if (!isOpen || !sale) return null;

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
            <FontAwesomeIcon icon={faTags} style={{ color: 'var(--sand-600)' }} />
            Edit Sale
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
            {/* Sale Name */}
            <div className="col-12">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Sale Name <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., Diwali Sale 2024, New Year Sale"
                {...register('name', { 
                  required: 'Sale name is required',
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

            {/* Description */}
            <div className="col-12">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Description <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Describe your sale event..."
                {...register('description', { 
                  required: 'Description is required',
                  minLength: { value: 10, message: 'Description must be at least 10 characters' }
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

            {/* Discount Percentage */}
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Discount (%) <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  className="form-control"
                  placeholder="30"
                  {...register('discount', { 
                    required: 'Discount is required',
                    min: { value: 1, message: 'Discount must be at least 1%' },
                    max: { value: 100, message: 'Discount cannot exceed 100%' }
                  })}
                  style={{
                    padding: '0.75rem',
                    paddingLeft: '2.5rem',
                    borderRadius: '10px',
                    border: `2px solid ${errors.discount ? '#dc3545' : 'var(--sand-300)'}`,
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
                  <FontAwesomeIcon icon={faPercent} />
                </span>
              </div>
              {errors.discount && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                  {errors.discount.message}
                </small>
              )}
            </div>

            {/* Start Date */}
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Start Date <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="date"
                className="form-control"
                {...register('startDate', { 
                  required: 'Start date is required'
                })}
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: `2px solid ${errors.startDate ? '#dc3545' : 'var(--sand-300)'}`,
                  fontSize: '0.95rem'
                }}
              />
              {errors.startDate && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                  {errors.startDate.message}
                </small>
              )}
            </div>

            {/* End Date */}
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                End Date <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="date"
                className="form-control"
                {...register('endDate', { 
                  required: 'End date is required'
                })}
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: `2px solid ${errors.endDate ? '#dc3545' : 'var(--sand-300)'}`,
                  fontSize: '0.95rem'
                }}
              />
              {errors.endDate && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                  {errors.endDate.message}
                </small>
              )}
            </div>

            {/* Select Products */}
            <div className="col-12">
              <label className="form-label fw-semibold" style={{ color: 'var(--sand-900)' }}>
                Select Products for Sale <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <Select
                options={productOptions}
                value={selectedProducts}
                onChange={handleProductsChange}
                placeholder={productOptions.length === 0 ? "Loading products..." : "Select products to include in this sale..."}
                styles={customSelectStyles}
                isMulti
                closeMenuOnSelect={false}
                isLoading={productOptions.length === 0}
                isDisabled={productOptions.length === 0}
              />
              <small style={{ color: 'var(--sand-600)', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                <FontAwesomeIcon icon={faTags} className="me-1" />
                Selected products will have the discount applied automatically
              </small>
              {selectedProducts.length === 0 && (
                <small style={{ color: '#dc3545', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                  Please select at least one product
                </small>
              )}
            </div>

            {/* Selected Products Preview */}
            {selectedProducts.length > 0 && (
              <div className="col-12">
                <div style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  backgroundColor: 'var(--sand-100)',
                  border: '2px solid var(--sand-300)'
                }}>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: 'var(--sand-900)',
                    marginBottom: '0.75rem'
                  }}>
                    Selected Products ({selectedProducts.length})
                  </div>
                  <div className="row g-2">
                    {selectedProducts.map((product, index) => (
                      <div key={index} className="col-12 col-md-6">
                        <div style={{
                          padding: '0.5rem 0.75rem',
                          borderRadius: '8px',
                          backgroundColor: 'white',
                          border: '1px solid var(--sand-300)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span style={{ fontSize: '0.85rem', color: 'var(--sand-900)' }}>
                            {product.label}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
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
                  : 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                color: 'white',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(0, 123, 255, 0.3)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 123, 255, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.3)';
                }
              }}
            >
              {isSubmitting ? (
                <>
                  <SprayLoader size="small" color="white" />
                  <span>Updating Sale...</span>
                </>
              ) : (
                <span>Update Sale</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
