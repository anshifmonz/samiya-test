import React from 'react';
import { useAdminProductFormFields } from './AdminProductFormContext';

interface PriceInputProps {
  label: string;
  field: 'price' | 'originalPrice';
}

const PriceInput: React.FC<PriceInputProps> = ({ label, field }) => {
  const { formData, handlePriceChange, handleOriginalPriceChange } = useAdminProductFormFields();
  
  const value = formData[field];
  const onChange = field === 'price' ? handlePriceChange : handleOriginalPriceChange;
  return (
    <div>
      <label className="block luxury-subheading text-sm text-luxury-black mb-2">
        {label} (₹)
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="w-full px-4 py-3 luxury-body text-sm rounded-xl bg-luxury-cream/50 text-luxury-black border border-luxury-gray/20 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 focus:border-luxury-gold/30 transition-all duration-300"
        placeholder="Enter price"
        required
      />
    </div>
  );
};

export default PriceInput;
