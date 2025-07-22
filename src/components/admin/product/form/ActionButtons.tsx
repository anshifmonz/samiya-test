import React from 'react';
import { useAdminProductFormActions_Buttons } from './AdminProductFormContext';

const ActionButtons: React.FC = () => {
  const { handleCancel, isEditing } = useAdminProductFormActions_Buttons();
  
  return (
    <div className="flex gap-4 pt-6 border-t border-luxury-gray/20">
      <button
        type="button"
        onClick={handleCancel}
        className="flex-1 px-6 py-3 luxury-body text-sm font-medium text-luxury-gray bg-luxury-cream/50 rounded-xl hover:bg-luxury-cream transition-all duration-300 border border-luxury-gray/20"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="flex-1 luxury-btn-primary px-6 py-3 rounded-xl font-medium text-sm tracking-wider uppercase shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {isEditing ? 'Update Product' : 'Create Product'}
      </button>
    </div>
  );
};

export default ActionButtons;
