import { useState, useEffect } from 'react';
import { type Product, type CreateProductData, type ProductColorData, type Size } from 'types/product';
import { type Category } from 'types/category';
import { ensureProductImageFormat } from 'utils/migrateProductImages';

interface UseAdminProductFormProps {
  product?: Product | null;
  categories: Category[];
  onSave: (product: Product | CreateProductData) => void;
  onCancel: () => void;
}

interface FormData {
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  categoryId: string;
  images: Record<string, ProductColorData>;
  tags: string[];
  sizes: Size[];
  active: boolean;
  short_code: string;
}

export const useAdminProductForm = ({ product, categories, onSave, onCancel }: UseAdminProductFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: 0,
    originalPrice: 0,
    categoryId: '',
    images: {},
    tags: [],
    sizes: [],
    active: true,
    short_code: ''
  });

  const [activeColorTab, setActiveColorTab] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    if (product) {
      const migratedProduct = ensureProductImageFormat(product);

      const categoryId = migratedProduct.categoryId || '';

      setFormData({
        title: migratedProduct.title,
        description: migratedProduct.description,
        price: migratedProduct.price,
        originalPrice: migratedProduct.originalPrice,
        categoryId: categoryId,
        images: { ...migratedProduct.images },
        tags: [...migratedProduct.tags],
        sizes: [...(migratedProduct.sizes || [])],
        active: migratedProduct.active !== undefined ? migratedProduct.active : true,
        short_code: migratedProduct.short_code
      });

      const colors = Object.keys(migratedProduct.images);
      if (colors.length > 0) {
        setActiveColorTab(colors[0]);
      }
    }
    }, [product, categories]);

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
  const handleOriginalPriceChange = (value: number) => updateFormField('originalPrice', value);
  const handleCategoryChange = (value: string) => updateFormField('categoryId', value);
  const handleImagesChange = (images: Record<string, ProductColorData>) => updateFormField('images', images);
  const handleTagsChange = (tags: string[]) => updateFormField('tags', tags);
  const handleSizesChange = (sizes: Size[]) => updateFormField('sizes', sizes);
  const handleActiveChange = (active: boolean) => updateFormField('active', active);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (product) {
      const productData = {
        ...formData,
        id: product.id,
        short_code: product.short_code
      };
      onSave(productData);
    } else {
      const { short_code, ...productDataWithoutShortCode } = formData;
      onSave(productDataWithoutShortCode);
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
    handleOriginalPriceChange,
    handleCategoryChange,
    handleImagesChange,
    handleTagsChange,
    handleSizesChange,
    handleActiveChange,
    handleSubmit,
    handleCancel,
    setActiveColorTab,

    // Computed values
    isEditing: !!product,
    modalTitle: product ? 'Edit Product' : 'Add New Product'
  };
};
