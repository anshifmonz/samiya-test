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
  price: number | null;
  originalPrice: number | null;
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
    price: null,
    originalPrice: null,
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
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

  const clearFieldError = (fieldName: string) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const handleTitleChange = (value: string) => {
    updateFormField('title', value);
    if (value.trim()) clearFieldError('title');
  };
  
  const handleDescriptionChange = (value: string) => {
    updateFormField('description', value);
    if (value.trim()) clearFieldError('description');
  };
  
  const handlePriceChange = (value: number | null) => {
    updateFormField('price', value);
    if (value !== null) clearFieldError('price');
  };
  
  const handleOriginalPriceChange = (value: number | null) => {
    updateFormField('originalPrice', value);
    if (value !== null) clearFieldError('originalPrice');
  };
  
  const handleCategoryChange = (value: string) => {
    updateFormField('categoryId', value);
    if (value) clearFieldError('category');
  };
  const handleImagesChange = (images: Record<string, ProductColorData>) => updateFormField('images', images);
  const handleTagsChange = (tags: string[]) => updateFormField('tags', tags);
  const handleSizesChange = (sizes: Size[]) => updateFormField('sizes', sizes);
  const handleActiveChange = (active: boolean) => updateFormField('active', active);

  const validateRequiredFields = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!formData.title) errors.title = 'Title is required.';
    if (!formData.categoryId) errors.category = 'Category is required.';
    if (!formData.description) errors.description = 'Description is required.';
    if (formData.price === null) errors.price = 'Price is required.';
    if (formData.originalPrice === null) errors.originalPrice = 'Original price is required.';
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setValidationError('');
    setFieldErrors({});
    setIsSubmitting(true);

    const requiredFieldErrors = validateRequiredFields();
    if (Object.keys(requiredFieldErrors).length > 0) {
      setFieldErrors(requiredFieldErrors);
      setValidationError('Please fill in all required fields.');
      setIsSubmitting(false);

      const firstErrorField = Object.keys(requiredFieldErrors)[0];
      let inputElement: HTMLElement | null = null;
      
      if (firstErrorField === 'category') {
        inputElement = document.querySelector(`[data-name="category"]`) as HTMLElement;
      } else {
        inputElement = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
      }
      
      if (inputElement) {
        inputElement.focus();
      }
      return;
    }

    // Validate the form data
    const { canSubmit, errorMessage, detailedErrors } = checkSubmissionErrors(formData.images);

    if (!canSubmit) {
      setValidationError(errorMessage || 'Please fix validation errors before submitting.');
      setIsSubmitting(false);
      return;
    }


    try {
      if (product) {
        const productData = {
          ...formData,
          price: formData.price,
          originalPrice: formData.originalPrice || 0,
          id: product.id,
          short_code: product.short_code,
          images: { ...formData.images }
        };
        onSave(productData);
      } else {
        const { short_code, ...productDataWithoutShortCode } = formData;
        const submissionData = {
          ...productDataWithoutShortCode,
          price: formData.price,
          originalPrice: formData.originalPrice || 0,
          images: { ...formData.images }
        };
        onSave(submissionData);
      }
    } catch (error) {
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
    fieldErrors,
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
    clearValidationError: () => {
      setValidationError('');
      setFieldErrors({});
    },

    // Computed values
    isEditing: !!product,
    modalTitle: product ? 'Edit Product' : 'Add New Product'
  };
};
