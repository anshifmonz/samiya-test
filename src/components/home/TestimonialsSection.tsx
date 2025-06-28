import React from 'react';
import { Star } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      text: "Absolutely stunning collection! The quality of fabrics and attention to detail is exceptional. My wedding lehenga was a dream come true.",
      rating: 5,
      role: "Bride",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      fallbackImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Rajesh Kumar",
      text: "Perfect place for traditional wear. The staff is knowledgeable and helped me find the ideal sherwani for my son's wedding.",
      rating: 5,
      role: "Groom's Father",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      fallbackImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Meera Patel",
      text: "Beautiful sarees and excellent customer service. Samiya Wedding Center never disappoints. Highly recommended!",
      rating: 5,
      role: "Mother of the Bride",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      fallbackImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
    },
    {
      name: "Arjun Singh",
      text: "The entire family found perfect outfits for our daughter's wedding. The variety and quality exceeded our expectations.",
      rating: 5,
      role: "Father of the Bride",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      fallbackImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
    }
  ];

  return (
    <div className="bg-gradient-to-br from-luxury-cream via-luxury-beige to-luxury-cream py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-luxury-gold/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-luxury-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-luxury-gold/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-luxury-gold rounded-full mb-8">
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-luxury-black fill-current" />
                ))}
              </div>
            </div>
            <div className="animate-fade-in-up">
              <h2 className="luxury-heading text-6xl sm:text-7xl text-luxury-black mb-8">
                <span className="luxury-subheading block text-luxury-gold-dark text-2xl sm:text-3xl mb-8 tracking-[0.3em]">
                  Client Stories
                </span>
                What Our Customers Say
            </h2>
            </div>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <p className="luxury-body text-xl text-luxury-gray max-w-3xl mx-auto leading-relaxed">
              Hear from our valued customers who trusted us with their special moments
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`group animate-fade-in-up ${
                index % 2 === 0 ? 'lg:mt-0' : 'lg:mt-12'
              }`}
              style={{ animationDelay: `${0.4 + index * 0.1}s` }}
            >
              <div className="bg-white p-4 rounded-lg shadow-lg transform hover:-translate-y-2 hover:rotate-1 transition-all duration-300 group-hover:shadow-2xl">
                <div className="aspect-square mb-4 overflow-hidden rounded-xl bg-luxury-beige relative shadow-lg border border-luxury-gray/10">
                  <video
                    src={testimonial.video}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-xl"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    onError={(e) => {
                      const target = e.target as HTMLVideoElement;
                      // Create fallback image element
                      const img = document.createElement('img');
                      img.src = testimonial.fallbackImage;
                      img.alt = testimonial.name;
                      img.className = 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-xl';
                      target.parentNode?.replaceChild(img, target);
                    }}
                  >
                    {/* fallback for browsers that don't support video */}
                    <source src={testimonial.video} type="video/mp4" />
                    <img
                      src={testimonial.fallbackImage}
                      alt={testimonial.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-xl"
                    />
                  </video>
                </div>

                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-12 h-6 bg-luxury-gold/20 rounded-sm shadow-sm"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <div className="glass-dark rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="luxury-heading text-3xl text-white mb-4">
              Join Our Happy Customers
            </h3>
            <p className="luxury-body text-white/90 text-lg mb-6 leading-relaxed">
              Experience the quality and service that has made thousands of families choose us for their special occasions.
            </p>
            <button className="luxury-btn-secondary px-8 py-3 rounded-full font-medium text-sm tracking-wider uppercase hover:bg-white/10">
              Visit Our Store
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
