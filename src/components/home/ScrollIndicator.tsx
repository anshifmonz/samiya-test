import React from 'react';

const ScrollIndicator: React.FC = () => {
  return (
    <div className="absolute hidden sm:block sm:bottom-2 lg:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
      <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
        <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse delay-1000"></div>
      </div>
    </div>
  );
};

export default ScrollIndicator;
