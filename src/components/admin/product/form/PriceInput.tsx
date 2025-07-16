import React from 'react';

interface PriceInputProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
}

const PriceInput: React.FC<PriceInputProps> = ({ value, onChange, label  }) => {
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
