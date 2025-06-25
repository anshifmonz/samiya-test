import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <div className="bg-luxury-cream py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <div className="animate-fade-in-up">
            <h2 className="luxury-heading text-6xl sm:text-7xl text-luxury-black mb-8">
              <span className="luxury-subheading block text-luxury-gold text-2xl sm:text-3xl mb-8 tracking-[0.3em]">
                Our Legacy
              </span>
              About Samiya
            </h2>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <p className="luxury-body text-xl text-luxury-gray mb-8 max-w-4xl mx-auto leading-relaxed">
              For over two decades, Samiya Wedding Center has been the premier destination for exquisite wedding attire and traditional wear. We specialize in creating unforgettable moments through our carefully curated collection of premium fabrics, intricate designs, and personalized styling services.
            </p>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <p className="luxury-body text-xl text-luxury-gray mb-16 max-w-4xl mx-auto leading-relaxed">
              From elegant bridal sarees and lehengas to sophisticated sherwanis and formal wear for gents, plus adorable traditional outfits for kids, we offer everything your family needs for life's most precious celebrations.
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mt-24">
            <div className="animate-fade-in-up text-center group" style={{ animationDelay: '0.6s' }}>
              <div className="luxury-heading text-7xl text-luxury-gold mb-6 group-hover:scale-110 transition-transform duration-500">
                20+
              </div>
              <p className="luxury-subheading text-luxury-gray text-lg tracking-wider">
                Years of Excellence
              </p>
            </div>

            <div className="animate-fade-in-up text-center group" style={{ animationDelay: '0.8s' }}>
              <div className="luxury-heading text-7xl text-luxury-gold mb-6 group-hover:scale-110 transition-transform duration-500">
                5000+
              </div>
              <p className="luxury-subheading text-luxury-gray text-lg tracking-wider">
                Happy Customers
              </p>
            </div>

            <div className="animate-fade-in-up text-center group" style={{ animationDelay: '1s' }}>
              <div className="luxury-heading text-7xl text-luxury-gold mb-6 group-hover:scale-110 transition-transform duration-500">
                100%
              </div>
              <p className="luxury-subheading text-luxury-gray text-lg tracking-wider">
                Premium Quality
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
