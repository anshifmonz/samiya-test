import React from 'react';
import { useNavigate } from 'react-router-dom';
import collections from '@/data/collections';

const CollectionsGrid: React.FC = () => {
  const navigate = useNavigate();

  const handleCollectionClick = (searchQuery: string) => {
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="py-32 bg-luxury-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <div className="animate-fade-in-up">
            <span className="luxury-subheading block text-luxury-gold text-2xl sm:text-3xl mb-8 tracking-[0.3em]">
              Trending Now
            </span>
            <h2 className="luxury-heading text-5xl sm:text-6xl text-luxury-black mb-8">
              Featured Collections
            </h2>
            <p className="luxury-body text-xl text-luxury-gray max-w-3xl mx-auto">
              Explore our handpicked selections that define today's fashion landscape
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <div
              key={collection.id}
              onClick={() => handleCollectionClick(collection.searchQuery)}
              className={`group cursor-pointer luxury-card rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-6 animate-fade-in-up`}
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <div className="relative overflow-hidden aspect-[4/5]">
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${collection.gradient} group-hover:opacity-90 transition-opacity duration-500`}></div>

                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <div className="glass-dark rounded-xl p-4 backdrop-blur-sm transition-all duration-500 ease-out group-hover:pb-6 flex items-center group-hover:items-start">
                    <div className="transform group-hover:translate-y-0 transition-transform duration-500 w-full">
                      <h3 className="luxury-heading text-3xl text-white  group-hover:mb-4 transition-all duration-500 group-hover:text-luxury-gold text-left">
                        {collection.title}
                      </h3>
                      <div className="overflow-hidden transition-all duration-500 ease-out max-h-0 group-hover:max-h-32">
                        <p className="luxury-body text-white/90 text-lg leading-relaxed pt-2">
                          {collection.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-luxury-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700">
                  <div className="shimmer absolute inset-0"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-20 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <p className="luxury-body text-xl text-luxury-gray mb-8">
            Can't find what you're looking for?
          </p>
          <button
            onClick={() => navigate('/search')}
            className="luxury-btn-primary px-12 py-4 rounded-full text-lg font-light tracking-wide"
          >
            Browse All Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionsGrid;
