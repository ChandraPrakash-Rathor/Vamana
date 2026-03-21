import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt,
  faLock,
  faCreditCard,
  faShieldAlt,
  faCheckCircle,
  faTruck,
  faBox
} from '@fortawesome/free-solid-svg-icons';
import { 
  faCcVisa, 
  faCcMastercard, 
  faCcAmex, 
  faPaypal 
} from '@fortawesome/free-brands-svg-icons';
import Breadcrumb from '../components/common/Breadcrumb';
import { getCart, clearCart } from '../redux/apis/CartApi';
import { createOrder, verifyPayment } from '../redux/apis/OrderApi';
import { toast } from 'react-toastify';

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [processing, setProcessing] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  // Get cart and user data from Redux
  const { items, loading } = useSelector(state => state.CartSlice);
  const { user, isAuthenticated } = useSelector(state => state.AuthSlice);
  const { appliedCoupon } = useSelector(state => state.CouponSlice);

  // Fetch cart on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to checkout');
      navigate('/cart');
      return;
    }
    dispatch(getCart());
  }, [dispatch, isAuthenticated, navigate]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!loading && items && items.length === 0) {
      toast.info('Your cart is empty');
      navigate('/cart');
    }
  }, [items, loading, navigate]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Calculate totals from Redux cart items
  const subtotal = items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const shipping = subtotal >= 2000 ? 0 : 99; // Free shipping above ₹2000
  const total = subtotal - couponDiscount + shipping;

  const handleRazorpayPayment = async (orderData) => {
    try {
      setProcessing(true);

      // Step 1: Create order in backend
      const orderResponse = await dispatch(createOrder({
        userId: user._id || user.id,
        products: items.map(item => ({
          productId: item.product._id,
          quantity: item.quantity,
          price: item.price
        })),
        address: {
          firstName: orderData.firstName,
          lastName: orderData.lastName,
          email: orderData.email,
          phone: orderData.phone,
          address: orderData.address,
          city: orderData.city,
          state: orderData.state,
          pincode: orderData.pincode
        },
        totalAmount: total
      })).unwrap();

      // Get primary color from CSS variable for Razorpay theme
      const primaryColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--sand-600').trim();

      // Step 2: Open Razorpay payment modal
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: orderResponse.amount,
        currency: 'INR',
        name: 'Vamana Perfumes',
        description: 'Order Payment',
        order_id: orderResponse.razorpayOrderId,
        handler: async function (response) {
          // Step 3: Verify payment
          try {
            await dispatch(verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })).unwrap();

            // Clear cart after successful payment
            await dispatch(clearCart());

            toast.success('Payment successful! Order placed.');
            navigate(`/invoice/${orderResponse.orderId}`);
          } catch (error) {
            toast.error('Payment verification failed');
            console.error('Verification error:', error);
          }
        },
        prefill: {
          name: `${orderData.firstName} ${orderData.lastName}`,
          email: orderData.email,
          contact: orderData.phone
        },
        theme: {
          color: primaryColor || '#B3873F'
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
            toast.info('Payment cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setProcessing(false);

    } catch (error) {
      setProcessing(false);
      toast.error(error.message || 'Failed to create order');
      console.error('Order creation error:', error);
    }
  };

  const handleCODPayment = async (orderData) => {
    try {
      setProcessing(true);

      // Create order with COD payment method
      const orderResponse = await dispatch(createOrder({
        userId: user._id || user.id,
        products: items.map(item => ({
          productId: item.product._id,
          quantity: item.quantity,
          price: item.price
        })),
        address: {
          firstName: orderData.firstName,
          lastName: orderData.lastName,
          email: orderData.email,
          phone: orderData.phone,
          address: orderData.address,
          city: orderData.city,
          state: orderData.state,
          pincode: orderData.pincode
        },
        totalAmount: total,
        paymentMethod: 'cod'
      })).unwrap();

      // Clear cart after successful order
      await dispatch(clearCart());

      toast.success('Order placed successfully! Pay on delivery.');
      navigate(`/invoice/${orderResponse.orderId}`);
      setProcessing(false);

    } catch (error) {
      setProcessing(false);
      toast.error(error.message || 'Failed to create order');
      console.error('Order creation error:', error);
    }
  };

  const onSubmit = (data) => {
    if (paymentMethod === 'razorpay') {
      handleRazorpayPayment(data);
    } else if (paymentMethod === 'cod') {
      handleCODPayment(data);
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--sand-100)', minHeight: '100vh', paddingTop: '90px' }}>
        <div className="container py-5 text-center">
          <div className="spinner-border" role="status" style={{ color: 'var(--sand-600)' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }
