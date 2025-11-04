import { useAdminProductFormFields } from './AdminProductFormContext';

const DescriptionTextarea: React.FC = () => {
  const { formData, fieldErrors, handleDescriptionChange } = useAdminProductFormFields();
  const hasError = !!fieldErrors.description;

  return (
    <div>
      <label className="block luxury-subheading text-sm text-luxury-black mb-2">
        Description
      </label>
      <textarea
        name="description"
        value={formData.description}
        onChange={(e) => handleDescriptionChange(e.target.value)}
        rows={4}
        className={`w-full px-4 py-3 luxury-body text-sm rounded-xl bg-transparent text-luxury-black border transition-all duration-300 resize-none focus:outline-none focus:ring-2 ${
          hasError
            ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
            : 'border-luxury-gray/20 focus:ring-luxury-gold/50 focus:border-luxury-gold/30'
        }`}
        placeholder="Enter product description"
        required
      />
      {hasError && (
        <p className="mt-1 text-sm text-red-600">{fieldErrors.description}</p>
      )}
    </div>
  );
};

export default DescriptionTextarea;
