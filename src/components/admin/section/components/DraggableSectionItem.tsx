import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type SectionWithProducts, type SectionProductItem } from 'types/section';
import SectionHeader from './SectionHeader';
import SectionContent from './SectionContent';

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
  handleProductDragEnd
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

  const sectionProducts = getSectionProducts(section);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border border-luxury-gray/20 rounded-lg overflow-hidden shadow-sm ${
        isDragging ? 'shadow-lg' : ''
      }`}
    >
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
