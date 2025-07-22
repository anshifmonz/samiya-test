import React from 'react';
import { useBulkImportConfig, useBulkImportCursor } from './BulkImportContext';

export const DynamicColumnHeaders: React.FC = () => {
  const { expectedHeaders } = useBulkImportConfig();
  const { activeColumnIndex } = useBulkImportCursor();

  return (
  <div className="px-3 py-2 bg-luxury-gray/10 rounded-md border">
    <span className="text-sm font-medium text-luxury-black mb-2 block">Column Order:</span>
    <div className="flex flex-wrap gap-2">
      {expectedHeaders.map((header, index) => (
        <div
          key={index}
          className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
            activeColumnIndex === index
              ? 'bg-luxury-gold text-luxury-gray shadow-sm transform scale-105'
              : 'bg-white text-luxury-gray border border-luxury-gray/20 hover:bg-luxury-gray/5'
          }`}
        >
          <span className="text-xs opacity-60 mr-1 text-black">{index + 1}.</span>
          {header}
        </div>
      ))}
    </div>
  </div>
  );
};
