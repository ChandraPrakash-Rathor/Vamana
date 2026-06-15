import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import SplashScreen from './components/common/SplashScreen';
import ScrollToTopOnRouteChange from './components/common/ScrollToTopOnRouteChange';
import AuthModal from './components/common/AuthModal';
import ThemeProvider from './components/common/ThemeProvider';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Offers from './pages/Offers';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Invoice from './pages/Invoice';
import Sale from './pages/Sale';
import TrackOrder from './pages/TrackOrder';
import ReturnsPage from './pages/Returns';
import ShippingInfo from './pages/ShippingInfo';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';
import { getCurrentUser } from './redux/apis/AuthApi';
import { getCart } from './redux/apis/CartApi';

function App() {
  const dispatch = useDispatch();
  const [showSplash, setShowSplash] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const authCheckInProgress = useRef(false); // prevents duplicate auth/me calls

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

// Check if user is logged in on app load
useEffect(() => {
    const token = localStorage.getItem('memberToken');
    if (!token) return; // No token — don't call auth/me at all

    if (authCheckInProgress.current) return; // Already in flight
    authCheckInProgress.current = true;

    dispatch(getCurrentUser()).then((result) => {
      authCheckInProgress.current = false;
      if (result.payload?.success) {
        dispatch(getCart());
      }
    }).catch(() => {
      authCheckInProgress.current = false;
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for unauthorized events
  useEffect(() => {
    const handleUnauthorized = () => {
      setShowAuthModal(true);
      setAuthModalTab('login');
    };

    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, []);

  // Global function to open auth modal
  useEffect(() => {
    window.openAuthModal = (tab = 'login') => {
      setAuthModalTab(tab);
      setShowAuthModal(true);
    };
  }, []);

  return (
    <ThemeProvider>
      <Router>
        {showSplash && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}
        <ScrollToTopOnRouteChange />
        <div className="d-flex flex-column min-vh-100">
          <Header onOpenAuth={() => setShowAuthModal(true)} />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/invoice/:orderId" element={<Invoice />} />
              <Route path="/sale" element={<Sale />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/returns" element={<ReturnsPage />} />
              <Route path="/shipping-info" element={<ShippingInfo />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <Footer />
        </div>

        {/* Auth Modal */}
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          defaultTab={authModalTab}
        />

        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </ThemeProvider>
  );
}

export default App;