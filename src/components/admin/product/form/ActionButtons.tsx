import React from 'react';
import { useAdminProductFormActions_Buttons, useAdminProductFormState } from './AdminProductFormContext';
import { checkSubmissionErrors } from 'lib/utils/isValidImageData';

const ActionButtons: React.FC = () => {
  const { handleCancel, isEditing } = useAdminProductFormActions_Buttons();
  const { formData, isSubmitting } = useAdminProductFormState();

  // check if submission should be blocked
  const submissionCheck = checkSubmissionErrors(formData.images);
  const canSubmit = submissionCheck.canSubmit && !isSubmitting;

  return (
    <div className="flex gap-4 pt-6 border-t border-luxury-gray/20">
      <button
        type="button"
        onClick={handleCancel}
        disabled={isSubmitting}
        className="flex-1 px-6 py-3 luxury-body text-sm font-medium text-luxury-gray bg-luxury-cream/50 rounded-xl hover:bg-luxury-cream transition-all duration-300 border border-luxury-gray/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={!canSubmit}
        className={`
          flex-1 px-6 py-3 rounded-xl font-medium text-sm tracking-wider uppercase shadow-lg transition-all duration-300
          ${
            canSubmit
              ? 'luxury-btn-primary hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
          }
          ${
            isSubmitting ? 'opacity-70' : ''
          }
        `}
        title={!canSubmit ? submissionCheck.errorMessage : undefined}
      >
        {isSubmitting
          ? (isEditing ? 'Updating...' : 'Creating...')
          : canSubmit
          ? (isEditing ? 'Update Product' : 'Create Product')
          : 'Fix Validation Errors'
        }
      </button>
    </div>
  );
};

export default ActionButtons;
