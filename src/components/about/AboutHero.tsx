
import React from 'react';

const AboutHero: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-luxury-black luxury-gradient-overlay pt-20">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in-up">
          <span className="luxury-subheading block text-luxury-gold text-xl sm:text-2xl mb-8 tracking-[0.3em]">
            Our Legacy
          </span>
          <h1 className="luxury-heading text-6xl sm:text-8xl text-white mb-8 leading-tight">
            About Samiya
          </h1>
          <p className="luxury-body text-xl sm:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Creating timeless elegance and unforgettable moments for over two decades
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutHero;
