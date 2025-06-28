
import React from 'react';

const AboutTeam: React.FC = () => {
  return (
    <div className="py-32 bg-luxury-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="luxury-subheading block text-luxury-gold text-xl mb-6 tracking-[0.3em]">
            The People Behind The Magic
          </span>
          <h2 className="luxury-heading text-5xl sm:text-6xl text-luxury-black mb-8">
            Our Commitment
          </h2>
          <p className="luxury-body text-xl text-luxury-gray max-w-4xl mx-auto leading-relaxed">
            Behind every exquisite piece at Samiya is a team of skilled artisans, designers, and customer service professionals who share a common passion for excellence and a commitment to making your special day truly unforgettable.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in-left">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="assets/images/about/about-team.jpg"
                alt="Samiya Team"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="animate-fade-in-right">
            <div className="space-y-8">
              <div className="luxury-card bg-white/60 backdrop-blur-sm p-6 rounded-xl">
                <h3 className="luxury-heading text-2xl text-luxury-black mb-3">
                  Expert Craftsmanship
                </h3>
                <p className="luxury-body text-luxury-gray leading-relaxed">
                  Our master tailors and designers bring decades of combined experience, ensuring every stitch meets our exacting standards.
                </p>
              </div>

              <div className="luxury-card bg-white/60 backdrop-blur-sm p-6 rounded-xl">
                <h3 className="luxury-heading text-2xl text-luxury-black mb-3">
                  Personalized Service
                </h3>
                <p className="luxury-body text-luxury-gray leading-relaxed">
                  Our styling consultants work closely with each client to understand their vision and bring it to life with care and attention.
                </p>
              </div>

              <div className="luxury-card bg-white/60 backdrop-blur-sm p-6 rounded-xl">
                <h3 className="luxury-heading text-2xl text-luxury-black mb-3">
                  Continuous Innovation
                </h3>
                <p className="luxury-body text-luxury-gray leading-relaxed">
                  We constantly evolve our techniques and designs while respecting traditional methods, creating contemporary pieces with timeless appeal.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-20">
          <div className="luxury-card bg-luxury-gold/10 backdrop-blur-sm p-12 rounded-2xl border border-luxury-gold/20">
            <h3 className="luxury-heading text-3xl text-luxury-black mb-6">
              Visit Our Showroom
            </h3>
            <p className="luxury-body text-xl text-luxury-gray mb-8 max-w-2xl mx-auto leading-relaxed">
              Experience the Samiya difference in person. Our showroom is designed to provide a comfortable, luxurious environment where you can explore our collections and receive personalized styling advice.
            </p>
            <button className="luxury-btn-primary px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 hover:shadow-lg">
              Schedule an Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutTeam;
