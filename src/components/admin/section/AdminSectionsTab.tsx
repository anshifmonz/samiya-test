import React from 'react';
import { Plus, ChevronDown, ChevronRight, Edit2, Trash2, GripVertical } from 'lucide-react';
import { type Section, type SectionWithProducts, type SectionProductItem } from 'types/section';
import { type Product } from 'types/product';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Switch } from 'components/ui/switch';
import CarouselWrapper from 'components/home/shared/CarouselWrapper';
import { CarouselItem } from 'components/ui/carousel';
import ProductSearchModal from './ProductSearchModal';
import SectionProductCard from './SectionProductCard';
import AdminTabHeaderButton from '../shared/AdminTabHeaderButton';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAdminSectionsTab } from 'hooks/useAdminSectionsTab';

interface AdminSectionsTabProps {
  sections: SectionWithProducts[];
  products: Product[];
  onAddSection: (section: Omit<Section, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEditSection: (section: Section) => void;
  onDeleteSection: (sectionId: string) => void;
  onAddProductToSection: (sectionId: string, productId: string) => void;
  onRemoveProductFromSection: (sectionId: string, productId: string) => void;
  onReorderSections: (sectionIds: string[]) => void;
  onReorderSectionProducts: (sectionId: string, productIds: string[]) => void;
}

interface DraggableProductItemProps {
  product: SectionProductItem;
  onRemove: () => void;
}

const DraggableProductItem: React.FC<DraggableProductItemProps> = ({
  product,
  onRemove
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

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
    <CarouselItem className="flex-none pl-2">
      <div
        ref={setNodeRef}
        style={style}
        className={`relative ${isDragging ? 'shadow-lg' : ''}`}
      >
        <button
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 z-50 bg-white/95 hover:bg-luxury-gray/10 text-luxury-gray hover:text-luxury-black transition-all duration-200 rounded-full w-8 h-8 p-0 shadow-lg border border-luxury-gray/200 hover:shadow-xl flex items-center justify-center"
          title="Drag to reorder"
          type="button"
        >
          <GripVertical size={14} />
        </button>
        <SectionProductCard
          product={product}
          onRemove={onRemove}
        />
      </div>
    </CarouselItem>
  );
};

interface DraggableSectionItemProps {
  section: SectionWithProducts;
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

  const productSensors = useSensors(
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border border-luxury-gray/20 rounded-lg overflow-hidden shadow-sm ${
        isDragging ? 'shadow-lg' : ''
      }`}
    >
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

      {/* Section Content */}
      {isExpanded && (
        <div className="p-0 pr-2 sm:p-4 space-y-4">
          {/* Add Product Button */}
          <div className="flex justify-between items-center pl-4">
            <span className="luxury-body text-sm text-luxury-gray">
              {sectionProducts.length} product{sectionProducts.length !== 1 ? 's' : ''}
            </span>
            <AdminTabHeaderButton
              onClick={() => onAddProduct(section.id)}
              label="Add Product"
              className="px-3 py-1 text-xs"
            >
              <Plus size={14} />
            </AdminTabHeaderButton>
          </div>

          {/* Products Carousel */}
          {sectionProducts.length > 0 ? (
            <DndContext
              sensors={productSensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleProductDragEnd(event, section)}
            >
              <SortableContext
                items={sectionProducts.map(product => product.id)}
                strategy={horizontalListSortingStrategy}
              >
                <CarouselWrapper className="w-full">
                  {sectionProducts.map((product) => (
                    <DraggableProductItem
                      key={product.id}
                      product={product}
                      onRemove={() => onRemoveProduct(section.id, product.id)}
                    />
                  ))}
                </CarouselWrapper>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="text-center py-8 text-luxury-gray">
              <p className="luxury-body text-sm">No products in this section yet.</p>
              <p className="luxury-body text-xs mt-1">Click "Add Product" to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const AdminSectionsTab: React.FC<AdminSectionsTabProps> = ({
  sections,
  products,
  onAddSection,
  onEditSection,
  onDeleteSection,
  onAddProductToSection,
  onRemoveProductFromSection,
  onReorderSections,
  onReorderSectionProducts
}) => {
  // Use the custom hook for all logic
  const {
    editingTitle,
    showAddSection,
    newSectionTitle,
    searchModalOpen,
    setLocalProductOrders,
    toggleSection,
    startEditing,
    saveEdit,
    cancelEdit,
    handleAddSection,
    handleToggleActive,
    getSectionProducts,
    handleProductSelect,
    getExistingProductIds,
    handleRemoveProduct,
    handleSectionDragEnd,
    handleProductDragEnd,
    openAddSection,
    closeAddSection,
    openSearchModal,
    closeSearchModal,
    isSectionExpanded,
    isSectionEditing,
    setEditingTitle,
    setNewSectionTitle,
  } = useAdminSectionsTab({
    sections,
    products,
    onAddSection,
    onEditSection,
    onDeleteSection,
    onAddProductToSection,
    onRemoveProductFromSection,
    onReorderSections,
    onReorderSectionProducts
  });

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

  return (
    <div className="space-y-6">
      {/* Add Section Button */}
      <div className="flex justify-between items-center">
        <h3 className="luxury-heading text-xl text-luxury-black">Manage Sections</h3>
        <AdminTabHeaderButton
          onClick={openAddSection}
          label="Add Section"
        >
          <Plus size={16} />
        </AdminTabHeaderButton>
      </div>

      {showAddSection && (
        <div className="bg-luxury-cream/50 border border-luxury-gray/20 rounded-lg p-4 space-y-3">
          <Input
            placeholder="Enter section title..."
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            className="border-luxury-gray/30 focus:border-luxury-gold"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddSection();
              if (e.key === 'Escape') closeAddSection();
            }}
          />
          <div className="flex gap-2">
            <Button
              onClick={handleAddSection}
              disabled={!newSectionTitle.trim()}
              className="bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-black px-4 py-2 rounded-lg"
            >
              Add Section
            </Button>
            <Button
              onClick={closeAddSection}
              variant="outline"
              className="border-luxury-gray/30 text-luxury-gray hover:text-luxury-black"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Sections List */}
      <div className="space-y-4">
        {sections.length === 0 ? (
          <div className="text-center py-12 text-luxury-gray">
            <p className="luxury-body text-lg">No sections created yet.</p>
            <p className="luxury-body text-sm mt-2">Click "Add Section" to get started.</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleSectionDragEnd}
          >
            <SortableContext
              items={sections.map(section => section.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {sections.map((section) => {
                  const isExpanded = isSectionExpanded(section.id);
                  const isEditing = isSectionEditing(section.id);

                  return (
                    <DraggableSectionItem
                      key={section.id}
                      section={section}
                      isExpanded={isExpanded}
                      isEditing={isEditing}
                      editingTitle={editingTitle}
                      onToggleSection={toggleSection}
                      onStartEditing={startEditing}
                      onSaveEdit={saveEdit}
                      onCancelEdit={cancelEdit}
                      onEditTitleChange={setEditingTitle}
                      onToggleActive={handleToggleActive}
                      onDeleteSection={onDeleteSection}
                      onAddProduct={(sectionId) => openSearchModal(sectionId)}
                      onRemoveProduct={handleRemoveProduct}
                      onReorderProducts={onReorderSectionProducts}
                      setLocalProductOrders={setLocalProductOrders}
                      getSectionProducts={getSectionProducts}
                      handleProductDragEnd={handleProductDragEnd}
                    />
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Product Search Modal */}
      {searchModalOpen && (
        <ProductSearchModal
          isOpen={!!searchModalOpen}
          onClose={closeSearchModal}
          onProductSelect={handleProductSelect}
          existingProductIds={getExistingProductIds(searchModalOpen)}
        />
      )}
    </div>
  );
};

export default AdminSectionsTab;
