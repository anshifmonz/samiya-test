
import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            About Samiya Wedding Center
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-6">
              For over two decades, Samiya Wedding Center has been the premier destination for exquisite wedding attire and traditional wear. We specialize in creating unforgettable moments through our carefully curated collection of premium fabrics, intricate designs, and personalized styling services.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              From elegant bridal sarees and lehengas to sophisticated sherwanis and formal wear for gents, plus adorable traditional outfits for kids, we offer everything your family needs for life's most precious celebrations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">20+</div>
                <p className="text-gray-600">Years of Excellence</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">5000+</div>
                <p className="text-gray-600">Happy Customers</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">100%</div>
                <p className="text-gray-600">Premium Quality</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
