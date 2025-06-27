import React from 'react';

const StatsSection: React.FC = () => {
  return (
    <div className="bg-luxury-cream py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="animate-fade-in-up text-center group" style={{ animationDelay: '0.2s' }}>
              <div className="luxury-heading text-7xl text-luxury-gold mb-6 group-hover:scale-110 transition-transform duration-500">
                20+
              </div>
              <p className="luxury-subheading text-luxury-gray text-lg tracking-wider">
                Years of Excellence
              </p>
            </div>

            <div className="animate-fade-in-up text-center group" style={{ animationDelay: '0.4s' }}>
              <div className="luxury-heading text-7xl text-luxury-gold mb-6 group-hover:scale-110 transition-transform duration-500">
                5000+
              </div>
              <p className="luxury-subheading text-luxury-gray text-lg tracking-wider">
                Happy Customers
              </p>
            </div>

            <div className="animate-fade-in-up text-center group" style={{ animationDelay: '0.6s' }}>
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

export default StatsSection;
