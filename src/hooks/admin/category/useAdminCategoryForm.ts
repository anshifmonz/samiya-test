import { useState, useEffect } from 'react';
import { type Category } from 'types/category';

interface UseAdminCategoryFormProps {
  category?: Category | null;
  categories: Category[];
  onSave: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

interface FormData {
  name: string;
  description: string;
  parentId: string;
  isActive: boolean;
}

export const useAdminCategoryForm = ({ category, categories, onSave, onCancel }: UseAdminCategoryFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    parentId: 'none',
    isActive: true
  });

  const [mounted, setMounted] = useState(false);

  // Initialize component mount state and body scroll management
  useEffect(() => {
    setMounted(true);
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

  const updateFormField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNameChange = (value: string) => updateFormField('name', value);
  const handleDescriptionChange = (value: string) => updateFormField('description', value);
  const handleParentIdChange = (value: string) => updateFormField('parentId', value);
  const handleIsActiveChange = (value: boolean) => updateFormField('isActive', value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // build path based on parent selection
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

  const handleCancel = () => {
    onCancel();
  };

  return {
    // State
    formData,
    mounted,

    // Handlers
    handleNameChange,
    handleDescriptionChange,
    handleParentIdChange,
    handleIsActiveChange,
    handleSubmit,
    handleCancel,

    // Computed values
    isEditMode: !!category,
    isFormValid: !!formData.name.trim()
  };
};
