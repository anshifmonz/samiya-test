
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
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600">
            Trusted by thousands of families for their special occasions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
              <p className="font-semibold text-gray-900">- {testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
