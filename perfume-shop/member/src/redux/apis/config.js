// API Base URL Configuration
const isLocal = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname.startsWith('192.168.')
);

export const baseUrl = isLocal
  ? (process.env.REACT_APP_API_URL || 'http://localhost:5001/api/member/')
  : 'https://vamana.store/api/member/';

export const imageBaseUrl = isLocal
  ? 'http://localhost:5001'
  : 'https://vamana.store';

