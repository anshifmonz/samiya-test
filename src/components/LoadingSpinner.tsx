import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-luxury-cream flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-luxury-gold mx-auto"></div>
        <p className="mt-6 luxury-body text-luxury-gray text-lg">Searching products...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
