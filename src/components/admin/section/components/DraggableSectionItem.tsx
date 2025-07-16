import React, { useRef, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type SectionWithProducts, type SectionProductItem } from 'types/section';
import SectionHeader from './SectionHeader';
import SectionContent from './SectionContent';

function isTouchDevice() {
  return (
    typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0)
  );
}

interface DraggableSectionItemProps {
  section: SectionWithProducts;
  isExpanded: boolean;
  isEditing: boolean;
  editingTitle: string;
  onToggleSection: (sectionId: string) => void;
  onStartEditing: (section: any) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditTitleChange: (title: string) => void;
  onToggleActive: (section: any) => void;
  onDeleteSection: (sectionId: string) => void;
  onAddProduct: (sectionId: string) => void;
  onRemoveProduct: (sectionId: string, productId: string) => void;
  onReorderProducts: (sectionId: string, productIds: string[]) => void;
  setLocalProductOrders: React.Dispatch<React.SetStateAction<Record<string, SectionProductItem[]>>>;
  getSectionProducts: (section: SectionWithProducts) => SectionProductItem[];
  handleProductDragEnd: (event: any, section: SectionWithProducts) => void;
  isSuperAdmin: boolean;
}

const DraggableSectionItem: React.FC<DraggableSectionItemProps> = ({
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
  onDeleteSection,
  onAddProduct,
  onRemoveProduct,
  onReorderProducts,
  setLocalProductOrders,
  getSectionProducts,
  handleProductDragEnd,
  isSuperAdmin
}) => {
  const isTouch = isTouchDevice();
  const [showTouchHandle, setShowTouchHandle] = useState(false);
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);
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
    touchAction: 'none' as const,
    minHeight: isTouch ? 48 : undefined,
  };

  const sectionProducts = getSectionProducts(section);

  // Touch event handlers for long-press drag handle
  const handleTouchStart = () => {
    if (longPressTimeout.current) clearTimeout(longPressTimeout.current);
    longPressTimeout.current = setTimeout(() => {
      setShowTouchHandle(true);
    }, 350);
  };
  const handleTouchEnd = () => {
    if (longPressTimeout.current) clearTimeout(longPressTimeout.current);
    setShowTouchHandle(false);
  };
  const handleTouchMove = handleTouchEnd;
  const handleTouchCancel = handleTouchEnd;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border border-luxury-gray/20 rounded-lg overflow-hidden shadow-sm ${
        isDragging ? 'shadow-lg' : ''
      }`}
      tabIndex={0}
      onTouchStart={isTouch ? handleTouchStart : undefined}
      onTouchEnd={isTouch ? handleTouchEnd : undefined}
      onTouchMove={isTouch ? handleTouchMove : undefined}
      onTouchCancel={isTouch ? handleTouchCancel : undefined}
    >
      {/* Drag handle for touch devices (visually hidden on desktop, only after long-press) */}
      {isTouch && showTouchHandle && (
        <button
          {...attributes}
          {...listeners}
          type="button"
          className="absolute left-2 top-2 z-50 w-10 h-10 rounded-full bg-white/90 border border-luxury-gray/200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-luxury-black/40"
          style={{ touchAction: 'none' }}
          tabIndex={0}
          aria-label="Drag to reorder section"
        >
          <span className="sr-only">Drag to reorder section</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="6" cy="7" r="1.5" fill="#888" />
            <circle cx="6" cy="13" r="1.5" fill="#888" />
            <circle cx="10" cy="7" r="1.5" fill="#888" />
            <circle cx="10" cy="13" r="1.5" fill="#888" />
            <circle cx="14" cy="7" r="1.5" fill="#888" />
            <circle cx="14" cy="13" r="1.5" fill="#888" />
          </svg>
        </button>
      )}
      <SectionHeader
        section={section}
        isExpanded={isExpanded}
        isEditing={isEditing}
        editingTitle={editingTitle}
        onToggleSection={onToggleSection}
        onStartEditing={onStartEditing}
        onSaveEdit={onSaveEdit}
        onCancelEdit={onCancelEdit}
        onEditTitleChange={onEditTitleChange}
        onToggleActive={onToggleActive}
        onDeleteSection={onDeleteSection}
        isSuperAdmin={isSuperAdmin}
      />

      {/* Section Content */}
      {isExpanded && (
        <SectionContent
          section={section}
          sectionProducts={sectionProducts}
          onAddProduct={onAddProduct}
          onRemoveProduct={onRemoveProduct}
          onProductDragEnd={handleProductDragEnd}
        />
      )}
    </div>
  );
};

export default DraggableSectionItem;
