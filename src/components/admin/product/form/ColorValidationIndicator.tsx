import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { type ProductColorData } from 'types/product';

interface ColorValidationIndicatorProps {
  color: string;
  colorData: ProductColorData;
  className?: string;
}

/**
 * Small validation indicator for individual color tabs/sections
 * Shows whether a specific color has valid images
 */
const ColorValidationIndicator: React.FC<ColorValidationIndicatorProps> = ({
  color,
  colorData,
  className = ''
}) => {
  // Check if this color has valid images
  const hasValidImages = colorData?.images && Array.isArray(colorData.images) && 
    colorData.images.some(img => {
      const imageUrl = typeof img === 'string' ? img : img?.url;
      return imageUrl && imageUrl.trim() !== '';
    });

  const hasHexCode = colorData?.hex && colorData.hex.trim() !== '';

  const getTooltipMessage = () => {
    if (hasValidImages && hasHexCode) {
      return `"${color}" color has valid images and hex code`;
    } else if (!hasValidImages && !hasHexCode) {
      return `"${color}" needs images and hex code`;
    } else if (!hasValidImages) {
      return `"${color}" needs at least one image`;
    } else {
      return `"${color}" needs a hex color code`;
    }
  };

  if (hasValidImages && hasHexCode) {
    return (
      <div className="relative group">
        <CheckCircle 
          size={14} 
          className={`text-green-500 flex-shrink-0 ${className}`}
        />
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          {getTooltipMessage()}
        </div>
      </div>
    );
  } else {
    return (
      <div className="relative group">
        <AlertTriangle 
          size={14} 
          className={`text-amber-500 flex-shrink-0 ${className}`}
        />
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
          {getTooltipMessage()}
        </div>
      </div>
    );
  }
};

export default ColorValidationIndicator;
