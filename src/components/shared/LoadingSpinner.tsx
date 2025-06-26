import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text = 'Loading...' }) => {
  return (
    <div className="min-h-screen bg-luxury-cream flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-luxury-gold mx-auto"></div>
        <p className="mt-6 luxury-body text-luxury-gray text-lg">{text}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
