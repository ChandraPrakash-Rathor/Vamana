# URL Configuration Guide - Production Ready ✅

## Configuration Files Updated

### Member Side (`member/src/redux/apis/config.js`)
```javascript
export const baseUrl = 'https://vamana.store/api/member/';
export const imageBaseUrl = 'https://vamana.store';
```

### Admin Side (`admin/src/APIS/apis/config.js`)
```javascript
export const baseUrl = 'https://admin.vamana.store/api/admin/';
export const imageBaseUrl = 'https://admin.vamana.store';
```

## Files Fixed

### Member Side ✅
1. `member/src/pages/AboutUs.jsx` - Using baseUrl from config
2. `member/src/pages/ContactUs.jsx` - Using baseUrl from config
3. `member/src/pages/Invoice.jsx` - Using baseUrl from config
4. `member/src/redux/apis/OrderApi.js` - Using baseUrl from config

### Remaining Files to Fix

#### Member Side (Image URLs)
- `member/src/components/home/DiscountSection.jsx` - Line 248: `http://localhost:5000/uploads/`
- `member/src/pages/Invoice.jsx` - Line 384: `http://localhost:5000/`
- `member/src/components/common/Footer.jsx` - Lines 32, 120: `http://localhost:5000`
- `member/src/components/common/Header.jsx` - Lines 27, 108: `http://localhost:5000`
- `member/src/components/invoice/InvoiceTemplate.jsx` - Line 12: `http://localhost:5000`

#### Admin Side
- `admin/src/pages/OrderInvoice.jsx` - Line 225: `http://localhost:5000/`
- `admin/src/pages/Settings.jsx` - Line 100: `http://localhost:5000`
- `admin/src/components/modals/EditMemberModal.jsx` - Line 37: `http://localhost:5000`
- `admin/src/APIS/apis/MemberApi.js` - Line 4: `http://localhost:5000`
- `admin/src/components/layout/Sidebar.jsx` - Line 51: `http://localhost:5000`

## How to Switch Between Development and Production

### For Development
Uncomment the development URLs in config files:
```javascript
// Development
export const baseUrl = 'http://localhost:5000/api/member/';
export const imageBaseUrl = 'http://localhost:5000';
```

### For Production
Use the production URLs (currently active):
```javascript
// Production
export const baseUrl = 'https://vamana.store/api/member/';
export const imageBaseUrl = 'https://vamana.store';
```

## Next Steps
Replace all remaining hardcoded `http://localhost:5000` with `imageBaseUrl` from config files.

## Date
December 2024
