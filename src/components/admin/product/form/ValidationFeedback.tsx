import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { getColorValidationStatus } from 'lib/utils/isValidImageData';
import { useAdminProductFormState } from './AdminProductFormContext';

const ValidationFeedback: React.FC = () => {
  const { formData, validationError } = useAdminProductFormState();

  // Get real-time validation status for images
  const validationStatus = getColorValidationStatus(formData.images);

  return (
    <div className="space-y-3">
      {/* Real-time image validation feedback */}
      <div>
        {!validationStatus.hasColors && (
          <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
            <Info size={16} className="flex-shrink-0" />
            <span>This product has no color variants. Images are optional for products without color variations.</span>
          </div>
        )}

        {validationStatus.hasColors && validationStatus.allColorsValid && (
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
            <CheckCircle size={16} className="flex-shrink-0" />
            <span>All color variants have valid images and can be saved.</span>
          </div>
        )}

        {validationStatus.hasColors && !validationStatus.allColorsValid && (
          <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
            <AlertCircle size={16} className="flex-shrink-0" />
            <div>
              <div className="font-medium">Color validation warning:</div>
              <div>{validationStatus.warningMessage}</div>
              <div className="text-xs mt-1 opacity-80">
                Each color variant must have at least one image before the product can be saved.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submission error feedback */}
      {validationError && (
        <div className="border border-red-200 bg-red-50 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-red-800 mb-1">Cannot Save Product</h4>
              <p className="text-sm text-red-700">{validationError}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationFeedback;
