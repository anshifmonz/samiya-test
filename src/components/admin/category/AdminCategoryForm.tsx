import React from 'react';
import { createPortal } from 'react-dom';
import { type Category } from 'types/category';
import {
  CategoryNameInput,
  DescriptionTextarea,
  ParentCategorySelect,
  ActiveStatusSwitch,
  CategoryPathPreview,
  ActionButtons,
  ModalHeader
} from './form';
import { useAdminCategoryForm } from 'hooks/useAdminCategoryForm';

interface AdminCategoryFormProps {
  category?: Category | null;
  categories: Category[];
  onSave: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const AdminCategoryForm: React.FC<AdminCategoryFormProps> = ({
  category,
  categories,
  onSave,
  onCancel
}) => {
  const {
    formData,
    mounted,
    handleNameChange,
    handleDescriptionChange,
    handleParentIdChange,
    handleIsActiveChange,
    handleSubmit,
    handleCancel,
    isEditMode,
    isFormValid
  } = useAdminCategoryForm({ category, categories, onSave, onCancel });

  const modalContent = (
    <div className="fixed inset-0 bg-luxury-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <ModalHeader
          isEditMode={isEditMode}
          onClose={handleCancel}
        />

        <form onSubmit={handleSubmit} className="p-3 sm:p-6 space-y-6">
          <CategoryNameInput
            value={formData.name}
            onChange={handleNameChange}
          />

          <DescriptionTextarea
            value={formData.description}
            onChange={handleDescriptionChange}
          />

          <ParentCategorySelect
            value={formData.parentId}
            onChange={handleParentIdChange}
            categories={categories}
            currentCategory={category}
          />

          <ActiveStatusSwitch
            label="Category"
            value={formData.isActive}
            onChange={handleIsActiveChange}
          />

          <CategoryPathPreview
            parentId={formData.parentId}
            categoryName={formData.name}
            categories={categories}
          />

          <ActionButtons
            onCancel={handleCancel}
            isEditMode={isEditMode}
            isDisabled={!isFormValid}
          />
        </form>
      </div>
    </div>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
};

export default AdminCategoryForm;
