import React from 'react';

interface DescriptionTextareaProps {
  value: string;
  onChange: (value: string) => void;
}

const DescriptionTextarea: React.FC<DescriptionTextareaProps> = ({ value, onChange }) => {
  return (
    <div>
      <label className="block luxury-subheading text-luxury-black mb-2 tracking-wider">
        Description
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full px-4 py-3 rounded-xl border border-luxury-gray/30 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all duration-300"
        required
      />
    </div>
  );
};

export default DescriptionTextarea;
