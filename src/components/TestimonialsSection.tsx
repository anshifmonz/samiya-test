
import React from 'react';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: "Priya Sharma",
      text: "Absolutely stunning collection! The quality of fabrics and attention to detail is exceptional. My wedding lehenga was a dream come true.",
      rating: 5
    },
    {
      name: "Rajesh Kumar",
      text: "Perfect place for traditional wear. The staff is knowledgeable and helped me find the ideal sherwani for my son's wedding.",
      rating: 5
    },
    {
      name: "Meera Patel",
      text: "Beautiful sarees and excellent customer service. Samiya Wedding Center never disappoints. Highly recommended!",
      rating: 5
    }
  ];

  return (
    <div className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
            <span className="block text-rose-600 text-2xl sm:text-3xl font-light mb-4 tracking-widest uppercase">
              Client Stories
            </span>
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 font-light">
            Trusted by thousands of families for their special occasions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-10 rounded-2xl shadow-xl hover:shadow-rose-500/10 transition-all duration-500 group hover:-translate-y-2">
              <div className="flex mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-rose-500 text-2xl">★</span>
                ))}
              </div>
              <p className="text-gray-600 mb-8 italic text-lg font-light leading-relaxed">"{testimonial.text}"</p>
              <p className="font-semibold text-gray-900 text-lg tracking-wide">— {testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
