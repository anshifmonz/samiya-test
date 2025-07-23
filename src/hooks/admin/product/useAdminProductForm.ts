import { useState, useEffect } from 'react';
import { type Product, type CreateProductData, type ProductColorData, type Size } from 'types/product';
import { type Category } from 'types/category';
import { ensureProductImageFormat } from 'utils/migrateProductImages';
import { checkSubmissionErrors } from 'lib/utils/isValidImageData';

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
  const [validationError, setValidationError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Clear any previous validation errors
    setValidationError('');
    setIsSubmitting(true);

    // Validate the form data
    const { canSubmit, errorMessage, detailedErrors } = checkSubmissionErrors(formData.images);

    if (!canSubmit) {
      setValidationError(errorMessage || 'Please fix validation errors before submitting.');
      setIsSubmitting(false);

      // Log detailed errors for debugging
      if (detailedErrors.length > 0) {
        console.warn('Product validation errors:', detailedErrors);
      }

      return;
    }

    try {
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
    } catch (error) {
      console.error('Error saving product:', error);
      setValidationError('An error occurred while saving the product. Please try again.');
    } finally {
      setIsSubmitting(false);
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
    validationError,
    isSubmitting,

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
    clearValidationError: () => setValidationError(''),

    // Computed values
    isEditing: !!product,
    modalTitle: product ? 'Edit Product' : 'Add New Product'
  };
};
