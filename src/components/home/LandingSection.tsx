import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../search/SearchBar';
import ScrollIndicator from './ScrollIndicator';

const LandingSection: React.FC = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div id="hero" className="relative overflow-hidden min-h-screen flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/assets/images/home/landing-hero.jpg)'
        }}
      ></div>

      <div className="absolute inset-0 luxury-gradient-overlay"></div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-luxury-gold/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-luxury-gold/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center z-10 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="animate-fade-in-up">
          <h1 className="luxury-heading text-7xl sm:text-9xl text-white mb-8 leading-none">
            {/* <span className="luxury-subheading block text-luxury-gold text-2xl sm:text-3xl mb-8 tracking-[0.3em]">
              Luxury Wedding Collection
            </span> */}
            Samiya
            <span className="block text-4xl sm:text-5xl luxury-subheading tracking-[0.2em] mt-4 text-luxury-gold">
              Wedding Center
            </span>
          </h1>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <p className="luxury-body text-xl sm:text-2xl text-white/90 mb-16 max-w-4xl mx-auto leading-relaxed">
            Where timeless elegance meets contemporary sophistication.
            Discover our curated collection of premium wedding attire,
            crafted for life's most precious moments.
          </p>
        </div>

        <div className="animate-fade-in-up mb-20" style={{ animationDelay: '0.4s' }}>
          <div className="glass-dark rounded-2xl p-8 max-w-2xl mx-auto">
            <SearchBar />
          </div>
        </div>

        <div className="animate-fade-in-up flex flex-col sm:flex-row gap-8 justify-center items-center" style={{ animationDelay: '0.6s' }}>
          <button
            onClick={() => navigate('/search?q=wedding')}
            className="luxury-btn-primary px-16 py-6 rounded-full font-medium text-lg tracking-wider uppercase shadow-2xl"
          >
            Explore Collection
          </button>
          <button
            onClick={() => navigate('/search?q=festive')}
            className="luxury-btn-secondary px-16 py-6 rounded-full font-medium text-lg tracking-wider uppercase"
          >
            Festive Wear
          </button>
        </div>
      </div>

      <ScrollIndicator />
    </div>
  );
};

export default LandingSection;
