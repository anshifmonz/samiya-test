import React from 'react';
import { X } from 'lucide-react';
import BulkImportImagesSection from './BulkImportImagesSection';
import { useBulkImportImageDialog, useBulkImportImageActions } from '../context';

const BulkImportImageDialog: React.FC = () => {
  const { isOpen, productTitle, imageData } = useBulkImportImageDialog();
  const { closeImageDialog, saveImageChanges, updateImageDataRealTime } = useBulkImportImageActions();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-luxury-black/60 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-white border-b border-luxury-gray/20 p-6 flex items-center justify-between">
          <h3 className="luxury-heading text-xl text-luxury-black">
            Edit Images - {productTitle}
          </h3>
          <button
            onClick={closeImageDialog}
            className="text-luxury-gray hover:text-luxury-black transition-colors duration-200"
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <BulkImportImagesSection
            imageData={imageData}
            onSave={saveImageChanges}
            onRealTimeUpdate={updateImageDataRealTime}
          />
        </div>

        <div className="bg-white border-t border-luxury-gray/20 p-6 flex gap-3">
          <button
            type="button"
            onClick={closeImageDialog}
            className="flex-1 px-4 py-2 text-sm font-medium text-luxury-gray bg-luxury-cream/50 rounded-xl hover:bg-luxury-cream transition-all duration-300 border border-luxury-gray/20"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              saveImageChanges(imageData);
              closeImageDialog();
            }}
            className="flex-1 bg-luxury-gold text-luxury-black px-4 py-2 rounded-xl hover:bg-luxury-gold-light transition-colors duration-200"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkImportImageDialog;
