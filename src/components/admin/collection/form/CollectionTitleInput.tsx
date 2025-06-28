import React from 'react';

interface CollectionTitleInputProps {
  value: string;
  onChange: (value: string) => void;
}

const CollectionTitleInput: React.FC<CollectionTitleInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <label className="block luxury-subheading text-sm text-luxury-black mb-2">
        Collection Title
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 luxury-body text-sm rounded-xl bg-luxury-cream/50 text-luxury-black border border-luxury-gray/20 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 focus:border-luxury-gold/30 transition-all duration-300"
        placeholder="Enter collection title"
        required
      />
    </div>
  );
};

export default CollectionTitleInput;
