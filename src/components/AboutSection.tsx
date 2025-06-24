
import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <div className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
            <span className="block text-rose-600 text-2xl sm:text-3xl font-light mb-4 tracking-widest uppercase">
              Our Legacy
            </span>
            About Samiya Wedding Center
          </h2>
          <div className="max-w-5xl mx-auto">
            <p className="text-xl text-gray-600 mb-8 font-light leading-relaxed">
              For over two decades, Samiya Wedding Center has been the premier destination for exquisite wedding attire and traditional wear. We specialize in creating unforgettable moments through our carefully curated collection of premium fabrics, intricate designs, and personalized styling services.
            </p>
            <p className="text-xl text-gray-600 mb-12 font-light leading-relaxed">
              From elegant bridal sarees and lehengas to sophisticated sherwanis and formal wear for gents, plus adorable traditional outfits for kids, we offer everything your family needs for life's most precious celebrations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
              <div className="text-center group">
                <div className="text-6xl font-bold text-rose-600 mb-4 group-hover:scale-110 transition-transform duration-300">20+</div>
                <p className="text-gray-600 text-lg font-light tracking-wide uppercase">Years of Excellence</p>
              </div>
              <div className="text-center group">
                <div className="text-6xl font-bold text-rose-600 mb-4 group-hover:scale-110 transition-transform duration-300">5000+</div>
                <p className="text-gray-600 text-lg font-light tracking-wide uppercase">Happy Customers</p>
              </div>
              <div className="text-center group">
                <div className="text-6xl font-bold text-rose-600 mb-4 group-hover:scale-110 transition-transform duration-300">100%</div>
                <p className="text-gray-600 text-lg font-light tracking-wide uppercase">Premium Quality</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
