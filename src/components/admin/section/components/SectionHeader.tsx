import React from 'react';
import { ChevronDown, ChevronRight, Edit2, Trash2, GripVertical } from 'lucide-react';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Switch } from 'components/ui/switch';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type Section } from 'types/section';

interface SectionHeaderProps {
  section: Section;
  isExpanded: boolean;
  isEditing: boolean;
  editingTitle: string;
  onToggleSection: (sectionId: string) => void;
  onStartEditing: (section: Section) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditTitleChange: (title: string) => void;
  onToggleActive: (section: Section) => void;
  onDeleteSection: (sectionId: string) => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  section,
  isExpanded,
  isEditing,
  editingTitle,
  onToggleSection,
  onStartEditing,
  onSaveEdit,
  onCancelEdit,
  onEditTitleChange,
  onToggleActive,
  onDeleteSection
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

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
    <div className="p-2 sm:p-4 bg-luxury-cream/30">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center xs:gap-1 gap-3 flex-1">
          <button
            onClick={() => onToggleSection(section.id)}
            className="text-luxury-gray hover:text-luxury-black transition-colors duration-200 flex-shrink-0"
          >
            {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </button>

          <button
            {...attributes}
            {...listeners}
            className="text-luxury-gray hover:text-luxury-black transition-colors cursor-grab active:cursor-grabbing flex-shrink-0 touch-manipulation p-1 -m-1 min-w-[32px] min-h-[32px] flex items-center justify-center"
            title="Drag to reorder"
            type="button"
          >
            <GripVertical size={16} />
          </button>

          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={editingTitle}
                onChange={(e) => onEditTitleChange(e.target.value)}
                className="border-luxury-gray/30 focus:border-luxury-gold flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSaveEdit();
                  if (e.key === 'Escape') onCancelEdit();
                }}
                autoFocus
              />
              <Button
                onClick={onSaveEdit}
                size="sm"
                className="bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-black"
              >
                Save
              </Button>
              <Button
                onClick={onCancelEdit}
                size="sm"
                variant="outline"
                className="border-luxury-gray/30"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <h4 className="luxury-heading xs:text-base text-lg text-luxury-black flex-1">
              {section.title}
            </h4>
          )}
        </div>

        {/* Action Buttons */}
        {!isEditing && (
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Switch
                checked={section.isActive ?? true}
                onCheckedChange={() => onToggleActive(section)}
                className="data-[state=checked]:bg-luxury-gold"
              />
              <span className="luxury-body text-sm text-luxury-gray">
                {section.isActive ?? true ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-0">
              <Button
                onClick={() => onStartEditing(section)}
                size="sm"
                variant="ghost"
                className="text-luxury-gray hover:text-luxury-black xs:w-4 w-6 sm:w-10"
              >
                <Edit2 size={16} />
              </Button>
              <Button
                onClick={() => onDeleteSection(section.id)}
                size="sm"
                variant="ghost"
                className="text-red-500 hover:text-red-700 xs:w-4 w-6 sm:w-10"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionHeader;
