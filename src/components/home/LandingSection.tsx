"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ScrollIndicator from './ScrollIndicator';

const LandingSection: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section id="hero" className="relative overflow-hidden -mt-6">
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
            <h1 className="luxury-heading text-4xl sm:text-6xl md:text-8xl lg:text-10xl xl:text-12xl text-white mb-1 sm:mb-2 md:mb-4 lg:mb-6 leading-tight">
              Samiya
              <span className="block text-sm sm:text-md md:text-2xl lg:text-2xl xl:text-3xl luxury-subheading tracking-[0.15em] sm:tracking-[0.2em] mt-0.5 sm:mt-1 md:mt-2 lg:mt-3 xl:mt-4 text-luxury-gold">
                Wedding Center
              </span>
            </h1>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <p className="luxury-body text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-white/90 mb-2 sm:mb-4 md:mb-6 lg:mb-8 xl:mb-12 max-w-[380px] sm:max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto leading-relaxed px-3 sm:px-4 md:px-6">
              Where timeless elegance meets contemporary sophistication.
              Discover our curated collection of premium wedding attire,
              crafted for life's most precious moments.
            </p>
          </div>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
};

export default LandingSection;
