import React, { useState, useEffect, useCallback } from 'react';
import { Product } from '../../data/products';
import { X, Plus, Trash, Crown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import DraggableImageList from './DraggableImageList';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface AdminProductFormProps {
  product?: Product | null;
  onSave: (product: Product | Omit<Product, 'id'>) => void;
  onCancel: () => void;
}

interface DraggableColorTabProps {
  color: string;
  imageCount: number;
  isActive: boolean;
  onValueChange: (value: string) => void;
  index: number;
}

const DraggableColorTab: React.FC<DraggableColorTabProps> = ({
  color,
  imageCount,
  isActive,
  onValueChange,
  index
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: color });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
    >
      <TabsTrigger
        value={color}
        className={`flex items-center gap-2 px-3 py-2 text-sm capitalize data-[state=active]:bg-luxury-gold data-[state=active]:text-luxury-black relative ${
          isDragging ? 'shadow-lg' : ''
        }`}
        onClick={() => onValueChange(color)}
        {...attributes}
        {...listeners}
      >
        {/* Primary Color Indicator - Only show for first tab (index 0) */}
        {index === 0 && (
          <div className="absolute -top-1 -right-1 bg-luxury-gold text-luxury-black rounded-full p-0.5">
            <Crown size={10} />
          </div>
        )}

        <div
          className="w-3 h-3 rounded-full border border-white shadow-sm"
          style={{
            backgroundColor: color === 'cream' ? '#F5F5DC' :
                           color === 'navy' ? '#000080' :
                           color === 'red' ? '#DC2626' :
                           color === 'green' ? '#059669' :
                           color === 'blue' ? '#2563EB' :
                           color === 'purple' ? '#7C3AED' :
                           color === 'pink' ? '#EC4899' :
                           color === 'yellow' ? '#EAB308' :
                           color === 'orange' ? '#EA580C' :
                           color === 'brown' ? '#92400E' :
                           color === 'gray' ? '#6B7280' :
                           color === 'black' ? '#000000' :
                           color === 'white' ? '#FFFFFF' : color
          }}
        />
        {color}
        <span className="text-xs">({imageCount})</span>
      </TabsTrigger>
    </div>
  );
};

const AdminProductForm: React.FC<AdminProductFormProps> = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    category: 'Women' as 'Gents' | 'Women' | 'Kids',
    images: {} as Record<string, string[]>,
    tags: [] as string[]
  });

  const [newImageColor, setNewImageColor] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newTag, setNewTag] = useState('');
  const [activeColorTab, setActiveColorTab] = useState<string>('');
  const [showAddColorDialog, setShowAddColorDialog] = useState(false);
  const [showAddImageDialog, setShowAddImageDialog] = useState(false);
  const [selectedColorForImage, setSelectedColorForImage] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
      // Set the first color as active tab
      const colors = Object.keys(product.images);
      if (colors.length > 0) {
        setActiveColorTab(colors[0]);
      }
    }
  }, [product]);

  useEffect(() => {
    // Update active tab when colors change
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

  const addColor = () => {
    if (newImageColor && !formData.images[newImageColor]) {
      setFormData(prev => ({
        ...prev,
        images: {
          ...prev.images,
          [newImageColor]: []
        }
      }));
      setNewImageColor('');
      setShowAddColorDialog(false);
      setActiveColorTab(newImageColor);
    }
  };

  const addImage = () => {
    if (selectedColorForImage && newImageUrl) {
      setFormData(prev => ({
        ...prev,
        images: {
          ...prev.images,
          [selectedColorForImage]: prev.images[selectedColorForImage]
            ? [...prev.images[selectedColorForImage], newImageUrl]
            : [newImageUrl]
        }
      }));
      setNewImageUrl('');
      setShowAddImageDialog(false);
      setSelectedColorForImage('');
    }
  };

  const reorderColors = useCallback((newColors: string[]) => {
    setFormData(prev => {
      const newImages: Record<string, string[]> = {};
      newColors.forEach(color => {
        if (prev.images[color]) {
          newImages[color] = prev.images[color];
        }
      });
      return { ...prev, images: newImages };
    });
  }, []);

  const reorderImages = useCallback((color: string, newImages: string[]) => {
    setFormData(prev => ({
      ...prev,
      images: {
        ...prev.images,
        [color]: newImages
      }
    }));
  }, []);

  const removeImage = useCallback((color: string, imageIndex: number) => {
    setFormData(prev => {
      const updatedImages = { ...prev.images };
      updatedImages[color] = updatedImages[color].filter((_, index) => index !== imageIndex);
      if (updatedImages[color].length === 0) {
        delete updatedImages[color];
      }
      return { ...prev, images: updatedImages };
    });
  }, []);

  const removeColor = (colorToRemove: string) => {
    if (window.confirm(`Remove all images for ${colorToRemove}?`)) {
      setFormData(prev => {
        const updatedImages = { ...prev.images };
        delete updatedImages[colorToRemove];
        return { ...prev, images: updatedImages };
      });
    }
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleColorDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const colors = Object.keys(formData.images);
      const oldIndex = colors.indexOf(active.id as string);
      const newIndex = colors.indexOf(over?.id as string);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newColors = arrayMove(colors, oldIndex, newIndex);
        reorderColors(newColors);
      }
    }
  };

  const colorVariants = Object.keys(formData.images);

  return (
    <div className="fixed inset-0 bg-luxury-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-luxury-gray/20 p-6 flex items-center justify-between">
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Product Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block luxury-subheading text-luxury-black mb-2 tracking-wider">
                Product Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
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
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
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
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
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
              onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
              className="w-full px-4 py-3 rounded-xl border border-luxury-gray/30 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all duration-300"
              required
            />
          </div>

          {/* Images Section */}
          <div>
            <label className="block luxury-subheading text-luxury-black mb-4 tracking-wider">
              Product Images
            </label>

            {/* Color Tabs for Images */}
            <Tabs value={activeColorTab} onValueChange={setActiveColorTab} className="w-full">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleColorDragEnd}
              >
                <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-2 h-auto p-1 bg-luxury-gray/10">
                  <SortableContext
                    items={colorVariants}
                    strategy={horizontalListSortingStrategy}
                  >
                    {colorVariants.map((color, index) => (
                      <DraggableColorTab
                        key={color}
                        color={color}
                        imageCount={formData.images[color]?.length || 0}
                        isActive={activeColorTab === color}
                        onValueChange={setActiveColorTab}
                        index={index}
                      />
                    ))}
                  </SortableContext>

                  {/* Add Color Button */}
                  <button
                    type="button"
                    onClick={() => setShowAddColorDialog(true)}
                    className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-luxury-gold/20 text-luxury-black rounded-lg hover:bg-luxury-gold/30 transition-colors duration-200"
                  >
                    <Plus size={16} />
                    Add Color
                  </button>
                </TabsList>
              </DndContext>

              {colorVariants.map((color, index) => (
                <TabsContent key={color} value={color} className="mt-4">
                  <div className="border border-luxury-gray/20 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="luxury-body font-medium text-luxury-black capitalize">
                        {color} Images ({formData.images[color]?.length || 0})
                        {index === 0 && (
                          <span className="ml-2 text-luxury-gold text-sm font-medium">
                            • Primary Color
                          </span>
                        )}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeColor(color)}
                        className="text-red-600 hover:text-red-800 transition-colors duration-200 text-sm flex items-center gap-1"
                      >
                        <Trash size={14} />
                        Remove Color
                      </button>
                    </div>

                    <DraggableImageList
                      images={formData.images[color] || []}
                      onReorder={(newImages) => reorderImages(color, newImages)}
                      onRemove={(index) => removeImage(color, index)}
                    />

                    {/* Add Image Button for this color */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedColorForImage(color);
                        setShowAddImageDialog(true);
                      }}
                      className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-luxury-cream/30 text-luxury-black rounded-lg hover:bg-luxury-cream/50 transition-colors duration-200 border-2 border-dashed border-luxury-gray/30"
                    >
                      <Plus size={16} />
                      Add Image to {color}
                    </button>
                  </div>
                </TabsContent>
              ))}

              {/* Show message when no colors exist */}
              {colorVariants.length === 0 && (
                <TabsContent value="" className="mt-4">
                  <div className="border border-luxury-gray/20 rounded-xl p-8 text-center">
                    <p className="text-luxury-gray mb-4">No colors added yet. Click "Add Color" to get started.</p>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>

          {/* Tags Section */}
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

        {/* Add Color Dialog */}
        {showAddColorDialog && (
          <div className="fixed inset-0 bg-luxury-black/60 backdrop-blur-sm z-60 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
              <h3 className="luxury-heading text-xl text-luxury-black mb-4">Add New Color</h3>
              <input
                type="text"
                placeholder="Color name (e.g., red, navy, cream)"
                value={newImageColor}
                onChange={(e) => setNewImageColor(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-luxury-gray/30 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all duration-300 mb-4"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddColorDialog(false);
                    setNewImageColor('');
                  }}
                  className="flex-1 px-4 py-2 border border-luxury-gray/30 text-luxury-gray rounded-lg hover:bg-luxury-gray/10 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addColor}
                  className="flex-1 bg-luxury-gold text-luxury-black px-4 py-2 rounded-lg hover:bg-luxury-gold-light transition-colors duration-200"
                >
                  Add Color
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Image Dialog */}
        {showAddImageDialog && (
          <div className="fixed inset-0 bg-luxury-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
              <h3 className="luxury-heading text-xl text-luxury-black mb-4">
                Add Image to {selectedColorForImage}
              </h3>
              <input
                type="url"
                placeholder="Image URL"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-luxury-gray/30 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 transition-all duration-300 mb-4"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddImageDialog(false);
                    setNewImageUrl('');
                    setSelectedColorForImage('');
                  }}
                  className="flex-1 px-4 py-2 border border-luxury-gray/30 text-luxury-gray rounded-lg hover:bg-luxury-gray/10 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addImage}
                  className="flex-1 bg-luxury-gold text-luxury-black px-4 py-2 rounded-lg hover:bg-luxury-gold-light transition-colors duration-200"
                >
                  Add Image
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductForm;
