import React from 'react';

interface SectionHeadingProps {
  title: string;
  className?: string;
  animationDelay?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  className = 'text-2xl sm:text-3xl',
  animationDelay = '0s'
}) => {
  return (
    <div className="text-center">
      <div className="animate-fade-in-up" style={{ animationDelay }}>
        <h2 className={`luxury-heading ${className} text-luxury-black`}>{title}</h2>
      </div>
    </div>
  );
};

export default SectionHeading;
