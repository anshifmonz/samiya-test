import React from 'react';
import { TabsTrigger } from 'ui/tabs';
import { Crown } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DraggableColorTabProps {
  color: string;
  imageCount: number;
  isActive: boolean;
  onValueChange: (value: string) => void;
  index: number;
  className?: string;
}

const DraggableColorTab: React.FC<DraggableColorTabProps> = ({
  color,
  imageCount,
  onValueChange,
  index,
  className
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
      className={`relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}${className ? ` ${className}` : ''}`}
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
        {/* primary color indicator - only show for first tab (index 0) */}
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

export default DraggableColorTab;
