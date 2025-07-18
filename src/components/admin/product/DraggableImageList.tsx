'use client';

import Image from 'next/image';
import isCloudinaryUrl from 'src/lib/utils/isCloudinaryUrls';
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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash, Crown } from 'lucide-react';
import { type ProductImage } from 'types/product';
import { useState } from 'react';
import CloudinaryWithFallback from 'components/shared/CloudinaryWithFallback';

interface DraggableImageItemProps {
  id: string;
  image: ProductImage;
  index: number;
  onRemove: () => void;
  isPrimary?: boolean;
  isDeleting?: boolean;
}

const DraggableImageItem: React.FC<DraggableImageItemProps> = ({
  id,
  image,
  index,
  onRemove,
  isPrimary,
  isDeleting = false
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
    userSelect: 'none' as const,
    WebkitUserSelect: 'none' as const,
    MozUserSelect: 'none' as const,
    msUserSelect: 'none' as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative flex items-start gap-3 p-3 border rounded-lg bg-white relative touch-manipulation ${
        isDragging ? 'shadow-lg' : 'border-luxury-gray/20'
      } ${isPrimary ? 'ring-luxury-gold/50 bg-luxury-gold/5' : ''} ${isDeleting ? 'opacity-50' : ''}`}
    >
      {isPrimary && (
        <div className="absolute top-0 right-0 bg-luxury-gold text-luxury-black rounded-full p-1">
          <Crown size={12} />
        </div>
      )}

      <button
        {...attributes}
        {...listeners}
        className="text-luxury-gray hover:text-luxury-black transition-colors cursor-grab active:cursor-grabbing flex-shrink-0 touch-manipulation p-3 -m-3 min-w-[44px] min-h-[44px] flex items-center justify-center"
        title="Drag to reorder"
        type="button"
        disabled={isDeleting}
      >
        <GripVertical size={16} />
      </button>

      {isCloudinaryUrl(image.url) ? (
        <CloudinaryWithFallback
          src={image.url}
          alt={`Product image ${index + 1}${isPrimary ? ' (Primary)' : ''}`}
          width={64}
          height={64}
          sizes="(max-width: 600px) 20vw, 64px"
          className="w-16 h-16 object-cover rounded flex-shrink-0"
          priority={index === 0}
        />
      ) : (
        <Image
          src={image.url}
          alt={`Image ${index + 1}`}
          className="w-16 h-16 object-cover rounded flex-shrink-0"
          width={64}
          height={64}
        />
      )}

      <div className="flex-1 max-w-[60%] overflow-hidden">
        <p className="luxury-body text-xs text-luxury-gray leading-relaxed truncate overflow-hidden whitespace-nowrap">
          {isPrimary && <span className="text-luxury-gold font-medium">Primary • </span>}
          {image.url}
        </p>
        <p className="luxury-body text-xs text-luxury-gray leading-relaxed truncate overflow-hidden whitespace-nowrap">
          ID: {image.publicId}
        </p>
      </div>

      <button
        type="button"
        onClick={onRemove}
        disabled={isDeleting}
        className={`absolute top-3 right-3 transition-colors flex-shrink-0 p-1 rounded hover:bg-red-50 ${
          isDeleting
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-red-600 hover:text-red-800'
        }`}
        title={isDeleting ? "Deleting..." : "Remove image"}
      >
        <Trash size={14} />
      </button>
    </div>
  );
};

interface DraggableImageListProps {
  images: ProductImage[];
  onReorder: (newImages: ProductImage[]) => void;
  onRemove: (index: number) => void;
  deletingImages?: Set<string>;
}

const DraggableImageList: React.FC<DraggableImageListProps> = ({
  images,
  onReorder,
  onRemove,
  deletingImages = new Set()
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = images.findIndex((_, index) => `image-${index}` === active.id);
      const newIndex = images.findIndex((_, index) => `image-${index}` === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newImages = arrayMove(images, oldIndex, newIndex);
        onReorder(newImages);
      }
    }
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-luxury-gray">
        <p className="luxury-body text-sm">No images added yet</p>
      </div>
    );
  }

  return (
    <div className="relative" style={{ touchAction: 'none' }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={(event) => {
          if (event.active.data.current?.type === 'pointer') {
            event.active.data.current.point = event.active.data.current.point;
          }
        }}
      >
        <SortableContext
          items={images.map((_, index) => `image-${index}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {images.map((image, index) => (
              <DraggableImageItem
                key={`image-${index}`}
                id={`image-${index}`}
                image={image}
                index={index}
                onRemove={() => onRemove(index)}
                isPrimary={index === 0}
                isDeleting={deletingImages.has(image.publicId)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default DraggableImageList;
