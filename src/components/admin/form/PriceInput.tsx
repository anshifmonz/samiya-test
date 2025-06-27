import React from 'react';

interface PriceInputProps {
  value: number;
  onChange: (value: number) => void;
}

const PriceInput: React.FC<PriceInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <label className="block luxury-subheading text-luxury-black mb-2 tracking-wider">
        Price (₹)
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        className="w-full px-4 py-3 rounded-xl border border-luxury-gray/30 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all duration-300"
        required
      />
    </div>
  );
};

export default PriceInput;
