
import React from 'react';
import { Heart, Sparkles, Users, Award } from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: 'Passion',
    description: 'Every garment is crafted with love and dedication to perfection'
  },
  {
    icon: Sparkles,
    title: 'Excellence',
    description: 'We never compromise on quality or attention to detail'
  },
  {
    icon: Users,
    title: 'Family',
    description: 'Treating every customer as part of our extended family'
  },
  {
    icon: Award,
    title: 'Heritage',
    description: 'Preserving traditional craftsmanship for future generations'
  }
];

const AboutValues: React.FC = () => {
  return (
    <div className="py-32 bg-luxury-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="luxury-subheading block text-luxury-gold text-xl mb-6 tracking-[0.3em]">
            What Drives Us
          </span>
          <h2 className="luxury-heading text-5xl sm:text-6xl text-white mb-8">
            Our Values
          </h2>
          <p className="luxury-body text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            These core principles guide everything we do, from selecting the finest fabrics to providing personalized service that exceeds expectations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={value.title}
              className="text-center group animate-fade-in-up luxury-card bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-all duration-500"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="mb-6">
                <value.icon className="w-12 h-12 text-luxury-gold mx-auto group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="luxury-heading text-2xl text-white mb-4">
                {value.title}
              </h3>
              <p className="luxury-body text-white/70 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutValues;
