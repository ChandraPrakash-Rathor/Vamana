import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
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
import './styles/global.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from "js-cookie";
function App() {
  const isAuthenticate =Cookies.get("isAuthenticate");
   
  console.log(isAuthenticate)


  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
           <Login  />
          } 
        />
        
        <Route
          path="/*"
          element={
           
              <AdminLayout >
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
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
              </AdminLayout>
            
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
