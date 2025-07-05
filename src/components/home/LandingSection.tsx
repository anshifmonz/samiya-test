"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SearchBar from '../search/SearchBar';
import ScrollIndicator from './ScrollIndicator';

const LandingSection: React.FC = () => {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div id="hero" className="relative overflow-hidden mt-[80px] bg-transparent">
      <div id="hero-banner" className="relative mx-auto w-[clamp(166px,calc(100vw-34px),1366px)] h-[clamp(67px,calc((100vw-34px)*0.4),534px)]">
        <Image
          src="/assets/images/home/landing-hero.jpg"
          alt="Samiya Wedding Center"
          fill
          className="object-cover rounded-lg"
          priority
          unoptimized={true}
        />

        <div className="absolute inset-0 bg-black/30 rounded-lg pointer-events-none"></div>

        <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
          <div className="absolute top-4 left-4 w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 bg-luxury-gold/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-4 right-4 w-20 h-20 sm:w-28 sm:h-28 lg:w-40 lg:h-40 bg-luxury-gold/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        <div className={`absolute inset-0 flex flex-col items-center justify-center text-center z-10 transition-all duration-1000 pointer-events-none ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="animate-fade-in-up">
            <h1 className="luxury-heading text-2xl sm:text-4xl md:text-6xl lg:text-8xl text-white mb-2 sm:mb-4 lg:mb-8 leading-none">
              Samiya
              <span className="block text-sm sm:text-lg md:text-xl lg:text-3xl luxury-subheading tracking-[0.2em] mt-1 sm:mt-2 lg:mt-4 text-luxury-gold">
                Wedding Center
              </span>
            </h1>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <p className="luxury-body text-xs sm:text-sm md:text-base lg:text-lg text-white/90 mb-4 sm:mb-8 lg:mb-16 max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl mx-auto leading-relaxed px-4">
              Where timeless elegance meets contemporary sophistication.
              Discover our curated collection of premium wedding attire,
              crafted for life's most precious moments.
            </p>
          </div>
        </div>
      </div>

      <ScrollIndicator />
    </div>
  );
};

export default LandingSection;
