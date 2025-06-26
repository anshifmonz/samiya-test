
import React from 'react';

const AboutMission: React.FC = () => {
  return (
    <div className="py-32 bg-luxury-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="luxury-subheading block text-luxury-gold text-xl mb-6 tracking-[0.3em]">
            Our Purpose
          </span>
          <h2 className="luxury-heading text-5xl sm:text-6xl text-luxury-black mb-8">
            Our Mission
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="luxury-card bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="luxury-heading text-2xl text-luxury-black">01</span>
              </div>
              <h3 className="luxury-heading text-2xl text-luxury-black mb-4">
                Preserve Heritage
              </h3>
              <p className="luxury-body text-luxury-gray leading-relaxed">
                Keeping traditional craftsmanship alive while embracing modern design sensibilities for contemporary couples.
              </p>
            </div>
          </div>

          <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="luxury-card bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="luxury-heading text-2xl text-luxury-black">02</span>
              </div>
              <h3 className="luxury-heading text-2xl text-luxury-black mb-4">
                Create Memories
              </h3>
              <p className="luxury-body text-luxury-gray leading-relaxed">
                Helping families celebrate life's most precious moments with attire that reflects their unique style and personality.
              </p>
            </div>
          </div>

          <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="luxury-card bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="luxury-heading text-2xl text-luxury-black">03</span>
              </div>
              <h3 className="luxury-heading text-2xl text-luxury-black mb-4">
                Exceed Expectations
              </h3>
              <p className="luxury-body text-luxury-gray leading-relaxed">
                Providing personalized service and exceptional quality that goes beyond what our customers expect.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMission;
