import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getActiveTheme } from '../../redux/apis/ThemeApi';

export default function ThemeProvider({ children }) {
  const dispatch = useDispatch();
  const activeTheme = useSelector((state) => state.ThemeSlice?.activeTheme);

  useEffect(() => {
    // Fetch active theme on mount (non-blocking)
    dispatch(getActiveTheme()).catch(() => {
      // Silently fail - default CSS variables will be used
    });
  }, [dispatch]);

  useEffect(() => {
    // Apply theme colors to CSS variables
    if (activeTheme?.colors) {
      const root = document.documentElement;
      Object.entries(activeTheme.colors).forEach(([shade, color]) => {
        root.style.setProperty(`--sand-${shade}`, color);
      });
      
      // Also set dark color (950 shade)
      if (activeTheme.colors['950']) {
        root.style.setProperty('--sand-dark', activeTheme.colors['950']);
      }
    }
  }, [activeTheme]);

  // Always render children immediately - don't wait for theme
  return <>{children}</>;
}
