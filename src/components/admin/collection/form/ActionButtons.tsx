import React from 'react';

interface ActionButtonsProps {
  onCancel: () => void;
  isEditing: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onCancel, isEditing }) => {
  return (
    <div className="flex gap-4 pt-6 border-t border-luxury-gray/20">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 px-6 py-3 luxury-body text-sm font-medium text-luxury-gray bg-luxury-cream/50 rounded-xl hover:bg-luxury-cream transition-all duration-300 border border-luxury-gray/20"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="flex-1 luxury-btn-primary px-6 py-3 rounded-xl font-medium text-sm tracking-wider uppercase shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {isEditing ? 'Update Collection' : 'Create Collection'}
      </button>
    </div>
  );
};

export default ActionButtons;
