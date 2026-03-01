import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import HeroSlider from '../components/home/HeroSlider';
import FeaturedPerfumes from '../components/home/FeaturedPerfumes';
import DiscountSection from '../components/home/DiscountSection';
import BestSellers from '../components/home/BestSellers';
import Testimonials from '../components/home/Testimonials';
import ScrollToTop from '../components/common/ScrollToTop';

export default function Home() {
  const { user } = useSelector((state) => state.AuthSlice);

  useEffect(() => {
    // Check if modal was already shown automatically
    const modalShownBefore = localStorage.getItem('loginModalShown');
    
    // Show login modal after 3 seconds only if not logged in and not shown before
    if (!user && !modalShownBefore) {
      const timer = setTimeout(() => {
        window.openAuthModal('login');
        // Mark that modal has been shown automatically
        localStorage.setItem('loginModalShown', 'true');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [user]);

  return (
    <div>
      <HeroSlider />
      
      {/* Section Separator */}
      <div 
        style={{
          height: '1px',
          background: 'linear-gradient(to right, transparent, var(--sand-400), transparent)',
          margin: '2rem 0'
        }}
      />
      
      <FeaturedPerfumes />
      
      {/* Section Separator */}
      <div 
        style={{
          height: '1px',
          background: 'linear-gradient(to right, transparent, var(--sand-400), transparent)',
          margin: '2rem 0'
        }}
      />
      
      <DiscountSection />
      
      {/* Section Separator */}
      <div 
        style={{
          height: '1px',
          background: 'linear-gradient(to right, transparent, var(--sand-400), transparent)',
          margin: '2rem 0'
        }}
      />
      
      <BestSellers />
      
      {/* Section Separator */}
      <div 
        style={{
          height: '1px',
          background: 'linear-gradient(to right, transparent, var(--sand-400), transparent)',
          margin: '2rem 0'
        }}
      />
      
      <Testimonials />
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}
