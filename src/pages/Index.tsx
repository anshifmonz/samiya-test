
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
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-black/30"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" 
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&h=900&fit=crop)'
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center z-10">
          <h1 className="text-5xl sm:text-7xl font-bold text-white mb-8 leading-tight">
            Samiya Wedding Center
          </h1>
          <p className="text-xl sm:text-2xl text-white/95 mb-12 max-w-4xl mx-auto leading-relaxed">
            Your premier destination for exquisite wedding attire, traditional wear, and festive collections for the entire family
          </p>
          <div className="mb-12">
            <SearchBar />
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => navigate('/search?q=wedding')}
              className="bg-white text-indigo-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
            >
              Shop Wedding Collection
            </button>
            <button
              onClick={() => navigate('/search?q=festive')}
              className="border-3 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-indigo-600 transition-all duration-300 transform hover:-translate-y-1"
            >
              Festive Wear
            </button>
          </div>
        </div>
      </div>

      {/* Featured Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our curated collections designed for every special occasion and celebration
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {categories.map(category => (
            <div
              key={category.name}
              onClick={() => handleCategoryClick(category.name)}
              className="group cursor-pointer bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3"
            >
              <div className="relative overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-3xl font-bold mb-3">{category.name}</h3>
                  <p className="text-white/95 text-lg">{category.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <AboutSection />

      {/* Featured Products */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Featured Collection
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked favorites from our latest arrivals, showcasing the finest in traditional and contemporary fashion
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-16">
            <button
              onClick={() => navigate('/search?q=')}
              className="bg-indigo-600 text-white px-12 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              View All Products
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
