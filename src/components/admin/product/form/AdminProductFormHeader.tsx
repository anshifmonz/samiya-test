import { useAdminProductFormContext } from './AdminProductFormContext';
import { X } from 'lucide-react';

const AdminProductFormHeader: React.FC = () => {
  const { modalTitle, handleCancel } = useAdminProductFormContext();

  return (
    <div className="sticky top-0 bg-white rounded-t-2xl border-b border-luxury-gray/20 p-6 flex items-center justify-between z-[9999]">
      <h2 className="luxury-heading text-2xl text-luxury-black">
        {modalTitle}
      </h2>
      <button
        onClick={handleCancel}
        className="text-luxury-gray hover:text-luxury-black transition-colors duration-200"
        type="button"
      >
        <X size={24} />
      </button>
    </div>
  );
};

export default AdminProductFormHeader;
