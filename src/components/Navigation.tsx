
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navigation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            onClick={() => navigate('/')}
            className="text-xl font-bold text-white cursor-pointer hover:text-rose-300 transition-colors tracking-wide"
          >
            Samiya Wedding Center
          </div>
          <div className="hidden md:flex space-x-8">
            <button 
              onClick={() => navigate('/')}
              className="text-white/90 hover:text-white font-medium transition-colors tracking-wide relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-rose-300 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
            >
              Home
            </button>
            <button className="text-white/90 hover:text-white font-medium transition-colors tracking-wide relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-rose-300 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
              About
            </button>
            <button className="text-white/90 hover:text-white font-medium transition-colors tracking-wide relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-rose-300 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
