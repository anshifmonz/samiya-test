
import React, { useState, useEffect } from 'react';
import { Product } from '../../data/products';
import { X, Plus, Trash } from 'lucide-react';

interface AdminProductFormProps {
  product?: Product | null;
  onSave: (product: Product | Omit<Product, 'id'>) => void;
  onCancel: () => void;
}

const AdminProductForm: React.FC<AdminProductFormProps> = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    category: 'Women' as 'Gents' | 'Women' | 'Kids',
    images: {} as Record<string, string>,
    tags: [] as string[]
  });

  const [newImageColor, setNewImageColor] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price,
        category: product.category,
        images: { ...product.images },
        tags: [...product.tags]
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (product) {
      onSave({ ...formData, id: product.id });
    } else {
      onSave(formData);
    }
  };

  const addImage = () => {
    if (newImageColor && newImageUrl) {
      setFormData({
        ...formData,
        images: { ...formData.images, [newImageColor]: newImageUrl }
      });
      setNewImageColor('');
      setNewImageUrl('');
    }
  };

  const removeImage = (color: string) => {
    const { [color]: removed, ...rest } = formData.images;
    setFormData({ ...formData, images: rest });
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <div className="fixed inset-0 bg-luxury-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-luxury-gray/20 p-6 flex items-center justify-between">
          <h2 className="luxury-heading text-2xl text-luxury-black">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onCancel}
            className="text-luxury-gray hover:text-luxury-black transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block luxury-subheading text-luxury-black mb-2 tracking-wider">
                Product Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-luxury-gray/30 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block luxury-subheading text-luxury-black mb-2 tracking-wider">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-4 py-3 rounded-xl border border-luxury-gray/30 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all duration-300"
              >
                <option value="Women">Women</option>
                <option value="Gents">Gents</option>
                <option value="Kids">Kids</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block luxury-subheading text-luxury-black mb-2 tracking-wider">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-luxury-gray/30 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all duration-300"
              required
            />
          </div>

          <div>
            <label className="block luxury-subheading text-luxury-black mb-2 tracking-wider">
              Price (₹)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 rounded-xl border border-luxury-gray/30 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all duration-300"
              required
            />
          </div>

          <div>
            <label className="block luxury-subheading text-luxury-black mb-2 tracking-wider">
              Product Images
            </label>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Color name"
                  value={newImageColor}
                  onChange={(e) => setNewImageColor(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-luxury-gray/30 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50"
                />
                <input
                  type="url"
                  placeholder="Image URL"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-luxury-gray/30 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50"
                />
                <button
                  type="button"
                  onClick={addImage}
                  className="bg-luxury-gold text-luxury-black px-4 py-2 rounded-lg hover:bg-luxury-gold-light transition-colors duration-200"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(formData.images).map(([color, url]) => (
                  <div key={color} className="flex items-center gap-3 p-3 border border-luxury-gray/20 rounded-lg">
                    <img src={url} alt={color} className="w-12 h-12 object-cover rounded" />
                    <div className="flex-1">
                      <p className="luxury-body text-sm font-medium">{color}</p>
                      <p className="luxury-body text-xs text-luxury-gray truncate">{url}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(color)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block luxury-subheading text-luxury-black mb-2 tracking-wider">
              Tags
            </label>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-luxury-gray/30 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="bg-luxury-gold text-luxury-black px-4 py-2 rounded-lg hover:bg-luxury-gold-light transition-colors duration-200"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-luxury-cream text-luxury-gray px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-luxury-gray/20">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-luxury-gray/30 text-luxury-gray rounded-xl hover:bg-luxury-gray/10 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 luxury-btn-primary px-6 py-3 rounded-xl font-medium tracking-wider uppercase shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {product ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductForm;
