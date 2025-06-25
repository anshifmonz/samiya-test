
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from '../search/SearchBar';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const isSearchPage = location.pathname === '/search';
  const isAdminPage = location.pathname === '/admin';
  const isProductPage = location.pathname.startsWith('/product/');

  useEffect(() => {
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(heroSection);

    return () => observer.disconnect();
  }, []);

  // Determine navbar background and styling based on page
  const getNavbarStyling = () => {
    if (isSearchPage) {
      return 'bg-luxury-black/90 backdrop-blur-xl border-b border-luxury-gold/30 shadow-2xl shadow-luxury-black/50';
    }
    
    if (isAdminPage || isProductPage) {
      return 'bg-luxury-black/95 backdrop-blur-xl border-b border-luxury-gold/30 shadow-xl';
    }
    
    // Home page styling
    return isScrolled
      ? 'bg-[#2e2e2e]/60 backdrop-blur-md border-b border-[#d6c6ae]/30 shadow-[0_4px_24px_rgba(214,198,174,0.2)] drop-shadow-[0_0_12px_rgba(214,198,174,0.1)]'
      : 'bg-luxury-black/95 backdrop-blur-lg border-b border-white/30';
  };

  // Determine text styling based on page
  const getTextStyling = () => {
    if (isSearchPage || isAdminPage || isProductPage) {
      return {
        logo: 'text-white hover:text-luxury-gold',
        logoSubtext: 'text-luxury-gold',
        navLinks: 'text-white hover:text-luxury-gold'
      };
    }
    
    // Home page styling
    return {
      logo: 'text-white hover:text-luxury-gold',
      logoSubtext: 'text-luxury-gold',
      navLinks: 'text-white hover:text-luxury-gold'
    };
  };

  const textStyles = getTextStyling();

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${getNavbarStyling()}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div
            onClick={() => navigate('/')}
            className={`luxury-heading text-2xl font-light cursor-pointer transition-colors duration-300 tracking-wide ${textStyles.logo}`}
          >
            Samiya
            <span className={`block text-sm luxury-subheading tracking-[0.2em] ${textStyles.logoSubtext}`}>
              Wedding Center
            </span>
          </div>

          <div className="hidden md:flex space-x-12">
            <button
              onClick={() => navigate('/')}
              className={`luxury-body font-light transition-colors duration-300 tracking-wide relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-luxury-gold after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left ${textStyles.navLinks}`}
            >
              Home
            </button>
            <button className={`luxury-body font-light transition-colors duration-300 tracking-wide relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-luxury-gold after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left ${textStyles.navLinks}`}>
              About
            </button>
            <button className={`luxury-body font-light transition-colors duration-300 tracking-wide relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-luxury-gold after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left ${textStyles.navLinks}`}>
              Collections
            </button>
            <button className={`luxury-body font-light transition-colors duration-300 tracking-wide relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-luxury-gold after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left ${textStyles.navLinks}`}>
              Contact
            </button>
            {isAdminPage && (
              <span className="luxury-body font-light text-luxury-gold/80 tracking-wide px-3 py-1 bg-luxury-gold/10 rounded-full border border-luxury-gold/20">
                Admin
              </span>
            )}
          </div>

          {/* Search Bar - Only show on search page */}
          {isSearchPage && (
            <div className="hidden md:block w-80">
              <SearchBar />
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className={`transition-colors duration-300 ${textStyles.navLinks}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
