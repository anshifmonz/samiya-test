import React from 'react';
import { Upload } from 'lucide-react';
import { Button } from 'ui/button';
import { useBulkImportComputed, useBulkImportState, useBulkImportModalActions } from './BulkImportContext';

export const ModalActionButtons: React.FC = () => {
  const { validProductsCount } = useBulkImportComputed();
  const { isValidating } = useBulkImportState();
  const { handleImport, handleCancel } = useBulkImportModalActions();

  return (
    <div className="flex items-center justify-end gap-3 pt-4 border-t">
      <Button variant="outline" onClick={handleCancel}>
        Cancel
      </Button>
      <Button
        onClick={handleImport}
        disabled={validProductsCount === 0 || isValidating}
        className="bg-luxury-gold hover:bg-luxury-gold/90 text-white"
      >
        <Upload className="h-4 w-4 mr-2" />
        {isValidating ? 'Importing...' : `Import ${validProductsCount} Products`}
      </Button>
    </div>
  );
};
