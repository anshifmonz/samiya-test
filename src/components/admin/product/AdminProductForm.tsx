import React, { useState, useEffect } from 'react';
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

interface AdminProductFormProps {
  product?: Product | null;
  categories: Category[];
  onSave: (product: Product | Omit<Product, 'id'>) => void;
  onCancel: () => void;
}

const AdminProductForm: React.FC<AdminProductFormProps> = ({ product, categories, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    category: '',
    images: {} as Record<string, string[]>,
    tags: [] as string[],
    active: true
  });

  const [activeColorTab, setActiveColorTab] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

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
      console.log('product', product);
      // set the first color as active tab
      const colors = Object.keys(product.images);
      if (colors.length > 0) {
        setActiveColorTab(colors[0]);
      }
    }
  }, [product]);

  useEffect(() => {
    // update active tab when colors change
    const colors = Object.keys(formData.images);
    if (colors.length > 0 && !colors.includes(activeColorTab)) {
      setActiveColorTab(colors[0]);
    }
  }, [formData.images, activeColorTab]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (product) {
      onSave({ ...formData, id: product.id });
    } else {
      onSave(formData);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 bg-luxury-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-luxury-gray/20 p-6 flex items-center justify-between z-[9999]">
          <h2 className="luxury-heading text-2xl text-luxury-black">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onCancel}
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
              onChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
            />

            <CategorySelect
              value={formData.category}
              onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              categories={categories}
            />
          </div>

          <DescriptionTextarea
            value={formData.description}
            onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
          />

          <PriceInput
            value={formData.price}
            onChange={(value) => setFormData(prev => ({ ...prev, price: value }))}
          />

          <ProductImagesSection
            images={formData.images}
            onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
            activeColorTab={activeColorTab}
            onActiveColorTabChange={setActiveColorTab}
          />

          <TagsSection
            tags={formData.tags}
            onTagsChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
          />

          <ActiveStatusSwitch
            label="Product"
            value={formData.active}
            onChange={(active) => setFormData(prev => ({ ...prev, active }))}
          />

          <ActionButtons
            onCancel={onCancel}
            isEditing={!!product}
          />
        </form>
      </div>
    </div>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
};

export default AdminProductForm;
