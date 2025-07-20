import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface CategoryInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  placeholder: string;
  disabled: boolean;
  isOpen: boolean;
}

/**
 * Input field component for category autocomplete
 */
export const CategoryInput = forwardRef<HTMLInputElement, CategoryInputProps>(
  ({ value, onChange, onKeyDown, onFocus, placeholder, disabled, isOpen }, ref) => {
    return (
      <div className="relative">
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-3 py-2 border border-luxury-gray/20 rounded-lg focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold transition-colors duration-200 pr-8"
        />
        <ChevronDown 
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-luxury-gray transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>
    );
  }
);

CategoryInput.displayName = 'CategoryInput';
