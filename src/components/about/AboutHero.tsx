import React from 'react';

const AboutHero: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center bg-luxury-white pt-24 pb-10">
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in-up">
          <span className="luxury-subheading block text-luxury-gold text-xl sm:text-2xl tracking-[0.3em]">
            Our Legacy
          </span>
          <h1 className="luxury-heading text-6xl sm:text-6xl text-luxury-black mb-4 -mt-2 leading-tight">
            About Samiya
          </h1>
          <p className="luxury-body text-xl sm:text-xl text-luxury-gray mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
            Creating timeless elegance and unforgettable moments for over two decades
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutHero;
