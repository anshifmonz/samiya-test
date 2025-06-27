
import React from 'react';
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

interface DraggableImageItemProps {
  id: string;
  url: string;
  index: number;
  onRemove: () => void;
  isPrimary?: boolean;
}

const DraggableImageItem: React.FC<DraggableImageItemProps> = ({ 
  id, 
  url, 
  index, 
  onRemove,
  isPrimary 
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
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-start gap-3 p-3 border rounded-lg bg-white relative ${
        isDragging ? 'shadow-lg' : 'border-luxury-gray/20'
      } ${isPrimary ? 'ring-2 ring-luxury-gold/50 bg-luxury-gold/5' : ''}`}
    >
      {isPrimary && (
        <div className="absolute -top-2 -right-2 bg-luxury-gold text-luxury-black rounded-full p-1">
          <Crown size={12} />
        </div>
      )}
      
      <button
        {...attributes}
        {...listeners}
        className="text-luxury-gray hover:text-luxury-black transition-colors cursor-grab active:cursor-grabbing flex-shrink-0"
        title="Drag to reorder"
        type="button"
      >
        <GripVertical size={16} />
      </button>
      
      <img 
        src={url} 
        alt={`Image ${index + 1}`} 
        className="w-16 h-16 object-cover rounded flex-shrink-0" 
        draggable={false}
      />
      
      <div className="flex-1 min-w-0">
        <p className="luxury-body text-xs text-luxury-gray break-all leading-relaxed">
          {isPrimary && <span className="text-luxury-gold font-medium">Primary • </span>}
          {url}
        </p>
      </div>
      
      <button
        type="button"
        onClick={onRemove}
        className="text-red-600 hover:text-red-800 transition-colors flex-shrink-0 p-1 rounded hover:bg-red-50"
        title="Remove image"
      >
        <Trash size={14} />
      </button>
    </div>
  );
};

interface DraggableImageListProps {
  images: string[];
  onReorder: (newImages: string[]) => void;
  onRemove: (index: number) => void;
}

const DraggableImageList: React.FC<DraggableImageListProps> = ({
  images,
  onReorder,
  onRemove,
}) => {
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
    <div className="relative">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={images.map((_, index) => `image-${index}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {images.map((url, index) => (
              <DraggableImageItem
                key={`image-${index}`}
                id={`image-${index}`}
                url={url}
                index={index}
                onRemove={() => onRemove(index)}
                isPrimary={index === 0}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default DraggableImageList;
