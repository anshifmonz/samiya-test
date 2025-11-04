import { useAdminProductFormState, useAdminProductFormActions } from './AdminProductFormContext';

const ProductTitleInput: React.FC = () => {
  const { formData, fieldErrors } = useAdminProductFormState();
  const { handleTitleChange } = useAdminProductFormActions();
  const hasError = !!fieldErrors.title;

  return (
    <div>
      <label className="block luxury-subheading text-sm text-luxury-black mb-2">
        Product Title
      </label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={(e) => handleTitleChange(e.target.value)}
        className={`w-full px-4 py-3 luxury-body text-sm rounded-xl bg-transparent text-luxury-black border transition-all duration-300 focus:outline-none focus:ring-2 ${
          hasError
            ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
            : 'border-luxury-gray/20 focus:ring-luxury-gold/50 focus:border-luxury-gold/30'
        }`}
        placeholder="Enter product title"
        required
      />
      {hasError && (
        <p className="mt-1 text-sm text-red-600">{fieldErrors.title}</p>
      )}
    </div>
  );
};

export default ProductTitleInput;
