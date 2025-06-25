import React from 'react';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      text: "Absolutely stunning collection! The quality of fabrics and attention to detail is exceptional. My wedding lehenga was a dream come true.",
      rating: 5,
      role: "Bride"
    },
    {
      name: "Rajesh Kumar",
      text: "Perfect place for traditional wear. The staff is knowledgeable and helped me find the ideal sherwani for my son's wedding.",
      rating: 5,
      role: "Groom's Father"
    },
    {
      name: "Meera Patel",
      text: "Beautiful sarees and excellent customer service. Samiya Wedding Center never disappoints. Highly recommended!",
      rating: 5,
      role: "Mother of the Bride"
    }
  ];

  return (
    <div className="bg-luxury-cream py-32 relative">
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <div className="animate-fade-in-up">
              <h2 className="luxury-heading text-6xl sm:text-7xl text-luxury-black mb-8">
                <span className="luxury-subheading block text-luxury-gold text-2xl sm:text-3xl mb-8 tracking-[0.3em]">
                  Client Stories
                </span>
                What Our Customers Say
              </h2>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <p className="luxury-body text-xl text-luxury-gray max-w-3xl mx-auto">
                Trusted by thousands of families for their special occasions
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="luxury-card p-10 rounded-3xl group animate-fade-in-up"
                style={{ animationDelay: `${0.4 + index * 0.2}s` }}
              >
                <div className="flex mb-8">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-luxury-gold text-2xl">★</span>
                  ))}
                </div>

                <p className="luxury-body text-luxury-gray mb-8 italic text-lg leading-relaxed">
                  "{testimonial.text}"
                </p>

                <div className="border-t border-luxury-gray/20 pt-6">
                  <p className="luxury-heading text-luxury-black text-lg mb-1">
                    {testimonial.name}
                  </p>
                  <p className="luxury-subheading text-luxury-gold text-sm tracking-wider">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
