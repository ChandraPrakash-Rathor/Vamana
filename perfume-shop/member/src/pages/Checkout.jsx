import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, faLock, faCreditCard,
  faShieldAlt, faTruck, faBox, faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import { faCcVisa, faCcMastercard, faCcAmex } from '@fortawesome/free-brands-svg-icons';
import { getCart, clearCart } from '../redux/apis/CartApi';
import { createOrder, verifyPayment } from '../redux/apis/OrderApi';
import { toast } from 'react-toastify';

const INDIA_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Andaman and Nicobar Islands","Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu","Delhi","Jammu and Kashmir",
  "Ladakh","Lakshadweep","Puducherry"
];

// Combobox: dropdown + "Other" fallback to text input
function ComboField({ label, options, value, onChange, error, loading, placeholder }) {
  const [useOther, setUseOther] = useState(false);

  const handleSelect = (e) => {
    if (e.target.value === '__other__') {
      setUseOther(true);
      onChange('');
    } else {
      setUseOther(false);
      onChange(e.target.value);
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.75rem', borderRadius: '10px',
    border: `2px solid ${error ? '#dc3545' : 'var(--sand-300)'}`,
    fontSize: '0.95rem', outline: 'none', background: 'white'
  };

  return (
    <div>
      <label style={{ fontWeight: '600', color: 'var(--sand-800)', marginBottom: '0.4rem', display: 'block' }}>
        {label} *
      </label>
      {!useOther ? (
        <div style={{ position: 'relative' }}>
          <select
            value={value || ''}
            onChange={handleSelect}
            disabled={loading}
            style={{ ...inputStyle, appearance: 'none', paddingRight: '2.5rem', cursor: 'pointer' }}
            onFocus={e => e.target.style.borderColor = 'var(--sand-600)'}
            onBlur={e => e.target.style.borderColor = error ? '#dc3545' : 'var(--sand-300)'}
          >
            <option value="">{loading ? 'Loading...' : placeholder}</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            <option value="__other__">Other (type manually)</option>
          </select>
          <FontAwesomeIcon icon={faChevronDown} style={{
            position: 'absolute', right: '0.9rem', top: '50%',
            transform: 'translateY(-50%)', color: 'var(--sand-500)', pointerEvents: 'none', fontSize: '0.8rem'
          }} />
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            autoFocus
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={`Type ${label.toLowerCase()}...`}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = 'var(--sand-600)'}
            onBlur={e => e.target.style.borderColor = error ? '#dc3545' : 'var(--sand-300)'}
          />
          <button type="button" onClick={() => { setUseOther(false); onChange(''); }}
            style={{ padding: '0 0.75rem', borderRadius: '10px', border: '2px solid var(--sand-300)', background: 'white', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--sand-600)', whiteSpace: 'nowrap' }}>
            ↩ List
          </button>
        </div>
      )}
      {error && <small style={{ color: '#dc3545' }}>{error}</small>}
    </div>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [processing, setProcessing] = useState(false);

  // State & City combobox state
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(false);

  // Address char count
  const [addressVal, setAddressVal] = useState('');
  const ADDRESS_MAX = 100;

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({ mode: 'onSubmit', reValidateMode: 'onSubmit' });

  const { items, loading } = useSelector(state => state.CartSlice);
  const { user, isAuthenticated } = useSelector(state => state.AuthSlice);
  const { appliedCoupon } = useSelector(state => state.CouponSlice);

  useEffect(() => {
    if (!isAuthenticated) { toast.error('Please login to checkout'); navigate('/cart'); return; }
    dispatch(getCart());
  }, [dispatch, isAuthenticated, navigate]);

  useEffect(() => {
    if (!loading && items && items.length === 0) { toast.info('Your cart is empty'); navigate('/cart'); }
  }, [items, loading, navigate]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  // Fetch cities when state changes
  useEffect(() => {
    if (!selectedState) { setCities([]); setSelectedCity(''); return; }
    setCitiesLoading(true);
    setSelectedCity('');
    fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: 'India', state: selectedState })
    })
      .then(r => r.json())
      .then(data => { setCities(data.data || []); })
      .catch(() => setCities([]))
      .finally(() => setCitiesLoading(false));
  }, [selectedState]);

  // Sync combobox values into react-hook-form
  useEffect(() => { setValue('state', selectedState); }, [selectedState]);
  useEffect(() => { setValue('city', selectedCity); }, [selectedCity]);

  const subtotal = items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const shipping = subtotal >= 2000 ? 0 : 99;
  const total = subtotal - couponDiscount + shipping;

  const buildAddress = (data) => ({
    firstName: data.firstName, lastName: data.lastName,
    email: data.email, phone: data.phone,
    address: data.address, city: data.city,
    state: data.state, pincode: data.pincode
  });

  const handleRazorpayPayment = async (orderData) => {
    try {
      setProcessing(true);
      const orderResponse = await dispatch(createOrder({
        userId: user._id || user.id,
        products: items.map(item => ({ productId: item.product._id, quantity: item.quantity, price: item.price })),
        address: buildAddress(orderData),
        totalAmount: total
      })).unwrap();

      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--sand-600').trim();
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: orderResponse.amount,
        currency: 'INR',
        name: 'Vamana Perfumes',
        description: 'Order Payment',
        order_id: orderResponse.razorpayOrderId,
        handler: async (response) => {
          try {
            await dispatch(verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })).unwrap();
            await dispatch(clearCart());
            toast.success('Payment successful! Order placed.');
            navigate(`/invoice/${orderResponse.orderId}?new=true`);
          } catch { toast.error('Payment verification failed'); }
        },
        prefill: { name: `${orderData.firstName} ${orderData.lastName}`, email: orderData.email, contact: orderData.phone },
        theme: { color: primaryColor || '#B3873F' },
        modal: { ondismiss: () => { setProcessing(false); toast.info('Payment cancelled'); } }
      };
      new window.Razorpay(options).open();
      setProcessing(false);
    } catch (error) {
      setProcessing(false);
      toast.error(error.message || 'Failed to create order');
    }
  };

  const handleCODPayment = async (orderData) => {
    try {
      setProcessing(true);
      const orderResponse = await dispatch(createOrder({
        userId: user._id || user.id,
        products: items.map(item => ({ productId: item.product._id, quantity: item.quantity, price: item.price })),
        address: buildAddress(orderData),
        totalAmount: total,
        paymentMethod: 'cod'
      })).unwrap();
      await dispatch(clearCart());
      toast.success('Order placed successfully! Pay on delivery.');
      navigate(`/invoice/${orderResponse.orderId}?new=true`);
      setProcessing(false);
    } catch (error) {
      setProcessing(false);
      toast.error(error.message || 'Failed to create order');
    }
  };

  const onSubmit = (data) => {
    if (paymentMethod === 'razorpay') handleRazorpayPayment(data);
    else handleCODPayment(data);
  };

  const inputStyle = (hasError) => ({
    width: '100%', padding: '0.75rem', borderRadius: '10px',
    border: `2px solid ${hasError ? '#dc3545' : 'var(--sand-300)'}`,
    fontSize: '0.95rem', outline: 'none'
  });

  if (loading) return (
    <div style={{ backgroundColor: 'var(--sand-100)', minHeight: '100vh', paddingTop: '90px' }}>
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status" style={{ color: 'var(--sand-600)' }} />
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: 'var(--sand-50)', minHeight: '100vh', paddingTop: '90px' }}>
      <div className="container py-5" style={{ maxWidth: '1100px' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--sand-900)', marginBottom: '2rem', fontSize: '2rem' }}>
          Checkout
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row g-4">
            {/* Left - Shipping Details */}
            <div className="col-lg-7">
              <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
                <h5 style={{ color: 'var(--sand-900)', fontWeight: '700', marginBottom: '1.5rem' }}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '0.5rem', color: 'var(--sand-600)' }} />
                  Shipping Details
                </h5>

                <div className="row g-3">
                  {/* First Name */}
                  <div className="col-md-6">
                    <label style={{ fontWeight: '600', color: 'var(--sand-800)', marginBottom: '0.4rem', display: 'block' }}>First Name *</label>
                    <input {...register('firstName', { required: 'First name is required' })}
                      defaultValue={user?.name?.split(' ')[0] || ''}
                      style={inputStyle(errors.firstName)}
                      onFocus={e => e.target.style.borderColor = 'var(--sand-600)'}
                      onBlur={e => e.target.style.borderColor = errors.firstName ? '#dc3545' : 'var(--sand-300)'} />
                    {errors.firstName && <small style={{ color: '#dc3545' }}>{errors.firstName.message}</small>}
                  </div>

                  {/* Last Name */}
                  <div className="col-md-6">
                    <label style={{ fontWeight: '600', color: 'var(--sand-800)', marginBottom: '0.4rem', display: 'block' }}>Last Name *</label>
                    <input {...register('lastName', { required: 'Last name is required' })}
                      defaultValue={user?.name?.split(' ')[1] || ''}
                      style={inputStyle(errors.lastName)}
                      onFocus={e => e.target.style.borderColor = 'var(--sand-600)'}
                      onBlur={e => e.target.style.borderColor = errors.lastName ? '#dc3545' : 'var(--sand-300)'} />
                    {errors.lastName && <small style={{ color: '#dc3545' }}>{errors.lastName.message}</small>}
                  </div>

                  {/* Email */}
                  <div className="col-md-6">
                    <label style={{ fontWeight: '600', color: 'var(--sand-800)', marginBottom: '0.4rem', display: 'block' }}>Email *</label>
                    <input {...register('email', { required: 'Email is required' })}
                      defaultValue={user?.email || ''} type="email"
                      style={inputStyle(errors.email)}
                      onFocus={e => e.target.style.borderColor = 'var(--sand-600)'}
                      onBlur={e => e.target.style.borderColor = errors.email ? '#dc3545' : 'var(--sand-300)'} />
                    {errors.email && <small style={{ color: '#dc3545' }}>{errors.email.message}</small>}
                  </div>

                  {/* Phone */}
                  <div className="col-md-6">
                    <label style={{ fontWeight: '600', color: 'var(--sand-800)', marginBottom: '0.4rem', display: 'block' }}>Phone *</label>
                    <input {...register('phone', { required: 'Phone is required' })}
                      defaultValue={user?.phone || ''} type="tel"
                      style={inputStyle(errors.phone)}
                      onFocus={e => e.target.style.borderColor = 'var(--sand-600)'}
                      onBlur={e => e.target.style.borderColor = errors.phone ? '#dc3545' : 'var(--sand-300)'} />
                    {errors.phone && <small style={{ color: '#dc3545' }}>{errors.phone.message}</small>}
                  </div>

                  {/* Address with char limit */}
                  <div className="col-12">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <label style={{ fontWeight: '600', color: 'var(--sand-800)' }}>Address *</label>
                      <small style={{ color: addressVal.length > ADDRESS_MAX * 0.9 ? '#dc3545' : 'var(--sand-500)' }}>
                        {addressVal.length}/{ADDRESS_MAX}
                      </small>
                    </div>
                    <input
                      {...register('address', { required: 'Address is required', maxLength: { value: ADDRESS_MAX, message: `Max ${ADDRESS_MAX} characters` }, onChange: e => setAddressVal(e.target.value) })}
                      maxLength={ADDRESS_MAX}
                      placeholder="House no, Street, Area..."
                      style={inputStyle(errors.address)}
                      onFocus={e => e.target.style.borderColor = 'var(--sand-600)'}
                      onBlur={e => e.target.style.borderColor = errors.address ? '#dc3545' : 'var(--sand-300)'} />
                    {errors.address && <small style={{ color: '#dc3545' }}>{errors.address.message}</small>}
                  </div>

                  {/* Hidden fields for react-hook-form validation */}
                  <input type="hidden" {...register('state', { required: 'State is required' })} />
                  <input type="hidden" {...register('city', { required: 'City is required' })} />

                  {/* State Combobox */}
                  <div className="col-md-4">
                    <ComboField
                      label="State"
                      options={INDIA_STATES}
                      value={selectedState}
                      onChange={setSelectedState}
                      error={errors.state?.message}
                      placeholder="Select state"
                    />
                  </div>

                  {/* City Combobox */}
                  <div className="col-md-4">
                    <ComboField
                      label="City"
                      options={cities}
                      value={selectedCity}
                      onChange={setSelectedCity}
                      error={errors.city?.message}
                      loading={citiesLoading}
                      placeholder={selectedState ? 'Select city' : 'Select state first'}
                    />
                  </div>

                  {/* Pincode */}
                  <div className="col-md-4">
                    <label style={{ fontWeight: '600', color: 'var(--sand-800)', marginBottom: '0.4rem', display: 'block' }}>Pincode *</label>
                    <input {...register('pincode', { required: 'Pincode is required', pattern: { value: /^[1-9][0-9]{5}$/, message: 'Invalid pincode' } })}
                      type="tel" inputMode="numeric" maxLength={6} placeholder="6-digit pincode"
                      onKeyDown={e => { if (!/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)) e.preventDefault(); }}
                      style={inputStyle(errors.pincode)}
                      onFocus={e => e.target.style.borderColor = 'var(--sand-600)'}
                      onBlur={e => e.target.style.borderColor = errors.pincode ? '#dc3545' : 'var(--sand-300)'} />
                    {errors.pincode && <small style={{ color: '#dc3545' }}>{errors.pincode.message}</small>}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h5 style={{ color: 'var(--sand-900)', fontWeight: '700', marginBottom: '1.5rem' }}>
                  <FontAwesomeIcon icon={faCreditCard} style={{ marginRight: '0.5rem', color: 'var(--sand-600)' }} />
                  Payment Method
                </h5>
                <div className="d-flex flex-column gap-3">
                  {/* Razorpay */}
                  <div onClick={() => setPaymentMethod('razorpay')} style={{
                    padding: '1rem 1.5rem', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s ease',
                    border: `2px solid ${paymentMethod === 'razorpay' ? 'var(--sand-600)' : 'var(--sand-300)'}`,
                    backgroundColor: paymentMethod === 'razorpay' ? 'var(--sand-50)' : 'white'
                  }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-3">
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${paymentMethod === 'razorpay' ? 'var(--sand-600)' : 'var(--sand-400)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {paymentMethod === 'razorpay' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--sand-600)' }} />}
                        </div>
                        <div>
                          <div style={{ fontWeight: '700', color: 'var(--sand-900)' }}>
                            <FontAwesomeIcon icon={faShieldAlt} style={{ marginRight: '0.5rem', color: 'var(--sand-600)' }} />
                            Pay Online (Razorpay)
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--sand-600)' }}>Credit/Debit Card, UPI, Net Banking, Wallets</div>
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <FontAwesomeIcon icon={faCcVisa} style={{ fontSize: '1.8rem', color: '#1a1f71' }} />
                        <FontAwesomeIcon icon={faCcMastercard} style={{ fontSize: '1.8rem', color: '#eb001b' }} />
                        <FontAwesomeIcon icon={faCcAmex} style={{ fontSize: '1.8rem', color: '#007bc1' }} />
                      </div>
                    </div>
                  </div>

                  {/* COD - currently unavailable */}
                  {/* <div onClick={() => setPaymentMethod('cod')} style={{
                    padding: '1rem 1.5rem', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s ease',
                    border: `2px solid ${paymentMethod === 'cod' ? 'var(--sand-600)' : 'var(--sand-300)'}`,
                    backgroundColor: paymentMethod === 'cod' ? 'var(--sand-50)' : 'white'
                  }}>
                    <div className="d-flex align-items-center gap-3">
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${paymentMethod === 'cod' ? 'var(--sand-600)' : 'var(--sand-400)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {paymentMethod === 'cod' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--sand-600)' }} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', color: 'var(--sand-900)' }}>
                          <FontAwesomeIcon icon={faTruck} style={{ marginRight: '0.5rem', color: 'var(--sand-600)' }} />
                          Cash on Delivery (COD)
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--sand-600)' }}>Pay when your order arrives</div>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Right - Order Summary */}
            <div className="col-lg-5">
              <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', position: 'sticky', top: '100px' }}>
                <h5 style={{ color: 'var(--sand-900)', fontWeight: '700', marginBottom: '1.5rem' }}>
                  <FontAwesomeIcon icon={faBox} style={{ marginRight: '0.5rem', color: 'var(--sand-600)' }} />
                  Order Summary
                </h5>

                <div style={{ marginBottom: '1.5rem' }}>
                  {items?.map((item, index) => (
                    <div key={index} className="d-flex align-items-center gap-3 mb-3">
                      <img src={item.product?.mainImage} alt={item.product?.name}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                        onError={e => e.target.src = '/product4.jpg'} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', color: 'var(--sand-900)', fontSize: '0.9rem' }}>{item.product?.name}</div>
                        <div style={{ color: 'var(--sand-600)', fontSize: '0.85rem' }}>Qty: {item.quantity}</div>
                      </div>
                      <div style={{ fontWeight: '700', color: 'var(--sand-800)' }}>₹{(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--sand-200)', paddingTop: '1rem' }}>
                  <div className="d-flex justify-content-between mb-2">
                    <span style={{ color: 'var(--sand-700)' }}>Subtotal</span>
                    <span style={{ color: 'var(--sand-800)', fontWeight: '600' }}>₹{subtotal.toLocaleString()}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="d-flex justify-content-between mb-2">
                      <span style={{ color: '#10b981' }}>Coupon Discount</span>
                      <span style={{ color: '#10b981', fontWeight: '600' }}>-₹{couponDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between mb-2">
                    <span style={{ color: 'var(--sand-700)' }}>Shipping</span>
                    <span style={{ color: shipping === 0 ? '#10b981' : 'var(--sand-800)', fontWeight: '600' }}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  {shipping === 0 && (
                    <div style={{ fontSize: '0.8rem', color: '#10b981', backgroundColor: '#f0fdf4', padding: '0.5rem 0.75rem', borderRadius: '8px', marginBottom: '0.75rem' }}>
                      🎉 You qualify for free shipping!
                    </div>
                  )}
                  <div className="d-flex justify-content-between pt-3" style={{ borderTop: '2px solid var(--sand-600)' }}>
                    <span style={{ color: 'var(--sand-900)', fontWeight: '700', fontSize: '1.1rem' }}>Total</span>
                    <span style={{ color: 'var(--sand-800)', fontWeight: '700', fontSize: '1.2rem' }}>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <button type="submit" disabled={processing} style={{
                  width: '100%', padding: '1rem', marginTop: '1.5rem',
                  backgroundColor: processing ? 'var(--sand-400)' : 'var(--sand-600)',
                  color: 'white', border: 'none', borderRadius: '12px',
                  fontWeight: '700', fontSize: '1.1rem',
                  cursor: processing ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                }}
                  onMouseEnter={e => { if (!processing) e.target.style.backgroundColor = 'var(--sand-700)'; }}
                  onMouseLeave={e => { if (!processing) e.target.style.backgroundColor = 'var(--sand-600)'; }}>
                  {processing ? (
                    <><span className="spinner-border spinner-border-sm" role="status" /> Processing...</>
                  ) : (
                    <><FontAwesomeIcon icon={faLock} /> {paymentMethod === 'cod' ? 'Place Order (COD)' : 'Pay Now'}</>
                  )}
                </button>

                <div className="text-center mt-3" style={{ color: 'var(--sand-600)', fontSize: '0.85rem' }}>
                  <FontAwesomeIcon icon={faShieldAlt} style={{ marginRight: '0.4rem' }} />
                  Secure & Encrypted Payment
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
