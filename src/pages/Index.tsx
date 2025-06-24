
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import AboutSection from '../components/AboutSection';
import TestimonialsSection from '../components/TestimonialsSection';
import ContactSection from '../components/ContactSection';
import { products } from '../data/products';

const Index: React.FC = () => {
  const navigate = useNavigate();

  const featuredProducts = products.slice(0, 6);
  const categories = [
    {
      name: 'Women',
      image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500&h=400&fit=crop',
      description: 'Elegant sarees, lehengas & more'
    },
    {
      name: 'Gents',
      image: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=500&h=400&fit=crop',
      description: 'Kurtas, sherwanis & formal wear'
    },
    {
      name: 'Kids',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=400&fit=crop',
      description: 'Traditional wear for little ones'
    }
  ];

  const handleCategoryClick = (category: string) => {
    navigate(`/search?q=${category.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-screen flex items-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&h=900&fit=crop)'
          }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center z-10">
          <h1 className="text-6xl sm:text-8xl font-bold text-white mb-8 leading-tight tracking-tight">
            <span className="block text-rose-300 text-4xl sm:text-5xl font-light mb-4 tracking-widest uppercase">
              Premium Collection
            </span>
            Samiya Wedding Center
          </h1>
          <p className="text-xl sm:text-2xl text-white/95 mb-12 max-w-4xl mx-auto leading-relaxed font-light tracking-wide">
            Discover exquisite wedding attire and traditional wear crafted for life's most precious moments. 
            Where elegance meets tradition in perfect harmony.
          </p>
          
          <div className="mb-16">
            <SearchBar />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <button
              onClick={() => navigate('/search?q=wedding')}
              className="group relative overflow-hidden bg-rose-600 text-white px-12 py-5 rounded-full font-semibold text-lg hover:bg-rose-700 transition-all duration-500 shadow-2xl hover:shadow-rose-500/25 transform hover:-translate-y-2 tracking-wide uppercase"
            >
              <span className="relative z-10">Explore Collection</span>
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </button>
            <button
              onClick={() => navigate('/search?q=festive')}
              className="group relative border-2 border-white/80 text-white px-12 py-5 rounded-full font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-500 transform hover:-translate-y-2 tracking-wide uppercase backdrop-blur-sm"
            >
              Festive Wear
            </button>
          </div>
        </div>
      </div>

      {/* Featured Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-20">
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
            <span className="block text-rose-600 text-2xl sm:text-3xl font-light mb-4 tracking-widest uppercase">
              Curated Excellence
            </span>
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
            Discover our meticulously curated collections designed for every special occasion and celebration
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {categories.map(category => (
            <div
              key={category.name}
              onClick={() => handleCategoryClick(category.name)}
              className="group cursor-pointer bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-rose-500/20 transition-all duration-700 transform hover:-translate-y-6"
            >
              <div className="relative overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-rose-900/80 transition-all duration-500"></div>
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="text-4xl font-bold mb-4 tracking-wide">{category.name}</h3>
                  <p className="text-white/95 text-lg font-light tracking-wide">{category.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <AboutSection />

      {/* Featured Products */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
              <span className="block text-rose-600 text-2xl sm:text-3xl font-light mb-4 tracking-widest uppercase">
                Handpicked Favorites
              </span>
              Featured Collection
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Discover our latest arrivals, showcasing the finest in traditional and contemporary fashion
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-20">
            <button
              onClick={() => navigate('/search?q=')}
              className="group relative overflow-hidden bg-gray-900 text-white px-16 py-5 rounded-full font-semibold text-lg hover:bg-gray-800 transition-all duration-500 shadow-2xl hover:shadow-gray-500/25 transform hover:-translate-y-2 tracking-wide uppercase"
            >
              <span className="relative z-10">View All Products</span>
              <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Customer Testimonials */}
      <TestimonialsSection />

      {/* Contact Section */}
      <ContactSection />
    </div>
  );
};

export default Index;
