import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { type Category } from '@/types/category';
import {
  CategoryNameInput,
  DescriptionTextarea,
  ParentCategorySelect,
  ActiveStatusSwitch,
  CategoryPathPreview,
  ActionButtons,
  ModalHeader
} from './form';

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
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentId: 'none',
    isActive: true
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        parentId: category.parentId || 'none',
        isActive: category.isActive
      });
    } else {
      setFormData({
        name: '',
        description: '',
        parentId: 'none',
        isActive: true
      });
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // build the path based on parent selection
    let path: string[] = [formData.name];
    let level = 0;

    if (formData.parentId && formData.parentId !== 'none') {
      const parent = categories.find(c => c.id === formData.parentId);
      if (parent) {
        path = [...parent.path, formData.name];
        level = parent.level + 1;
      }
    }

    const newCategory: Omit<Category, 'id' | 'createdAt' | 'updatedAt'> = {
      name: formData.name,
      description: formData.description || undefined,
      parentId: formData.parentId === 'none' ? undefined : formData.parentId,
      level,
      path,
      isActive: formData.isActive
    };

    onSave(newCategory);
  };

  const modalContent = (
    <div className="fixed inset-0 bg-luxury-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <ModalHeader
          isEditMode={!!category}
          onClose={onCancel}
        />

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <CategoryNameInput
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
          />

          <DescriptionTextarea
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
          />

          <ParentCategorySelect
            value={formData.parentId}
            onChange={(value) => setFormData({ ...formData, parentId: value })}
            categories={categories}
            currentCategory={category}
          />

          <ActiveStatusSwitch
            value={formData.isActive}
            onChange={(value) => setFormData({ ...formData, isActive: value })}
          />

          <CategoryPathPreview
            parentId={formData.parentId}
            categoryName={formData.name}
            categories={categories}
          />

          <ActionButtons
            onCancel={onCancel}
            isEditMode={!!category}
            isDisabled={!formData.name.trim()}
          />
        </form>
      </div>
    </div>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
};

export default AdminCategoryForm;
