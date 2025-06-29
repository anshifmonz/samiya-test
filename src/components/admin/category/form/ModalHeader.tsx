import React from 'react';
import { X } from 'lucide-react';

interface ModalHeaderProps {
  isEditMode: boolean;
  onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ isEditMode, onClose }) => {
  return (
    <div className="sticky top-0 bg-white rounded-t-2xl border-b border-luxury-gray/20 p-6 flex items-center justify-between">
      <h2 className="luxury-heading text-2xl text-luxury-black">
        {isEditMode ? 'Edit Category' : 'Add New Category'}
      </h2>
      <button
        onClick={onClose}
        className="text-luxury-gray hover:text-luxury-black transition-colors duration-200"
        type="button"
      >
        <X size={24} />
      </button>
    </div>
  );
};

export default ModalHeader;
