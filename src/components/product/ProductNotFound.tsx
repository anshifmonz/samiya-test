import React from 'react';
import Navigation from '../../components/shared/Navigation';

interface ProductNotFoundProps {
  onGoHome: () => void;
}

const ProductNotFound: React.FC<ProductNotFoundProps> = ({ onGoHome }) => (
  <div className="min-h-screen bg-luxury-cream flex flex-col">
    <Navigation />
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <h2 className="luxury-heading text-3xl text-luxury-black mb-6">Product Not Found</h2>
        <button
          onClick={onGoHome}
          className="luxury-btn-primary px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300"
        >
          Go Home
        </button>
      </div>
    </div>
  </div>
);

export default ProductNotFound;
