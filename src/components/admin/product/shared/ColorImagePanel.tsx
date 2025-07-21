import React from 'react';
import DraggableImageList from './DraggableImageList';
import { Trash, Plus } from 'lucide-react';
import { type ProductImage } from 'types/product';

interface ColorImagePanelProps {
  color: string;
  images: ProductImage[];
  onReorder: (newImages: ProductImage[]) => void;
  onRemove: (index: number) => void;
  onRemoveColor: () => void;
  onAddImage: () => void;
  isPrimary: boolean;
  imageCount: number;
  deletingImages?: Set<string>;
}

const ColorImagePanel: React.FC<ColorImagePanelProps> = ({
  color,
  images,
  onReorder,
  onRemove,
  onRemoveColor,
  onAddImage,
  isPrimary,
  imageCount,
  deletingImages = new Set()
}) => (
  <div className="border border-luxury-gray/20 rounded-xl p-4 flex flex-col gap-4 max-h-[60vh] md:max-h-[70vh]">
    <div className="flex items-center justify-between mb-4">
      <h4 className="luxury-body font-medium text-luxury-black capitalize flex items-center gap-2">
        {color} Images ({imageCount})
        {isPrimary && (
          <span className="ml-2 text-luxury-gold text-sm font-medium">• Primary Color</span>
        )}
      </h4>
      <button
        type="button"
        onClick={onRemoveColor}
        className="text-red-600 hover:text-red-800 transition-colors duration-200 text-sm flex items-center gap-1"
      >
        <Trash size={14} />
        Remove Color
      </button>
    </div>
    <div className="flex-1 min-h-0 overflow-y-auto">
      <DraggableImageList
        images={images}
        onReorder={onReorder}
        onRemove={onRemove}
        deletingImages={deletingImages}
      />
    </div>
    <div className="sticky bottom-0 left-0 w-full bg-white pt-2 pb-2 z-20">
      <button
        type="button"
        onClick={onAddImage}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-luxury-cream/30 text-luxury-black rounded-lg hover:bg-luxury-cream/50 transition-colors duration-200 border-2 border-dashed border-luxury-gray/30"
        style={{ marginTop: 'auto' }}
      >
        <Plus size={16} />
        Add Image to {color}
      </button>
    </div>
  </div>
);

export default ColorImagePanel;
