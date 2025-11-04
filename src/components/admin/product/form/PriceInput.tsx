import { useAdminProductFormFields } from './AdminProductFormContext';

interface PriceInputProps {
  label: string;
  field: 'price' | 'originalPrice';
}

const PriceInput: React.FC<PriceInputProps> = ({ label, field }) => {
  const { formData, fieldErrors, handlePriceChange, handleOriginalPriceChange } = useAdminProductFormFields();
  const hasError = !!fieldErrors[field];

  const value = formData[field];
  const onChange = field === 'price' ? handlePriceChange : handleOriginalPriceChange;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'].includes(e.key) ||
      (e.ctrlKey && ['a', 'c', 'v', 'x', 'z'].includes(e.key.toLowerCase())) ||
      ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)
    ) {
      return;
    }

    const currentValue = (e.target as HTMLInputElement).value;
    if (e.key === '.' && !currentValue.includes('.')) return;
    if (/^[0-9]$/.test(e.key)) return;

    e.preventDefault();
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (inputValue === '') {
      onChange(null);
      return;
    }

    const numericRegex = /^\d*\.?\d*$/;
    if (!numericRegex.test(inputValue))
      return;
    const numericValue = parseFloat(inputValue);
    onChange(isNaN(numericValue) ? null : numericValue);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');

    const numericRegex = /^\d*\.?\d*$/;
    if (numericRegex.test(pastedText) && pastedText !== '') {
      const numericValue = parseFloat(pastedText);
      if (!isNaN(numericValue)) {
        onChange(numericValue);
      }
    }
  };

  return (
    <div>
      <label className="block luxury-subheading text-sm text-luxury-black mb-2">
        {label} (₹)
      </label>
      <input
        type="text"
        name={field}
        inputMode="decimal"
        value={value === null ? '' : value.toString()}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        className={`w-full px-4 py-3 luxury-body text-sm rounded-xl bg-transparent text-luxury-black border transition-all duration-300 focus:outline-none focus:ring-2 ${
          hasError
            ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
            : 'border-luxury-gray/20 focus:ring-luxury-gold/50 focus:border-luxury-gold/30'
        }`}
        placeholder="Enter price"
        autoComplete="off"
        required
      />
      {hasError && (
        <p className="mt-1 text-sm text-red-600">{fieldErrors[field]}</p>
      )}
    </div>
  );
};

export default PriceInput;
