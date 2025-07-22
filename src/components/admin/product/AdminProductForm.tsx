import { createPortal } from 'react-dom';
import { type Product, type CreateProductData } from 'types/product';
import { type Category } from 'types/category';
import {
  ProductTitleInput,
  ProductIdDisplay,
  CategorySelect,
  DescriptionTextarea,
  PriceInput,
  ProductImagesSection,
  TagsSection,
  SizeSelect,
  ActionButtons,
  ActiveStatusSwitch,
  AdminProductFormHeader
} from './form';
import { useAdminProductForm } from 'hooks/admin/product/useAdminProductForm';
import { AdminProductFormProvider, useAdminProductFormContext } from './form/AdminProductFormContext';

interface AdminProductFormProps {
  product?: Product | null;
  categories: Category[];
  onSave: (product: Product | CreateProductData) => void;
  onCancel: () => void;
}

const AdminProductFormContent: React.FC = () => {
  const { product, handleSubmit } = useAdminProductFormContext();

  return (
    <form onSubmit={handleSubmit} className="p-3 sm:p-6 space-y-6">
      <ProductIdDisplay productId={product?.short_code} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductTitleInput />
        <CategorySelect />
      </div>

      <DescriptionTextarea />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PriceInput label="Price" field="price" />
        <PriceInput label="Original Price" field="originalPrice" />
      </div>

      <ProductImagesSection />
      <SizeSelect />
      <TagsSection />
      <ActiveStatusSwitch />
      <ActionButtons />
    </form>
  );
};

const AdminProductForm: React.FC<AdminProductFormProps> = ({ product, categories, onSave, onCancel }) => {
  const logic = useAdminProductForm({ product, categories, onSave, onCancel });

  const providerValue = {
    // ===== ORGANIZED CONTEXT STRUCTURE =====
    config: {
      product,
      categories,
    },

    state: {
      formData: logic.formData,
      activeColorTab: logic.activeColorTab,
      mounted: logic.mounted,
    },

    computed: {
      isEditing: logic.isEditing,
      modalTitle: logic.modalTitle,
    },

    actions: {
      handleTitleChange: logic.handleTitleChange,
      handleDescriptionChange: logic.handleDescriptionChange,
      handlePriceChange: logic.handlePriceChange,
      handleOriginalPriceChange: logic.handleOriginalPriceChange,
      handleCategoryChange: logic.handleCategoryChange,
      handleImagesChange: logic.handleImagesChange,
      handleTagsChange: logic.handleTagsChange,
      handleSizesChange: logic.handleSizesChange,
      handleActiveChange: logic.handleActiveChange,
      setActiveColorTab: logic.setActiveColorTab,
    },

    formControl: {
      handleSubmit: logic.handleSubmit,
      handleCancel: logic.handleCancel,
    },

    // ===== LEGACY COMPATIBILITY =====
    formData: logic.formData,
    activeColorTab: logic.activeColorTab,
    mounted: logic.mounted,
    handleTitleChange: logic.handleTitleChange,
    handleDescriptionChange: logic.handleDescriptionChange,
    handlePriceChange: logic.handlePriceChange,
    handleOriginalPriceChange: logic.handleOriginalPriceChange,
    handleCategoryChange: logic.handleCategoryChange,
    handleImagesChange: logic.handleImagesChange,
    handleTagsChange: logic.handleTagsChange,
    handleSizesChange: logic.handleSizesChange,
    handleActiveChange: logic.handleActiveChange,
    handleSubmit: logic.handleSubmit,
    handleCancel: logic.handleCancel,
    setActiveColorTab: logic.setActiveColorTab,
    isEditing: logic.isEditing,
    modalTitle: logic.modalTitle,
    categories,
    product,
  };

  const modalContent = (
    <AdminProductFormProvider value={providerValue}>
      <div className="fixed inset-0 bg-luxury-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <AdminProductFormHeader />
          <AdminProductFormContent />
        </div>
      </div>
    </AdminProductFormProvider>
  );

  return logic.mounted ? createPortal(modalContent, document.body) : null;
};

export default AdminProductForm;
