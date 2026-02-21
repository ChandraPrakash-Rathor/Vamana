import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import SplashScreen from './components/common/SplashScreen';
import ScrollToTopOnRouteChange from './components/common/ScrollToTopOnRouteChange';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Invoice from './pages/Invoice';
import Sale from './pages/Sale';
import TrackOrder from './pages/TrackOrder';
import Returns from './pages/Returns';
import ShippingInfo from './pages/ShippingInfo';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <Router>
      {showSplash && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}
      <ScrollToTopOnRouteChange />
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/sale" element={<Sale />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/shipping-info" element={<ShippingInfo />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;