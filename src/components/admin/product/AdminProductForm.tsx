import React from 'react';
import { createPortal } from 'react-dom';
import { type Product } from 'types/product';
import { type Category } from 'types/category';
import { X } from 'lucide-react';
import {
  ProductTitleInput,
  CategorySelect,
  DescriptionTextarea,
  PriceInput,
  ProductImagesSection,
  TagsSection,
  ActionButtons
} from './form';
import ActiveStatusSwitch from '../category/form/ActiveStatusSwitch';
import { useAdminProductForm } from 'hooks/useAdminProductForm';

interface AdminProductFormProps {
  product?: Product | null;
  categories: Category[];
  onSave: (product: Product | Omit<Product, 'id'>) => void;
  onCancel: () => void;
}

const AdminProductForm: React.FC<AdminProductFormProps> = ({ product, categories, onSave, onCancel }) => {
  const {
    formData,
    activeColorTab,
    mounted,
    handleTitleChange,
    handleDescriptionChange,
    handlePriceChange,
    handleCategoryChange,
    handleImagesChange,
    handleTagsChange,
    handleActiveChange,
    handleSubmit,
    handleCancel,
    setActiveColorTab,
    isEditing,
    modalTitle
  } = useAdminProductForm({ product, categories, onSave, onCancel });

  const modalContent = (
    <div className="fixed inset-0 bg-luxury-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
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

        <form onSubmit={handleSubmit} className="p-3 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProductTitleInput
              value={formData.title}
              onChange={handleTitleChange}
            />

            <CategorySelect
              value={formData.category}
              onChange={handleCategoryChange}
              categories={categories}
            />
          </div>

          <DescriptionTextarea
            value={formData.description}
            onChange={handleDescriptionChange}
          />

          <PriceInput
            value={formData.price}
            onChange={handlePriceChange}
          />

          <ProductImagesSection
            images={formData.images}
            onImagesChange={handleImagesChange}
            activeColorTab={activeColorTab}
            onActiveColorTabChange={(color) => setActiveColorTab(color)}
          />

          <TagsSection
            tags={formData.tags}
            onTagsChange={handleTagsChange}
          />

          <ActiveStatusSwitch
            label="Product"
            value={formData.active}
            onChange={handleActiveChange}
          />

          <ActionButtons
            onCancel={handleCancel}
            isEditing={isEditing}
          />
        </form>
      </div>
    </div>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
};

export default AdminProductForm;
