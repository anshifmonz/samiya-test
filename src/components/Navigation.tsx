import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled
        ? 'glass-dark border-b border-white/10'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div
            onClick={() => navigate('/')}
            className="luxury-heading text-2xl font-light text-white cursor-pointer hover:text-luxury-gold transition-colors duration-300 tracking-wide"
          >
            Samiya
            <span className="block text-sm luxury-subheading tracking-[0.2em] text-luxury-gold">
              Wedding Center
            </span>
          </div>

          <div className="hidden md:flex space-x-12">
            <button
              onClick={() => navigate('/')}
              className="luxury-body text-white/90 hover:text-white font-light transition-colors duration-300 tracking-wide relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-luxury-gold after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
            >
              Home
            </button>
            <button className="luxury-body text-white/90 hover:text-white font-light transition-colors duration-300 tracking-wide relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-luxury-gold after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
              About
            </button>
            <button className="luxury-body text-white/90 hover:text-white font-light transition-colors duration-300 tracking-wide relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-luxury-gold after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
              Collections
            </button>
            <button className="luxury-body text-white/90 hover:text-white font-light transition-colors duration-300 tracking-wide relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-luxury-gold after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
              Contact
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-white/90 hover:text-white transition-colors duration-300">
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
