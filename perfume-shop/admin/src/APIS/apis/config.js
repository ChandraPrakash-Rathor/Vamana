// API Base URL Configuration
const isLocal = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname.startsWith('192.168.')
);

export const baseUrl = isLocal 
  ? (process.env.REACT_APP_API_URL || 'http://localhost:5001/api/admin/')
  : 'https://admin.vamana.store/api/admin/';

export const imageBaseUrl = isLocal
  ? 'http://localhost:5001'
  : 'https://admin.vamana.store';

