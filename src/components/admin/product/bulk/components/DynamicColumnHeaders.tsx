import React from 'react';

interface DynamicColumnHeadersProps {
  expectedHeaders: string[];
  activeColumnIndex: number | null;
}

/**
 * Dynamic column headers with active highlighting
 */
export const DynamicColumnHeaders: React.FC<DynamicColumnHeadersProps> = ({
  expectedHeaders,
  activeColumnIndex
}) => (
  <div className="px-3 py-2 bg-luxury-gray/10 rounded-md border">
    <span className="text-sm font-medium text-luxury-black mb-2 block">Column Order:</span>
    <div className="flex flex-wrap gap-2">
      {expectedHeaders.map((header, index) => (
        <div
          key={index}
          className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
            activeColumnIndex === index
              ? 'bg-luxury-gold text-white shadow-sm transform scale-105'
              : 'bg-white text-luxury-gray border border-luxury-gray/20 hover:bg-luxury-gray/5'
          }`}
        >
          <span className="text-xs opacity-60 mr-1">{index + 1}.</span>
          {header}
          {activeColumnIndex === index && (
            <span className="ml-1 text-xs opacity-80">← typing here</span>
          )}
        </div>
      ))}
    </div>
    {activeColumnIndex !== null && (
      <div className="text-xs text-luxury-gold mt-2">
        Currently typing in: <strong>{expectedHeaders[activeColumnIndex]}</strong> column
      </div>
    )}
  </div>
);
