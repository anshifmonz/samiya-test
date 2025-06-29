import React from 'react';

interface CategorySelectProps {
  value: 'Gents' | 'Women' | 'Kids';
  onChange: (value: 'Gents' | 'Women' | 'Kids') => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ value, onChange }) => {
  return (
    <div>
      <label className="block luxury-subheading text-sm text-luxury-black mb-2">
        Category
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as 'Gents' | 'Women' | 'Kids')}
        className="w-full px-4 py-3 luxury-body text-sm rounded-xl bg-luxury-cream/50 text-luxury-black border border-luxury-gray/20 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 focus:border-luxury-gold/30 transition-all duration-300"
      >
        <option value="Women">Women</option>
        <option value="Gents">Gents</option>
        <option value="Kids">Kids</option>
      </select>
    </div>
  );
};

export default CategorySelect;
