import React from 'react';
import { useAdminProductFormState, useAdminProductFormActions } from './AdminProductFormContext';

const ProductTitleInput: React.FC = () => {
  const { formData } = useAdminProductFormState();
  const { handleTitleChange } = useAdminProductFormActions();
  return (
    <div>
      <label className="block luxury-subheading text-sm text-luxury-black mb-2">
        Product Title
      </label>
      <input
        type="text"
        value={formData.title}
        onChange={(e) => handleTitleChange(e.target.value)}
        className="w-full px-4 py-3 luxury-body text-sm rounded-xl bg-luxury-cream/50 text-luxury-black border border-luxury-gray/20 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 focus:border-luxury-gold/30 transition-all duration-300"
        placeholder="Enter product title"
        required
      />
    </div>
  );
};

export default ProductTitleInput;
