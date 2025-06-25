import React from 'react';
import { useNavigate } from 'react-router-dom';

const FeaturedCategories: React.FC = () => {
  const navigate = useNavigate();

  const categories = [
    {
      name: 'Bridal Collection',
      image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=600&fit=crop&crop=center',
      description: 'Exquisite bridal wear for your special day',
      accent: 'text-luxury-gold'
    },
    {
      name: 'Groom\'s Attire',
      image: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=800&h=600&fit=crop&crop=center',
      description: 'Sophisticated sherwanis and formal wear',
      accent: 'text-luxury-gold'
    },
    {
      name: 'Festive Collection',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center',
      description: 'Celebratory attire for every occasion',
      accent: 'text-luxury-gold'
    }
  ];

  const handleCategoryClick = (category: string) => {
    navigate(`/search?q=${category.toLowerCase()}`);
  };

  return (
    <div className="bg-luxury-beige py-32 relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <div className="animate-fade-in-up">
            <h2 className="luxury-heading text-6xl sm:text-7xl text-luxury-black mb-8">
              <span className="luxury-subheading block text-luxury-gold text-2xl sm:text-3xl mb-8 tracking-[0.3em]">
                Curated Excellence
              </span>
              Collections
            </h2>
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <p className="luxury-body text-xl text-luxury-gray max-w-3xl mx-auto">
              Discover our meticulously curated collections designed for every special occasion
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {categories.map((category, index) => (
            <div
              key={category.name}
              onClick={() => handleCategoryClick(category.name)}
              className={`group cursor-pointer luxury-card rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-6 animate-fade-in-up`}
              style={{ animationDelay: `${0.4 + index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/90 via-luxury-black/30 to-transparent group-hover:from-luxury-gold/20 transition-all duration-500"></div>
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="luxury-heading text-4xl mb-4">{category.name}</h3>
                  <p className="luxury-body text-white/90 text-lg">{category.description}</p>
                </div>
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-luxury-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCategories;
