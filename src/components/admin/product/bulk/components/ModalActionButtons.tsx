import React from 'react';
import { Upload } from 'lucide-react';
import { Button } from 'ui/button';

interface ModalActionButtonsProps {
  validProductsCount: number;
  isValidating: boolean;
  onImport: () => void;
  onCancel: () => void;
}

/**
 * Modal action buttons component (Cancel/Import)
 */
export const ModalActionButtons: React.FC<ModalActionButtonsProps> = ({
  validProductsCount,
  isValidating,
  onImport,
  onCancel
}) => (
  <div className="flex items-center justify-end space-x-3 pt-4 border-t">
    <Button variant="outline" onClick={onCancel}>
      Cancel
    </Button>
    <Button
      onClick={onImport}
      disabled={validProductsCount === 0 || isValidating}
      className="bg-luxury-gold hover:bg-luxury-gold/90 text-white"
    >
      <Upload className="h-4 w-4 mr-2" />
      {isValidating ? 'Importing...' : `Import ${validProductsCount} Products`}
    </Button>
  </div>
);
