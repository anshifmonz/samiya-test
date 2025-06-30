import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
  customClass?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text = 'Loading...', customClass= 'min-h-screen bg-luxury-cream' }) => {
  return (
    <div className={`flex items-center justify-center ${customClass}`}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-luxury-gold mx-auto"></div>
        <p className="mt-6 luxury-body text-luxury-gray text-lg">{text}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
