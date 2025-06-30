import React, { useState, useCallback } from 'react';
import { Plus, Trash, Crown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'ui/tabs';
import DraggableImageList from '../DraggableImageList';
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

interface ProductImagesSectionProps {
  images: Record<string, string[]>;
  onImagesChange: (images: Record<string, string[]>) => void;
  activeColorTab: string;
  onActiveColorTabChange: (color: string) => void;
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

const ProductImagesSection: React.FC<ProductImagesSectionProps> = ({
  images,
  onImagesChange,
  activeColorTab,
  onActiveColorTabChange
}) => {
  const [showAddColorDialog, setShowAddColorDialog] = useState(false);
  const [showAddImageDialog, setShowAddImageDialog] = useState(false);
  const [newImageColor, setNewImageColor] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
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

  const addColor = () => {
    if (newImageColor && !images[newImageColor]) {
      onImagesChange({
        ...images,
        [newImageColor]: []
      });
      setNewImageColor('');
      setShowAddColorDialog(false);
      onActiveColorTabChange(newImageColor);
    }
  };

  const addImage = () => {
    if (selectedColorForImage && newImageUrl) {
      onImagesChange({
        ...images,
        [selectedColorForImage]: images[selectedColorForImage]
          ? [...images[selectedColorForImage], newImageUrl]
          : [newImageUrl]
      });
      setNewImageUrl('');
      setShowAddImageDialog(false);
      setSelectedColorForImage('');
    }
  };

  const reorderColors = useCallback((newColors: string[]) => {
    const newImages: Record<string, string[]> = {};
    newColors.forEach(color => {
      if (images[color]) {
        newImages[color] = images[color];
      }
    });
    onImagesChange(newImages);
  }, [images, onImagesChange]);

  const reorderImages = useCallback((color: string, newImages: string[]) => {
    onImagesChange({
      ...images,
      [color]: newImages
    });
  }, [images, onImagesChange]);

  const removeImage = useCallback((color: string, imageIndex: number) => {
    const updatedImages = { ...images };
    updatedImages[color] = updatedImages[color].filter((_, index) => index !== imageIndex);
    if (updatedImages[color].length === 0) {
      delete updatedImages[color];
    }
    onImagesChange(updatedImages);
  }, [images, onImagesChange]);

  const removeColor = (colorToRemove: string) => {
    if (window.confirm(`Remove all images for ${colorToRemove}?`)) {
      const updatedImages = { ...images };
      delete updatedImages[colorToRemove];
      onImagesChange(updatedImages);
    }
  };

  const handleColorDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const colors = Object.keys(images);
      const oldIndex = colors.indexOf(active.id as string);
      const newIndex = colors.indexOf(over?.id as string);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newColors = arrayMove(colors, oldIndex, newIndex);
        reorderColors(newColors);
      }
    }
  };

  const colorVariants = Object.keys(images);

  return (
    <div>
      <label className="block luxury-subheading text-sm text-luxury-black mb-4">
        Product Images
      </label>

      {/* Color Tabs for Images */}
      <Tabs value={activeColorTab} onValueChange={onActiveColorTabChange} className="w-full">
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
                  imageCount={images[color]?.length || 0}
                  isActive={activeColorTab === color}
                  onValueChange={onActiveColorTabChange}
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
                  {color} Images ({images[color]?.length || 0})
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
                images={images[color] || []}
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
              className="w-full px-4 py-3 luxury-body text-sm rounded-xl bg-luxury-cream/50 text-luxury-black border border-luxury-gray/20 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 focus:border-luxury-gold/30 transition-all duration-300 mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddColorDialog(false);
                  setNewImageColor('');
                }}
                className="flex-1 px-4 py-2 luxury-body text-sm font-medium text-luxury-gray bg-luxury-cream/50 rounded-xl hover:bg-luxury-cream transition-all duration-300 border border-luxury-gray/20"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addColor}
                className="flex-1 bg-luxury-gold text-luxury-black px-4 py-2 rounded-xl hover:bg-luxury-gold-light transition-colors duration-200"
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
              className="w-full px-4 py-3 luxury-body text-sm rounded-xl bg-luxury-cream/50 text-luxury-black border border-luxury-gray/20 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 focus:border-luxury-gold/30 transition-all duration-300 mb-4"
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
                className="flex-1 px-4 py-2 luxury-body text-sm font-medium text-luxury-gray bg-luxury-cream/50 rounded-xl hover:bg-luxury-cream transition-all duration-300 border border-luxury-gray/20"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addImage}
                className="flex-1 bg-luxury-gold text-luxury-black px-4 py-2 rounded-xl hover:bg-luxury-gold-light transition-colors duration-200"
              >
                Add Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImagesSection;
