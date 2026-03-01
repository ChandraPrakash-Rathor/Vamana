import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Users from './pages/Users';
import Coupons from './pages/Coupons';
import Sales from './pages/Sales';
import LimitedOffers from './pages/LimitedOffers';
import ContentManagement from './pages/ContentManagement';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import LoaderDemo from './pages/LoaderDemo';
import ThemeProvider from './components/common/ThemeProvider';
import './styles/global.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from "js-cookie";
import { logoutUser } from './APIS/apis/Authapi';
import { toast } from 'react-toastify';

// Protected Route Component
function ProtectedRoute({ children }) {
  const isAuthenticate = Cookies.get("isAuthenticate");
  const authToken = Cookies.get("authToken");
  
  if (!isAuthenticate || !authToken) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function App() {
  const handleLogout = () => {
    toast.info("Logging out...");
    logoutUser();
  };

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Login Route - Redirect to dashboard if already logged in */}
          <Route 
            path="/login" 
            element={
              Cookies.get("isAuthenticate") && Cookies.get("authToken") 
                ? <Navigate to="/dashboard" replace />
                : <Login />
            } 
          />
          
          {/* Protected Admin Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AdminLayout onLogout={handleLogout}>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/coupons" element={<Coupons />} />
                    <Route path="/sales" element={<Sales />} />
                    <Route path="/limited-offers" element={<LimitedOffers />} />
                    <Route path="/content" element={<ContentManagement />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/loader-demo" element={<LoaderDemo />} />
                    <Route path="/" element={<Navigate to="/login" replace />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
