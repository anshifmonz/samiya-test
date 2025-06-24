
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navigation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            onClick={() => navigate('/')}
            className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors"
          >
            Samiya Wedding Center
          </div>
          <div className="hidden md:flex space-x-8">
            <button 
              onClick={() => navigate('/')}
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
            >
              Home
            </button>
            <button className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
              About
            </button>
            <button className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
