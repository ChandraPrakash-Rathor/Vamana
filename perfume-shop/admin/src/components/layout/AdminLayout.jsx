import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AdminLayout({ children, onLogout }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  // Reset mobile sidebar on mount (fixes stuck overlay after login)
  useEffect(() => {
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
      if (window.innerWidth >= 992) {
        setMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        mobileOpen={mobileOpen}
        onLinkClick={closeMobileSidebar}
      />
      
      <div className={`main-content ${sidebarCollapsed && !isMobile ? 'expanded' : ''}`}>
        <Topbar 
          onToggleSidebar={toggleSidebar} 
          onLogout={onLogout}
          sidebarCollapsed={sidebarCollapsed}
          isMobile={isMobile}
        />
        <div className="container-fluid p-3 p-md-4">
          {children}
        </div>
      </div>
    </div>
  );
}
