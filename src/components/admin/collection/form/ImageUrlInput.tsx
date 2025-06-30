import React from 'react';
import Image from 'next/image';

interface ImageUrlInputProps {
  value: string;
  onChange: (value: string) => void;
}

const ImageUrlInput: React.FC<ImageUrlInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <label className="block luxury-subheading text-sm text-luxury-black mb-2">
        Image URL
      </label>
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 luxury-body text-sm rounded-xl bg-luxury-cream/50 text-luxury-black border border-luxury-gray/20 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 focus:border-luxury-gold/30 transition-all duration-300"
        placeholder="Enter image URL"
        required
      />
      {value && (
        <div className="mt-3">
          <Image
            src={value}
            alt="Preview"
            className="w-full h-32 object-cover rounded-lg"
            width={400}
            height={128}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUrlInput;
