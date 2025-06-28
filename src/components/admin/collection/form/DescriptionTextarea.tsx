import React from 'react';

interface DescriptionTextareaProps {
  value: string;
  onChange: (value: string) => void;
}

const DescriptionTextarea: React.FC<DescriptionTextareaProps> = ({ value, onChange }) => {
  return (
    <div>
      <label className="block luxury-subheading text-sm text-luxury-black mb-2">
        Description
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full px-4 py-3 luxury-body text-sm rounded-xl bg-luxury-cream/50 text-luxury-black border border-luxury-gray/20 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 focus:border-luxury-gold/30 transition-all duration-300 resize-none"
        placeholder="Enter collection description"
        required
      />
    </div>
  );
};

export default DescriptionTextarea;
