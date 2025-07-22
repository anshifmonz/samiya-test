import { X } from "lucide-react";
import { useBulkImportContext } from "./BulkImportContext";

const BulkImportModalHeader: React.FC = () => {
  const { onCancel } = useBulkImportContext();

  return (
    <div className="sticky top-0 bg-white rounded-t-xl sm:rounded-t-2xl border-b border-luxury-gray/20 p-4 sm:p-6 flex items-center justify-between z-[9999]">
      <h2 className="luxury-heading text-lg sm:text-2xl text-luxury-black">
        Bulk Import Products
      </h2>
      <button
        onClick={onCancel}
        className="text-luxury-gray hover:text-luxury-black transition-colors duration-200 flex-shrink-0"
        type="button"
      >
        <X size={20} className="sm:w-6 sm:h-6" />
      </button>
    </div>
  );
};

export default BulkImportModalHeader;
