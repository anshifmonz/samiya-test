import { useState, useEffect } from 'react';
import { type Product } from 'types/product';
import { type Category } from 'types/category';

interface UseAdminProductFormProps {
  product?: Product | null;
  categories: Category[];
  onSave: (product: Product | Omit<Product, 'id'>) => void;
  onCancel: () => void;
}

interface FormData {
  title: string;
  description: string;
  price: number;
  category: string;
  images: Record<string, string[]>;
  tags: string[];
  active: boolean;
}

export const useAdminProductForm = ({ product, categories, onSave, onCancel }: UseAdminProductFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: 0,
    category: '',
    images: {},
    tags: [],
    active: true
  });

  const [activeColorTab, setActiveColorTab] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  // Initialize component mount state and body scroll management
  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Initialize form data when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        images: { ...product.images },
        tags: [...product.tags],
        active: product.active !== undefined ? product.active : true
      });

      const colors = Object.keys(product.images);
      if (colors.length > 0) {
        setActiveColorTab(colors[0]);
      }
    }
  }, [product]);

  useEffect(() => {
    const colors = Object.keys(formData.images);
    if (colors.length > 0 && !colors.includes(activeColorTab)) {
      setActiveColorTab(colors[0]);
    }
  }, [formData.images, activeColorTab]);

  const updateFormField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTitleChange = (value: string) => updateFormField('title', value);
  const handleDescriptionChange = (value: string) => updateFormField('description', value);
  const handlePriceChange = (value: number) => updateFormField('price', value);
  const handleCategoryChange = (value: string) => updateFormField('category', value);
  const handleImagesChange = (images: Record<string, string[]>) => updateFormField('images', images);
  const handleTagsChange = (tags: string[]) => updateFormField('tags', tags);
  const handleActiveChange = (active: boolean) => updateFormField('active', active);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (product) {
      onSave({ ...formData, id: product.id });
    } else {
      onSave(formData);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return {
    // State
    formData,
    activeColorTab,
    mounted,

    // Handlers
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

    // Computed values
    isEditing: !!product,
    modalTitle: product ? 'Edit Product' : 'Add New Product'
  };
};
