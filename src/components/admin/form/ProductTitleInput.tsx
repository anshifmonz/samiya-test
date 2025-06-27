import React from 'react';

interface ProductTitleInputProps {
  value: string;
  onChange: (value: string) => void;
}

const ProductTitleInput: React.FC<ProductTitleInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <label className="block luxury-subheading text-luxury-black mb-2 tracking-wider">
        Product Title
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-luxury-gray/30 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all duration-300"
        required
      />
    </div>
  );
};

export default ProductTitleInput;
