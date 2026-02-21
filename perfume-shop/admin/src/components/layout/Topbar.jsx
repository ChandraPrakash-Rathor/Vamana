import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export default function Topbar({ onToggleSidebar, onLogout, sidebarCollapsed, isMobile }) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="topbar">
      <div className="d-flex justify-content-between align-items-center">
        {/* Left side */}
        <div className="d-flex align-items-center gap-2 gap-md-3">
          <button
            onClick={onToggleSidebar}
            className="btn btn-link text-decoration-none p-2"
            style={{
              color: 'var(--sand-800)',
              fontSize: '1.3rem'
            }}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
          <h4 className="mb-0 d-none d-md-block" style={{
            color: 'var(--sand-900)',
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.5rem'
          }}>
            Vamana Admin
          </h4>
          <h5 className="mb-0 d-md-none" style={{
            color: 'var(--sand-900)',
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.2rem'
          }}>
            Admin
          </h5>
        </div>

        {/* Right side */}
        <div className="d-flex align-items-center gap-2 gap-md-3">
          {/* Notifications */}
          <button
            className="btn btn-link text-decoration-none position-relative p-2"
            style={{
              color: 'var(--sand-700)',
              fontSize: '1.2rem'
            }}
          >
            <FontAwesomeIcon icon={faBell} />
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{
              fontSize: '0.6rem',
              padding: '0.25rem 0.4rem'
            }}>
              3
            </span>
          </button>

          {/* User Profile Dropdown */}
          <div className="position-relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="btn d-flex align-items-center gap-2 px-2 px-md-3 py-2"
              style={{
                background: 'var(--sand-200)',
                border: 'none',
                borderRadius: '25px'
              }}
            >
              <div className="rounded-circle d-flex align-items-center justify-content-center" style={{
                width: '35px',
                height: '35px',
                backgroundColor: 'var(--sand-600)',
                color: 'white'
              }}>
                <FontAwesomeIcon icon={faUser} />
              </div>
              <span className="d-none d-sm-inline fw-semibold" style={{
                color: 'var(--sand-900)',
                fontSize: '0.9rem'
              }}>
                Admin
              </span>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <>
                <div
                  className="position-fixed top-0 start-0 w-100 h-100"
                  style={{ zIndex: 1 }}
                  onClick={() => setShowDropdown(false)}
                />
                <div className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg" style={{
                  minWidth: '200px',
                  zIndex: 2
                }}>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      onLogout();
                    }}
                    className="btn btn-link text-decoration-none w-100 text-start d-flex align-items-center gap-3 px-4 py-3 rounded-3"
                    style={{
                      color: 'var(--sand-900)',
                      fontSize: '0.95rem'
                    }}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
