import React from 'react';
import { useBulkImportConfig, useBulkImportActions } from '../context';

// Instructions and sample data loader component
export const Instructions: React.FC = () => {
  const { sampleData } = useBulkImportConfig();
  const { handleLoadSample } = useBulkImportActions();

  return (
  <>
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-luxury-black">Sample Format</h3>
        <button
          onClick={handleLoadSample}
          className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-luxury-gold hover:text-luxury-gold/80 transition-colors duration-200"
        >
          <span>Load Sample</span>
        </button>
      </div>
      <div className="bg-luxury-gray/10 p-3 rounded-lg text-xs font-mono overflow-x-auto">
        <pre className="whitespace-pre-wrap">{sampleData}</pre>
      </div>
    </div>
  </>
  );
};
