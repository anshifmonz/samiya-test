import React from 'react';

interface CategoryNameInputProps {
  value: string;
  onChange: (value: string) => void;
}

const CategoryNameInput: React.FC<CategoryNameInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <label className="block luxury-subheading text-sm text-luxury-black mb-2">
        Category Name
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 luxury-body text-sm rounded-xl bg-luxury-cream/50 text-luxury-black border border-luxury-gray/20 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 focus:border-luxury-gold/30 transition-all duration-300"
        placeholder="Enter category name"
        required
      />
    </div>
  );
};

export default CategoryNameInput;
