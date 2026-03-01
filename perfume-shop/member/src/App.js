import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
import { getCurrentUser } from './redux/apis/AuthApi';
import { getCart } from './redux/apis/CartApi';

function App() {
  const dispatch = useDispatch();
  const [showSplash, setShowSplash] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Check if user is logged in on app load
  useEffect(() => {
    const token = localStorage.getItem('memberToken');
    if (token) {
      // localStorage is synchronous, no delay needed
      dispatch(getCurrentUser()).then((result) => {
        if (result.payload?.success) {
          // Fetch cart after user is loaded
          dispatch(getCart());
        }
      });
    }
  }, [dispatch]);

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
              <Route path="/invoice" element={<Invoice />} />
              <Route path="/sale" element={<Sale />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/returns" element={<ReturnsPage />} />
              <Route path="/shipping-info" element={<ShippingInfo />} />
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